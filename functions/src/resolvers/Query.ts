import type { QueryResolvers } from '../__generated__/graphql';
import { getAuth } from 'firebase-admin/auth';
import { ensureAuth } from '../utils/user';
import type { UserDoc } from '../dataSources/models';
import type { UserRecord } from 'firebase-functions/v1/auth';
import type { DataSources } from '../dataSources';

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
    console.log('userRecord before', userRecord !== undefined);
    if (userRecord === undefined) userRecord = await getAuth().getUser(uid);
    console.log('userRecord after', userRecord !== undefined);

    return userRecord;
  };
};

// Resolvers for the Course type
const resolver: QueryResolvers = {
  // Send a model of the current user to the User resolver
  async me(_, __, { user: maybeUser, dataSources }) {
    // Return null if the user is not authenticated
    const user = ensureAuth(maybeUser);

    return {
      _getUserDoc: createUserDocGetter(user.uid, dataSources),
      _getUserRecord: createUserRecordGetter(user.uid),
    };
  },
};

export default resolver;
