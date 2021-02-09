import * as Automerge from 'automerge';
import { Node } from 'slate';
export declare const createText: (text?: string) => {
    text: string;
};
export declare const createNode: (type?: string, text?: string, data?: {
    [key: string]: any;
} | undefined) => {
    type: string;
    children: {
        text: string;
    }[];
};
export declare const createValue: (children?: any) => {
    children: Node[];
};
export declare const createDoc: (children?: any) => Automerge.FreezeObject<any>;
export declare const cloneDoc: (doc: any) => any;
//# sourceMappingURL=testUtils.d.ts.map