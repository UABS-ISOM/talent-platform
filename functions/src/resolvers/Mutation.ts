import type { MutationResolvers } from '../__generated__/graphql';
import { editMe } from './mutations/editMe';
import { generateClaims } from './mutations/generateClaims';
import { addCourse } from './mutations/addCourse';
import { addCourseMembers } from './mutations/addCourseMembers';
import { addCourseChatMember } from './mutations/addCourseChatMember';
import { addCourseChatMessage } from './mutations/addCourseChatMessage';
import { addCourseProject } from './mutations/addCourseProject';
import { editCourseProject } from './mutations/editCourseProject';

// Resolvers for the Course type
const resolver: MutationResolvers = {
  editMe,
  generateClaims,
  addCourse,
  addCourseMembers,
  addCourseChatMember,
  addCourseChatMessage,
  addCourseProject,
  editCourseProject,
};

export default resolver;
