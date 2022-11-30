import type { QueryResolvers } from '../__generated__/graphql';
import { me } from './queries/me';
import { course } from './queries/course';

// Resolvers for the Course type
const resolver: QueryResolvers = {
  me,
  course,
};

export default resolver;
