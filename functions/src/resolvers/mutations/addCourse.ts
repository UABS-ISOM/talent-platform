import { ensureAuth, ensureStaff, ensureVerified } from '../../utils/user';
import { dataFetchError } from '../../utils/errors';
import escapeHTML from 'escape-html';
import type { MutationResolvers } from '../../__generated__/graphql';

// Add a new course to the database
export const addCourse: MutationResolvers['addCourse'] = async (
  _,
  { name, description },
  { user, dataLoaders: { courses, courseAdmins } }
) => {
  // Ensure the user is staff
  user = ensureAuth(user); // TODO: What if user token provided is incorrect/doesn't exist?
  ensureVerified(user);
  ensureStaff(user);

  const courseData = await courses.createDoc(
    {
      name: escapeHTML(name),
      description: escapeHTML(description),
      numStaff: 1,
      numStudents: 0,
    },
    true
  );

  if (courseData === undefined) throw dataFetchError();

  // Add user to course admins
  const adminData = await courseAdmins.createDoc(
    {
      userId: user.uid,
    },
    true,
    courseData._id,
    user.uid
  );

  if (adminData === undefined) throw dataFetchError();

  // Send the new course to the Course resolver
  return {
    _id: courseData._id,
    _courseStaffQuery: ref => ref,
    _courseStudentsQuery: ref => ref,
  };
};
