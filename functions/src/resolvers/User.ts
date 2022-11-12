import { UserResolvers } from '../__generated__/graphql';

// Resolvers for the User type
const resolver: UserResolvers = {
  id: parent => parent._userModel.uid,
  name: parent => parent._userModel.displayName ?? '',
  email: parent => parent._userModel.email ?? '',
  courses: () => [],
};

export default resolver;
