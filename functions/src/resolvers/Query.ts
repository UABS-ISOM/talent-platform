import type { QueryResolvers } from '../__generated__/graphql';
import { getAuth } from 'firebase-admin/auth';
import type { UserRecord } from 'firebase-functions/v1/auth';
import { me } from './queries/me';
import { course } from './queries/course';

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
  me,
  course,
};

export default resolver;
