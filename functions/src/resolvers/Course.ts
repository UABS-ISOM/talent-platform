import type { CourseResolvers } from '../__generated__/graphql';

// Resolvers for the Course type
const resolver: CourseResolvers = {
  id: parent => parent._courseId,
  name: async ({ _courseId }, _, { dataSources }) =>
    (await dataSources.courses.findOneById(_courseId))?.name ?? '',
  description: async ({ _courseId }, _, { dataSources }) =>
    (await dataSources.courses.findOneById(_courseId))?.description ?? '',
};

export default resolver;
