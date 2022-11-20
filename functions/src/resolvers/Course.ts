import type { CourseResolvers } from '../__generated__/graphql';
import { createUserDocGetter, createUserRecordGetter } from './Query';

// Resolvers for the Course type
const resolver: CourseResolvers = {
  id: parent => parent._courseId,

  name: async ({ _courseId }, _, { dataSources }) =>
    (await dataSources.courses.findOneById(_courseId))?.name ?? '',

  description: async ({ _courseId }, _, { dataSources }) =>
    (await dataSources.courses.findOneById(_courseId))?.description ?? '',

  staff: async ({ _courseId }, _, { dataSources }) => {
    const courseAdmins = await dataSources
      .getCourseAdmins(_courseId)
      .findManyByQuery(c => c);

    console.log(courseAdmins);

    return courseAdmins.map(admin => ({
      _uid: admin.userId,
      _getUserDoc: createUserDocGetter(admin.userId, dataSources),
      _getUserRecord: createUserRecordGetter(admin.userId),
    }));
  },
};

export default resolver;
