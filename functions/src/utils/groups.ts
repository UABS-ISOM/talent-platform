import type { FirestoreCollectionLoader } from 'data-loader-firestore';
import { GraphQLError } from 'graphql';
import type { CourseStudentModel } from '../dataLoaders/models';

/**
 * Throws an error if the student does not have a group.
 * @param courseId The course ID.
 * @param user The user.
 * @param courseStudents The course students data loader.
 */
export const ensureStudentHasGroup = async (
  courseId: string,
  uid: string,
  courseStudents: FirestoreCollectionLoader<CourseStudentModel>
): Promise<string> => {
  const { groupId } = (await courseStudents.fetchDocById(courseId, uid)) ?? {};
  if (groupId === undefined)
    throw new GraphQLError('You do not have a group in this course.', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });

  return groupId;
};
