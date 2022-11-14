# talent-platform-frontend

Backend written in TS, running an Apollo GraphQL server implementation for Google Cloud Functions on Firebase Functions.

## Project Setup

First, install [Firebase CLI](https://firebase.google.com/docs/cli).

```sh
npm install
```

### Compile and Hot-Reload for Development

This generates schema types and runs the Firebase Functions emulator.

```sh
npm run serve
```

GraphQL types are generated automatically before `npm run serve` and `npm run build` from the `src/typeDefs` folder. If you update the schema, you need to update the types.

```sh
npm run codegen
```

### Type-Check, Compile and Send to Production

```sh
npm run build
firebase deploy --only functions
```
