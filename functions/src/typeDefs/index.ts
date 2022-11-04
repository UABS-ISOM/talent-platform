import { readFileSync } from 'fs';

export default ['default.graphql', 'me.graphql'].map(path =>
  readFileSync(`./src/typeDefs/${path}`, { encoding: 'utf-8' })
);
