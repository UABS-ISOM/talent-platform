import type { UserRecord } from 'firebase-admin/auth';
import { getAuth } from 'firebase-admin/auth';

/**
 * Returns the records of the given users.
 * @param uids The user's UIDs.
 * @returns The user's Firebase Auth records.
 */
export const userRecordBatchFn = async (
  uids: ReadonlyArray<string>
): Promise<UserRecord[]> => {
  const auth = getAuth();
  const userRecords = await Promise.all(uids.map(uid => auth.getUser(uid)));
  return userRecords;
};
