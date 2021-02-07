import * as Automerge from 'automerge';
import { Element } from 'slate';
export declare const setDataOp: ({ key, obj, path, value }: Automerge.Diff, doc: any) => (map: any, tmpDoc: Element) => {
    type: string;
    path: any;
    properties: {
        [x: string]: any;
    };
    newProperties: {
        [x: string]: any;
    };
};
declare const opSet: (op: Automerge.Diff, [map, ops]: any, doc: any, tmpDoc: any) => any[];
export default opSet;
//# sourceMappingURL=set.d.ts.map