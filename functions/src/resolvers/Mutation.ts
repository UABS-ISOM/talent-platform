import type { MutationResolvers } from '../__generated__/graphql';
import { generateClaims } from './mutations/generateClaims';
import { addCourse } from './mutations/addCourse';
import { addCourseStaff } from './mutations/addCourseStaff';
import { addCourseStudent } from './mutations/addCourseStudent';

// Resolvers for the Course type
const resolver: MutationResolvers = {
  generateClaims,
  addCourse,
  addCourseStaff,
  addCourseStudent,
};

export default resolver;
