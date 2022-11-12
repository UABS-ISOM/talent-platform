import { CourseResolvers } from '../__generated__/graphql';

// Resolvers for the Course type
const resolver: CourseResolvers = {
  id: parent => parent._id,
  name: parent => parent._courseModel.name ?? '',
  description: parent => parent._courseModel.description ?? '',
};

export default resolver;
