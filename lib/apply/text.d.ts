import { InsertTextOperation, RemoveTextOperation } from 'slate';
import { SyncValue } from '../model';
export declare const insertText: (doc: SyncValue, op: InsertTextOperation) => SyncValue;
export declare const removeText: (doc: SyncValue, op: RemoveTextOperation) => SyncValue;
declare const _default: {
    insert_text: (doc: SyncValue, op: InsertTextOperation) => SyncValue;
    remove_text: (doc: SyncValue, op: RemoveTextOperation) => SyncValue;
};
export default _default;
//# sourceMappingURL=text.d.ts.map