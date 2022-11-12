import { getAuth } from 'firebase-admin/auth';
import type { DecodedIdToken } from 'firebase-admin/auth';

/**
 * Determines the request's auth status.
 * @param token The authorization bearer value.
 * @return The decoded user token, if valid.
 */
export const getUser = async (
  token: string
): Promise<DecodedIdToken | undefined> => {
  token = token.slice(7); // Length of "Bearer " at beginning of header

  try {
    const user = await getAuth().verifyIdToken(token);
    return user;
  } catch (e) {
    console.log('Error:', e);
    return undefined;
  }
};
