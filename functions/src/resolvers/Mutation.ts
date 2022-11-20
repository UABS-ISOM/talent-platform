import type { MutationResolvers } from '../__generated__/graphql';
import { getAuth } from 'firebase-admin/auth';
import { ensureAuth, ensureStaff, ensureVerified } from '../utils/user';
import { dataFetchError, notFoundError } from '../utils/errors';
import escapeHTML from 'escape-html';
import sanitizeHtml from 'sanitize-html';
import { createUserDocGetter, createUserRecordGetter } from './Query';
import type { CollectionReference } from 'firebase-admin/firestore';
import type { CourseAdminDoc } from '../dataSources/models';
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
  async addCourse(_, { name, description }, { user, dataSources }) {
    // Ensure the user is staff
    user = ensureAuth(user); // TODO: What if user token provided is incorrect/doesn't exist?
    ensureVerified(user);
    ensureStaff(user);

    const courseData = await dataSources.courses.createOne({
      name: escapeHTML(name),
      description: escapeHTML(description),
      numStaff: 1,
    });

    if (courseData === undefined) throw dataFetchError();

    // Add user to course admins
    const courseAdminsDs = dataSources.getCourseAdmins(courseData.id);
    courseAdminsDs.initialize();
    const adminData = await courseAdminsDs.createOne({
      id: user.uid,
      userId: user.uid,
      role: 'lecturer',
    });

    if (adminData === undefined) throw dataFetchError();

    // Send the new course to the Course resolver
    return {
      _courseId: courseData.id,
      _courseStaffQuery: (ref: CollectionReference<CourseAdminDoc>) => ref,
    };
  },

  // Add a new course to the database
  async addCourseStaff(_, { courseId, email }, { user, dataSources }) {
    // Ensure the user is staff
    user = ensureAuth(user); // TODO: What if user token provided is incorrect/doesn't exist?
    ensureVerified(user);
    ensureStaff(user); // TODO: Ensure user is course admin

    // Throw error if the course does not exist
    const course = await dataSources.courses.findOneById(courseId);
    if (course === undefined) throw notFoundError();

    // Get user
    const newUser = await getAuth().getUserByEmail(email); // TODO: Add user not found error

    // Throw error if the user is already a course admin
    const courseAdminsDs = dataSources.getCourseAdmins(courseId);
    courseAdminsDs.initialize();
    const courseAdmin = await courseAdminsDs.findOneById(newUser.uid);
    if (courseAdmin !== undefined)
      throw new GraphQLError('This user is already course staff.', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });

    // Add user to course admins
    const adminData = await courseAdminsDs.createOne({
      id: newUser.uid,
      userId: newUser.uid,
      role: 'lecturer',
    });

    if (adminData === undefined) throw dataFetchError();

    // Increase the number of staff in the course
    await dataSources.courses.updateOnePartial(courseId, {
      numStaff: course.numStaff + 1,
    });

    // Send the new course to the Course resolver
    return {
      _uid: user.uid,
      _getUserDoc: createUserDocGetter(newUser.uid, dataSources),
      _getUserRecord: createUserRecordGetter(newUser.uid),
    };
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
      _uid: user.uid,
      _getUserDoc: createUserDocGetter(user.uid, dataSources),
      _getUserRecord: createUserRecordGetter(user.uid),
    };
  },
};

export default resolver;
