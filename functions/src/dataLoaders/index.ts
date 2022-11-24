import { FirestoreCollectionLoader } from 'data-loader-firestore';
import type { Firestore } from 'firebase-admin/firestore';
import type {
  CourseAdminModel,
  CourseModel,
  UserExperienceModel,
  UserModel,
} from './models';

/**
 * Contains instances of FirestoreCollectionLoader for each collection we want
 * to access.
 */
export class DataLoaders {
  users: FirestoreCollectionLoader<UserModel>;
  userExperiences: FirestoreCollectionLoader<UserExperienceModel>;
  courses: FirestoreCollectionLoader<CourseModel>;
  courseAdmins: FirestoreCollectionLoader<CourseAdminModel>;

  /**
   * Generates a new instance of DataLoaders.
   *
   * @param {Firestore} firestore The firestore instance.
   */
  constructor(firestore: Firestore) {
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
      'courseAdmins'
    );
  }
}
