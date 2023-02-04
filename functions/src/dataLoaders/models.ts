import type { DocumentData } from 'firebase-admin/firestore';

/**
 * A document in the Firestore users collection
 *
 * @interface CourseDoc
 * @typedef {CourseDoc}
 * @extends {DocumentData}
 */
export interface UserModel extends DocumentData {
  displayName?: string;
  pronouns?: string;
  overview?: string;
  skills?: string[];
}

/**
 * A document in the Firestore users collection
 *
 * @interface CourseDoc
 * @typedef {CourseDoc}
 * @extends {DocumentData}
 */
export interface UserExperienceModel extends DocumentData {
  userId: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
}

/**
 * A document in the Firestore courses collection
 *
 * @interface CourseDoc
 * @typedef {CourseDoc}
 * @extends {DocumentData}
 */
export interface CourseModel extends DocumentData {
  name: string;
  description: string;
  numStaff: number;
  numStudents: number;
  numReps: number;
}

/**
 * A document in the Firestore courses/admins collection
 *
 * @interface CourseDoc
 * @typedef {CourseDoc}
 * @extends {DocumentData}
 */
export interface CourseAdminModel extends DocumentData {
  userId: string;
}

/**
 * A document in the Firestore courses/students collection
 *
 * @interface CourseDoc
 * @typedef {CourseDoc}
 * @extends {DocumentData}
 */
export interface CourseStudentModel extends DocumentData {
  userId: string;
}

/**
 * A document in the Firestore courses/students collection
 *
 * @interface CourseDoc
 * @typedef {CourseDoc}
 * @extends {DocumentData}
 */
export interface CourseRepModel extends DocumentData {
  userId: string;
}

/**
 * A document in the Firestore courses/chats collection
 *
 * @interface CourseChats
 * @typedef {CourseChats}
 * @extends {DocumentData}
 */
export interface CourseChatModel extends DocumentData {
  userIds: string[];
  personal?: boolean;
}

/**
 * A document in the Firestore courses/chats collection
 *
 * @interface ChatMessageModel
 * @typedef {ChatMessageModel}
 * @extends {DocumentData}
 */
export interface ChatMessageModel extends DocumentData {
  sender: string;
  message: string;
  createdAt: number;
}

/**
 * A document in the Firestore courses/project collection
 *
 * @interface ChatMessageModel
 * @typedef {ChatMessageModel}
 * @extends {DocumentData}
 */
export interface CourseProjectModel extends DocumentData {
  userId: string;
  name: string;
  overview?: string;
  status: string;
}
