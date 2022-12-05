import algoliasearch from 'algoliasearch/lite';
import type {
  FirestoreCollectionLoader,
  OutputDocumentData,
} from 'data-loader-firestore';
import type { UserModel } from '../dataLoaders/models';

const searchClient = algoliasearch(
  'CBK1HQDRFR',
  '581e24a51a38ec39c772741d70b9cc6c'
);

const usersSearchIndex = searchClient.initIndex('users_uabs_talent_platform');

/**
 * Search for users in the Algolia users index.
 * @param query The query string to search for.
 * @param usersDataLoader The data loader for the users collection.
 * @returns An array of users matching the query.
 */
export const searchUsers = async (
  query: string,
  courseId: string,
  usersDataLoader: FirestoreCollectionLoader<UserModel>
): Promise<OutputDocumentData<UserModel>[]> => {
  return (
    await usersSearchIndex.search<UserModel>(query, {
      filters: `studentCourses:${courseId}`,
    })
  ).hits.map(hit => {
    const data = {
      _id: hit.objectID,
      _path: `users/${hit.objectID}`,
      displayName: hit.displayName,
      pronouns: hit.pronouns,
      overview: hit.overview,
      skills: hit.skills,
    };

    usersDataLoader.dataLoader.prime(data._path, data);
    return data;
  });
};
