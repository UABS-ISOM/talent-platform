import type { FirestoreCollectionLoader } from 'data-loader-firestore';
import { GraphQLError } from 'graphql';
import type { CourseChatModel } from '../dataLoaders/models';

/**
 * Throws an error if the chat does not exist.
 * @param courseId The course ID.
 * @param chatId The chat ID.
 * @param courseChats The courses chats data loader.
 */
export const ensureCourseChatExists = async (
  courseId: string,
  chatId: string,
  courseChats: FirestoreCollectionLoader<CourseChatModel>
): Promise<void> => {
  if ((await courseChats.fetchDocById(courseId, chatId)) === undefined)
    throw new GraphQLError('This chat does not exist.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
};

/**
 * Throws an error if the user is not a member of a course chat.
 * @param courseId The course ID.
 * @param chatId The chat ID.
 * @param user The user.
 * @param courseChats The courses chats data loader.
 */
export const ensureMemberOfCourseChat = async (
  courseId: string,
  chatId: string,
  uid: string,
  courseChats: FirestoreCollectionLoader<CourseChatModel>
): Promise<void> => {
  // Determine if the user is an admin of the course
  const doc = await courseChats.fetchDocById(courseId, chatId);
  if (doc === undefined || !doc.userIds.includes(uid))
    throw new GraphQLError('You are not a member of this chat.', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
};
