import type { MutationResolvers } from '../__generated__/graphql';
import { editMe } from './mutations/editMe';
import { generateClaims } from './mutations/generateClaims';
import { addCourse } from './mutations/addCourse';
import { addCourseMembers } from './mutations/addCourseMembers';

// Resolvers for the Course type
const resolver: MutationResolvers = {
  editMe,
  generateClaims,
  addCourse,
  addCourseMembers,
};

export default resolver;
