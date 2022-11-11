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

### Type-Check, Compile and Send to Production

```sh
npm run build
firebase deploy --only functions
```
