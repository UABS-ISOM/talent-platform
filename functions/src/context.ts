import type { DecodedIdToken } from 'firebase-admin/auth';
import type { DataLoaders } from './dataLoaders';

/**
 * The context provided to each Apollo resolver
 *
 * @export
 * @interface Context
 * @typedef {Context}
 */
export interface Context {
  user: DecodedIdToken | undefined;
  dataLoaders: DataLoaders;
}
