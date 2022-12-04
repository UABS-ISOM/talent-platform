import type { MutationResolvers } from '../../__generated__/graphql';
import escapeHTML from 'escape-html';
import sanitizeHtml from 'sanitize-html';
import { getAuth } from 'firebase-admin/auth';
import { ensureAuth } from '../../utils/user';

// Edit the current user's details
export const editMe: MutationResolvers['editMe'] = async (
  _,
  { input },
  { user, dataLoaders: { users } }
) => {
  // Ensure the user is authenticated
  user = ensureAuth(user);

  // Update the user's Auth record
  await getAuth().updateUser(user.uid, {
    ...(typeof input.name === 'string' && input.name.length > 0
      ? { displayName: escapeHTML(input.name) }
      : {}),
  });

  // Update the user's Firestore document
  if (input.overview !== null || input.skills !== null)
    await users.createDoc(
      {
        ...(typeof input.name === 'string'
          ? { displayName: escapeHTML(input.name) }
          : {}),
        ...(typeof input.pronouns === 'string'
          ? { pronouns: escapeHTML(input.pronouns) }
          : {}),
        ...(typeof input.overview === 'string'
          ? { overview: sanitizeHtml(input.overview) }
          : {}),
        ...(Array.isArray(input.skills)
          ? {
              skills: input.skills
                .map(skill => escapeHTML(skill))
                .filter(skill => skill !== ''),
            }
          : {}),
      },
      false,
      user.uid
    );

  // Send the updated user to the User resolver
  return {
    _uid: user.uid,
  };
};
