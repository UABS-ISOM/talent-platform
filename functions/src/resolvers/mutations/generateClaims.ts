import type { MutationResolvers } from '../../__generated__/graphql';
import { getAuth } from 'firebase-admin/auth';
import { ensureAuth, ensureVerified } from '../../utils/user';

// Generate custom Auth claims for the user
export const generateClaims: MutationResolvers['generateClaims'] = async (
  _,
  __,
  { user }
) => {
  // Ensure the user is authenticated
  user = ensureAuth(user);
  ensureVerified(user);

  // Set claims
  const claim = { staff: user.email?.endsWith('@auckland.ac.nz') === true };
  await getAuth().setCustomUserClaims(user.uid, claim);

  return claim;
};
