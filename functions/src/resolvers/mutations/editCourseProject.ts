import { ensureAuth, ensureVerified } from '../../utils/user';
import type { MutationResolvers } from '../../__generated__/graphql';
import { CourseProjectStatusEnum } from '../../__generated__/graphql';
import { dataFetchError } from '../../utils/errors';
import {
  ensureCourseProjectExists,
  ensureRepOwnsProject,
} from '../../utils/projects';
import sanitize from 'sanitize-html';
import escapeHTML from 'escape-html';
import type { CourseProjectModel } from '../../dataLoaders/models';
import { GraphQLError } from 'graphql';

// Add multiple members to a course, and return the members added
export const editCourseProject: MutationResolvers['editCourseProject'] = async (
  _,
  { input: { courseId, projectId, name, overview, status } },
  { user, dataLoaders: { courseProjects } }
) => {
  // Ensure the user is staff
  user = ensureAuth(user);
  ensureVerified(user);
  await Promise.all([
    ensureCourseProjectExists(courseId, projectId, courseProjects),
    ensureRepOwnsProject(courseId, projectId, user.uid, courseProjects),
  ]);

  const currentProject = await courseProjects.fetchDocById(courseId, projectId);
  if (currentProject === undefined) throw dataFetchError();
  if (
    [CourseProjectStatusEnum.Active, CourseProjectStatusEnum.Pending].includes(
      currentProject.status as CourseProjectStatusEnum
    ) &&
    status !== CourseProjectStatusEnum.Draft
  )
    throw new GraphQLError('You cannot edit an active or pending project.');

  const projectRecord: Partial<CourseProjectModel> = {
    name: name ? escapeHTML(name) : undefined,
    overview: overview ? sanitize(overview) : undefined,
  };

  // Delete undefined values from projectRecord
  Object.keys(projectRecord).forEach(key => {
    if (projectRecord[key] === undefined) delete projectRecord[key];
  });

  // Allow rep to ask for a project to be accepted, or to cancel
  if (
    status &&
    [CourseProjectStatusEnum.Draft, CourseProjectStatusEnum.Pending].includes(
      status
    )
  )
    projectRecord.status = status;

  const project = await courseProjects.createDoc(
    projectRecord,
    false,
    courseId,
    projectId
  );
  if (project === undefined) throw dataFetchError();

  return {
    _courseId: courseId,
    _projectId: projectId,
  };
};
