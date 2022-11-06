import {
  getFirestore,
  QueryDocumentSnapshot,
  CollectionReference,
  DocumentData,
} from 'firebase-admin/firestore';

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
 * @param {string} collection The name of the Firestore collection.
 * @return {CollectionReference<T>}
 */
export const typedCollection = <T extends DocumentData>(
  collection: string
): CollectionReference<T> => {
  return getFirestore()
    .collection(collection)
    .withConverter(new GenericConverter<T>());
};
