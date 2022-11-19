import { QueryResolvers } from '../__generated__/graphql';
import { getAuth } from 'firebase-admin/auth';
import { ensureAuth } from '../utils/user';

// Resolvers for the Course type
const resolver: QueryResolvers = {
  // Send a model of the current user to the User resolver
  async me(_, __, { user, collections }) {
    // Return null if the user is not authenticated
    try {
      user = ensureAuth(user);
    } catch (e) {
      return null;
    }

    const userRef = await collections.users.doc(user.uid);
    const userData = (await userRef.get()).data() ?? {};

    return {
      _userRecord: await getAuth().getUser(user.uid),
      _userDoc: userData,
    };
  },
};

export default resolver;
