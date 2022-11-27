import type { MutationResolvers } from '../__generated__/graphql';
import { getAuth } from 'firebase-admin/auth';
import { ensureAuth, ensureStaff, ensureVerified } from '../utils/user';
import { dataFetchError, notFoundError } from '../utils/errors';
import escapeHTML from 'escape-html';
import sanitizeHtml from 'sanitize-html';
import { createUserRecordGetter } from './Query';
import { GraphQLError } from 'graphql';

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
  async addCourse(
    _,
    { name, description },
    { user, dataLoaders: { courses, courseAdmins } }
  ) {
    // Ensure the user is staff
    user = ensureAuth(user); // TODO: What if user token provided is incorrect/doesn't exist?
    ensureVerified(user);
    ensureStaff(user);

    const courseData = await courses.createDoc(
      {
        name: escapeHTML(name),
        description: escapeHTML(description),
        numStaff: 1,
      },
      true
    );

    if (courseData === undefined) throw dataFetchError();

    // Add user to course admins
    const adminData = await courseAdmins.createDoc(
      {
        userId: user.uid,
        role: 'lecturer',
      },
      true,
      courseData._id,
      user.uid
    );

    if (adminData === undefined) throw dataFetchError();

    // Send the new course to the Course resolver
    return {
      _id: courseData._id,
      _courseStaffQuery: ref => ref,
    };
  },

  // Add a new course to the database
  async addCourseStaff(
    _,
    { courseId, email },
    { user, dataLoaders: { courses, courseAdmins } }
  ) {
    // Ensure the user is staff
    user = ensureAuth(user); // TODO: What if user token provided is incorrect/doesn't exist?
    ensureVerified(user);
    ensureStaff(user); // TODO: Ensure user is course admin

    // Throw error if the course does not exist
    const course = await courses.fetchDocById(courseId);
    if (course === undefined) throw notFoundError();

    // Get user
    const newUser = await getAuth().getUserByEmail(email); // TODO: Add user not found error

    // Throw error if the user is already a course admin
    const courseAdmin = await courseAdmins.fetchDocById(courseId, newUser.uid);
    if (courseAdmin !== undefined)
      throw new GraphQLError('This user is already course staff.', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });

    // Add user to course admins
    const adminData = await courseAdmins.createDoc(
      {
        userId: newUser.uid,
        role: 'lecturer',
      },
      true,
      courseId,
      newUser.uid
    );
    if (adminData === undefined) throw dataFetchError();

    // Increase the number of staff in the course
    await courses.createDoc(
      {
        numStaff: course.numStaff + 1,
      },
      false,
      courseId
    );

    // Send the new course to the Course resolver
    return {
      _uid: user.uid,
      _getUserRecord: createUserRecordGetter(newUser.uid),
    };
  },

  // Edit the current user's details
  async editMe(_, { input }, { user, dataLoaders: { users } }) {
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
      await users.createDoc(
        {
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
      _getUserRecord: createUserRecordGetter(user.uid),
    };
  },
};

export default resolver;
