import sanitize from 'sanitize-html';
import {
  ensureCourseChatExists,
  ensureMemberOfCourseChat,
} from '../../utils/chats';
import { dataFetchError } from '../../utils/errors';
import { ensureAuth, ensureVerified } from '../../utils/user';
import type { MutationResolvers } from '../../__generated__/graphql';

export const addCourseChatMessage: MutationResolvers['addCourseChatMessage'] =
  async (
    _,
    { courseId, chatId, message },
    { user, dataLoaders: { courseChats, chatMessages } }
  ) => {
    user = ensureAuth(user);
    ensureVerified(user);
    await ensureCourseChatExists(courseId, chatId, courseChats); // If the chat exists, the course exists
    await ensureMemberOfCourseChat(courseId, chatId, user.uid, courseChats);

    const doc = await chatMessages.createDoc(
      {
        sender: user.uid,
        message: sanitize(message),
        createdAt: new Date().getTime(),
      },
      true,
      courseId,
      chatId
    );

    if (doc === undefined) throw dataFetchError();

    return {
      _courseId: courseId,
      _chatId: chatId,
      _messageId: doc._id,
    };
  };
