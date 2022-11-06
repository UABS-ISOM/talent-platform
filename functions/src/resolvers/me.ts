import { QueryResolvers } from '../__generated__/graphql';

const resolver: QueryResolvers = {
  me: () => ({
    name: 'John',
    email: 'john.smith@example.com',
    courses: [],
  }),
};

export default resolver;
