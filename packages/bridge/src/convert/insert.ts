import * as Automerge from 'automerge'
import { Element, Node, Path } from 'slate'
import _ from 'lodash'

import { getTarget } from '../path'
import { toSlatePath, toJS } from '../utils'

import { SyncDoc } from '../model'

const insertTextOp = ({ obj, index, path, value }: Automerge.Diff) => (
  map: any,
  doc: Element
) => {
  const slatePath = toSlatePath(path)
  const node = Node.get(doc, slatePath)!
  const text = node.text! as string
  node.text = [text.slice(0, index), value, text.slice(index)].join('')
  map[obj] = node.text
  return {
    type: 'insert_text',
    path: slatePath,
    offset: index,
    text: value
    //marks: []
  }
}

const insertNodeOp = (
  { link, value, obj, index, path }: Automerge.Diff,
  doc: any
) => (map: any, tmpDoc: Element) => {
  /*const ops: any = []

  const iterate = ({ children, ...json }: any, path: any) => {
    const node = toJS(children ? { ...json, children: [] } : json)

    ops.push({
      type: 'insert_node',
      path,
      node
    })

    // update the temp doc so later remove_node won't error.
    const parent = Node.parent(tmpDoc, path)
    const index = path[path.length - 1]
    parent.children.splice(index, 0, toJS(node))

    children &&
      children.forEach((n: any, i: any) => {
        const node = map[n] || Automerge.getObjectById(doc, n)

        iterate((node && toJS(node)) || n, [...path, i])
      })
  }
*/
  const source = link ? map[value] : value

  const slatePath = toSlatePath(path)
  const parent = Node.get(tmpDoc, slatePath)!
  map[obj] = parent.children
  map[obj].splice(index, 0, source)

  //ops.push({
  return {
    type: 'insert_node',
    path: [...slatePath, index],
    node: toJS(source)
  } //)

  //source && iterate(source, [...toSlatePath(path), index])

  //return ops
}

const insertByType = {
  text: insertTextOp,
  list: insertNodeOp
}

const opInsert = (
  op: Automerge.Diff,
  [map, ops]: any,
  doc: SyncDoc,
  tmpDoc: Element
) => {
  try {
    const { link, obj, path, index, type, value } = op

    if (link && !map.hasOwnProperty(value)) {
      map[value] = toJS(Automerge.getObjectById(doc, value))
    }
    if (path && path.length && path[0] === 'children') {
      const insert = insertByType[type]

      const operation = insert && insert(op, doc)(map, tmpDoc)

      if (operation && operation.type === 'insert_node' && operation.node) {
        const lastOp = ops[ops.length - 1]
        if (
          operation.node.text &&
          Object.keys(operation.node).length === 1 &&
          lastOp &&
          lastOp.type === 'remove_text' &&
          Path.equals(operation.path, Path.next(lastOp.path)) &&
          lastOp.text.slice(-operation.node.text.length) === operation.node.text
        ) {
          // insert text node just after delete some text, it possiblly be some split_node op?
          const slatePath = toSlatePath(lastOp.path)
          const lastNode = getTarget(tmpDoc, slatePath)
          if (lastNode.text.length === lastOp.offset) {
            // previous node was just deleted text until the end, so we are splitting
            if (lastOp.text.length > operation.node.text.length) {
              lastOp.text = lastOp.text.slice(0, -operation.node.text.length)
            } else {
              ops.pop()
            }
            ops.push({
              type: 'split_node',
              path: lastOp.path,
              position: lastOp.offset,
              properties: {}
            })
            return [map, ops]
          }
        } else if (
          lastOp &&
          lastOp.type === 'remove_node' &&
          _.isEqual(lastOp.node, operation.node)
        ) {
          ops.pop()
          // XXX: fix the newPath since it currently is the case old path was removed
          //      but we need consider if the old path is not removed, what the newPath
          //      should be.
          //   1. if newPath is before path, it is not effected.
          //   2. if newPath same or under path, at the path end position, should add 1
          //   3. if newPath above path, remove path does not effect above path
          //   4. if newPath is after path, and is or under siblings after lowest level of path, add 1
          //   5. if newPath is after path, but not share same parent, it is not effected.
          const newPath = operation.path
          if (
            !Path.isBefore(operation.path, lastOp.path) &&
            operation.path.length >= lastOp.path.length && // parent also match !isBefore, but not effected.
            Path.isCommon(Path.parent(lastOp.path), operation.path)
          ) {
            newPath[lastOp.path.length - 1] += 1
          }
          ops.push({
            type: 'move_node',
            path: lastOp.path,
            newPath
          })
          return [map, ops]
        }
      } else if (operation && operation.type === 'insert_text') {
        const lastOp = ops[ops.length - 1]
        if (
          lastOp &&
          lastOp.type === 'insert_text' &&
          Path.equals(operation.path, lastOp.path) &&
          lastOp.offset + lastOp.text.length === operation.offset
        ) {
          lastOp.text += operation.text
          return [map, ops]
        }
      }
      ops.push(operation)
    } else {
      if (!map.hasOwnProperty(obj)) {
        map[obj] = toJS(Automerge.getObjectById(doc, obj))
      }
      if (type === 'list') {
        map[obj].splice(index, 0, link ? map[value] : value)
      } else if (type === 'text') {
        map[obj] = map[obj]
          ? map[obj]
              .slice(0, index)
              .concat(value)
              .concat(map[obj].slice(index))
          : value
      }
    }

    return [map, ops]
  } catch (e) {
    console.error(e, op, toJS(map))

    return [map, ops]
  }
}

export default opInsert
