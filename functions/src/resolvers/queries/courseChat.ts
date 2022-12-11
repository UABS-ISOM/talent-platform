import {
  ensureCourseChatExists,
  ensureMemberOfCourseChat,
} from '../../utils/chats';
import { ensureAuth, ensureVerified } from '../../utils/user';
import type { QueryResolvers } from '../../__generated__/graphql';

export const courseChat: QueryResolvers['courseChat'] = async (
  _,
  { courseId, chatId },
  { user, dataLoaders: { courseChats } }
) => {
  user = ensureAuth(user);
  ensureVerified(user);
  await ensureCourseChatExists(courseId, chatId, courseChats); // If the chat exists, the course exists
  await ensureMemberOfCourseChat(courseId, chatId, user.uid, courseChats);

  return {
    _courseId: courseId,
    _chatId: chatId,
  };
};
