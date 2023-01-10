import algoliasearch from 'algoliasearch';
import { getFirestore } from 'firebase-admin/firestore';
import type { UserModel } from '../dataLoaders/models';

const client = algoliasearch(
  process.env.ALGOLIA_ID,
  process.env.ALGOLIA_ADMIN_KEY
);

/**
 * The user object stored in Algolia
 */
export interface AlgoliaUserObject extends UserModel {
  studentCourses: string[];
}

/**
 * Indexes a user in Algolia.
 * @param objectID The ID of the user to index.
 */
export const indexUser = async (objectID: string) => {
  // Get the user's courses
  const firestore = getFirestore();
  const studentCourses = (
    await firestore
      .collectionGroup('courseStudents')
      .where('userId', '==', objectID)
      .get()
  ).docs.map(doc => doc.ref.path.split('/')[1]);

  // Get user doc
  const data = (
    await firestore.collection('users').doc(objectID).get()
  ).data() as UserModel;

  const user: AlgoliaUserObject = { ...data, objectID, studentCourses };

  console.log(process.env);

  const index = client.initIndex(
    process.env.FUNCTIONS_EMULATOR === 'true'
      ? process.env.DEV_ALGOLIA_USERS_INDEX
      : process.env.ALGOLIA_USERS_INDEX
  );
  await index.saveObject(user);
};
