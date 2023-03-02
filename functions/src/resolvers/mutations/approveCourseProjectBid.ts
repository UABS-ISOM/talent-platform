import { ensureAuth, ensureVerified } from '../../utils/user';
import type { MutationResolvers } from '../../__generated__/graphql';
import { CourseProjectBidStatusEnum } from '../../__generated__/graphql';
import { ensureStaffMemberOfCourse } from '../../utils/roles';
import { ensureGroupProjectExists } from '../../utils/groupProjects';

// Add multiple members to a course, and return the members added
export const approveCourseProjectBid: MutationResolvers['approveCourseProjectBid'] =
  async (
    _,
    { courseId, groupProjectId, approved },
    { user, dataLoaders: { courseAdmins, courseGroupProjects } }
  ) => {
    // Ensure the user is staff
    user = ensureAuth(user);
    ensureVerified(user);
    await Promise.all([
      ensureGroupProjectExists(courseId, groupProjectId, courseGroupProjects),
      ensureStaffMemberOfCourse(courseId, user.uid, courseAdmins),
    ]);

    await courseGroupProjects.createDoc(
      {
        bidStatus: approved
          ? CourseProjectBidStatusEnum.PendingRep
          : CourseProjectBidStatusEnum.Rejected,
      },
      false,
      courseId,
      groupProjectId
    );

    return {
      _courseId: courseId,
      _groupProjectId: groupProjectId,
    };
  };
