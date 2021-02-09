import * as Automerge from 'automerge'
import { Element } from 'slate'

import { toSlatePath, toJS } from '../utils'
import { getTarget } from '../path'
import { setDataOp } from './set'

const removeTextOp = (op: Automerge.Diff) => (map: any, doc: Element) => {
  try {
    const { index, path, obj } = op

    const slatePath = toSlatePath(path)

    const node = getTarget(doc, slatePath)

    if (typeof index !== 'number') return

    const text = node?.text?.[index] || '*'

    node.text = node.text.slice(0, index) + node.text.slice(index + 1)

    map[obj] = node.text

    return {
      type: 'remove_text',
      path: slatePath,
      offset: index,
      text,
      marks: []
    }
  } catch (e) {
    console.error(e, op, map, toJS(doc))
  }
}

const removeNodeOp = (op: Automerge.Diff) => (map: any, doc: Element) => {
  try {
    const { index, obj, path } = op

    const slatePath = toSlatePath(path)

    const parent = getTarget(doc, slatePath)
    const target =
      parent?.children?.[index as number] || parent?.[index as number] // || { children: [] }

    if (!target) {
      throw new TypeError('Target is not found!')
    }

    if (!Number.isInteger(index)) {
      throw new TypeError('Index is not a number')
    }

    if (parent?.children?.[index as number]) {
      parent.children.splice(index, 1)
      map[obj] = parent?.children
    } else if (parent?.[index as number]) {
      parent.splice(index, 1)
      map[obj] = parent
    }

    return {
      type: 'remove_node',
      path: slatePath.concat(index),
      node: toJS(target)
    }
  } catch (e) {
    console.error(e, op, map, toJS(doc))
  }
}

const removeByType = {
  text: removeTextOp,
  list: removeNodeOp
}

const opRemove = (
  op: Automerge.Diff,
  [map, ops]: any,
  doc: any,
  tmpDoc: Element
) => {
  try {
    const { index, key, path, obj, type } = op

    if (type === 'map') {
      // remove a key from map, mapping to slate set a key's value to undefined.
      if (path && path.length && path[0] === 'children') {
        ops.push(setDataOp(op, doc)(map, tmpDoc))
      } else {
        if (!map.hasOwnProperty(obj)) {
          map[obj] = toJS(Automerge.getObjectById(doc, obj))
        }
        delete map[obj][key as string]
      }
      return [map, ops]
    }
    /*
    if (
      map.hasOwnProperty(obj) &&
      typeof map[obj] !== 'string' &&
      type !== 'text' &&
      map?.obj?.length
    ) {
      map[obj].splice(index, 1)

      return [map, ops]
    }

    if (!path) return [map, ops]
*/
    if (path && path.length && path[0] === 'children') {
      const remove = removeByType[type]

      const operation = remove && remove(op, doc)(map, tmpDoc)

      ops.push(operation)
    } else {
      if (!map.hasOwnProperty(obj)) {
        map[obj] = toJS(Automerge.getObjectById(doc, obj))
      }
      if (type === 'list') {
        map[obj].splice(index, 1)
      } else if (type === 'text') {
        map[obj] = map[obj]
          .slice(0, index)
          .concat(map[obj].slice((index as number) + 1))
      }
    }

    return [map, ops]
  } catch (e) {
    console.error(e, op, toJS(map))

    return [map, ops]
  }
}

export default opRemove
