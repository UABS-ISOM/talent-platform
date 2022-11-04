import { Resolvers } from '../__generated__/graphql';
import me from './me';

const resolvers: Resolvers = { Query: { ...me } };

export default resolvers;
