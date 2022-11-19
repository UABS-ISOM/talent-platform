import { UserRecord } from 'firebase-admin/auth';
import { DocumentData } from 'firebase-admin/firestore';

/**
 * A document in the Firestore users collection
 *
 * @export
 * @interface CourseDoc
 * @typedef {CourseDoc}
 * @extends {DocumentData}
 */
export interface UserDoc extends DocumentData {
  pronouns?: string;
  overview?: string;
  skills?: string[];
}

/**
 * A document in the Firestore users collection
 *
 * @export
 * @interface CourseDoc
 * @typedef {CourseDoc}
 * @extends {DocumentData}
 */
export interface UserExperienceDoc extends DocumentData {
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
 * @export
 * @interface CourseDoc
 * @typedef {CourseDoc}
 * @extends {DocumentData}
 */
export interface CourseDoc extends DocumentData {
  name: string;
  description: string;
}

/**
 * A document in the Firestore courses/admins collection
 *
 * @export
 * @interface CourseDoc
 * @typedef {CourseDoc}
 * @extends {DocumentData}
 */
export interface CourseAdminDoc extends DocumentData {
  role: 'lecturer' | 'assistant';
}

export interface UserMapper {
  _userRecord: UserRecord;
  _userDoc: UserDoc;
}

export interface UserExperienceMapper {
  _id: string;
  _userExperienceDoc: UserExperienceDoc;
}

export interface CourseMapper {
  _id: string;
  _courseDoc: CourseDoc;
}
