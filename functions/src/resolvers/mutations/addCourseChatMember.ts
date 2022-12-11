import { GraphQLError } from 'graphql';
import {
  ensureCourseChatExists,
  ensureMemberOfCourseChat,
} from '../../utils/chats';
import { dataFetchError } from '../../utils/errors';
import { ensureCourseExists, ensureMemberOfCourse } from '../../utils/roles';
import { ensureAuth, ensureVerified } from '../../utils/user';
import type { MutationResolvers } from '../../__generated__/graphql';

// Add a user to a course chat
export const addCourseChatMember: MutationResolvers['addCourseChatMember'] =
  async (
    _,
    { courseId, chatId, uid },
    {
      user,
      dataLoaders: { courseAdmins, courseStudents, courseChats, courses },
    }
  ) => {
    user = ensureAuth(user);
    ensureVerified(user);

    if (chatId) {
      // Add a user to an existing chat
      await ensureCourseChatExists(courseId, chatId, courseChats); // If the chat exists, the course exists
      await ensureMemberOfCourseChat(courseId, chatId, user.uid, courseChats);

      // Check if the proposed new user can be added to the chat
      const userNotInCourse =
        (await courseStudents.fetchDocById(courseId, uid)) === undefined &&
        (await courseAdmins.fetchDocById(courseId, uid)) === undefined;
      const userAlreadyInChat = (
        (await courseChats.fetchDocById(courseId, chatId))?.userIds ?? []
      ).includes(uid);

      if (userNotInCourse || userAlreadyInChat)
        throw new GraphQLError('This user cannot be added to the chat.', {
          extensions: {
            code: 'FORBIDDEN',
          },
        });

      courseChats.createDoc({ userIds: [uid] }, false, courseId, chatId);
    } else {
      // Create a new chat and add the user to it
      ensureCourseExists(courseId, courses);
      ensureMemberOfCourse(courseId, user.uid, courseAdmins, courseStudents);

      if (user.uid !== uid)
        throw new GraphQLError('You can only start a chat with yourself.', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });

      const doc = await courseChats.createDoc(
        { userIds: [uid] },
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
