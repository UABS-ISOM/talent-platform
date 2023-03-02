import { ensureAuth, ensureVerified } from '../../utils/user';
import type { MutationResolvers } from '../../__generated__/graphql';
import { ensureMemberOfCourseChat } from '../../utils/chats';
import { FieldValue } from 'firebase-admin/firestore';

// Add multiple members to a course, and return the members added
export const editCourseStudentGroup: MutationResolvers['editCourseStudentGroup'] =
  async (
    _,
    { courseId, groupId },
    { user, dataLoaders: { courseStudents, courseChats } }
  ) => {
    // Ensure the user is staff
    user = ensureAuth(user);
    ensureVerified(user);

    if (groupId) {
      await ensureMemberOfCourseChat(courseId, groupId, user.uid, courseChats);
      await courseStudents.createDoc(
        {
          groupId,
        },
        false,
        courseId,
        user.uid
      );
    } else {
      // Clear the group
      await courseStudents.createDoc(
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          groupId: FieldValue.delete() as any,
        },
        false,
        courseId,
        user.uid
      );
    }

    return {
      _courseId: courseId,
      _studentId: user.uid,
    };
  };
