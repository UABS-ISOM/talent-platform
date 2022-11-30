import type { MutationResolvers } from '../../__generated__/graphql';
import { getAuth } from 'firebase-admin/auth';
import { ensureAuth, ensureStaff, ensureVerified } from '../../utils/user';
import { dataFetchError, notFoundError } from '../../utils/errors';
import { GraphQLError } from 'graphql';

// Add a new course admin to the database
export const addCourseStaff: MutationResolvers['addCourseStaff'] = async (
  _,
  { courseId, email },
  { user, dataLoaders: { courses, courseAdmins } }
) => {
  // Ensure the user is staff
  user = ensureAuth(user); // TODO: What if user token provided is incorrect/doesn't exist?
  ensureVerified(user);
  ensureStaff(user); // TODO: Ensure user is course admin

  // Throw error if the course does not exist
  const course = await courses.fetchDocById(courseId);
  if (course === undefined) throw notFoundError();

  // Get user
  const newUser = await getAuth().getUserByEmail(email);

  // Throw error if the user is already a course admin
  const courseAdmin = await courseAdmins.fetchDocById(courseId, newUser.uid);
  if (courseAdmin !== undefined)
    throw new GraphQLError(
      'This user is already a staff member in this course.',
      {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      }
    );

  // Add user to course admins
  const adminData = await courseAdmins.createDoc(
    {
      userId: newUser.uid,
      role: 'lecturer',
    },
    true,
    courseId,
    newUser.uid
  );
  if (adminData === undefined) throw dataFetchError();

  // Increase the number of staff in the course
  await courses.createDoc(
    {
      numStaff: course.numStaff + 1,
    },
    false,
    courseId
  );

  // Send the new course to the Course resolver
  return {
    _uid: user.uid,
  };
};
