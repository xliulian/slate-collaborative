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

    var mergedDoc = _automerge["default"].merge(externalDoc, currentDoc || _automerge["default"].init());

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
    try {
      var current = e.docSet.getDoc(docId);
      var updated = e.connection.receiveMsg(data);

      var operations = _automerge["default"].diff(current, updated);

      if (operations.length) {
        var slateOps = (0, _bridge.toSlateOp)(operations, current); // do not change isRemote flag for no-op case.

        var wasRemote = e.isRemote;
        e.isRemote = true;

        var applyRemoteOpsToSlate = function applyRemoteOpsToSlate() {
          _slate.Editor.withoutNormalizing(e, function () {
            slateOps.forEach(function (o) {
              e.apply(o);
            });
            e.onCursor && e.onCursor(updated.cursors);
          });
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
    } catch (e) {
      console.error(e);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hdXRvbWVyZ2UtZWRpdG9yLnRzIl0sIm5hbWVzIjpbIkF1dG9tZXJnZUVkaXRvciIsImNyZWF0ZUNvbm5lY3Rpb24iLCJlIiwiZW1pdCIsIkF1dG9tZXJnZSIsIkNvbm5lY3Rpb24iLCJkb2NTZXQiLCJhcHBseVNsYXRlT3BzIiwiZG9jSWQiLCJvcGVyYXRpb25zIiwiY3Vyc29yRGF0YSIsImRvYyIsImdldERvYyIsIlR5cGVFcnJvciIsIm9wIiwiY2hhbmdlZCIsImNoYW5nZSIsImQiLCJjaGlsZHJlbiIsImNsaWVudElkIiwic2VsZWN0aW9uIiwic2V0RG9jIiwiY29uc29sZSIsImVycm9yIiwicmVjZWl2ZURvY3VtZW50IiwiZGF0YSIsImN1cnJlbnREb2MiLCJleHRlcm5hbERvYyIsImxvYWQiLCJtZXJnZWREb2MiLCJtZXJnZSIsImluaXQiLCJFZGl0b3IiLCJ3aXRob3V0Tm9ybWFsaXppbmciLCJIaXN0b3J5RWRpdG9yIiwiaXNIaXN0b3J5RWRpdG9yIiwiaGlzdG9yeSIsInVuZG9zIiwicmVkb3MiLCJvbkN1cnNvciIsImN1cnNvcnMiLCJub3JtYWxpemUiLCJmb3JjZSIsIm9uQ2hhbmdlIiwiYXBwbHlPcGVyYXRpb24iLCJwcmVzZXJ2ZUV4dGVybmFsSGlzdG9yeSIsImN1cnJlbnQiLCJ1cGRhdGVkIiwiY29ubmVjdGlvbiIsInJlY2VpdmVNc2ciLCJkaWZmIiwibGVuZ3RoIiwic2xhdGVPcHMiLCJ3YXNSZW1vdGUiLCJpc1JlbW90ZSIsImFwcGx5UmVtb3RlT3BzVG9TbGF0ZSIsImZvckVhY2giLCJvIiwiYXBwbHkiLCJ3aXRob3V0U2F2aW5nIiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwiXyIsImdhcmJhZ2VDdXJzb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7OztBQWdDQTtBQUNBO0FBQ0E7QUFFTyxJQUFNQSxlQUFlLEdBQUc7QUFDN0I7QUFDRjtBQUNBO0FBRUVDLEVB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TUFBVCxDQUFnQkosS0FBaEIsQ0FBWjs7QUFFQSxRQUFJLENBQUNHLEdBQUwsRUFBVTtBQUNSO0FBQ0Q7O0FBRUQsUUFBTUksT0FBTyxHQUFHWCxzQkFBVVksTUFBVixDQUEwQkwsR0FBMUIsRUFBK0IsVUFBQ00sQ0FBRCxFQUFZO0FBQ3pELGFBQU9BLENBQUMsQ0FBQ3VCLE9BQVQ7QUFDRCxLQUZlLENBQWhCOztBQUlBdEMsSUFBQUEsQ0FBQyxDQUFDcUMsUUFBRixJQUFjckMsQ0FBQyxDQUFDcUMsUUFBRixDQUFXLElBQVgsQ0FBZDtBQUVBckMsSUFBQUEsQ0FBQyxDQUFDSSxNQUFGLENBQVNlLE1BQVQsQ0FBZ0JiLEtBQWhCLEVBQXVCTyxPQUF2QjtBQUVBYixJQUFBQSxDQUFDLENBQUN5QyxRQUFGO0FBQ0Q7QUE5STRCLENBQXhCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEF1dG9tZXJnZSBmcm9tICdhdXRvbWVyZ2UnXG5cbmltcG9ydCB7IEVkaXRvciwgT3BlcmF0aW9uIH0gZnJvbSAnc2xhdGUnXG5pbXBvcnQgeyBIaXN0b3J5RWRpdG9yIH0gZnJvbSAnc2xhdGUtaGlzdG9yeSdcblxuaW1wb3J0IHtcbiAgdG9KUyxcbiAgU3luY0RvYyxcbiAgQ29sbGFiQWN0aW9uLFxuICB0b0NvbGxhYkFjdGlvbixcbiAgYXBwbHlPcGVyYXRpb24sXG4gIHNldEN1cnNvcixcbiAgdG9TbGF0ZU9wLFxuICBDdXJzb3JEYXRhXG59IGZyb20gJ0BzbGF0ZS1jb2xsYWJvcmF0aXZlL2JyaWRnZSdcblxuZXhwb3J0IGludGVyZmFjZSBBdXRvbWVyZ2VFZGl0b3IgZXh0ZW5kcyBFZGl0b3Ige1xuICBjbGllbnRJZDogc3RyaW5nXG5cbiAgaXNSZW1vdGU6IGJvb2xlYW5cblxuICBkb2NTZXQ6IEF1dG9tZXJnZS5Eb2NTZXQ8U3luY0RvYz5cbiAgY29ubmVjdGlvbjogQXV0b21lcmdlLkNvbm5lY3Rpb248U3luY0RvYz5cblxuICBvbkNvbm5lY3Rpb25Nc2c6IChtc2c6IEF1dG9tZXJnZS5NZXNzYWdlKSA9PiB2b2lkXG5cbiAgb3BlbkNvbm5lY3Rpb246ICgpID0+IHZvaWRcbiAgY2xvc2VDb25uZWN0aW9uOiAoKSA9PiB2b2lkXG5cbiAgcmVjZWl2ZURvY3VtZW50OiAoZGF0YTogc3RyaW5nKSA9PiB2b2lkXG4gIHJlY2VpdmVPcGVyYXRpb246IChkYXRhOiBBdXRvbWVyZ2UuTWVzc2FnZSkgPT4gdm9pZFxuXG4gIGdhYmFnZUN1cnNvcjogKCkgPT4gdm9pZFxuXG4gIG9uQ3Vyc29yOiAoZGF0YTogYW55KSA9PiB2b2lkXG59XG5cbi8qKlxuICogYEF1dG9tZXJnZUVkaXRvcmAgY29udGFpbnMgbWV0aG9kcyBmb3IgY29sbGFib3JhdGlvbi1lbmFibGVkIGVkaXRvcnMuXG4gKi9cblxuZXhwb3J0IGNvbnN0IEF1dG9tZXJnZUVkaXRvciA9IHtcbiAgLyoqXG4gICAqIENyZWF0ZSBBdXRvbWVyZ2UgY29ubmVjdGlvblxuICAgKi9cblxuICBjcmVhdGVDb25uZWN0aW9uOiAoZTogQXV0b21lcmdlRWRpdG9yLCBlbWl0OiAoZGF0YTogQ29sbGFiQWN0aW9uKSA9PiB2b2lkKSA9PlxuICAgIG5ldyBBdXRvbWVyZ2UuQ29ubmVjdGlvbihlLmRvY1NldCwgdG9Db2xsYWJBY3Rpb24oJ29wZXJhdGlvbicsIGVtaXQpKSxcblxuICAvKipcbiAgICogQXBwbHkgU2xhdGUgb3BlcmF0aW9ucyB0byBBdXRvbWVyZ2VcbiAgICovXG5cbiAgYXBwbHlTbGF0ZU9wczogYXN5bmMgKFxuICAgIGU6IEF1dG9tZXJnZUVkaXRvcixcbiAgICBkb2NJZDogc3RyaW5nLFxuICAgIG9wZXJhdGlvbnM6IE9wZXJhdGlvbltdLFxuICAgIGN1cnNvckRhdGE/OiBDdXJzb3JEYXRhXG4gICkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkb2MgPSBlLmRvY1NldC5nZXREb2MoZG9jSWQpXG5cbiAgICAgIGlmICghZG9jKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFVua25vd24gZG9jSWQ6ICR7ZG9jSWR9IWApXG4gICAgICB9XG5cbiAgICAgIGxldCBjaGFuZ2VkXG5cbiAgICAgIGZvciBhd2FpdCAobGV0IG9wIG9mIG9wZXJhdGlvbnMpIHtcbiAgICAgICAgY2hhbmdlZCA9IEF1dG9tZXJnZS5jaGFuZ2U8U3luY0RvYz4oY2hhbmdlZCB8fCBkb2MsIGQgPT5cbiAgICAgICAgICBhcHBseU9wZXJhdGlvbihkLmNoaWxkcmVuLCBvcClcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBjaGFuZ2VkID0gQXV0b21lcmdlLmNoYW5nZShjaGFuZ2VkIHx8IGRvYywgZCA9PiB7XG4gICAgICAgIHNldEN1cnNvcihlLmNsaWVudElkLCBlLnNlbGVjdGlvbiwgZCwgb3BlcmF0aW9ucywgY3Vyc29yRGF0YSB8fCB7fSlcbiAgICAgIH0pXG5cbiAgICAgIGUuZG9jU2V0LnNldERvYyhkb2NJZCwgY2hhbmdlZCBhcyBhbnkpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogUmVjZWl2ZSBhbmQgYXBwbHkgZG9jdW1lbnQgdG8gQXV0b21lcmdlIGRvY1NldFxuICAgKi9cblxuICByZWNlaXZlRG9jdW1lbnQ6IChlOiBBdXRvbWVyZ2VFZGl0b3IsIGRvY0lkOiBzdHJpbmcsIGRhdGE6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnREb2MgPSBlLmRvY1NldC5nZXREb2MoZG9jSWQpXG5cbiAgICBjb25zdCBleHRlcm5hbERvYyA9IEF1dG9tZXJnZS5sb2FkPFN5bmNEb2M+KGRhdGEpXG5cbiAgICBjb25zdCBtZXJnZWREb2MgPSBBdXRvbWVyZ2UubWVyZ2U8U3luY0RvYz4oXG4gICAgICBleHRlcm5hbERvYyxcbiAgICAgIGN1cnJlbnREb2MgfHwgQXV0b21lcmdlLmluaXQoKVxuICAgIClcblxuICAgIGUuZG9jU2V0LnNldERvYyhkb2NJZCwgbWVyZ2VkRG9jKVxuXG4gICAgRWRpdG9yLndpdGhvdXROb3JtYWxpemluZyhlLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb2MgPSB0b0pTKG1lcmdlZERvYylcbiAgICAgIGUuY2hpbGRyZW4gPSBkb2MuY2hpbGRyZW5cbiAgICAgIC8vIFhYWDogU2luY2Ugd2UgYXJlIGZvcmNlIG92ZXJyaWRlIHNsYXRlIGludGVybmFsIGRvYywgY2xlYXIgd2hhdCB3ZSBjYW4gY2xlYXJcbiAgICAgIGlmIChIaXN0b3J5RWRpdG9yLmlzSGlzdG9yeUVkaXRvcihlKSkge1xuICAgICAgICBlLmhpc3RvcnkudW5kb3MgPSBbXVxuICAgICAgICBlLmhpc3RvcnkucmVkb3MgPSBbXVxuICAgICAgfVxuICAgICAgZS5zZWxlY3Rpb24gPSBudWxsXG4gICAgICBlLm9uQ3Vyc29yICYmIGUub25DdXJzb3IoZG9jLmN1cnNvcnMpXG4gICAgfSlcblxuICAgIC8vIG9uQ2hhbmdlIGV4cGVjdCB2YWxpZCBkb2MsIHdlIG1ha2Ugc3VyZSBkbyBub3JtYWxpemF0aW9uIGJlZm9yZSB0aGF0LlxuICAgIEVkaXRvci5ub3JtYWxpemUoZSwgeyBmb3JjZTogdHJ1ZSB9KVxuICAgIGUub25DaGFuZ2UoKVxuICB9LFxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhdXRvbWVyZ2UgZGlmZiwgY29udmVydCBhbmQgYXBwbHkgb3BlcmF0aW9ucyB0byBFZGl0b3JcbiAgICovXG5cbiAgYXBwbHlPcGVyYXRpb246IChcbiAgICBlOiBBdXRvbWVyZ2VFZGl0b3IsXG4gICAgZG9jSWQ6IHN0cmluZyxcbiAgICBkYXRhOiBBdXRvbWVyZ2UuTWVzc2FnZSxcbiAgICBwcmVzZXJ2ZUV4dGVybmFsSGlzdG9yeT86IGJvb2xlYW5cbiAgKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGN1cnJlbnQ6IGFueSA9IGUuZG9jU2V0LmdldERvYyhkb2NJZClcblxuICAgICAgY29uc3QgdXBkYXRlZCA9IGUuY29ubmVjdGlvbi5yZWNlaXZlTXNnKGRhdGEpXG5cbiAgICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBBdXRvbWVyZ2UuZGlmZihjdXJyZW50LCB1cGRhdGVkKVxuXG4gICAgICBpZiAob3BlcmF0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3Qgc2xhdGVPcHMgPSB0b1NsYXRlT3Aob3BlcmF0aW9ucywgY3VycmVudClcblxuICAgICAgICAvLyBkbyBub3QgY2hhbmdlIGlzUmVtb3RlIGZsYWcgZm9yIG5vLW9wIGNhc2UuXG4gICAgICAgIGNvbnN0IHdhc1JlbW90ZSA9IGUuaXNSZW1vdGVcbiAgICAgICAgZS5pc1JlbW90ZSA9IHRydWVcblxuICAgICAgICBjb25zdCBhcHBseVJlbW90ZU9wc1RvU2xhdGUgPSAoKSA9PiB7XG4gICAgICAgICAgRWRpdG9yLndpdGhvdXROb3JtYWxpemluZyhlLCAoKSA9PiB7XG4gICAgICAgICAgICBzbGF0ZU9wcy5mb3JFYWNoKChvOiBPcGVyYXRpb24pID0+IHtcbiAgICAgICAgICAgICAgZS5hcHBseShvKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGUub25DdXJzb3IgJiYgZS5vbkN1cnNvcih1cGRhdGVkLmN1cnNvcnMpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoSGlzdG9yeUVkaXRvci5pc0hpc3RvcnlFZGl0b3IoZSkgJiYgIXByZXNlcnZlRXh0ZXJuYWxIaXN0b3J5KSB7XG4gICAgICAgICAgSGlzdG9yeUVkaXRvci53aXRob3V0U2F2aW5nKGUsIGFwcGx5UmVtb3RlT3BzVG9TbGF0ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcHBseVJlbW90ZU9wc1RvU2xhdGUoKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNsYXRlT3BzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAvLyBYWFg6IG9ubHkgc2NoZWR1bGUgc2V0IGlzUmVtb3RlIGZhbHNlIHdoZW4gd2UgZGlkIHNjaGVkdWxlZCBvbkNoYW5nZSBieSBhcHBseS5cbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKF8gPT4gKGUuaXNSZW1vdGUgPSBmYWxzZSkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZS5pc1JlbW90ZSA9IHdhc1JlbW90ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKVxuICAgIH1cbiAgfSxcblxuICBnYXJiYWdlQ3Vyc29yOiAoZTogQXV0b21lcmdlRWRpdG9yLCBkb2NJZDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgZG9jID0gZS5kb2NTZXQuZ2V0RG9jKGRvY0lkKVxuXG4gICAgaWYgKCFkb2MpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGNoYW5nZWQgPSBBdXRvbWVyZ2UuY2hhbmdlPFN5bmNEb2M+KGRvYywgKGQ6IGFueSkgPT4ge1xuICAgICAgZGVsZXRlIGQuY3Vyc29yc1xuICAgIH0pXG5cbiAgICBlLm9uQ3Vyc29yICYmIGUub25DdXJzb3IobnVsbClcblxuICAgIGUuZG9jU2V0LnNldERvYyhkb2NJZCwgY2hhbmdlZClcblxuICAgIGUub25DaGFuZ2UoKVxuICB9XG59XG4iXX0=