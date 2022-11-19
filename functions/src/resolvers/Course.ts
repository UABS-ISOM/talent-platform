import type { CourseResolvers } from '../__generated__/graphql';

// Resolvers for the Course type
const resolver: CourseResolvers = {
  id: parent => parent._id,
  name: parent => parent._courseDoc.name ?? '',
  description: parent => parent._courseDoc.description ?? '',
};

export default resolver;
