import type { CourseResolvers } from '../__generated__/graphql';

// Resolvers for the Course type
const resolver: CourseResolvers = {
  id: parent => parent._id,

  name: async ({ _id }, _, { dataLoaders: { courses } }) =>
    (await courses.fetchDocById(_id))?.name ?? '',

  description: async ({ _id }, _, { dataLoaders: { courses } }) =>
    (await courses.fetchDocById(_id))?.description ?? '',

  numStaff: async ({ _id }, _, { dataLoaders: { courses } }) =>
    (await courses.fetchDocById(_id))!.numStaff,

  numStudents: async ({ _id }, _, { dataLoaders: { courses } }) =>
    (await courses.fetchDocById(_id))!.numStudents,

  staff: async (
    { _id, _courseStaffQuery },
    _,
    { dataLoaders: { courseAdmins } }
  ) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (await courseAdmins.fetchDocsByQuery(_courseStaffQuery as any, _id)).map(
      admin => ({
        _uid: admin.userId,
      })
    ),

  students: async (
    { _id, _courseStudentsQuery },
    _,
    { dataLoaders: { courseStudents: cs } }
  ) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (await cs.fetchDocsByQuery(_courseStudentsQuery as any, _id)).map(
      student => ({
        _uid: student.userId,
      })
    ),
};

export default resolver;
