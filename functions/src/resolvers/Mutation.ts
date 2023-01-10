import type { MutationResolvers } from '../__generated__/graphql';
import { editMe } from './mutations/editMe';
import { generateClaims } from './mutations/generateClaims';
import { addCourse } from './mutations/addCourse';
import { addCourseMembers } from './mutations/addCourseMembers';
import { addCourseChatMember } from './mutations/addCourseChatMember';
import { addCourseChatMessage } from './mutations/addCourseChatMessage';

// Resolvers for the Course type
const resolver: MutationResolvers = {
  editMe,
  generateClaims,
  addCourse,
  addCourseMembers,
  addCourseChatMember,
  addCourseChatMessage,
};

export default resolver;
