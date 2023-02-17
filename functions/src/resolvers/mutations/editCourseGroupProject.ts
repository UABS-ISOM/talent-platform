import { ensureAuth, ensureVerified } from '../../utils/user';
import type { MutationResolvers } from '../../__generated__/graphql';
import { ensureStudentHasGroup } from '../../utils/groups';
import { dataFetchError } from '../../utils/errors';

// Add multiple members to a course, and return the members added
export const editCourseGroupProject: MutationResolvers['editCourseGroupProject'] =
  async (
    _,
    { input: { courseId, projectId, starred } },
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
    if (groupProject === undefined) {
      // Create the group project
      await courseGroupProjects.createDoc(
        {
          groupId,
          projectId,
          starred: starred ?? false,
        },
        true,
        courseId
      );
    } else {
      // Update the group project
      const newGroupProject = await courseGroupProjects.createDoc(
        {
          starred: starred ?? false,
        },
        true,
        courseId,
        groupProject._id
      );

      if (newGroupProject === undefined) throw dataFetchError();
      groupProject = newGroupProject;
    }

    return {
      _courseId: courseId,
      _groupProjectId: groupProject._id,
    };
  };
