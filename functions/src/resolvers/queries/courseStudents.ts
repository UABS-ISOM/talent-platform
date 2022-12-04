import { getPaginatedDocs } from '../../utils/pagination';
import { ensureCourseExists, ensureMemberOfCourse } from '../../utils/roles';
import { ensureAuth, ensureVerified } from '../../utils/user';
import type { QueryResolvers } from '../../__generated__/graphql';

export const courseStudents: QueryResolvers['courseStudents'] = async (
  _,
  { courseId, options },
  { user, dataLoaders: { courses, courseAdmins, courseStudents } }
) => {
  // Return null if the user is not authenticated
  user = ensureAuth(user);
  ensureVerified(user);
  await ensureCourseExists(courseId, courses);
  await ensureMemberOfCourse(courseId, user.uid, courseAdmins, courseStudents);

  return (
    await courseStudents.fetchDocsByQuery(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getPaginatedDocs('userId', options) as any
    )
  ).map(student => ({
    _uid: student.userId,
  }));
};
