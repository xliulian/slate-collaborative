import Automerge from 'automerge'
import { SplitNodeOperation } from 'slate'

import { SyncValue } from '../../model'
import { getParent, getChildren } from '../../path'

const splitNode = (doc: SyncValue, op: SplitNodeOperation): SyncValue => {
  const [parent, index]: [any, number] = getParent(doc, op.path)

  const target = getChildren(parent)[index]
  const inject = {
    ...op.properties
  }

  if (target.text) {
    inject.text = new Automerge.Text(target.text.toString().slice(op.position))
    target.text.length > op.position &&
      target.text.deleteAt(op.position, target.text.length - op.position)
  } else {
    inject.children = target.children.splice(
      op.position,
      target.children.length - op.position
    )
  }

  getChildren(parent).insertAt(index + 1, inject)

  return doc
}

export default splitNode
