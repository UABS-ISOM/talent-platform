import type { Collections } from '../context';
import {
  UserDoc,
  UserExperienceDoc,
  CourseDoc,
  CourseAdminDoc,
} from './models';
import { typedCollection } from './generics';

const collections: Collections = {
  users: typedCollection<UserDoc>('users'),
  userExperiences: typedCollection<UserExperienceDoc>('userExperiences'),
  courses: typedCollection<CourseDoc>('courses'),
  getCourseAdmins: (course: string) =>
    typedCollection<CourseAdminDoc>('courses', course, 'admins'),
};

export default collections;
