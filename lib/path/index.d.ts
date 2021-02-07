import { Element, Node, Path } from 'slate';
import { SyncValue } from '../model';
export declare const isTree: (node: Node) => boolean;
export declare const getTarget: (doc: SyncValue | Element, path: Path) => any;
export declare const getParentPath: (path: Path, level?: number) => [number, Path];
export declare const getParent: (doc: SyncValue | Element, path: Path, level?: number) => [any, number];
export declare const getChildren: (node: any) => any;
//# sourceMappingURL=index.d.ts.map