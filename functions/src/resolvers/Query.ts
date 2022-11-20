import type { QueryResolvers } from '../__generated__/graphql';
import { getAuth } from 'firebase-admin/auth';
import { ensureAuth, ensureVerified } from '../utils/user';
import type { UserDoc } from '../dataSources/models';
import type { UserRecord } from 'firebase-functions/v1/auth';
import type { DataSources } from '../dataSources';
import { forbiddenError } from '../utils/errors';

/**
 * Allow Type resolvers to get the user's Firestore doc.
 * @param uid The user's UID.
 * @returns
 */
export const createUserDocGetter = (
  uid: string,
  dataSources: DataSources
): (() => Promise<UserDoc>) => {
  return async (): Promise<UserDoc> =>
    (await dataSources.users.findOneById(uid)) ?? {
      id: uid,
      collection: 'users',
    };
};

/**
 * Allow Type resolvers to get the user's Firebase Auth record.
 * @param uid The user's UID.
 * @returns _getUserRecord
 */
export const createUserRecordGetter = (
  uid: string
): (() => Promise<UserRecord>) => {
  // TODO: Cache userRecord with a DataSource
  let userRecord: UserRecord | undefined;

  return async (): Promise<UserRecord> => {
    if (userRecord === undefined) userRecord = await getAuth().getUser(uid);
    return userRecord;
  };
};

// Resolvers for the Course type
const resolver: QueryResolvers = {
  // Send a model of the current user to the User resolver
  async me(_, __, { user, dataSources }) {
    // Return null if the user is not authenticated
    user = ensureAuth(user);

    return {
      _uid: user.uid,
      _getUserDoc: createUserDocGetter(user.uid, dataSources),
      _getUserRecord: createUserRecordGetter(user.uid),
    };
  },

  // Send a model of the course to the Course resolver
  async course(_, { courseId }, { user, dataSources }) {
    // Return null if the user is not authenticated
    user = ensureAuth(user);
    ensureVerified(user);

    // Return null if the course does not exist
    const course = await dataSources.courses.findOneById(courseId);
    if (course === undefined) return null;

    // Determine if the user is an admin of the course
    const courseAdminsDs = dataSources.getCourseAdmins(courseId);
    courseAdminsDs.initialize();
    const courseAdmin = await courseAdminsDs.findOneById(user.uid);

    // Return error if the user is not an admin
    if (courseAdmin === undefined) throw forbiddenError();

    return {
      _courseId: courseId,
    };
  },
};

export default resolver;
