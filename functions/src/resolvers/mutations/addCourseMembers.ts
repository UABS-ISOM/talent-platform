import { getAuth } from 'firebase-admin/auth';
import { GraphQLError } from 'graphql';
import { ensureAuth, ensureStaff, ensureVerified } from '../../utils/user';
import type { MutationResolvers } from '../../__generated__/graphql';
import { CourseMemberEnum } from '../../__generated__/graphql';
import { dataFetchError, notFoundError } from '../../utils/errors';
import type { UserRecord } from 'firebase-functions/v1/auth';

// Add multiple members to a course, and return the members added
export const addCourseMembers: MutationResolvers['addCourseMembers'] = async (
  _,
  { courseId, members, type },
  { user, dataLoaders: { courses, courseAdmins, courseStudents } }
) => {
  // Ensure the user is staff
  user = ensureAuth(user); // TODO: What if user token provided is incorrect/doesn't exist?
  ensureVerified(user);
  ensureStaff(user);

  // Throw error if not staff
  if ((await courseAdmins.fetchDocById(courseId, user.uid)) === undefined)
    throw new GraphQLError('You are not a staff member of this course.', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });

  // Throw error if the course does not exist
  const course = await courses.fetchDocById(courseId);
  if (course === undefined) throw notFoundError();

  // Create users that don't exist
  const users = await Promise.all(
    members.map(async ({ email }) => {
      let newUser: UserRecord | undefined;
      try {
        newUser = await getAuth().getUserByEmail(email);
      } catch {
        newUser = await getAuth().createUser({
          email,
        });
      }
      return newUser;
    })
  );

  const col = type === CourseMemberEnum.Staff ? courseAdmins : courseStudents;

  const uidsCreated = await Promise.all(
    users.map(async ({ uid }) => {
      // Pass if the user is already in the collection
      if ((await col.fetchDocById(courseId, uid)) !== undefined) return;

      // Add user to collection
      if (
        (await col.createDoc(
          {
            userId: uid,
          },
          true,
          courseId,
          uid
        )) === undefined
      )
        throw dataFetchError();

      return uid;
    })
  );

  // Increase the number of staff in the course
  await courses.createDoc(
    type === CourseMemberEnum.Staff
      ? {
          numStaff: course.numStaff + uidsCreated.length,
        }
      : {
          numStudents: course.numStudents + uidsCreated.length,
        },
    false,
    courseId
  );

  return uidsCreated
    .filter((uid): uid is string => uid !== undefined)
    .map(async uid => ({
      _uid: uid,
    }));
};
