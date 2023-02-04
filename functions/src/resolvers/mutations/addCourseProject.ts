import { ensureAuth, ensureVerified } from '../../utils/user';
import type { MutationResolvers } from '../../__generated__/graphql';
import { CourseProjectStatusEnum } from '../../__generated__/graphql';
import { dataFetchError } from '../../utils/errors';
import { ensureRepInCourse } from '../../utils/roles';

// Add multiple members to a course, and return the members added
export const addCourseProject: MutationResolvers['addCourseProject'] = async (
  _,
  { courseId, name },
  { user, dataLoaders: { courseReps, courseProjects } }
) => {
  // Ensure the user is staff
  user = ensureAuth(user);
  ensureVerified(user);
  ensureRepInCourse(courseId, user.uid, courseReps);

  // Add user to collection
  const project = await courseProjects.createDoc(
    {
      userId: user.uid,
      name,
      status: CourseProjectStatusEnum.Draft,
    },
    false,
    courseId
  );
  if (project === undefined) throw dataFetchError();

  return {
    _courseId: courseId,
    _projectId: project._id,
  };
};
