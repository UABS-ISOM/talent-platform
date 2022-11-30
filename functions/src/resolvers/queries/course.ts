import { ensureAuth, ensureVerified } from '../../utils/user';
import type { QueryResolvers } from '../../__generated__/graphql';
import { forbiddenError } from '../../utils/errors';
import { getPaginatedDocs } from '../../utils/pagination';

// Send a model of the course to the Course resolver
export const course: QueryResolvers['course'] = async (
  _,
  { courseId, courseStaffOptions, courseStudentOptions },
  { user, dataLoaders }
) => {
  // Return null if the user is not authenticated
  user = ensureAuth(user);
  ensureVerified(user);

  // Return null if the course does not exist
  if ((await dataLoaders.courses.fetchDocById(courseId)) === undefined)
    return null;

  // Determine if the user is an admin of the course
  if (
    (await dataLoaders.courseAdmins.fetchDocById(courseId, user.uid)) ===
    undefined
  )
    throw forbiddenError();

  return {
    _id: courseId,
    _courseStaffQuery: getPaginatedDocs('userId', courseStaffOptions),
    _courseStudentsQuery: getPaginatedDocs('userId', courseStudentOptions),
  };
};
