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

        if (slateOps.length > 0) {
          // XXX: only schedule set isRemote false when we did scheduled onChange by apply.
          Promise.resolve().then(function (_) {
            return e.isRemote = false;
          });
        } else {
          e.isRemote = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hdXRvbWVyZ2UtZWRpdG9yLnRzIl0sIm5hbWVzIjpbIkF1dG9tZXJnZUVkaXRvciIsImNyZWF0ZUNvbm5lY3Rpb24iLCJlIiwiZW1pdCIsIkF1dG9tZXJnZSIsIkNvbm5lY3Rpb24iLCJkb2NTZXQiLCJhcHBseVNsYXRlT3BzIiwiZG9jSWQiLCJvcGVyYXRpb25zIiwiY3Vyc29yRGF0YSIsImRvYyIsImdldERvYyIsIlR5cGVFcnJvciIsIm9wIiwiY2hhbmdlZCIsImNoYW5nZSIsImQiLCJjaGlsZHJlbiIsImNsaWVudElkIiwic2VsZWN0aW9uIiwic2V0RG9jIiwiY29uc29sZSIsImVycm9yIiwicmVjZWl2ZURvY3VtZW50IiwiZGF0YSIsImN1cnJlbnREb2MiLCJleHRlcm5hbERvYyIsImxvYWQiLCJtZXJnZWREb2MiLCJtZXJnZSIsImluaXQiLCJFZGl0b3IiLCJ3aXRob3V0Tm9ybWFsaXppbmciLCJvbkN1cnNvciIsImN1cnNvcnMiLCJub3JtYWxpemUiLCJmb3JjZSIsIm9uQ2hhbmdlIiwiYXBwbHlPcGVyYXRpb24iLCJwcmVzZXJ2ZUV4dGVybmFsSGlzdG9yeSIsImN1cnJlbnQiLCJ1cGRhdGVkIiwiY29ubmVjdGlvbiIsInJlY2VpdmVNc2ciLCJkaWZmIiwibGVuZ3RoIiwic2xhdGVPcHMiLCJpc1JlbW90ZSIsIkhpc3RvcnlFZGl0b3IiLCJpc0hpc3RvcnlFZGl0b3IiLCJ3aXRob3V0U2F2aW5nIiwiZm9yRWFjaCIsIm8iLCJhcHBseSIsIlByb21pc2UiLCJyZXNvbHZlIiwidGhlbiIsIl8iLCJnYXJiYWdlQ3Vyc29yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUFnQ0E7QUFDQTtBQUNBO0FBRU8sSUFBTUEsZUFBZSxHQUFHO0FBQzdCO0FBQ0Y7QUFDQTtBQUVFQyxFQUFBQSxnQkFBZ0IsRUFBRSwwQkFBQ0MsQ0FBRCxFQUFxQkMsSUFBckI7QUFBQSxXQUNoQixJQUFJQyxzQkFB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QUFoQixFQUF1Qk8sT0FBdkI7QUFFQWIsSUFBQUEsQ0FBQyxDQUFDb0MsUUFBRjtBQUNEO0FBdkk0QixDQUF4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBdXRvbWVyZ2UgZnJvbSAnYXV0b21lcmdlJ1xuXG5pbXBvcnQgeyBFZGl0b3IsIE9wZXJhdGlvbiB9IGZyb20gJ3NsYXRlJ1xuaW1wb3J0IHsgSGlzdG9yeUVkaXRvciB9IGZyb20gJ3NsYXRlLWhpc3RvcnknXG5cbmltcG9ydCB7XG4gIHRvSlMsXG4gIFN5bmNEb2MsXG4gIENvbGxhYkFjdGlvbixcbiAgdG9Db2xsYWJBY3Rpb24sXG4gIGFwcGx5T3BlcmF0aW9uLFxuICBzZXRDdXJzb3IsXG4gIHRvU2xhdGVPcCxcbiAgQ3Vyc29yRGF0YVxufSBmcm9tICdAc2xhdGUtY29sbGFib3JhdGl2ZS9icmlkZ2UnXG5cbmV4cG9ydCBpbnRlcmZhY2UgQXV0b21lcmdlRWRpdG9yIGV4dGVuZHMgRWRpdG9yIHtcbiAgY2xpZW50SWQ6IHN0cmluZ1xuXG4gIGlzUmVtb3RlOiBib29sZWFuXG5cbiAgZG9jU2V0OiBBdXRvbWVyZ2UuRG9jU2V0PFN5bmNEb2M+XG4gIGNvbm5lY3Rpb246IEF1dG9tZXJnZS5Db25uZWN0aW9uPFN5bmNEb2M+XG5cbiAgb25Db25uZWN0aW9uTXNnOiAobXNnOiBBdXRvbWVyZ2UuTWVzc2FnZSkgPT4gdm9pZFxuXG4gIG9wZW5Db25uZWN0aW9uOiAoKSA9PiB2b2lkXG4gIGNsb3NlQ29ubmVjdGlvbjogKCkgPT4gdm9pZFxuXG4gIHJlY2VpdmVEb2N1bWVudDogKGRhdGE6IHN0cmluZykgPT4gdm9pZFxuICByZWNlaXZlT3BlcmF0aW9uOiAoZGF0YTogQXV0b21lcmdlLk1lc3NhZ2UpID0+IHZvaWRcblxuICBnYWJhZ2VDdXJzb3I6ICgpID0+IHZvaWRcblxuICBvbkN1cnNvcjogKGRhdGE6IGFueSkgPT4gdm9pZFxufVxuXG4vKipcbiAqIGBBdXRvbWVyZ2VFZGl0b3JgIGNvbnRhaW5zIG1ldGhvZHMgZm9yIGNvbGxhYm9yYXRpb24tZW5hYmxlZCBlZGl0b3JzLlxuICovXG5cbmV4cG9ydCBjb25zdCBBdXRvbWVyZ2VFZGl0b3IgPSB7XG4gIC8qKlxuICAgKiBDcmVhdGUgQXV0b21lcmdlIGNvbm5lY3Rpb25cbiAgICovXG5cbiAgY3JlYXRlQ29ubmVjdGlvbjogKGU6IEF1dG9tZXJnZUVkaXRvciwgZW1pdDogKGRhdGE6IENvbGxhYkFjdGlvbikgPT4gdm9pZCkgPT5cbiAgICBuZXcgQXV0b21lcmdlLkNvbm5lY3Rpb24oZS5kb2NTZXQsIHRvQ29sbGFiQWN0aW9uKCdvcGVyYXRpb24nLCBlbWl0KSksXG5cbiAgLyoqXG4gICAqIEFwcGx5IFNsYXRlIG9wZXJhdGlvbnMgdG8gQXV0b21lcmdlXG4gICAqL1xuXG4gIGFwcGx5U2xhdGVPcHM6IGFzeW5jIChcbiAgICBlOiBBdXRvbWVyZ2VFZGl0b3IsXG4gICAgZG9jSWQ6IHN0cmluZyxcbiAgICBvcGVyYXRpb25zOiBPcGVyYXRpb25bXSxcbiAgICBjdXJzb3JEYXRhPzogQ3Vyc29yRGF0YVxuICApID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZG9jID0gZS5kb2NTZXQuZ2V0RG9jKGRvY0lkKVxuXG4gICAgICBpZiAoIWRvYykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBVbmtub3duIGRvY0lkOiAke2RvY0lkfSFgKVxuICAgICAgfVxuXG4gICAgICBsZXQgY2hhbmdlZFxuXG4gICAgICBmb3IgYXdhaXQgKGxldCBvcCBvZiBvcGVyYXRpb25zKSB7XG4gICAgICAgIGNoYW5nZWQgPSBBdXRvbWVyZ2UuY2hhbmdlPFN5bmNEb2M+KGNoYW5nZWQgfHwgZG9jLCBkID0+XG4gICAgICAgICAgYXBwbHlPcGVyYXRpb24oZC5jaGlsZHJlbiwgb3ApXG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgY2hhbmdlZCA9IEF1dG9tZXJnZS5jaGFuZ2UoY2hhbmdlZCB8fCBkb2MsIGQgPT4ge1xuICAgICAgICBzZXRDdXJzb3IoZS5jbGllbnRJZCwgZS5zZWxlY3Rpb24sIGQsIG9wZXJhdGlvbnMsIGN1cnNvckRhdGEgfHwge30pXG4gICAgICB9KVxuXG4gICAgICBlLmRvY1NldC5zZXREb2MoZG9jSWQsIGNoYW5nZWQgYXMgYW55KVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSlcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlY2VpdmUgYW5kIGFwcGx5IGRvY3VtZW50IHRvIEF1dG9tZXJnZSBkb2NTZXRcbiAgICovXG5cbiAgcmVjZWl2ZURvY3VtZW50OiAoZTogQXV0b21lcmdlRWRpdG9yLCBkb2NJZDogc3RyaW5nLCBkYXRhOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBjdXJyZW50RG9jID0gZS5kb2NTZXQuZ2V0RG9jKGRvY0lkKVxuXG4gICAgY29uc3QgZXh0ZXJuYWxEb2MgPSBBdXRvbWVyZ2UubG9hZDxTeW5jRG9jPihkYXRhKVxuXG4gICAgY29uc3QgbWVyZ2VkRG9jID0gQXV0b21lcmdlLm1lcmdlPFN5bmNEb2M+KFxuICAgICAgZXh0ZXJuYWxEb2MsXG4gICAgICBjdXJyZW50RG9jIHx8IEF1dG9tZXJnZS5pbml0KClcbiAgICApXG5cbiAgICBlLmRvY1NldC5zZXREb2MoZG9jSWQsIG1lcmdlZERvYylcblxuICAgIEVkaXRvci53aXRob3V0Tm9ybWFsaXppbmcoZSwgKCkgPT4ge1xuICAgICAgY29uc3QgZG9jID0gdG9KUyhtZXJnZWREb2MpXG4gICAgICBlLmNoaWxkcmVuID0gZG9jLmNoaWxkcmVuXG4gICAgICBlLm9uQ3Vyc29yICYmIGUub25DdXJzb3IoZG9jLmN1cnNvcnMpXG4gICAgfSlcblxuICAgIC8vIG9uQ2hhbmdlIGV4cGVjdCB2YWxpZCBkb2MsIHdlIG1ha2Ugc3VyZSBkbyBub3JtYWxpemF0aW9uIGJlZm9yZSB0aGF0LlxuICAgIEVkaXRvci5ub3JtYWxpemUoZSwgeyBmb3JjZTogdHJ1ZSB9KVxuICAgIGUub25DaGFuZ2UoKVxuICB9LFxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhdXRvbWVyZ2UgZGlmZiwgY29udmVydCBhbmQgYXBwbHkgb3BlcmF0aW9ucyB0byBFZGl0b3JcbiAgICovXG5cbiAgYXBwbHlPcGVyYXRpb246IChcbiAgICBlOiBBdXRvbWVyZ2VFZGl0b3IsXG4gICAgZG9jSWQ6IHN0cmluZyxcbiAgICBkYXRhOiBBdXRvbWVyZ2UuTWVzc2FnZSxcbiAgICBwcmVzZXJ2ZUV4dGVybmFsSGlzdG9yeT86IGJvb2xlYW5cbiAgKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGN1cnJlbnQ6IGFueSA9IGUuZG9jU2V0LmdldERvYyhkb2NJZClcblxuICAgICAgY29uc3QgdXBkYXRlZCA9IGUuY29ubmVjdGlvbi5yZWNlaXZlTXNnKGRhdGEpXG5cbiAgICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBBdXRvbWVyZ2UuZGlmZihjdXJyZW50LCB1cGRhdGVkKVxuXG4gICAgICBpZiAob3BlcmF0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3Qgc2xhdGVPcHMgPSB0b1NsYXRlT3Aob3BlcmF0aW9ucywgY3VycmVudClcblxuICAgICAgICBlLmlzUmVtb3RlID0gdHJ1ZVxuXG4gICAgICAgIEVkaXRvci53aXRob3V0Tm9ybWFsaXppbmcoZSwgKCkgPT4ge1xuICAgICAgICAgIGlmIChIaXN0b3J5RWRpdG9yLmlzSGlzdG9yeUVkaXRvcihlKSAmJiAhcHJlc2VydmVFeHRlcm5hbEhpc3RvcnkpIHtcbiAgICAgICAgICAgIEhpc3RvcnlFZGl0b3Iud2l0aG91dFNhdmluZyhlLCAoKSA9PiB7XG4gICAgICAgICAgICAgIHNsYXRlT3BzLmZvckVhY2goKG86IE9wZXJhdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIGUuYXBwbHkobylcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsYXRlT3BzLmZvckVhY2goKG86IE9wZXJhdGlvbikgPT4gZS5hcHBseShvKSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBlLm9uQ3Vyc29yICYmIGUub25DdXJzb3IodXBkYXRlZC5jdXJzb3JzKVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChzbGF0ZU9wcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgLy8gWFhYOiBvbmx5IHNjaGVkdWxlIHNldCBpc1JlbW90ZSBmYWxzZSB3aGVuIHdlIGRpZCBzY2hlZHVsZWQgb25DaGFuZ2UgYnkgYXBwbHkuXG4gICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihfID0+IChlLmlzUmVtb3RlID0gZmFsc2UpKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGUuaXNSZW1vdGUgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKVxuICAgIH1cbiAgfSxcblxuICBnYXJiYWdlQ3Vyc29yOiAoZTogQXV0b21lcmdlRWRpdG9yLCBkb2NJZDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgZG9jID0gZS5kb2NTZXQuZ2V0RG9jKGRvY0lkKVxuXG4gICAgaWYgKCFkb2MpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGNoYW5nZWQgPSBBdXRvbWVyZ2UuY2hhbmdlPFN5bmNEb2M+KGRvYywgKGQ6IGFueSkgPT4ge1xuICAgICAgZGVsZXRlIGQuY3Vyc29yc1xuICAgIH0pXG5cbiAgICBlLm9uQ3Vyc29yICYmIGUub25DdXJzb3IobnVsbClcblxuICAgIGUuZG9jU2V0LnNldERvYyhkb2NJZCwgY2hhbmdlZClcblxuICAgIGUub25DaGFuZ2UoKVxuICB9XG59XG4iXX0=