import { readdirSync, readFileSync } from 'fs';

const gqlFiles = readdirSync('./src/typeDefs/').filter((file: string) =>
  file.endsWith('.graphql')
);

export default gqlFiles.map(path =>
  readFileSync(`./src/typeDefs/${path}`, { encoding: 'utf-8' })
);
