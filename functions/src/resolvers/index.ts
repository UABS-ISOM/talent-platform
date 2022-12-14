import type { Resolvers } from '../__generated__/graphql';
import { DateResolver } from 'graphql-scalars';
import Query from './Query';
import Mutation from './Mutation';
import User from './User';
import UserExperience from './UserExperience';
import Course from './Course';

const resolvers: Resolvers = {
  Query,
  Mutation,

  User,
  UserExperience,
  Course,
  Date: DateResolver,
};

export default resolvers;
