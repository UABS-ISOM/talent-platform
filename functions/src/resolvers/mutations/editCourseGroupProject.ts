import { ensureAuth, ensureVerified } from '../../utils/user';
import { CourseProjectBidStatusEnum } from '../../__generated__/graphql';
import type { MutationResolvers } from '../../__generated__/graphql';
import { ensureStudentHasGroup } from '../../utils/groups';
import { dataFetchError } from '../../utils/errors';
import type { CourseGroupProjectModel } from '../../dataLoaders/models';
import { GraphQLError } from 'graphql';
import sanitize from 'sanitize-html';

// Add multiple members to a course, and return the members added
export const editCourseGroupProject: MutationResolvers['editCourseGroupProject'] =
  async (
    _,
    { input: { courseId, projectId, starred, bid, bidStatus } },
    { user, dataLoaders: { courseStudents, courseGroupProjects } }
  ) => {
    // Ensure the user is staff
    user = ensureAuth(user);
    ensureVerified(user);
    const groupId = await ensureStudentHasGroup(
      courseId,
      user.uid,
      courseStudents
    );

    let [groupProject] = await courseGroupProjects.fetchDocsByQuery(
      c =>
        c.where('groupId', '==', groupId).where('projectId', '==', projectId),
      courseId
    );

    const projectRecord: Partial<CourseGroupProjectModel> = {
      starred: starred ?? groupProject.starred ?? false,
    };

    if (bid !== undefined && bid !== null) projectRecord.bid = sanitize(bid);

    // Student can only change bid status if current status is draft or pending
    if (
      !groupProject.bidStatus ||
      ([
        CourseProjectBidStatusEnum.Draft,
        CourseProjectBidStatusEnum.Pending,
        CourseProjectBidStatusEnum.Rejected,
      ].includes(groupProject.bidStatus as CourseProjectBidStatusEnum) &&
        groupProject.bidStatus !== bidStatus)
    ) {
      // Allow student to ask for a project to be accepted, or to cancel
      if (
        bidStatus !== undefined &&
        bidStatus !== null &&
        [
          CourseProjectBidStatusEnum.Draft,
          CourseProjectBidStatusEnum.Pending,
        ].includes(bidStatus)
      )
        projectRecord.bidStatus = bidStatus;
    } else {
      throw new GraphQLError('You cannot edit an active or pending project.');
    }

    if (groupProject === undefined) {
      // Create the group project
      await courseGroupProjects.createDoc(
        {
          groupId,
          projectId,
          ...projectRecord,
        },
        true,
        courseId
      );
    } else {
      // Update the group project
      const newGroupProject = await courseGroupProjects.createDoc(
        projectRecord,
        false,
        courseId,
        groupProject._id
      );

      if (newGroupProject === undefined) throw dataFetchError();
      groupProject = newGroupProject;
    }

    courseGroupProjects.dataLoader.clearAll(); // Clear the cache

    return {
      _courseId: courseId,
      _groupProjectId: groupProject._id,
    };
  };
