import type {
  QueryDocumentSnapshot,
  CollectionReference,
  DocumentData,
} from 'firebase-admin/firestore';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Converts a Firestore collection reference to a typed reference.
 *
 * @class GenericConverter
 * @typedef {GenericConverter}
 * @template T
 */
export class GenericConverter<T> {
  /**
   * Converts an object of type T to a Firestore doc.
   *
   * @param {T} data An object representing the Forestore document's content.
   * @return {T}
   */
  toFirestore(data: T): T {
    return data;
  }

  /**
   * Converts a Firestore snapshot to an object of type T.
   *
   * @param {QueryDocumentSnapshot} snapshot The Firestore document snapshot.
   * @return {T}
   */
  fromFirestore(snapshot: QueryDocumentSnapshot): T {
    return snapshot.data() as T;
  }
}

/**
 * Wraps a data source with a Firestore collection reference.
 *
 * @export
 * @template T extends DocumentData.
 * @param {string[]} path The path to the Firestore collection.
 * @return {CollectionReference<T>}
 */
export const typedCollection = <T extends DocumentData>(
  ...path: string[]
): CollectionReference<T> => {
  let collection: CollectionReference = getFirestore().collection(path[0]);

  // Add each following pair of path elements as a subcollection
  for (let i = 1; i < path.length; i += 2) {
    if (path[i + 1] === undefined)
      throw new Error('Not a valid collection path.');

    collection = collection.doc(path[i]).collection(path[i + 1]);
  }

  return collection.withConverter(new GenericConverter<T>());
};
