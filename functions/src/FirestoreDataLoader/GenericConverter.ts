import type { QueryDocumentSnapshot } from '@google-cloud/firestore';

/**
 * Converts a Firestore collection reference to a typed reference.
 */
export default class GenericConverter<DocumentModel> {
  /**
   * Converts an object of type T to a Firestore doc.
   *
   * @param data An object representing the Forestore document's content.
   * @return
   */
  toFirestore(data: DocumentModel): DocumentModel {
    return data;
  }

  /**
   * Converts a Firestore snapshot to an object of type T.
   *
   * @param snapshot The Firestore document snapshot.
   * @return
   */
  fromFirestore(snapshot: QueryDocumentSnapshot): DocumentModel {
    return snapshot.data() as DocumentModel;
  }
}
