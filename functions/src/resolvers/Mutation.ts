import type { MutationResolvers } from '../__generated__/graphql';
import { generateClaims } from './mutations/generateClaims';
import { addCourse } from './mutations/addCourse';
import { addCourseMember } from './mutations/addCourseMember';

// Resolvers for the Course type
const resolver: MutationResolvers = {
  generateClaims,
  addCourse,
  addCourseMember,
};

export default resolver;
