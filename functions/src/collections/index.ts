import type { Collections } from '../context';
import { UserDoc, UserExperienceDoc, CourseDoc } from './models';
import { typedCollection } from './generics';

const collections: Collections = {
  users: typedCollection<UserDoc>('users'),
  userExperiences: typedCollection<UserExperienceDoc>('userExperiences'),
  courses: typedCollection<CourseDoc>('courses'),
};

export default collections;
