import { dataFetchError } from '../../utils/errors';
import { ensureCourseExists, ensureMemberOfCourse } from '../../utils/roles';
import { ensureAuth, ensureVerified } from '../../utils/user';
import type { QueryResolvers } from '../../__generated__/graphql';

// Gets the personal chat of a user with another user in a course
export const coursePersonalChat: QueryResolvers['coursePersonalChat'] = async (
  _,
  { courseId, otherUid },
  {
    user,
    dataLoaders: {
      courses,
      courseChats,
      courseStudents,
      courseAdmins,
      courseReps,
    },
  }
) => {
  user = ensureAuth(user);
  ensureVerified(user);
  await ensureCourseExists(courseId, courses);
  await ensureMemberOfCourse(
    courseId,
    user.uid,
    courseAdmins,
    courseStudents,
    courseReps
  );

  // Get user's personal chats
  const chats = await courseChats.fetchDocsByQuery(
    c =>
      c
        .where('userIds', 'array-contains', user!.uid)
        .where('personal', '==', true),
    courseId
  );
  let chat = chats.find(chat => chat.userIds.includes(otherUid));

  if (chat) {
    // Personal chat already exists
    return {
      _courseId: courseId,
      _chatId: chats[0]._id,
    };
  } else {
    // Create a new personal chat
    chat = await courseChats.createDoc(
      {
        userIds: [user!.uid, otherUid],
        personal: true,
      },
      true,
      courseId
    );

    if (chat === undefined) throw dataFetchError();

    return {
      _courseId: courseId,
      _chatId: chat._id,
    };
  }
};
