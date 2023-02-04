import { ensureAuth, ensureVerified } from '../../utils/user';
import type { QueryResolvers } from '../../__generated__/graphql';
import {
  ensureCourseProjectExists,
  ensureRepOwnsProject,
} from '../../utils/projects';

// Send a model of the course to the Course resolver
export const courseProject: QueryResolvers['courseProject'] = async (
  _,
  { courseId, projectId },
  { user, dataLoaders: { courseProjects } }
) => {
  // Return null if the user is not authenticated
  user = ensureAuth(user);
  ensureVerified(user);
  await Promise.all([
    ensureCourseProjectExists(courseId, projectId, courseProjects),
    ensureRepOwnsProject(courseId, projectId, user.uid, courseProjects),
  ]);

  return {
    _courseId: courseId,
    _projectId: projectId,
  };
};
