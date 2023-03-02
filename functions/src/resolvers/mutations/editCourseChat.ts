import { ensureMemberOfCourseChat } from '../../utils/chats';
import { ensureAuth, ensureVerified } from '../../utils/user';
import type { MutationResolvers } from '../../__generated__/graphql';

// Add a user to a course chat
export const editCourseChat: MutationResolvers['editCourseChat'] = async (
  _,
  { courseId, chatId, name },
  { user, dataLoaders: { courseChats } }
) => {
  user = ensureAuth(user);
  ensureVerified(user);
  await ensureMemberOfCourseChat(courseId, chatId, user.uid, courseChats);

  courseChats.createDoc({ name }, false, courseId, chatId);

  return {
    _courseId: courseId,
    _chatId: chatId,
  };
};
