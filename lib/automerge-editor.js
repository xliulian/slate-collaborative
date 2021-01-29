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
      e.children = doc.children;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hdXRvbWVyZ2UtZWRpdG9yLnRzIl0sIm5hbWVzIjpbIkF1dG9tZXJnZUVkaXRvciIsImNyZWF0ZUNvbm5lY3Rpb24iLCJlIiwiZW1pdCIsIkF1dG9tZXJnZSIsIkNvbm5lY3Rpb24iLCJkb2NTZXQiLCJhcHBseVNsYXRlT3BzIiwiZG9jSWQiLCJvcGVyYXRpb25zIiwiY3Vyc29yRGF0YSIsImRvYyIsImdldERvYyIsIlR5cGVFcnJvciIsIm9wIiwiY2hhbmdlZCIsImNoYW5nZSIsImQiLCJjaGlsZHJlbiIsImNsaWVudElkIiwic2VsZWN0aW9uIiwic2V0RG9jIiwiY29uc29sZSIsImVycm9yIiwicmVjZWl2ZURvY3VtZW50IiwiZGF0YSIsImN1cnJlbnREb2MiLCJleHRlcm5hbERvYyIsImxvYWQiLCJtZXJnZWREb2MiLCJtZXJnZSIsImluaXQiLCJFZGl0b3IiLCJ3aXRob3V0Tm9ybWFsaXppbmciLCJvbkN1cnNvciIsImN1cnNvcnMiLCJub3JtYWxpemUiLCJmb3JjZSIsIm9uQ2hhbmdlIiwiYXBwbHlPcGVyYXRpb24iLCJwcmVzZXJ2ZUV4dGVybmFsSGlzdG9yeSIsImN1cnJlbnQiLCJ1cGRhdGVkIiwiY29ubmVjdGlvbiIsInJlY2VpdmVNc2ciLCJkaWZmIiwibGVuZ3RoIiwic2xhdGVPcHMiLCJpc1JlbW90ZSIsIkhpc3RvcnlFZGl0b3IiLCJpc0hpc3RvcnlFZGl0b3IiLCJ3aXRob3V0U2F2aW5nIiwiZm9yRWFjaCIsIm8iLCJhcHBseSIsIlByb21pc2UiLCJyZXNvbHZlIiwidGhlbiIsIl8iLCJnYXJiYWdlQ3Vyc29yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUFnQ0E7QUFDQTtBQUNBO0FBRU8sSUFBTUEsZUFBZSxHQUFHO0FBQzdCO0FBQ0Y7QUFDQTtBQUVFQyxFQUFBQSxnQkFBZ0IsRUFBRSwwQkFBQ0MsQ0FBRCxFQUFxQkMsSUFBckI7QUFBQSxXQUNoQixJQUFJQyxzQkFB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dG9tZXJnZSdcblxuaW1wb3J0IHsgRWRpdG9yLCBPcGVyYXRpb24gfSBmcm9tICdzbGF0ZSdcbmltcG9ydCB7IEhpc3RvcnlFZGl0b3IgfSBmcm9tICdzbGF0ZS1oaXN0b3J5J1xuXG5pbXBvcnQge1xuICB0b0pTLFxuICBTeW5jRG9jLFxuICBDb2xsYWJBY3Rpb24sXG4gIHRvQ29sbGFiQWN0aW9uLFxuICBhcHBseU9wZXJhdGlvbixcbiAgc2V0Q3Vyc29yLFxuICB0b1NsYXRlT3AsXG4gIEN1cnNvckRhdGFcbn0gZnJvbSAnQHNsYXRlLWNvbGxhYm9yYXRpdmUvYnJpZGdlJ1xuXG5leHBvcnQgaW50ZXJmYWNlIEF1dG9tZXJnZUVkaXRvciBleHRlbmRzIEVkaXRvciB7XG4gIGNsaWVudElkOiBzdHJpbmdcblxuICBpc1JlbW90ZTogYm9vbGVhblxuXG4gIGRvY1NldDogQXV0b21lcmdlLkRvY1NldDxTeW5jRG9jPlxuICBjb25uZWN0aW9uOiBBdXRvbWVyZ2UuQ29ubmVjdGlvbjxTeW5jRG9jPlxuXG4gIG9uQ29ubmVjdGlvbk1zZzogKG1zZzogQXV0b21lcmdlLk1lc3NhZ2UpID0+IHZvaWRcblxuICBvcGVuQ29ubmVjdGlvbjogKCkgPT4gdm9pZFxuICBjbG9zZUNvbm5lY3Rpb246ICgpID0+IHZvaWRcblxuICByZWNlaXZlRG9jdW1lbnQ6IChkYXRhOiBzdHJpbmcpID0+IHZvaWRcbiAgcmVjZWl2ZU9wZXJhdGlvbjogKGRhdGE6IEF1dG9tZXJnZS5NZXNzYWdlKSA9PiB2b2lkXG5cbiAgZ2FiYWdlQ3Vyc29yOiAoKSA9PiB2b2lkXG5cbiAgb25DdXJzb3I6IChkYXRhOiBhbnkpID0+IHZvaWRcbn1cblxuLyoqXG4gKiBgQXV0b21lcmdlRWRpdG9yYCBjb250YWlucyBtZXRob2RzIGZvciBjb2xsYWJvcmF0aW9uLWVuYWJsZWQgZWRpdG9ycy5cbiAqL1xuXG5leHBvcnQgY29uc3QgQXV0b21lcmdlRWRpdG9yID0ge1xuICAvKipcbiAgICogQ3JlYXRlIEF1dG9tZXJnZSBjb25uZWN0aW9uXG4gICAqL1xuXG4gIGNyZWF0ZUNvbm5lY3Rpb246IChlOiBBdXRvbWVyZ2VFZGl0b3IsIGVtaXQ6IChkYXRhOiBDb2xsYWJBY3Rpb24pID0+IHZvaWQpID0+XG4gICAgbmV3IEF1dG9tZXJnZS5Db25uZWN0aW9uKGUuZG9jU2V0LCB0b0NvbGxhYkFjdGlvbignb3BlcmF0aW9uJywgZW1pdCkpLFxuXG4gIC8qKlxuICAgKiBBcHBseSBTbGF0ZSBvcGVyYXRpb25zIHRvIEF1dG9tZXJnZVxuICAgKi9cblxuICBhcHBseVNsYXRlT3BzOiBhc3luYyAoXG4gICAgZTogQXV0b21lcmdlRWRpdG9yLFxuICAgIGRvY0lkOiBzdHJpbmcsXG4gICAgb3BlcmF0aW9uczogT3BlcmF0aW9uW10sXG4gICAgY3Vyc29yRGF0YT86IEN1cnNvckRhdGFcbiAgKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRvYyA9IGUuZG9jU2V0LmdldERvYyhkb2NJZClcblxuICAgICAgaWYgKCFkb2MpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgVW5rbm93biBkb2NJZDogJHtkb2NJZH0hYClcbiAgICAgIH1cblxuICAgICAgbGV0IGNoYW5nZWRcblxuICAgICAgZm9yIGF3YWl0IChsZXQgb3Agb2Ygb3BlcmF0aW9ucykge1xuICAgICAgICBjaGFuZ2VkID0gQXV0b21lcmdlLmNoYW5nZTxTeW5jRG9jPihjaGFuZ2VkIHx8IGRvYywgZCA9PlxuICAgICAgICAgIGFwcGx5T3BlcmF0aW9uKGQuY2hpbGRyZW4sIG9wKVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIGNoYW5nZWQgPSBBdXRvbWVyZ2UuY2hhbmdlKGNoYW5nZWQgfHwgZG9jLCBkID0+IHtcbiAgICAgICAgc2V0Q3Vyc29yKGUuY2xpZW50SWQsIGUuc2VsZWN0aW9uLCBkLCBvcGVyYXRpb25zLCBjdXJzb3JEYXRhIHx8IHt9KVxuICAgICAgfSlcblxuICAgICAgZS5kb2NTZXQuc2V0RG9jKGRvY0lkLCBjaGFuZ2VkIGFzIGFueSlcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGUpXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZWNlaXZlIGFuZCBhcHBseSBkb2N1bWVudCB0byBBdXRvbWVyZ2UgZG9jU2V0XG4gICAqL1xuXG4gIHJlY2VpdmVEb2N1bWVudDogKGU6IEF1dG9tZXJnZUVkaXRvciwgZG9jSWQ6IHN0cmluZywgZGF0YTogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgY3VycmVudERvYyA9IGUuZG9jU2V0LmdldERvYyhkb2NJZClcblxuICAgIGNvbnN0IGV4dGVybmFsRG9jID0gQXV0b21lcmdlLmxvYWQ8U3luY0RvYz4oZGF0YSlcblxuICAgIGNvbnN0IG1lcmdlZERvYyA9IEF1dG9tZXJnZS5tZXJnZTxTeW5jRG9jPihcbiAgICAgIGV4dGVybmFsRG9jLFxuICAgICAgY3VycmVudERvYyB8fCBBdXRvbWVyZ2UuaW5pdCgpXG4gICAgKVxuXG4gICAgZS5kb2NTZXQuc2V0RG9jKGRvY0lkLCBtZXJnZWREb2MpXG5cbiAgICBFZGl0b3Iud2l0aG91dE5vcm1hbGl6aW5nKGUsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvYyA9IHRvSlMobWVyZ2VkRG9jKVxuICAgICAgZS5jaGlsZHJlbiA9IGRvYy5jaGlsZHJlblxuICAgICAgZS5vbkN1cnNvciAmJiBlLm9uQ3Vyc29yKGRvYy5jdXJzb3JzKVxuICAgIH0pXG5cbiAgICAvLyBvbkNoYW5nZSBleHBlY3QgdmFsaWQgZG9jLCB3ZSBtYWtlIHN1cmUgZG8gbm9ybWFsaXphdGlvbiBiZWZvcmUgdGhhdC5cbiAgICBFZGl0b3Iubm9ybWFsaXplKGUsIHsgZm9yY2U6IHRydWUgfSlcbiAgICBlLm9uQ2hhbmdlKClcbiAgfSxcblxuICAvKipcbiAgICogR2VuZXJhdGUgYXV0b21lcmdlIGRpZmYsIGNvbnZlcnQgYW5kIGFwcGx5IG9wZXJhdGlvbnMgdG8gRWRpdG9yXG4gICAqL1xuXG4gIGFwcGx5T3BlcmF0aW9uOiAoXG4gICAgZTogQXV0b21lcmdlRWRpdG9yLFxuICAgIGRvY0lkOiBzdHJpbmcsXG4gICAgZGF0YTogQXV0b21lcmdlLk1lc3NhZ2UsXG4gICAgcHJlc2VydmVFeHRlcm5hbEhpc3Rvcnk/OiBib29sZWFuXG4gICkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjdXJyZW50OiBhbnkgPSBlLmRvY1NldC5nZXREb2MoZG9jSWQpXG5cbiAgICAgIGNvbnN0IHVwZGF0ZWQgPSBlLmNvbm5lY3Rpb24ucmVjZWl2ZU1zZyhkYXRhKVxuXG4gICAgICBjb25zdCBvcGVyYXRpb25zID0gQXV0b21lcmdlLmRpZmYoY3VycmVudCwgdXBkYXRlZClcblxuICAgICAgaWYgKG9wZXJhdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHNsYXRlT3BzID0gdG9TbGF0ZU9wKG9wZXJhdGlvbnMsIGN1cnJlbnQpXG5cbiAgICAgICAgZS5pc1JlbW90ZSA9IHRydWVcblxuICAgICAgICBFZGl0b3Iud2l0aG91dE5vcm1hbGl6aW5nKGUsICgpID0+IHtcbiAgICAgICAgICBpZiAoSGlzdG9yeUVkaXRvci5pc0hpc3RvcnlFZGl0b3IoZSkgJiYgIXByZXNlcnZlRXh0ZXJuYWxIaXN0b3J5KSB7XG4gICAgICAgICAgICBIaXN0b3J5RWRpdG9yLndpdGhvdXRTYXZpbmcoZSwgKCkgPT4ge1xuICAgICAgICAgICAgICBzbGF0ZU9wcy5mb3JFYWNoKChvOiBPcGVyYXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICBlLmFwcGx5KG8pXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzbGF0ZU9wcy5mb3JFYWNoKChvOiBPcGVyYXRpb24pID0+IGUuYXBwbHkobykpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZS5vbkN1cnNvciAmJiBlLm9uQ3Vyc29yKHVwZGF0ZWQuY3Vyc29ycylcbiAgICAgICAgfSlcblxuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKF8gPT4gKGUuaXNSZW1vdGUgPSBmYWxzZSkpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKVxuICAgIH1cbiAgfSxcblxuICBnYXJiYWdlQ3Vyc29yOiAoZTogQXV0b21lcmdlRWRpdG9yLCBkb2NJZDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgZG9jID0gZS5kb2NTZXQuZ2V0RG9jKGRvY0lkKVxuXG4gICAgaWYgKCFkb2MpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGNoYW5nZWQgPSBBdXRvbWVyZ2UuY2hhbmdlPFN5bmNEb2M+KGRvYywgKGQ6IGFueSkgPT4ge1xuICAgICAgZGVsZXRlIGQuY3Vyc29yc1xuICAgIH0pXG5cbiAgICBlLm9uQ3Vyc29yICYmIGUub25DdXJzb3IobnVsbClcblxuICAgIGUuZG9jU2V0LnNldERvYyhkb2NJZCwgY2hhbmdlZClcblxuICAgIGUub25DaGFuZ2UoKVxuICB9XG59XG4iXX0=