declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ALGOLIA_ID: string;
      ALGOLIA_ADMIN_KEY: string;
      ALGOLIA_SEARCH_KEY: string;
      ALGOLIA_USERS_INDEX: string;
      DEV_ALGOLIA_USERS_INDEX: string;
    }
  }
}

export {};
