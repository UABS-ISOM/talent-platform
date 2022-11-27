import type { DocumentData } from 'firebase-admin/firestore';

/**
 * A document in the Firestore users collection
 *
 * @interface CourseDoc
 * @typedef {CourseDoc}
 * @extends {DocumentData}
 */
export interface UserModel extends DocumentData {
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
  role: 'lecturer' | 'assistant';
}

/**
 * A document in the Firestore courses/admins collection
 *
 * @interface CourseDoc
 * @typedef {CourseDoc}
 * @extends {DocumentData}
 */
export interface CourseStudentModel extends DocumentData {
  userId: string;
}
