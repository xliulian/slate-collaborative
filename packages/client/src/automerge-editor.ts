import Automerge from 'automerge'

import { Editor, Operation } from 'slate'
import { HistoryEditor } from 'slate-history'

import {
  toJS,
  SyncDoc,
  CollabAction,
  toCollabAction,
  applyOperation,
  setCursor,
  toSlateOp,
  CursorData
} from '@slate-collaborative/bridge'

export interface AutomergeEditor extends Editor {
  clientId: string

  isRemote: boolean

  docSet: Automerge.DocSet<SyncDoc>
  connection: Automerge.Connection<SyncDoc>

  onConnectionMsg: (msg: Automerge.Message) => void

  openConnection: () => void
  closeConnection: () => void

  receiveDocument: (data: string) => void
  receiveOperation: (data: Automerge.Message) => void

  gabageCursor: () => void

  onCursor: (data: any) => void
}

/**
 * `AutomergeEditor` contains methods for collaboration-enabled editors.
 */

export const AutomergeEditor = {
  /**
   * Create Automerge connection
   */

  createConnection: (e: AutomergeEditor, emit: (data: CollabAction) => void) =>
    new Automerge.Connection(e.docSet, toCollabAction('operation', emit)),

  /**
   * Apply Slate operations to Automerge
   */

  applySlateOps: async (
    e: AutomergeEditor,
    docId: string,
    operations: Operation[],
    cursorData?: CursorData
  ) => {
    try {
      const doc = e.docSet.getDoc(docId)

      if (!doc) {
        throw new TypeError(`Unknown docId: ${docId}!`)
      }

      let changed

      for await (let op of operations) {
        changed = Automerge.change<SyncDoc>(changed || doc, d =>
          applyOperation(d.children, op)
        )
      }

      changed = Automerge.change(changed || doc, d => {
        setCursor(e.clientId, e.selection, d, operations, cursorData || {})
      })

      e.docSet.setDoc(docId, changed as any)
    } catch (e) {
      console.error(e)
    }
  },

  /**
   * Receive and apply document to Automerge docSet
   */

  receiveDocument: (e: AutomergeEditor, docId: string, data: string) => {
    const currentDoc = e.docSet.getDoc(docId)

    const externalDoc = Automerge.load<SyncDoc>(data)

    const mergedDoc = currentDoc ? Automerge.merge<SyncDoc>(
      externalDoc,
      currentDoc
    ) : externalDoc

    e.docSet.setDoc(docId, mergedDoc)

    Editor.withoutNormalizing(e, () => {
      const doc = toJS(mergedDoc)
      e.children = doc.children
      // XXX: Since we are force override slate internal doc, clear what we can clear
      if (HistoryEditor.isHistoryEditor(e)) {
        e.history.undos = []
        e.history.redos = []
      }
      e.selection = null
      e.onCursor && e.onCursor(doc.cursors)
    })

    // onChange expect valid doc, we make sure do normalization before that.
    Editor.normalize(e, { force: true })
    e.onChange()
  },

  /**
   * Generate automerge diff, convert and apply operations to Editor
   */

  applyOperation: (
    e: AutomergeEditor,
    docId: string,
    data: Automerge.Message,
    preserveExternalHistory?: boolean
  ) => {
    let current,
      updated: any,
      operations,
      slateOps: Operation[] = []
    try {
      current = e.docSet.getDoc(docId)

      updated = e.connection.receiveMsg(data)

      operations = Automerge.diff(current, updated)

      if (operations.length) {
        slateOps = toSlateOp(operations, current)

        // do not change isRemote flag for no-op case.
        const wasRemote = e.isRemote
        e.isRemote = true

        const applyRemoteOpsToSlate = () => {
          let opCount = e.operations.length
          Editor.withoutNormalizing(e, () => {
            slateOps.forEach((o: Operation) => {
              e.apply(o)
            })
            opCount = e.operations.length
            e.onCursor && e.onCursor(updated.cursors)
          })
          if (e.operations.length > opCount) {
            // XXX: there are some normalization operations happened
            //      make sure we apply it to remote (automerge doc)
            AutomergeEditor.applySlateOps(e, docId, e.operations.slice(opCount))
          }
        }
        if (HistoryEditor.isHistoryEditor(e) && !preserveExternalHistory) {
          HistoryEditor.withoutSaving(e, applyRemoteOpsToSlate)
        } else {
          applyRemoteOpsToSlate()
        }

        if (slateOps.length > 0) {
          // XXX: only schedule set isRemote false when we did scheduled onChange by apply.
          Promise.resolve().then(_ => (e.isRemote = false))
        } else {
          e.isRemote = wasRemote
        }
      }
    } catch (err) {
      console.error(err, { current, updated, operations, slateOps, editor: e })
      throw err
    }
  },

  garbageCursor: (e: AutomergeEditor, docId: string) => {
    const doc = e.docSet.getDoc(docId)

    if (!doc) {
      return
    }

    const changed = Automerge.change<SyncDoc>(doc, (d: any) => {
      delete d.cursors
    })

    e.onCursor && e.onCursor(null)

    e.docSet.setDoc(docId, changed)

    e.onChange()
  }
}
