import type { MutationResolvers } from '../__generated__/graphql';
import { editMe } from './mutations/editMe';
import { generateClaims } from './mutations/generateClaims';
import { addCourse } from './mutations/addCourse';
import { addCourseMembers } from './mutations/addCourseMembers';
import { editCourseChat } from './mutations/editCourseChat';
import { addCourseChatMember } from './mutations/addCourseChatMember';
import { addCourseChatMessage } from './mutations/addCourseChatMessage';
import { addCourseProject } from './mutations/addCourseProject';
import { editCourseProject } from './mutations/editCourseProject';
import { approveCourseProject } from './mutations/approveCourseProject';
import { editCourseGroupProject } from './mutations/editCourseGroupProject';
import { editCourseStudentGroup } from './mutations/editCourseStudentGroup';
import { approveCourseProjectBid } from './mutations/approveCourseProjectBid';

// Resolvers for the Course type
const resolver: MutationResolvers = {
  editMe,
  generateClaims,
  addCourse,
  addCourseMembers,
  editCourseChat,
  addCourseChatMember,
  addCourseChatMessage,
  addCourseProject,
  editCourseProject,
  approveCourseProject,
  editCourseGroupProject,
  editCourseStudentGroup,
  approveCourseProjectBid,
};

export default resolver;
