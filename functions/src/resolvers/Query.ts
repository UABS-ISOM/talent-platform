import type { QueryResolvers } from '../__generated__/graphql';
import { me } from './queries/me';
import { course } from './queries/course';
import { courseStudents } from './queries/courseStudents';
import { courseChat } from './queries/courseChat';
import { chatHistory } from './queries/chatHistory';

// Resolvers for the Course type
const resolver: QueryResolvers = {
  me,
  course,
  courseStudents,
  courseChat,
  chatHistory,
};

export default resolver;
