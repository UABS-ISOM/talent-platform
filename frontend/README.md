# talent-platform-frontend

Frontend written in Vue 3, using Quasar for UI.

`src/assets/background.jpg` is taken from the University of Auckland website.

## Project Setup

```sh
npm install
```

Download (mkcert)[https://github.com/FiloSottile/mkcert]. Add the CA to your system trust store:

```sh
mkcert -install
```

Then generate a SSL certificate for localhost in any folder.

```sh
cd ~
mkcert localhost
```

### Setup .env file from template.env

Copy the template.env file to .env and fill in the values. Variables starting with `VITE_FIREBASE` are used by Firebase, and their values are used in initialisation.

### Compile and Hot-Reload for Development

```sh
npm run dev
```

GraphQL types are generated automatically before `npm run dev` and `npm run build` from usage and the schema in the `functions/src/typeDefs` folder. If you update the schema, you need to update the types.

```sh
npm run codegen
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
firebase deploy --only hosting
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).
