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
      e.children = (0, _bridge.toJS)(mergedDoc).children;
      e.onChange();
    });
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
        var slateOps = (0, _bridge.toSlateOp)(operations, current);
        e.isRemote = true;

        _slate.Editor.withoutNormalizing(e, function () {
          if (_slateHistory.HistoryEditor.isHistoryEditor(e) && !preserveExternalHistory) {
            _slateHistory.HistoryEditor.withoutSaving(e, function () {
              slateOps.forEach(function (o) {
                e.apply(o);
              });
            });
          } else {
            slateOps.forEach(function (o) {
              return e.apply(o);
            });
          }

          e.onCursor && e.onCursor(updated.cursors);
        });

        Promise.resolve().then(function (_) {
          return e.isRemote = false;
        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hdXRvbWVyZ2UtZWRpdG9yLnRzIl0sIm5hbWVzIjpbIkF1dG9tZXJnZUVkaXRvciIsImNyZWF0ZUNvbm5lY3Rpb24iLCJlIiwiZW1pdCIsIkF1dG9tZXJnZSIsIkNvbm5lY3Rpb24iLCJkb2NTZXQiLCJhcHBseVNsYXRlT3BzIiwiZG9jSWQiLCJvcGVyYXRpb25zIiwiY3Vyc29yRGF0YSIsImRvYyIsImdldERvYyIsIlR5cGVFcnJvciIsIm9wIiwiY2hhbmdlZCIsImNoYW5nZSIsImQiLCJjaGlsZHJlbiIsImNsaWVudElkIiwic2VsZWN0aW9uIiwic2V0RG9jIiwiY29uc29sZSIsImVycm9yIiwicmVjZWl2ZURvY3VtZW50IiwiZGF0YSIsImN1cnJlbnREb2MiLCJleHRlcm5hbERvYyIsImxvYWQiLCJtZXJnZWREb2MiLCJtZXJnZSIsImluaXQiLCJFZGl0b3IiLCJ3aXRob3V0Tm9ybWFsaXppbmciLCJvbkNoYW5nZSIsImFwcGx5T3BlcmF0aW9uIiwicHJlc2VydmVFeHRlcm5hbEhpc3RvcnkiLCJjdXJyZW50IiwidXBkYXRlZCIsImNvbm5lY3Rpb24iLCJyZWNlaXZlTXNnIiwiZGlmZiIsImxlbmd0aCIsInNsYXRlT3BzIiwiaXNSZW1vdGUiLCJIaXN0b3J5RWRpdG9yIiwiaXNIaXN0b3J5RWRpdG9yIiwid2l0aG91dFNhdmluZyIsImZvckVhY2giLCJvIiwiYXBwbHkiLCJvbkN1cnNvciIsImN1cnNvcnMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRoZW4iLCJfIiwiZ2FyYmFnZUN1cnNvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBOztBQUNBOztBQUVBOzs7Ozs7Ozs7O0FBZ0NBO0FBQ0E7QUFDQTtBQUVPLElBQU1BLGVBQWUsR0FBRztBQUM3QjtBQUNGO0FBQ0E7QUFFRUMsRUFBQUEsZ0JBQWdCLEVBQUUsMEJBQUNDLENBQUQsRUFBcUJDLElBQXJCO0FBQUEsV0FDaEIsSUFBSUMsc0JBQVVDLFVBQWQsQ0FBeUJILENBQUMs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QixDQUF1QixVQUFBQyxDQUFDO0FBQUEsaUJBQUt0RCxDQUFDLENBQUMwQyxRQUFGLEdBQWEsS0FBbEI7QUFBQSxTQUF4QjtBQUNEO0FBQ0YsS0E1QkQsQ0E0QkUsT0FBTzFDLENBQVAsRUFBVTtBQUNWb0IsTUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWNyQixDQUFkO0FBQ0Q7QUFDRixHQTNHNEI7QUE2RzdCdUQsRUFBQUEsYUFBYSxFQUFFLHVCQUFDdkQsQ0FBRCxFQUFxQk0sS0FBckIsRUFBdUM7QUFDcEQsUUFBTUcsR0FBRyxHQUFHVCxDQUFDLENBQUNJLE1BQUYsQ0FBU00sTUFBVCxDQUFnQkosS0FBaEIsQ0FBWjs7QUFFQSxRQUFJLENBQUNHLEdBQUwsRUFBVTtBQUNSO0FBQ0Q7O0FBRUQsUUFBTUksT0FBTyxHQUFHWCxzQkFBVVksTUFBVixDQUEwQkwsR0FBMUIsRUFBK0IsVUFBQ00sQ0FBRCxFQUFZO0FBQ3pELGFBQU9BLENBQUMsQ0FBQ21DLE9BQVQ7QUFDRCxLQUZlLENBQWhCOztBQUlBbEQsSUFBQUEsQ0FBQyxDQUFDaUQsUUFBRixJQUFjakQsQ0FBQyxDQUFDaUQsUUFBRixDQUFXLElBQVgsQ0FBZDtBQUVBakQsSUFBQUEsQ0FBQyxDQUFDSSxNQUFGLENBQVNlLE1BQVQsQ0FBZ0JiLEtBQWhCLEVBQXVCTyxPQUF2QjtBQUVBYixJQUFBQSxDQUFDLENBQUNnQyxRQUFGO0FBQ0Q7QUE3SDRCLENBQXhCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEF1dG9tZXJnZSBmcm9tICdhdXRvbWVyZ2UnXG5cbmltcG9ydCB7IEVkaXRvciwgT3BlcmF0aW9uIH0gZnJvbSAnc2xhdGUnXG5pbXBvcnQgeyBIaXN0b3J5RWRpdG9yIH0gZnJvbSAnc2xhdGUtaGlzdG9yeSdcblxuaW1wb3J0IHtcbiAgdG9KUyxcbiAgU3luY0RvYyxcbiAgQ29sbGFiQWN0aW9uLFxuICB0b0NvbGxhYkFjdGlvbixcbiAgYXBwbHlPcGVyYXRpb24sXG4gIHNldEN1cnNvcixcbiAgdG9TbGF0ZU9wLFxuICBDdXJzb3JEYXRhXG59IGZyb20gJ0BzbGF0ZS1jb2xsYWJvcmF0aXZlL2JyaWRnZSdcblxuZXhwb3J0IGludGVyZmFjZSBBdXRvbWVyZ2VFZGl0b3IgZXh0ZW5kcyBFZGl0b3Ige1xuICBjbGllbnRJZDogc3RyaW5nXG5cbiAgaXNSZW1vdGU6IGJvb2xlYW5cblxuICBkb2NTZXQ6IEF1dG9tZXJnZS5Eb2NTZXQ8U3luY0RvYz5cbiAgY29ubmVjdGlvbjogQXV0b21lcmdlLkNvbm5lY3Rpb248U3luY0RvYz5cblxuICBvbkNvbm5lY3Rpb25Nc2c6IChtc2c6IEF1dG9tZXJnZS5NZXNzYWdlKSA9PiB2b2lkXG5cbiAgb3BlbkNvbm5lY3Rpb246ICgpID0+IHZvaWRcbiAgY2xvc2VDb25uZWN0aW9uOiAoKSA9PiB2b2lkXG5cbiAgcmVjZWl2ZURvY3VtZW50OiAoZGF0YTogc3RyaW5nKSA9PiB2b2lkXG4gIHJlY2VpdmVPcGVyYXRpb246IChkYXRhOiBBdXRvbWVyZ2UuTWVzc2FnZSkgPT4gdm9pZFxuXG4gIGdhYmFnZUN1cnNvcjogKCkgPT4gdm9pZFxuXG4gIG9uQ3Vyc29yOiAoZGF0YTogYW55KSA9PiB2b2lkXG59XG5cbi8qKlxuICogYEF1dG9tZXJnZUVkaXRvcmAgY29udGFpbnMgbWV0aG9kcyBmb3IgY29sbGFib3JhdGlvbi1lbmFibGVkIGVkaXRvcnMuXG4gKi9cblxuZXhwb3J0IGNvbnN0IEF1dG9tZXJnZUVkaXRvciA9IHtcbiAgLyoqXG4gICAqIENyZWF0ZSBBdXRvbWVyZ2UgY29ubmVjdGlvblxuICAgKi9cblxuICBjcmVhdGVDb25uZWN0aW9uOiAoZTogQXV0b21lcmdlRWRpdG9yLCBlbWl0OiAoZGF0YTogQ29sbGFiQWN0aW9uKSA9PiB2b2lkKSA9PlxuICAgIG5ldyBBdXRvbWVyZ2UuQ29ubmVjdGlvbihlLmRvY1NldCwgdG9Db2xsYWJBY3Rpb24oJ29wZXJhdGlvbicsIGVtaXQpKSxcblxuICAvKipcbiAgICogQXBwbHkgU2xhdGUgb3BlcmF0aW9ucyB0byBBdXRvbWVyZ2VcbiAgICovXG5cbiAgYXBwbHlTbGF0ZU9wczogYXN5bmMgKFxuICAgIGU6IEF1dG9tZXJnZUVkaXRvcixcbiAgICBkb2NJZDogc3RyaW5nLFxuICAgIG9wZXJhdGlvbnM6IE9wZXJhdGlvbltdLFxuICAgIGN1cnNvckRhdGE/OiBDdXJzb3JEYXRhXG4gICkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkb2MgPSBlLmRvY1NldC5nZXREb2MoZG9jSWQpXG5cbiAgICAgIGlmICghZG9jKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFVua25vd24gZG9jSWQ6ICR7ZG9jSWR9IWApXG4gICAgICB9XG5cbiAgICAgIGxldCBjaGFuZ2VkXG5cbiAgICAgIGZvciBhd2FpdCAobGV0IG9wIG9mIG9wZXJhdGlvbnMpIHtcbiAgICAgICAgY2hhbmdlZCA9IEF1dG9tZXJnZS5jaGFuZ2U8U3luY0RvYz4oY2hhbmdlZCB8fCBkb2MsIGQgPT5cbiAgICAgICAgICBhcHBseU9wZXJhdGlvbihkLmNoaWxkcmVuLCBvcClcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBjaGFuZ2VkID0gQXV0b21lcmdlLmNoYW5nZShjaGFuZ2VkIHx8IGRvYywgZCA9PiB7XG4gICAgICAgIHNldEN1cnNvcihlLmNsaWVudElkLCBlLnNlbGVjdGlvbiwgZCwgb3BlcmF0aW9ucywgY3Vyc29yRGF0YSB8fCB7fSlcbiAgICAgIH0pXG5cbiAgICAgIGUuZG9jU2V0LnNldERvYyhkb2NJZCwgY2hhbmdlZCBhcyBhbnkpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogUmVjZWl2ZSBhbmQgYXBwbHkgZG9jdW1lbnQgdG8gQXV0b21lcmdlIGRvY1NldFxuICAgKi9cblxuICByZWNlaXZlRG9jdW1lbnQ6IChlOiBBdXRvbWVyZ2VFZGl0b3IsIGRvY0lkOiBzdHJpbmcsIGRhdGE6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnREb2MgPSBlLmRvY1NldC5nZXREb2MoZG9jSWQpXG5cbiAgICBjb25zdCBleHRlcm5hbERvYyA9IEF1dG9tZXJnZS5sb2FkPFN5bmNEb2M+KGRhdGEpXG5cbiAgICBjb25zdCBtZXJnZWREb2MgPSBBdXRvbWVyZ2UubWVyZ2U8U3luY0RvYz4oXG4gICAgICBleHRlcm5hbERvYyxcbiAgICAgIGN1cnJlbnREb2MgfHwgQXV0b21lcmdlLmluaXQoKVxuICAgIClcblxuICAgIGUuZG9jU2V0LnNldERvYyhkb2NJZCwgbWVyZ2VkRG9jKVxuXG4gICAgRWRpdG9yLndpdGhvdXROb3JtYWxpemluZyhlLCAoKSA9PiB7XG4gICAgICBlLmNoaWxkcmVuID0gdG9KUyhtZXJnZWREb2MpLmNoaWxkcmVuXG5cbiAgICAgIGUub25DaGFuZ2UoKVxuICAgIH0pXG4gIH0sXG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIGF1dG9tZXJnZSBkaWZmLCBjb252ZXJ0IGFuZCBhcHBseSBvcGVyYXRpb25zIHRvIEVkaXRvclxuICAgKi9cblxuICBhcHBseU9wZXJhdGlvbjogKFxuICAgIGU6IEF1dG9tZXJnZUVkaXRvcixcbiAgICBkb2NJZDogc3RyaW5nLFxuICAgIGRhdGE6IEF1dG9tZXJnZS5NZXNzYWdlLFxuICAgIHByZXNlcnZlRXh0ZXJuYWxIaXN0b3J5PzogYm9vbGVhblxuICApID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY3VycmVudDogYW55ID0gZS5kb2NTZXQuZ2V0RG9jKGRvY0lkKVxuXG4gICAgICBjb25zdCB1cGRhdGVkID0gZS5jb25uZWN0aW9uLnJlY2VpdmVNc2coZGF0YSlcblxuICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IEF1dG9tZXJnZS5kaWZmKGN1cnJlbnQsIHVwZGF0ZWQpXG5cbiAgICAgIGlmIChvcGVyYXRpb25zLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBzbGF0ZU9wcyA9IHRvU2xhdGVPcChvcGVyYXRpb25zLCBjdXJyZW50KVxuXG4gICAgICAgIGUuaXNSZW1vdGUgPSB0cnVlXG5cbiAgICAgICAgRWRpdG9yLndpdGhvdXROb3JtYWxpemluZyhlLCAoKSA9PiB7XG4gICAgICAgICAgaWYgKEhpc3RvcnlFZGl0b3IuaXNIaXN0b3J5RWRpdG9yKGUpICYmICFwcmVzZXJ2ZUV4dGVybmFsSGlzdG9yeSkge1xuICAgICAgICAgICAgSGlzdG9yeUVkaXRvci53aXRob3V0U2F2aW5nKGUsICgpID0+IHtcbiAgICAgICAgICAgICAgc2xhdGVPcHMuZm9yRWFjaCgobzogT3BlcmF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgZS5hcHBseShvKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2xhdGVPcHMuZm9yRWFjaCgobzogT3BlcmF0aW9uKSA9PiBlLmFwcGx5KG8pKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGUub25DdXJzb3IgJiYgZS5vbkN1cnNvcih1cGRhdGVkLmN1cnNvcnMpXG4gICAgICAgIH0pXG5cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihfID0+IChlLmlzUmVtb3RlID0gZmFsc2UpKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSlcbiAgICB9XG4gIH0sXG5cbiAgZ2FyYmFnZUN1cnNvcjogKGU6IEF1dG9tZXJnZUVkaXRvciwgZG9jSWQ6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGRvYyA9IGUuZG9jU2V0LmdldERvYyhkb2NJZClcblxuICAgIGlmICghZG9jKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBjaGFuZ2VkID0gQXV0b21lcmdlLmNoYW5nZTxTeW5jRG9jPihkb2MsIChkOiBhbnkpID0+IHtcbiAgICAgIGRlbGV0ZSBkLmN1cnNvcnNcbiAgICB9KVxuXG4gICAgZS5vbkN1cnNvciAmJiBlLm9uQ3Vyc29yKG51bGwpXG5cbiAgICBlLmRvY1NldC5zZXREb2MoZG9jSWQsIGNoYW5nZWQpXG5cbiAgICBlLm9uQ2hhbmdlKClcbiAgfVxufVxuIl19