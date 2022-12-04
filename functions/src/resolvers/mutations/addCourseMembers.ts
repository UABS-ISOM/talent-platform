import type { EmailIdentifier } from 'firebase-admin/auth';
import { getAuth } from 'firebase-admin/auth';
import { GraphQLError } from 'graphql';
import { ensureAuth, ensureStaff, ensureVerified } from '../../utils/user';
import type { MutationResolvers } from '../../__generated__/graphql';
import { CourseMemberEnum } from '../../__generated__/graphql';
import { dataFetchError, notFoundError } from '../../utils/errors';

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

  const users = await getAuth().getUsers(
    members.map(member => ({ email: member.email }))
  );

  // Create users that don't exist
  const allUsers = [
    ...users.users,
    ...(await Promise.all(
      users.notFound.map(notFoundUser =>
        getAuth().createUser({
          email: (notFoundUser as EmailIdentifier).email,
        })
      )
    )),
  ];

  const col = type === CourseMemberEnum.Staff ? courseAdmins : courseStudents;

  // Create user entries, and save the new entries that were created
  const uidsCreated = (
    await Promise.all(
      allUsers.map(async ({ uid }) => {
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
    )
  ).filter((uid): uid is string => uid !== undefined);

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

  return uidsCreated.map(async uid => ({
    _uid: uid,
  }));
};
