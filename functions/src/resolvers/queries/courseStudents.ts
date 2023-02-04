import { searchUsers } from '../../utils/algolia';
import { ensureCourseExists, ensureMemberOfCourse } from '../../utils/roles';
import { ensureAuth, ensureVerified } from '../../utils/user';
import type { QueryResolvers } from '../../__generated__/graphql';

export const courseStudents: QueryResolvers['courseStudents'] = async (
  _,
  { courseId, options },
  {
    user,
    dataLoaders: { courses, users, courseAdmins, courseStudents, courseReps },
  }
) => {
  // Return null if the user is not authenticated
  user = ensureAuth(user);
  ensureVerified(user);
  await ensureCourseExists(courseId, courses);
  await ensureMemberOfCourse(
    courseId,
    user.uid,
    courseAdmins,
    courseStudents,
    courseReps
  );

  return (
    options.query
      ? await searchUsers(options.query, courseId, users)
      : await courseStudents.fetchDocsByQuery(c => c, courseId)
  ).map(student => ({
    _uid: student._id,
  }));
};
