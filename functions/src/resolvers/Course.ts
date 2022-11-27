import type { CourseResolvers } from '../__generated__/graphql';
import { createUserRecordGetter } from './Query';

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

  staff: async ({ _id }, _, { dataLoaders: { courseAdmins } }) =>
    await (
      await courseAdmins.fetchDocsByQuery(c => c, _id)
    ).map(admin => ({
      _uid: admin.userId,
      _getUserRecord: createUserRecordGetter(admin.userId),
    })),

  students: async ({ _id }, _, { dataLoaders: { courseStudents } }) =>
    await (
      await courseStudents.fetchDocsByQuery(c => c, _id)
    ).map(student => ({
      _uid: student.userId,
      _getUserRecord: createUserRecordGetter(student.userId),
    })),
};

export default resolver;
