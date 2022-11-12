import type { Collections } from '../context';
import { CourseDoc } from './models';
import { typedCollection } from './generics';

const collections: Collections = {
  courses: typedCollection<CourseDoc>('courses'),
};

export default collections;
