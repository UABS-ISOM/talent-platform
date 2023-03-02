import { ensureAuth, ensureVerified } from '../../utils/user';
import type { MutationResolvers } from '../../__generated__/graphql';
import { CourseProjectStatusEnum } from '../../__generated__/graphql';
import { ensureCourseProjectExists } from '../../utils/projects';
import { ensureStaffMemberOfCourse } from '../../utils/roles';

// Add multiple members to a course, and return the members added
export const approveCourseProject: MutationResolvers['approveCourseProject'] =
  async (
    _,
    { courseId, projectId, approved },
    { user, dataLoaders: { courseAdmins, courseProjects } }
  ) => {
    // Ensure the user is staff
    user = ensureAuth(user);
    ensureVerified(user);
    await Promise.all([
      ensureCourseProjectExists(courseId, projectId, courseProjects),
      ensureStaffMemberOfCourse(courseId, user.uid, courseAdmins),
    ]);

    await courseProjects.createDoc(
      {
        status: approved
          ? CourseProjectStatusEnum.Active
          : CourseProjectStatusEnum.Rejected,
      },
      false,
      courseId,
      projectId
    );

    return {
      _courseId: courseId,
      _projectId: projectId,
    };
  };
