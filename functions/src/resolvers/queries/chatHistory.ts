import type { OutputDocumentData } from 'data-loader-firestore';
import type { CollectionReference } from 'firebase-admin/firestore';
import { FieldPath } from 'firebase-admin/firestore';
import type { ChatMessageModel } from '../../dataLoaders/models';
import {
  ensureCourseChatExists,
  ensureMemberOfCourseChat,
} from '../../utils/chats';
import { ensureAuth, ensureVerified } from '../../utils/user';
import type { QueryResolvers } from '../../__generated__/graphql';

export const chatHistory: QueryResolvers['chatHistory'] = async (
  _,
  { courseId, chatId, afterDoc },
  { user, dataLoaders: { courseChats, chatMessages } }
) => {
  user = ensureAuth(user);
  ensureVerified(user);
  await ensureCourseChatExists(courseId, chatId, courseChats); // If the chat exists, the course exists
  await ensureMemberOfCourseChat(courseId, chatId, user.uid, courseChats);

  const messageQuery = (
    c: CollectionReference<OutputDocumentData<ChatMessageModel>>
  ) =>
    afterDoc
      ? c.orderBy(FieldPath.documentId(), 'desc').startAfter(afterDoc).limit(10)
      : c.orderBy('chatId', 'desc').limit(10);

  return (
    await chatMessages.fetchDocsByQuery(messageQuery, 'courseId', 'chatId')
  ).map(({ _id }) => ({
    _courseId: courseId,
    _chatId: chatId,
    _messageId: _id,
  }));
};
