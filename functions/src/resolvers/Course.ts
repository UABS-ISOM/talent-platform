import type { CourseResolvers } from '../__generated__/graphql';
import { createUserDocGetter, createUserRecordGetter } from './Query';

// Resolvers for the Course type
const resolver: CourseResolvers = {
  id: parent => parent._courseId,

  name: async ({ _courseId }, _, { dataSources }) =>
    (await dataSources.courses.findOneById(_courseId))?.name ?? '',

  description: async ({ _courseId }, _, { dataSources }) =>
    (await dataSources.courses.findOneById(_courseId))?.description ?? '',

  numStaff: async ({ _courseId }, _, { dataSources }) => {
    const course = await dataSources.courses.findOneById(_courseId);
    return course?.numStaff ?? 0;
  },

  staff: async ({ _courseId, _courseStaffQuery }, _, { dataSources }) => {
    const courseAdmins = await dataSources
      .getCourseAdmins(_courseId)
      .findManyByQuery(_courseStaffQuery);

    return courseAdmins.map(admin => ({
      _uid: admin.userId,
      _getUserDoc: createUserDocGetter(admin.userId, dataSources),
      _getUserRecord: createUserRecordGetter(admin.userId),
    }));
  },
};

export default resolver;
