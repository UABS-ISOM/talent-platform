import {
  collection,
  FirestoreError,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  where,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import GenericConverter, { type OutputDocumentData } from "./GenericConverter";

const firestore = getFirestore();

/**
 * A document in the Firestore courses/chats collection
 *
 * @interface CourseChatModel
 * @typedef {CourseChatModel}
 * @extends {DocumentData}
 */
export interface CourseChatModel extends DocumentData {
  lastSentAt: number;
  userIds: string[];
}

export type CourseChatData = OutputDocumentData<CourseChatModel>;

/**
 * A document in the Firestore courses/chats/messages collection
 *
 * @interface CourseChatMessageModel
 * @typedef {CourseChatMessageModel}
 * @extends {DocumentData}
 */
export interface CourseChatMessageModel extends DocumentData {
  message: string;
  userId: string;
  created: number;
}

export type CourseChatMessageData = OutputDocumentData<CourseChatMessageModel>;

/**
 * A document in the Firestore courses/chats collection
 * @param courseId The course ID.
 * @param uid The user ID.
 * @param onNext The callback to call when the document changes.
 * @param onError The callback to call when an error occurs.
 */
export const watchChats = (
  courseId: string,
  uid: string,
  onNext: (snapshot: QuerySnapshot<CourseChatData>) => void,
  onError: (error: FirestoreError) => void
): Unsubscribe => {
  // Get chats where the user is a member
  const userChatsQuery = query(
    collection(firestore, "courses", courseId, "courseChats"),
    where("userIds", "array-contains", uid),
    orderBy("lastSentAt", "desc")
  ).withConverter(new GenericConverter<CourseChatModel>());

  return onSnapshot(
    userChatsQuery,
    { includeMetadataChanges: true }, // Detect when added on both client and server
    {
      next: (snapshot: QuerySnapshot<CourseChatData>) => {
        onNext(snapshot);
      },
      error: (error: FirestoreError) => {
        onError(error);
      },
    }
  );
};

/**
 * A document in the Firestore courses/chats collection
 * @param courseId The course ID.
 * @param chatId The chat ID.
 * @param onNext The callback to call when the document changes.
 * @param onError The callback to call when an error occurs.
 */
export const watchMessages = (
  courseId: string,
  chatId: string,
  onNext: (snapshot: QuerySnapshot<CourseChatMessageData>) => void,
  onError: (error: FirestoreError) => void
) => {
  // Get messages in the chat
  const messagesRef = collection(
    firestore,
    "courses",
    courseId,
    "courseChats",
    chatId,
    "messages"
  ).withConverter(new GenericConverter<CourseChatMessageModel>());

  const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    messagesQuery,
    { includeMetadataChanges: true }, // Detect when added on both client and server
    {
      next: (snapshot: QuerySnapshot<CourseChatMessageData>) => {
        onNext(snapshot);
      },
      error: (error: FirestoreError) => {
        onError(error);
      },
    }
  );
};
