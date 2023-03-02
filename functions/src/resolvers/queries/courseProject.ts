import { ensureAuth, ensureVerified } from '../../utils/user';
import type { QueryResolvers } from '../../__generated__/graphql';
import { CourseProjectStatusEnum } from '../../__generated__/graphql';
import { ensureRepOwnsProject } from '../../utils/projects';
import { GraphQLError } from 'graphql';
import { ensureMemberOfCourse } from '../../utils/roles';

// Send a model of the course to the Course resolver
export const courseProject: QueryResolvers['courseProject'] = async (
  _,
  { courseId, projectId },
  {
    user,
    dataLoaders: { courseProjects, courseAdmins, courseStudents, courseReps },
  }
) => {
  // Return null if the user is not authenticated
  user = ensureAuth(user);
  ensureVerified(user);
  try {
    await ensureRepOwnsProject(courseId, projectId, user.uid, courseProjects);
  } catch (e) {
    // If not the rep, check if the project is published
    await ensureMemberOfCourse(
      courseId,
      user.uid,
      courseAdmins,
      courseStudents,
      courseReps
    );
    const project = await courseProjects.fetchDocById(courseId, projectId);
    if (
      project === undefined ||
      project.status !== CourseProjectStatusEnum.Active
    )
      throw new GraphQLError('This project has not been published.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
  }

  return {
    _courseId: courseId,
    _projectId: projectId,
  };
};
