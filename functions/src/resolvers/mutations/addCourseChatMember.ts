import { GraphQLError } from 'graphql';
import {
  ensureCourseChatExists,
  ensureMemberOfCourseChat,
} from '../../utils/chats';
import { dataFetchError } from '../../utils/errors';
import { ensureCourseExists, ensureStudentOfCourse } from '../../utils/roles';
import { ensureAuth, ensureVerified } from '../../utils/user';
import type { MutationResolvers } from '../../__generated__/graphql';
import { FieldValue } from 'firebase-admin/firestore';

// Add a user to a course chat
export const addCourseChatMember: MutationResolvers['addCourseChatMember'] =
  async (
    _,
    { courseId, chatId, uid },
    { user, dataLoaders: { courseStudents, courseChats, courses } }
  ) => {
    user = ensureAuth(user);
    ensureVerified(user);

    if (chatId) {
      // Add a user to an existing chat
      await ensureCourseChatExists(courseId, chatId, courseChats); // If the chat exists, the course exists
      await ensureMemberOfCourseChat(courseId, chatId, user.uid, courseChats);

      // Check if the proposed new user can be added to the chat
      const userNotInCourse =
        (await courseStudents.fetchDocById(courseId, uid)) === undefined;
      const userAlreadyInChat = (
        (await courseChats.fetchDocById(courseId, chatId))?.userIds ?? []
      ).includes(uid);

      if (userNotInCourse || userAlreadyInChat)
        throw new GraphQLError('This user cannot be added to the chat.', {
          extensions: {
            code: 'FORBIDDEN',
          },
        });

      courseChats.createDoc(
        { userIds: FieldValue.arrayUnion(uid) as unknown as string[] },
        false,
        courseId,
        chatId
      );
    } else {
      // Create a new chat and add the user to it
      ensureCourseExists(courseId, courses);
      ensureStudentOfCourse(courseId, user.uid, courseStudents);

      if (user.uid !== uid)
        throw new GraphQLError('You can only start a chat with yourself.', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });

      const doc = await courseChats.createDoc(
        { userIds: [uid], personal: false, lastSentAt: new Date().getTime() },
        true,
        courseId
      );

      if (doc === undefined) throw dataFetchError();

      chatId = doc._id;
    }

    return {
      _courseId: courseId,
      _chatId: chatId,
    };
  };
