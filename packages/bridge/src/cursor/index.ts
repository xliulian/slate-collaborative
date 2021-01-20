import { Operation, Range } from 'slate'

import { CursorData } from '../model'

export const setCursor = (
  id: string,
  selection: Range | null,
  doc: any,
  operations: Operation[],
  cursorData: CursorData
) => {
  const cursorOps = operations.filter(op => op.type === 'set_selection')

  if (!doc.cursors) doc.cursors = {}

  const newCursor = cursorOps[cursorOps.length - 1]?.newProperties || {}

  if (selection) {
    const oldCursorData = (doc.cursors[id] && JSON.parse(doc.cursors[id])) || {}
    const newCursorData = Object.assign(oldCursorData, newCursor, selection, {
      ...cursorData,
      isForward: Range.isForward(selection),
      seq: (oldCursorData.seq || 0) + 1
    })

    doc.cursors[id] = JSON.stringify(newCursorData)
  } else {
    delete doc.cursors[id]
  }

  return doc
}
