import type { Collections } from '../context';
import { CourseDoc } from './models';
import { typedCollection } from './generics';

export default (): Collections => ({
  courses: typedCollection<CourseDoc>('courses'),
});
