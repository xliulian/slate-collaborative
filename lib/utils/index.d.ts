import toSync from './toSync';
import hexGen from './hexGen';
import { CollabAction } from '../model';
export * from './testUtils';
declare const toJS: (node: any) => any;
declare const cloneNode: (node: any) => any;
declare const toSlatePath: (path: any) => any;
declare const toCollabAction: (type: any, fn: (action: CollabAction) => void) => (payload: any) => void;
export { toSync, toJS, toSlatePath, hexGen, cloneNode, toCollabAction };
//# sourceMappingURL=index.d.ts.map