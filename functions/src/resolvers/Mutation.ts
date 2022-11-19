import type { MutationResolvers } from '../__generated__/graphql';
import { getAuth } from 'firebase-admin/auth';
import { ensureAuth, ensureStaff, ensureVerified } from '../utils/user';
import { dataFetchError } from '../utils/errors';
import escapeHTML from 'escape-html';
import sanitizeHtml from 'sanitize-html';
import { createUserDocGetter, createUserRecordGetter } from './Query';

// Resolvers for the Course type
const resolver: MutationResolvers = {
  // Generate custom Auth claims for the user
  async generateClaims(_, __, { user }) {
    // Ensure the user is authenticated
    user = ensureAuth(user);
    ensureVerified(user);

    // Set claims
    const claim = { staff: user.email?.endsWith('@auckland.ac.nz') === true };
    await getAuth().setCustomUserClaims(user.uid, claim);

    return claim;
  },

  // Add a new course to the database
  async addCourse(_, { name, description }, { user, dataSources }) {
    // Ensure the user is staff
    console.log('addCourse user', user);
    user = ensureAuth(user); // TODO: What if user token provided is incorrect/doesn't exist?
    ensureVerified(user);
    ensureStaff(user);

    const courseData = await dataSources.courses.createOne({
      name: escapeHTML(name),
      description: escapeHTML(description),
    });

    if (courseData === undefined) throw dataFetchError();

    // Send the new course to the Course resolver
    return { _id: courseData.id, _courseDoc: courseData };
  },

  // Edit the current user's details
  async editMe(_, { input }, { user, dataSources }) {
    // Ensure the user is authenticated
    user = ensureAuth(user);
    ensureVerified(user);

    // Update the user's Auth record
    await getAuth().updateUser(user.uid, {
      ...(typeof input.name === 'string' && input.name.length > 0
        ? { displayName: escapeHTML(input.name) }
        : {}),
    });

    // Update the user's Firestore document
    if (input.overview !== null || input.skills !== null)
      await dataSources.users.updateOnePartial(user.uid, {
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
      });

    // Send the updated user to the User resolver
    return {
      _getUserDoc: createUserDocGetter(user.uid, dataSources),
      _getUserRecord: createUserRecordGetter(user.uid),
    };
  },
};

export default resolver;
