"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AutomergeEditor = void 0;

var _automerge = _interopRequireDefault(require("automerge"));

var _slate = require("slate");

var _slateHistory = require("slate-history");

var _bridge = require("@slate-collaborative/bridge");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

/**
 * `AutomergeEditor` contains methods for collaboration-enabled editors.
 */
var AutomergeEditor = {
  /**
   * Create Automerge connection
   */
  createConnection: function createConnection(e, emit) {
    return new _automerge["default"].Connection(e.docSet, (0, _bridge.toCollabAction)('operation', emit));
  },

  /**
   * Apply Slate operations to Automerge
   */
  applySlateOps: function () {
    var _applySlateOps = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e, docId, operations, cursorData) {
      var doc, changed, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, _value;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              doc = e.docSet.getDoc(docId);

              if (doc) {
                _context.next = 4;
                break;
              }

              throw new TypeError("Unknown docId: ".concat(docId, "!"));

            case 4:
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _context.prev = 6;

              _loop = function _loop() {
                var op = _value;
                changed = _automerge["default"].change(changed || doc, function (d) {
                  return (0, _bridge.applyOperation)(d.children, op);
                });
              };

              _iterator = _asyncIterator(operations);

            case 9:
              _context.next = 11;
              return _iterator.next();

            case 11:
              _step = _context.sent;
              _iteratorNormalCompletion = _step.done;
              _context.next = 15;
              return _step.value;

            case 15:
              _value = _context.sent;

              if (_iteratorNormalCompletion) {
                _context.next = 21;
                break;
              }

              _loop();

            case 18:
              _iteratorNormalCompletion = true;
              _context.next = 9;
              break;

            case 21:
              _context.next = 27;
              break;

            case 23:
              _context.prev = 23;
              _context.t0 = _context["catch"](6);
              _didIteratorError = true;
              _iteratorError = _context.t0;

            case 27:
              _context.prev = 27;
              _context.prev = 28;

              if (!(!_iteratorNormalCompletion && _iterator["return"] != null)) {
                _context.next = 32;
                break;
              }

              _context.next = 32;
              return _iterator["return"]();

            case 32:
              _context.prev = 32;

              if (!_didIteratorError) {
                _context.next = 35;
                break;
              }

              throw _iteratorError;

            case 35:
              return _context.finish(32);

            case 36:
              return _context.finish(27);

            case 37:
              changed = _automerge["default"].change(changed || doc, function (d) {
                (0, _bridge.setCursor)(e.clientId, e.selection, d, operations, cursorData || {});
              });
              e.docSet.setDoc(docId, changed);
              _context.next = 44;
              break;

            case 41:
              _context.prev = 41;
              _context.t1 = _context["catch"](0);
              console.error(_context.t1);

            case 44:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 41], [6, 23, 27, 37], [28,, 32, 36]]);
    }));

    function applySlateOps(_x, _x2, _x3, _x4) {
      return _applySlateOps.apply(this, arguments);
    }

    return applySlateOps;
  }(),

  /**
   * Receive and apply document to Automerge docSet
   */
  receiveDocument: function receiveDocument(e, docId, data) {
    var currentDoc = e.docSet.getDoc(docId);

    var externalDoc = _automerge["default"].load(data);

    var mergedDoc = currentDoc ? _automerge["default"].merge(externalDoc, currentDoc) : externalDoc;
    e.docSet.setDoc(docId, mergedDoc);

    _slate.Editor.withoutNormalizing(e, function () {
      var doc = (0, _bridge.toJS)(mergedDoc);
      e.children = doc.children; // XXX: Since we are force override slate internal doc, clear what we can clear

      if (_slateHistory.HistoryEditor.isHistoryEditor(e)) {
        e.history.undos = [];
        e.history.redos = [];
      }

      e.selection = null;
      e.onCursor && e.onCursor(doc.cursors);
    }); // onChange expect valid doc, we make sure do normalization before that.


    _slate.Editor.normalize(e, {
      force: true
    });

    e.onChange();
  },

  /**
   * Generate automerge diff, convert and apply operations to Editor
   */
  applyOperation: function applyOperation(e, docId, data, preserveExternalHistory) {
    var current,
        updated,
        operations,
        slateOps = [];

    try {
      current = e.docSet.getDoc(docId);
      updated = e.connection.receiveMsg(data);
      operations = _automerge["default"].diff(current, updated);

      if (operations.length) {
        slateOps = (0, _bridge.toSlateOp)(operations, current); // do not change isRemote flag for no-op case.

        var wasRemote = e.isRemote;
        e.isRemote = true;

        var applyRemoteOpsToSlate = function applyRemoteOpsToSlate() {
          var opCount = e.operations.length;

          _slate.Editor.withoutNormalizing(e, function () {
            slateOps.forEach(function (o) {
              e.apply(o);
            });
            opCount = e.operations.length;
            e.onCursor && e.onCursor(updated.cursors);
          });

          if (e.operations.length > opCount) {
            // XXX: there are some normalization operations happened
            //      make sure we apply it to remote (automerge doc)
            AutomergeEditor.applySlateOps(e, docId, e.operations.slice(opCount));
          }
        };

        if (_slateHistory.HistoryEditor.isHistoryEditor(e) && !preserveExternalHistory) {
          _slateHistory.HistoryEditor.withoutSaving(e, applyRemoteOpsToSlate);
        } else {
          applyRemoteOpsToSlate();
        }

        if (slateOps.length > 0) {
          // XXX: only schedule set isRemote false when we did scheduled onChange by apply.
          Promise.resolve().then(function (_) {
            return e.isRemote = false;
          });
        } else {
          e.isRemote = wasRemote;
        }
      }
    } catch (err) {
      console.error(err, {
        current: current,
        updated: updated,
        operations: operations,
        slateOps: slateOps,
        editor: e
      });
      throw err;
    }
  },
  garbageCursor: function garbageCursor(e, docId) {
    var doc = e.docSet.getDoc(docId);

    if (!doc) {
      return;
    }

    var changed = _automerge["default"].change(doc, function (d) {
      delete d.cursors;
    });

    e.onCursor && e.onCursor(null);
    e.docSet.setDoc(docId, changed);
    e.onChange();
  }
};
exports.AutomergeEditor = AutomergeEditor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hdXRvbWVyZ2UtZWRpdG9yLnRzIl0sIm5hbWVzIjpbIkF1dG9tZXJnZUVkaXRvciIsImNyZWF0ZUNvbm5lY3Rpb24iLCJlIiwiZW1pdCIsIkF1dG9tZXJnZSIsIkNvbm5lY3Rpb24iLCJkb2NTZXQiLCJhcHBseVNsYXRlT3BzIiwiZG9jSWQiLCJvcGVyYXRpb25zIiwiY3Vyc29yRGF0YSIsImRvYyIsImdldERvYyIsIlR5cGVFcnJvciIsIm9wIiwiY2hhbmdlZCIsImNoYW5nZSIsImQiLCJjaGlsZHJlbiIsImNsaWVudElkIiwic2VsZWN0aW9uIiwic2V0RG9jIiwiY29uc29sZSIsImVycm9yIiwicmVjZWl2ZURvY3VtZW50IiwiZGF0YSIsImN1cnJlbnREb2MiLCJleHRlcm5hbERvYyIsImxvYWQiLCJtZXJnZWREb2MiLCJtZXJnZSIsIkVkaXRvciIsIndpdGhvdXROb3JtYWxpemluZyIsIkhpc3RvcnlFZGl0b3IiLCJpc0hpc3RvcnlFZGl0b3IiLCJoaXN0b3J5IiwidW5kb3MiLCJyZWRvcyIsIm9uQ3Vyc29yIiwiY3Vyc29ycyIsIm5vcm1hbGl6ZSIsImZvcmNlIiwib25DaGFuZ2UiLCJhcHBseU9wZXJhdGlvbiIsInByZXNlcnZlRXh0ZXJuYWxIaXN0b3J5IiwiY3VycmVudCIsInVwZGF0ZWQiLCJzbGF0ZU9wcyIsImNvbm5lY3Rpb24iLCJyZWNlaXZlTXNnIiwiZGlmZiIsImxlbmd0aCIsIndhc1JlbW90ZSIsImlzUmVtb3RlIiwiYXBwbHlSZW1vdGVPcHNUb1NsYXRlIiwib3BDb3VudCIsImZvckVhY2giLCJvIiwiYXBwbHkiLCJzbGljZSIsIndpdGhvdXRTYXZpbmciLCJQcm9taXNlIiwicmVzb2x2ZSIsInRoZW4iLCJfIiwiZXJyIiwiZWRpdG9yIiwiZ2FyYmFnZUN1cnNvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBOztBQUNBOztBQUVBOzs7Ozs7Ozs7O0FBZ0NBO0FBQ0E7QUFDQTtBQUVPLElBQU1BLGVBQWUsR0FB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QUFDd0MsUUFBRjtBQUNEO0FBMUo0QixDQUF4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBdXRvbWVyZ2UgZnJvbSAnYXV0b21lcmdlJ1xuXG5pbXBvcnQgeyBFZGl0b3IsIE9wZXJhdGlvbiB9IGZyb20gJ3NsYXRlJ1xuaW1wb3J0IHsgSGlzdG9yeUVkaXRvciB9IGZyb20gJ3NsYXRlLWhpc3RvcnknXG5cbmltcG9ydCB7XG4gIHRvSlMsXG4gIFN5bmNEb2MsXG4gIENvbGxhYkFjdGlvbixcbiAgdG9Db2xsYWJBY3Rpb24sXG4gIGFwcGx5T3BlcmF0aW9uLFxuICBzZXRDdXJzb3IsXG4gIHRvU2xhdGVPcCxcbiAgQ3Vyc29yRGF0YVxufSBmcm9tICdAc2xhdGUtY29sbGFib3JhdGl2ZS9icmlkZ2UnXG5cbmV4cG9ydCBpbnRlcmZhY2UgQXV0b21lcmdlRWRpdG9yIGV4dGVuZHMgRWRpdG9yIHtcbiAgY2xpZW50SWQ6IHN0cmluZ1xuXG4gIGlzUmVtb3RlOiBib29sZWFuXG5cbiAgZG9jU2V0OiBBdXRvbWVyZ2UuRG9jU2V0PFN5bmNEb2M+XG4gIGNvbm5lY3Rpb246IEF1dG9tZXJnZS5Db25uZWN0aW9uPFN5bmNEb2M+XG5cbiAgb25Db25uZWN0aW9uTXNnOiAobXNnOiBBdXRvbWVyZ2UuTWVzc2FnZSkgPT4gdm9pZFxuXG4gIG9wZW5Db25uZWN0aW9uOiAoKSA9PiB2b2lkXG4gIGNsb3NlQ29ubmVjdGlvbjogKCkgPT4gdm9pZFxuXG4gIHJlY2VpdmVEb2N1bWVudDogKGRhdGE6IHN0cmluZykgPT4gdm9pZFxuICByZWNlaXZlT3BlcmF0aW9uOiAoZGF0YTogQXV0b21lcmdlLk1lc3NhZ2UpID0+IHZvaWRcblxuICBnYWJhZ2VDdXJzb3I6ICgpID0+IHZvaWRcblxuICBvbkN1cnNvcjogKGRhdGE6IGFueSkgPT4gdm9pZFxufVxuXG4vKipcbiAqIGBBdXRvbWVyZ2VFZGl0b3JgIGNvbnRhaW5zIG1ldGhvZHMgZm9yIGNvbGxhYm9yYXRpb24tZW5hYmxlZCBlZGl0b3JzLlxuICovXG5cbmV4cG9ydCBjb25zdCBBdXRvbWVyZ2VFZGl0b3IgPSB7XG4gIC8qKlxuICAgKiBDcmVhdGUgQXV0b21lcmdlIGNvbm5lY3Rpb25cbiAgICovXG5cbiAgY3JlYXRlQ29ubmVjdGlvbjogKGU6IEF1dG9tZXJnZUVkaXRvciwgZW1pdDogKGRhdGE6IENvbGxhYkFjdGlvbikgPT4gdm9pZCkgPT5cbiAgICBuZXcgQXV0b21lcmdlLkNvbm5lY3Rpb24oZS5kb2NTZXQsIHRvQ29sbGFiQWN0aW9uKCdvcGVyYXRpb24nLCBlbWl0KSksXG5cbiAgLyoqXG4gICAqIEFwcGx5IFNsYXRlIG9wZXJhdGlvbnMgdG8gQXV0b21lcmdlXG4gICAqL1xuXG4gIGFwcGx5U2xhdGVPcHM6IGFzeW5jIChcbiAgICBlOiBBdXRvbWVyZ2VFZGl0b3IsXG4gICAgZG9jSWQ6IHN0cmluZyxcbiAgICBvcGVyYXRpb25zOiBPcGVyYXRpb25bXSxcbiAgICBjdXJzb3JEYXRhPzogQ3Vyc29yRGF0YVxuICApID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZG9jID0gZS5kb2NTZXQuZ2V0RG9jKGRvY0lkKVxuXG4gICAgICBpZiAoIWRvYykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBVbmtub3duIGRvY0lkOiAke2RvY0lkfSFgKVxuICAgICAgfVxuXG4gICAgICBsZXQgY2hhbmdlZFxuXG4gICAgICBmb3IgYXdhaXQgKGxldCBvcCBvZiBvcGVyYXRpb25zKSB7XG4gICAgICAgIGNoYW5nZWQgPSBBdXRvbWVyZ2UuY2hhbmdlPFN5bmNEb2M+KGNoYW5nZWQgfHwgZG9jLCBkID0+XG4gICAgICAgICAgYXBwbHlPcGVyYXRpb24oZC5jaGlsZHJlbiwgb3ApXG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgY2hhbmdlZCA9IEF1dG9tZXJnZS5jaGFuZ2UoY2hhbmdlZCB8fCBkb2MsIGQgPT4ge1xuICAgICAgICBzZXRDdXJzb3IoZS5jbGllbnRJZCwgZS5zZWxlY3Rpb24sIGQsIG9wZXJhdGlvbnMsIGN1cnNvckRhdGEgfHwge30pXG4gICAgICB9KVxuXG4gICAgICBlLmRvY1NldC5zZXREb2MoZG9jSWQsIGNoYW5nZWQgYXMgYW55KVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSlcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlY2VpdmUgYW5kIGFwcGx5IGRvY3VtZW50IHRvIEF1dG9tZXJnZSBkb2NTZXRcbiAgICovXG5cbiAgcmVjZWl2ZURvY3VtZW50OiAoZTogQXV0b21lcmdlRWRpdG9yLCBkb2NJZDogc3RyaW5nLCBkYXRhOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBjdXJyZW50RG9jID0gZS5kb2NTZXQuZ2V0RG9jKGRvY0lkKVxuXG4gICAgY29uc3QgZXh0ZXJuYWxEb2MgPSBBdXRvbWVyZ2UubG9hZDxTeW5jRG9jPihkYXRhKVxuXG4gICAgY29uc3QgbWVyZ2VkRG9jID0gY3VycmVudERvYyA/IEF1dG9tZXJnZS5tZXJnZTxTeW5jRG9jPihcbiAgICAgIGV4dGVybmFsRG9jLFxuICAgICAgY3VycmVudERvY1xuICAgICkgOiBleHRlcm5hbERvY1xuXG4gICAgZS5kb2NTZXQuc2V0RG9jKGRvY0lkLCBtZXJnZWREb2MpXG5cbiAgICBFZGl0b3Iud2l0aG91dE5vcm1hbGl6aW5nKGUsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvYyA9IHRvSlMobWVyZ2VkRG9jKVxuICAgICAgZS5jaGlsZHJlbiA9IGRvYy5jaGlsZHJlblxuICAgICAgLy8gWFhYOiBTaW5jZSB3ZSBhcmUgZm9yY2Ugb3ZlcnJpZGUgc2xhdGUgaW50ZXJuYWwgZG9jLCBjbGVhciB3aGF0IHdlIGNhbiBjbGVhclxuICAgICAgaWYgKEhpc3RvcnlFZGl0b3IuaXNIaXN0b3J5RWRpdG9yKGUpKSB7XG4gICAgICAgIGUuaGlzdG9yeS51bmRvcyA9IFtdXG4gICAgICAgIGUuaGlzdG9yeS5yZWRvcyA9IFtdXG4gICAgICB9XG4gICAgICBlLnNlbGVjdGlvbiA9IG51bGxcbiAgICAgIGUub25DdXJzb3IgJiYgZS5vbkN1cnNvcihkb2MuY3Vyc29ycylcbiAgICB9KVxuXG4gICAgLy8gb25DaGFuZ2UgZXhwZWN0IHZhbGlkIGRvYywgd2UgbWFrZSBzdXJlIGRvIG5vcm1hbGl6YXRpb24gYmVmb3JlIHRoYXQuXG4gICAgRWRpdG9yLm5vcm1hbGl6ZShlLCB7IGZvcmNlOiB0cnVlIH0pXG4gICAgZS5vbkNoYW5nZSgpXG4gIH0sXG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIGF1dG9tZXJnZSBkaWZmLCBjb252ZXJ0IGFuZCBhcHBseSBvcGVyYXRpb25zIHRvIEVkaXRvclxuICAgKi9cblxuICBhcHBseU9wZXJhdGlvbjogKFxuICAgIGU6IEF1dG9tZXJnZUVkaXRvcixcbiAgICBkb2NJZDogc3RyaW5nLFxuICAgIGRhdGE6IEF1dG9tZXJnZS5NZXNzYWdlLFxuICAgIHByZXNlcnZlRXh0ZXJuYWxIaXN0b3J5PzogYm9vbGVhblxuICApID0+IHtcbiAgICBsZXQgY3VycmVudCxcbiAgICAgIHVwZGF0ZWQ6IGFueSxcbiAgICAgIG9wZXJhdGlvbnMsXG4gICAgICBzbGF0ZU9wczogT3BlcmF0aW9uW10gPSBbXVxuICAgIHRyeSB7XG4gICAgICBjdXJyZW50ID0gZS5kb2NTZXQuZ2V0RG9jKGRvY0lkKVxuXG4gICAgICB1cGRhdGVkID0gZS5jb25uZWN0aW9uLnJlY2VpdmVNc2coZGF0YSlcblxuICAgICAgb3BlcmF0aW9ucyA9IEF1dG9tZXJnZS5kaWZmKGN1cnJlbnQsIHVwZGF0ZWQpXG5cbiAgICAgIGlmIChvcGVyYXRpb25zLmxlbmd0aCkge1xuICAgICAgICBzbGF0ZU9wcyA9IHRvU2xhdGVPcChvcGVyYXRpb25zLCBjdXJyZW50KVxuXG4gICAgICAgIC8vIGRvIG5vdCBjaGFuZ2UgaXNSZW1vdGUgZmxhZyBmb3Igbm8tb3AgY2FzZS5cbiAgICAgICAgY29uc3Qgd2FzUmVtb3RlID0gZS5pc1JlbW90ZVxuICAgICAgICBlLmlzUmVtb3RlID0gdHJ1ZVxuXG4gICAgICAgIGNvbnN0IGFwcGx5UmVtb3RlT3BzVG9TbGF0ZSA9ICgpID0+IHtcbiAgICAgICAgICBsZXQgb3BDb3VudCA9IGUub3BlcmF0aW9ucy5sZW5ndGhcbiAgICAgICAgICBFZGl0b3Iud2l0aG91dE5vcm1hbGl6aW5nKGUsICgpID0+IHtcbiAgICAgICAgICAgIHNsYXRlT3BzLmZvckVhY2goKG86IE9wZXJhdGlvbikgPT4ge1xuICAgICAgICAgICAgICBlLmFwcGx5KG8pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgb3BDb3VudCA9IGUub3BlcmF0aW9ucy5sZW5ndGhcbiAgICAgICAgICAgIGUub25DdXJzb3IgJiYgZS5vbkN1cnNvcih1cGRhdGVkLmN1cnNvcnMpXG4gICAgICAgICAgfSlcbiAgICAgICAgICBpZiAoZS5vcGVyYXRpb25zLmxlbmd0aCA+IG9wQ291bnQpIHtcbiAgICAgICAgICAgIC8vIFhYWDogdGhlcmUgYXJlIHNvbWUgbm9ybWFsaXphdGlvbiBvcGVyYXRpb25zIGhhcHBlbmVkXG4gICAgICAgICAgICAvLyAgICAgIG1ha2Ugc3VyZSB3ZSBhcHBseSBpdCB0byByZW1vdGUgKGF1dG9tZXJnZSBkb2MpXG4gICAgICAgICAgICBBdXRvbWVyZ2VFZGl0b3IuYXBwbHlTbGF0ZU9wcyhlLCBkb2NJZCwgZS5vcGVyYXRpb25zLnNsaWNlKG9wQ291bnQpKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoSGlzdG9yeUVkaXRvci5pc0hpc3RvcnlFZGl0b3IoZSkgJiYgIXByZXNlcnZlRXh0ZXJuYWxIaXN0b3J5KSB7XG4gICAgICAgICAgSGlzdG9yeUVkaXRvci53aXRob3V0U2F2aW5nKGUsIGFwcGx5UmVtb3RlT3BzVG9TbGF0ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcHBseVJlbW90ZU9wc1RvU2xhdGUoKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNsYXRlT3BzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAvLyBYWFg6IG9ubHkgc2NoZWR1bGUgc2V0IGlzUmVtb3RlIGZhbHNlIHdoZW4gd2UgZGlkIHNjaGVkdWxlZCBvbkNoYW5nZSBieSBhcHBseS5cbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKF8gPT4gKGUuaXNSZW1vdGUgPSBmYWxzZSkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZS5pc1JlbW90ZSA9IHdhc1JlbW90ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVyciwgeyBjdXJyZW50LCB1cGRhdGVkLCBvcGVyYXRpb25zLCBzbGF0ZU9wcywgZWRpdG9yOiBlIH0pXG4gICAgICB0aHJvdyBlcnJcbiAgICB9XG4gIH0sXG5cbiAgZ2FyYmFnZUN1cnNvcjogKGU6IEF1dG9tZXJnZUVkaXRvciwgZG9jSWQ6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGRvYyA9IGUuZG9jU2V0LmdldERvYyhkb2NJZClcblxuICAgIGlmICghZG9jKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBjaGFuZ2VkID0gQXV0b21lcmdlLmNoYW5nZTxTeW5jRG9jPihkb2MsIChkOiBhbnkpID0+IHtcbiAgICAgIGRlbGV0ZSBkLmN1cnNvcnNcbiAgICB9KVxuXG4gICAgZS5vbkN1cnNvciAmJiBlLm9uQ3Vyc29yKG51bGwpXG5cbiAgICBlLmRvY1NldC5zZXREb2MoZG9jSWQsIGNoYW5nZWQpXG5cbiAgICBlLm9uQ2hhbmdlKClcbiAgfVxufVxuIl19