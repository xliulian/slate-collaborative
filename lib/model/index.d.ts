import Automerge from 'automerge';
import { Node, Range } from 'slate';
export declare type SyncValue = Automerge.List<Node>;
export declare type SyncDoc = Automerge.Doc<{
    children: SyncValue;
    cursors: Cursors;
}>;
export declare type CollabActionType = 'operation' | 'document';
export interface CollabAction {
    type: CollabActionType;
    payload: any;
}
export interface CursorData {
    [key: string]: any;
}
export interface Cursor extends Range, CursorData {
    isForward: boolean;
}
export declare type Cursors = {
    [key: string]: Cursor;
};
//# sourceMappingURL=index.d.ts.map