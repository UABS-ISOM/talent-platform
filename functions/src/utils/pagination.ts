import type { CollectionReference } from 'firebase-admin/firestore';
import type { PaginationInput } from '../__generated__/graphql';

export const getPaginatedDocs = (
  orderField: string,
  input: PaginationInput | undefined | null
) => {
  const rowsPerPage = Math.max(1, input?.rowsPerPage ?? 50);

  // Doc to start after is given
  if (input?.afterDoc)
    return (ref: CollectionReference) =>
      ref.orderBy(orderField).startAfter(input.afterDoc).limit(rowsPerPage);

  // Doc to start before is given
  if (input?.beforeDoc)
    return (ref: CollectionReference) =>
      ref
        .orderBy(orderField, 'desc')
        .startAfter(input.afterDoc)
        .limit(rowsPerPage);

  // Start after numerical offset
  if (input?.page) {
    const page = Math.max(1, input.page);
    const numDocsPreceeding = (page - 1) * rowsPerPage;

    console.log('numDocsPreceeding', numDocsPreceeding);

    return (ref: CollectionReference) =>
      ref.orderBy(orderField).limit(rowsPerPage).offset(numDocsPreceeding);
  }

  return (ref: CollectionReference) =>
    ref.orderBy(orderField).limit(rowsPerPage);
};
