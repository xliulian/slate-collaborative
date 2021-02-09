import * as Automerge from 'automerge'
import { Element, Node } from 'slate'

import { toSlatePath, toJS } from '../utils'

export const setDataOp = (
  { key = '', obj, path, link, value }: Automerge.Diff,
  doc: any
) => (map: any, tmpDoc: Element) => {
  const slatePath = toSlatePath(path)
  const node = Node.get(tmpDoc, slatePath)
  const oldValue = node[key]
  const newValue = link ? map[value] : value
  // FIXME: is it possible the map is newer than the tmpDoc (data in map modified without path)?
  map[obj] = node // node from tmpDoc is the newest value at the moment, keep map sync

  if (newValue == null) {
    // slate does this check.
    delete node[key]
  } else {
    node[key] = newValue
  }
  return {
    type: 'set_node',
    path: slatePath,
    properties: {
      [key]: toJS(oldValue)
    },
    newProperties: {
      [key]: toJS(newValue)
    }
  }
}

const opSet = (op: Automerge.Diff, [map, ops]: any, doc: any, tmpDoc: any) => {
  const { link, value, path, obj, key } = op

  try {
    if (link && !map.hasOwnProperty(value)) {
      map[value] = toJS(Automerge.getObjectById(doc, value))
    }
    if (path && path.length && path[0] === 'children') {
      ops.push(setDataOp(op, doc)(map, tmpDoc))
    } else {
      if (!map.hasOwnProperty(obj)) {
        map[obj] = toJS(Automerge.getObjectById(doc, obj))
      }
      map[obj][key as string] = link ? map[value] : value
    }

    return [map, ops]
  } catch (e) {
    console.error(e, op, toJS(map))

    return [map, ops]
  }
}

export default opSet
