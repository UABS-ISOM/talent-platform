import { ensureAuth } from '../../utils/user';
import type { QueryResolvers } from '../../__generated__/graphql';
import { createUserRecordGetter } from '../Query';

// Send a model of the current user to the User resolver
export const me: QueryResolvers['me'] = async (_, __, { user }) => {
  // Return null if the user is not authenticated
  user = ensureAuth(user);

  return {
    _uid: user.uid,
    _getUserRecord: createUserRecordGetter(user.uid),
  };
};
