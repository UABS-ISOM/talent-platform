import { FirestoreCollectionLoader } from 'data-loader-firestore';
import DataLoader from 'dataloader';
import type { UserRecord } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';
import type {
  ChatMessageModel,
  CourseAdminModel,
  CourseChatModel,
  CourseModel,
  CourseStudentModel,
  CourseRepModel,
  UserExperienceModel,
  UserModel,
  CourseProjectModel,
  CourseGroupProjectModel,
  CourseGroupModel,
} from './models';
import { userRecordBatchFn } from './userRecord';

/**
 * Contains instances of FirestoreCollectionLoader for each collection we want
 * to access.
 */
export class DataLoaders {
  userRecords: DataLoader<string, UserRecord>;
  users: FirestoreCollectionLoader<UserModel>;
  userExperiences: FirestoreCollectionLoader<UserExperienceModel>;
  courses: FirestoreCollectionLoader<CourseModel>;
  courseAdmins: FirestoreCollectionLoader<CourseAdminModel>;
  courseStudents: FirestoreCollectionLoader<CourseStudentModel>;
  courseReps: FirestoreCollectionLoader<CourseStudentModel>;
  courseChats: FirestoreCollectionLoader<CourseChatModel>;
  chatMessages: FirestoreCollectionLoader<ChatMessageModel>;
  courseProjects: FirestoreCollectionLoader<CourseProjectModel>;
  courseGroups: FirestoreCollectionLoader<CourseGroupModel>;
  courseGroupProjects: FirestoreCollectionLoader<CourseGroupProjectModel>;

  /**
   * Generates a new instance of DataLoaders.
   *
   * @param {Firestore} firestore The firestore instance.
   */
  constructor(firestore: Firestore) {
    this.userRecords = new DataLoader(userRecordBatchFn);
    this.users = new FirestoreCollectionLoader<UserModel>(firestore, 'users');
    this.userExperiences = new FirestoreCollectionLoader<UserExperienceModel>(
      firestore,
      'userExperiences'
    );
    this.courses = new FirestoreCollectionLoader<CourseModel>(
      firestore,
      'courses'
    );
    this.courseAdmins = new FirestoreCollectionLoader<CourseAdminModel>(
      firestore,
      'courses',
      'courseAdmins'
    );
    this.courseStudents = new FirestoreCollectionLoader<CourseStudentModel>(
      firestore,
      'courses',
      'courseStudents'
    );
    this.courseReps = new FirestoreCollectionLoader<CourseRepModel>(
      firestore,
      'courses',
      'courseReps'
    );
    this.courseChats = new FirestoreCollectionLoader<CourseChatModel>(
      firestore,
      'courses',
      'courseChats'
    );
    this.chatMessages = new FirestoreCollectionLoader<ChatMessageModel>(
      firestore,
      'courses',
      'courseChats',
      'messages'
    );
    this.courseProjects = new FirestoreCollectionLoader<CourseProjectModel>(
      firestore,
      'courses',
      'courseProjects'
    );
    this.courseGroups = new FirestoreCollectionLoader<CourseGroupModel>(
      firestore,
      'courses',
      'courseGroups'
    );
    this.courseGroupProjects =
      new FirestoreCollectionLoader<CourseGroupProjectModel>(
        firestore,
        'courses',
        'courseGroupProjects'
      );
  }
}
