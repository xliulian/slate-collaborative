import { Operation } from 'slate';
import { SyncValue } from '../model';
declare const applyOperation: (doc: SyncValue, op: Operation) => SyncValue;
declare const applySlateOps: (doc: SyncValue, operations: Operation[]) => SyncValue;
export { applyOperation, applySlateOps };
//# sourceMappingURL=index.d.ts.map