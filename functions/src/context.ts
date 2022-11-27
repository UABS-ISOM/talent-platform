import type { DecodedIdToken } from 'firebase-admin/auth';
import { type DataSources } from './dataSources';

/**
 * The context provided to each Apollo resolver
 *
 * @export
 * @interface Context
 * @typedef {Context}
 */
export interface Context {
  user: DecodedIdToken | undefined;
  dataSources: DataSources;
}
