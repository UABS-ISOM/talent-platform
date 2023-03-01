import { ensureMemberOfCourse } from '../../utils/roles';
import { ensureAuth, ensureVerified } from '../../utils/user';
import type { QueryResolvers } from '../../__generated__/graphql';

// Send a model of the current user to the User resolver
export const courseStudent: QueryResolvers['courseStudent'] = async (
  _,
  { courseId, uid },
  { user, dataLoaders: { courseAdmins, courseStudents, courseReps } }
) => {
  // Return null if the user is not authenticated
  user = ensureAuth(user);
  ensureVerified(user);
  ensureMemberOfCourse(
    courseId,
    user.uid,
    courseAdmins,
    courseStudents,
    courseReps
  );

  return {
    _courseId: courseId,
    _studentId: uid,
  };
};
