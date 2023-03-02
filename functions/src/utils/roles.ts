import type { FirestoreCollectionLoader } from 'data-loader-firestore';
import { GraphQLError } from 'graphql';
import type {
  CourseModel,
  CourseAdminModel,
  CourseStudentModel,
  CourseRepModel,
} from '../dataLoaders/models';

/**
 * Throws an error if the course does not exist.
 * @param courseId The course ID.
 * @param courses The courses data loader.
 */
export const ensureCourseExists = async (
  courseId: string,
  courses: FirestoreCollectionLoader<CourseModel>
): Promise<void> => {
  if ((await courses.fetchDocById(courseId)) === undefined)
    throw new GraphQLError('This course does not exist.', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
};

/**
 * Throws an error if the user is not a staff member of a course.
 * @param courseId The course ID.
 * @param user The user.
 * @param courseAdmins The course admins data loader.
 */
export const ensureStaffMemberOfCourse = async (
  courseId: string,
  uid: string,
  courseAdmins: FirestoreCollectionLoader<CourseAdminModel>
): Promise<void> => {
  // Determine if the user is an admin of the course
  if ((await courseAdmins.fetchDocById(courseId, uid)) === undefined)
    throw new GraphQLError('You are not a staff member of this course.', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
};

/**
 * Throws an error if the user is not a student of a course.
 * @param courseId The course ID.
 * @param user The user.
 * @param courseStudents The course students data loader.
 */
export const ensureStudentOfCourse = async (
  courseId: string,
  uid: string,
  courseStudents: FirestoreCollectionLoader<CourseStudentModel>
): Promise<void> => {
  // Determine if the user is an admin of the course
  if ((await courseStudents.fetchDocById(courseId, uid)) === undefined)
    throw new GraphQLError('You are not a student of this course.', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
};

/**
 * Throws an error if the user is not a company representative in a course.
 * @param courseId The course ID.
 * @param user The user.
 * @param courseReps The course reps data loader.
 */
export const ensureRepInCourse = async (
  courseId: string,
  uid: string,
  courseReps: FirestoreCollectionLoader<CourseRepModel>
): Promise<void> => {
  // Determine if the user is an admin of the course
  if ((await courseReps.fetchDocById(courseId, uid)) === undefined)
    throw new GraphQLError(
      'You are not a company representative in this course.',
      {
        extensions: {
          code: 'FORBIDDEN',
        },
      }
    );
};

/**
 * Throws an error if the user is not a staff member or student of a course.
 * @param courseId The course ID.
 * @param user The user.
 * @param courseAdmins The course admins data loader.
 * @param courseStudents The course students data loader.
 */
export const ensureMemberOfCourse = async (
  courseId: string,
  uid: string,
  courseAdmins: FirestoreCollectionLoader<CourseAdminModel>,
  courseStudents: FirestoreCollectionLoader<CourseStudentModel>,
  courseReps: FirestoreCollectionLoader<CourseRepModel>
): Promise<void> => {
  // Determine if the user is an admin of the course
  if (
    (await courseStudents.fetchDocById(courseId, uid)) === undefined &&
    (await courseAdmins.fetchDocById(courseId, uid)) === undefined &&
    (await courseReps.fetchDocById(courseId, uid)) === undefined
  )
    throw new GraphQLError('You are not a member of this course.', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
};
