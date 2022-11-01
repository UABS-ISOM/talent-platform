# talent-platform-frontend

Frontend written in Vue 3, using Quasar for UI.

`src/assets/background.jpg` is taken from the University of Auckland website.

## Project Setup

```sh
npm install
```

### Setup .env file from template.env

Copy the template.env file to .env and fill in the values. Variables starting with `VITE_FIREBASE` are used by Firebase, and their values are used in initialisation.

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).
