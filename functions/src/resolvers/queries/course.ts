import { ensureAuth, ensureVerified } from '../../utils/user';
import type { QueryResolvers } from '../../__generated__/graphql';
import { getPaginatedDocs } from '../../utils/pagination';
import { ensureCourseExists, ensureMemberOfCourse } from '../../utils/roles';

// Send a model of the course to the Course resolver
export const course: QueryResolvers['course'] = async (
  _,
  { courseId, courseStaffOptions, courseStudentOptions },
  { user, dataLoaders: { courses, courseAdmins, courseStudents } }
) => {
  // Return null if the user is not authenticated
  user = ensureAuth(user);
  ensureVerified(user);

  // Return null if the course does not exist
  try {
    await ensureCourseExists(courseId, courses);
  } catch (error) {
    return null;
  }
  await ensureMemberOfCourse(courseId, user.uid, courseAdmins, courseStudents);

  return {
    _id: courseId,
    _courseStaffQuery: getPaginatedDocs('userId', courseStaffOptions),
    _courseStudentsQuery: getPaginatedDocs('userId', courseStudentOptions),
  };
};
