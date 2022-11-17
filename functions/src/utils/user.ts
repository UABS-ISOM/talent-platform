import { GraphQLError } from 'graphql';
import { DecodedIdToken } from 'firebase-admin/auth';

/**
 * Throws an error if the user is not authenticated.
 * @param user The user to check.
 * @returns The user's decoded ID token, guaranteed to not be undefined.
 */
export const ensureAuth = (
  user: DecodedIdToken | undefined
): DecodedIdToken => {
  if (user === undefined)
    throw new GraphQLError('You are not signed in.', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });

  return user;
};

/**
 * Throws an error if the user's email is not verified.
 * @param user The user to check.
 */
export const ensureVerified = (user: DecodedIdToken): void => {
  if (user?.email_verified === false)
    throw new GraphQLError('Your email address is not verified.', {
      extensions: {
        code: 'UNVERIFIED',
      },
    });
};

/**
 * Throws an error if the user is not a staff member.
 * @param user The user to check.
 */
export const ensureStaff = (user: DecodedIdToken): void => {
  if (user?.token.staff === false)
    throw new GraphQLError('You are not a staff member.', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
};
