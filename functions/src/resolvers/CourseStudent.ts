import type { CourseStudentResolvers } from '../__generated__/graphql';

// Resolvers for the User type
const resolver: CourseStudentResolvers = {
  // Resolve information from the user's Firebase Auth record
  id: async ({ _studentId }) => _studentId,

  groupId: async (
    { _courseId, _studentId },
    _,
    { dataLoaders: { courseStudents } }
  ) =>
    (await courseStudents.fetchDocById(_courseId, _studentId))?.groupId ?? null,

  user: async ({ _studentId }) => ({ _uid: _studentId }),
};

export default resolver;
