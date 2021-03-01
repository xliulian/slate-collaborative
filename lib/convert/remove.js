"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Automerge = _interopRequireWildcard(require("automerge"));

var _slate = require("slate");

var _lodash = _interopRequireDefault(require("lodash"));

var _utils = require("../utils");

var _path = require("../path");

var _set = require("./set");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var removeTextOp = function removeTextOp(op) {
  return function (map, doc) {
    try {
      var _node$text;

      var index = op.index,
          path = op.path,
          obj = op.obj;
      var slatePath = (0, _utils.toSlatePath)(path);
      var node = (0, _path.getTarget)(doc, slatePath);
      if (typeof index !== 'number') return;
      var text = (node === null || node === void 0 ? void 0 : (_node$text = node.text) === null || _node$text === void 0 ? void 0 : _node$text[index]) || '*';
      node.text = node.text.slice(0, index) + node.text.slice(index + 1);
      map[obj] = node.text;
      return {
        type: 'remove_text',
        path: slatePath,
        offset: index,
        text: text //marks: []

      };
    } catch (e) {
      console.error(e, op, map, (0, _utils.toJS)(doc));
    }
  };
};

var removeNodeOp = function removeNodeOp(op) {
  return function (map, doc) {
    try {
      var _parent$children, _parent$children2;

      var index = op.index,
          obj = op.obj,
          path = op.path;
      var slatePath = (0, _utils.toSlatePath)(path);
      var parent = (0, _path.getTarget)(doc, slatePath);
      var target = (parent === null || parent === void 0 ? void 0 : (_parent$children = parent.children) === null || _parent$children === void 0 ? void 0 : _parent$children[index]) || (parent === null || parent === void 0 ? void 0 : parent[index]); // || { children: [] }

      if (!target) {
        throw new TypeError('Target is not found!');
      }

      if (!Number.isInteger(index)) {
        throw new TypeError('Index is not a number');
      }

      if (parent !== null && parent !== void 0 && (_parent$children2 = parent.children) !== null && _parent$children2 !== void 0 && _parent$children2[index]) {
        parent.children.splice(index, 1);
        map[obj] = parent === null || parent === void 0 ? void 0 : parent.children;
      } else if (parent !== null && parent !== void 0 && parent[index]) {
        parent.splice(index, 1);
        map[obj] = parent;
      }

      return {
        type: 'remove_node',
        path: slatePath.concat(index),
        node: (0, _utils.toJS)(target)
      };
    } catch (e) {
      console.error(e, op, map, (0, _utils.toJS)(doc));
    }
  };
};

var removeByType = {
  text: removeTextOp,
  list: removeNodeOp
};

var opRemove = function opRemove(op, _ref, doc, tmpDoc) {
  var _ref2 = _slicedToArray(_ref, 2),
      map = _ref2[0],
      ops = _ref2[1];

  try {
    var index = op.index,
        key = op.key,
        path = op.path,
        obj = op.obj,
        type = op.type;

    if (type === 'map') {
      // remove a key from map, mapping to slate set a key's value to undefined.
      if (path && path.length && path[0] === 'children') {
        ops.push((0, _set.setDataOp)(op, doc)(map, tmpDoc));
      } else {
        if (!map.hasOwnProperty(obj)) {
          map[obj] = (0, _utils.toJS)(Automerge.getObjectById(doc, obj));
        }

        delete map[obj][key];
      }

      return [map, ops];
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
      var remove = removeByType[type];
      var operation = remove && remove(op, doc)(map, tmpDoc);

      if (operation && operation.type === 'remove_text') {
        var lastOp = ops[ops.length - 1];

        if (lastOp && lastOp.type === 'remove_text' && operation.offset === lastOp.offset && _slate.Path.equals(operation.path, lastOp.path)) {
          // same position remove text, merge it into one op.
          lastOp.text += operation.text;
          return [map, ops];
        }
      } else if (operation && operation.type === 'remove_node' && operation.node) {
        var _lastOp = ops[ops.length - 1];

        if (_lastOp && _lastOp.type === 'insert_text' && operation.node.text && Object.keys(operation.node).length === 1 && _slate.Path.equals(operation.path, _slate.Path.next(_lastOp.path)) && _lastOp.text.slice(-operation.node.text.length) === operation.node.text) {
          // remove text node just after insert some text, it possiblly be some merge_node op?
          var slatePath = (0, _utils.toSlatePath)(_lastOp.path);
          var lastNode = (0, _path.getTarget)(tmpDoc, slatePath);

          if (_lastOp.offset + _lastOp.text.length === lastNode.text.length) {
            // previous node was just inserted text to the end, so we are merging
            if (_lastOp.text.length > operation.node.text.length) {
              _lastOp.text = _lastOp.text.slice(0, -operation.node.text.length);
            } else {
              ops.pop();
            }

            ops.push({
              type: 'merge_node',
              path: operation.path,
              position: lastNode.text.length - operation.node.text.length,
              properties: {}
            });
            return [map, ops];
          }
        } else if (_lastOp && _lastOp.type === 'insert_node' && operation.node.children) {
          var lastOpParentPath = _slate.Path.parent(_lastOp.path);

          var lastOpPathIdx = _lastOp.path[_lastOp.path.length - 1];

          if (_slate.Path.equals(operation.path, _slate.Path.next(lastOpParentPath)) && _slate.Node.get(tmpDoc, lastOpParentPath).children.length === lastOpPathIdx + 1) {
            var previousInsertedNodes = ops.slice(-operation.node.children.length).filter(function (slateOp, idx) {
              return slateOp.type === 'insert_node' && _slate.Path.equals(slateOp.path, lastOpParentPath.concat(lastOpPathIdx + 1 - operation.node.children.length + idx));
            }).map(function (slateOp) {
              return slateOp.node;
            });

            if (previousInsertedNodes.length === operation.node.children.length && _lodash["default"].isEqual(previousInsertedNodes, operation.node.children)) {
              ops.splice(ops.length - previousInsertedNodes.length, previousInsertedNodes.length);
              ops.push({
                type: 'merge_node',
                path: operation.path,
                position: lastOpPathIdx - previousInsertedNodes.length + 1,
                properties: _lodash["default"].omit(operation.node, 'children')
              });
              return [map, ops];
            }
          }
        }
      }

      ops.push(operation);
    } else {
      if (!map.hasOwnProperty(obj)) {
        map[obj] = (0, _utils.toJS)(Automerge.getObjectById(doc, obj));
      }

      if (type === 'list') {
        map[obj].splice(index, 1);
      } else if (type === 'text') {
        map[obj] = map[obj].slice(0, index).concat(map[obj].slice(index + 1));
      }
    }

    return [map, ops];
  } catch (e) {
    console.error(e, op, (0, _utils.toJS)(map));
    return [map, ops];
  }
};

var _default = opRemove;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L3JlbW92ZS50cyJdLCJuYW1lcyI6WyJyZW1vdmVUZXh0T3AiLCJvcCIsIm1hcCIsImRvYyIsImluZGV4IiwicGF0aCIsIm9iaiIsInNsYXRlUGF0aCIsIm5vZGUiLCJ0ZXh0Iiwic2xpY2UiLCJ0eXBlIiwib2Zmc2V0IiwiZSIsImNvbnNvbGUiLCJlcnJvciIsInJlbW92ZU5vZGVPcCIsInBhcmVudCIsInRhcmdldCIsImNoaWxkcmVuIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwic3BsaWNlIiwiY29uY2F0IiwicmVtb3ZlQnlUeXBlIiwibGlzdCIsIm9wUmVtb3ZlIiwidG1wRG9jIiwib3BzIiwia2V5IiwibGVuZ3RoIiwicHVzaCIsImhhc093blByb3BlcnR5IiwiQXV0b21lcmdlIiwiZ2V0T2JqZWN0QnlJZCIsInJlbW92ZSIsIm9wZXJhdGlvbiIsImxhc3RPcCIsIlBhdGgiLCJlcXVhbHMiLCJPYmplY3QiLCJrZXlzIiwibmV4dCIsImxhc3ROb2RlIiwicG9wIiwicG9zaXRpb24iLCJwcm9wZXJ0aWVzIiwibGFzdE9wUGFyZW50UGF0aCIsImxhc3RPcFBhdGhJZHgiLCJOb2RlIiwiZ2V0IiwicHJldmlvdXNJbnNlcnRlZE5vZGVzIiwiZmlsdGVyIiwic2xhdGVPcCIsImlkeCIsIl8iLCJpc0VxdWFsIiwib21pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBQ0MsRUFBRDtBQUFBLFNBQXdCLFVBQUNDLEdBQUQsRUFBV0MsR0FBWCxFQUE0QjtBQUN2RSxRQUFJO0FBQUE7O0FBQUEsVUFDTUMsS0FETixHQUMyQkgsRUFEM0IsQ0FDTUcsS0FETjtBQUFBLFVBQ2FDLElBRGIsR0FDMkJKLEVBRDNCLENBQ2FJLElBRGI7QUFBQSxVQUNtQkMsR0FEbkIs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QXFCLGlCQUFLQyxHQUFMLENBQXJCO0FBRUEsV0FBTyxDQUFDQSxHQUFELEVBQU0yQixHQUFOLENBQVA7QUFDRDtBQUNGLENBcEpEOztlQXNKZUYsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEF1dG9tZXJnZSBmcm9tICdhdXRvbWVyZ2UnXG5pbXBvcnQgeyBFbGVtZW50LCBQYXRoLCBPcGVyYXRpb24sIE5vZGUgfSBmcm9tICdzbGF0ZSdcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcblxuaW1wb3J0IHsgdG9TbGF0ZVBhdGgsIHRvSlMgfSBmcm9tICcuLi91dGlscydcbmltcG9ydCB7IGdldFRhcmdldCB9IGZyb20gJy4uL3BhdGgnXG5pbXBvcnQgeyBzZXREYXRhT3AgfSBmcm9tICcuL3NldCdcblxuY29uc3QgcmVtb3ZlVGV4dE9wID0gKG9wOiBBdXRvbWVyZ2UuRGlmZikgPT4gKG1hcDogYW55LCBkb2M6IEVsZW1lbnQpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGluZGV4LCBwYXRoLCBvYmogfSA9IG9wXG5cbiAgICBjb25zdCBzbGF0ZVBhdGggPSB0b1NsYXRlUGF0aChwYXRoKVxuXG4gICAgY29uc3Qgbm9kZSA9IGdldFRhcmdldChkb2MsIHNsYXRlUGF0aClcblxuICAgIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm5cblxuICAgIGNvbnN0IHRleHQgPSBub2RlPy50ZXh0Py5baW5kZXhdIHx8ICcqJ1xuXG4gICAgbm9kZS50ZXh0ID0gbm9kZS50ZXh0LnNsaWNlKDAsIGluZGV4KSArIG5vZGUudGV4dC5zbGljZShpbmRleCArIDEpXG5cbiAgICBtYXBbb2JqXSA9IG5vZGUudGV4dFxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdyZW1vdmVfdGV4dCcsXG4gICAgICBwYXRoOiBzbGF0ZVBhdGgsXG4gICAgICBvZmZzZXQ6IGluZGV4LFxuICAgICAgdGV4dFxuICAgICAgLy9tYXJrczogW11cbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUsIG9wLCBtYXAsIHRvSlMoZG9jKSlcbiAgfVxufVxuXG5jb25zdCByZW1vdmVOb2RlT3AgPSAob3A6IEF1dG9tZXJnZS5EaWZmKSA9PiAobWFwOiBhbnksIGRvYzogRWxlbWVudCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgaW5kZXgsIG9iaiwgcGF0aCB9ID0gb3BcblxuICAgIGNvbnN0IHNsYXRlUGF0aCA9IHRvU2xhdGVQYXRoKHBhdGgpXG5cbiAgICBjb25zdCBwYXJlbnQgPSBnZXRUYXJnZXQoZG9jLCBzbGF0ZVBhdGgpXG4gICAgY29uc3QgdGFyZ2V0ID1cbiAgICAgIHBhcmVudD8uY2hpbGRyZW4/LltpbmRleCBhcyBudW1iZXJdIHx8IHBhcmVudD8uW2luZGV4IGFzIG51bWJlcl0gLy8gfHwgeyBjaGlsZHJlbjogW10gfVxuXG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RhcmdldCBpcyBub3QgZm91bmQhJylcbiAgICB9XG5cbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIoaW5kZXgpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbmRleCBpcyBub3QgYSBudW1iZXInKVxuICAgIH1cblxuICAgIGlmIChwYXJlbnQ/LmNoaWxkcmVuPy5baW5kZXggYXMgbnVtYmVyXSkge1xuICAgICAgcGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSlcbiAgICAgIG1hcFtvYmpdID0gcGFyZW50Py5jaGlsZHJlblxuICAgIH0gZWxzZSBpZiAocGFyZW50Py5baW5kZXggYXMgbnVtYmVyXSkge1xuICAgICAgcGFyZW50LnNwbGljZShpbmRleCwgMSlcbiAgICAgIG1hcFtvYmpdID0gcGFyZW50XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdyZW1vdmVfbm9kZScsXG4gICAgICBwYXRoOiBzbGF0ZVBhdGguY29uY2F0KGluZGV4KSxcbiAgICAgIG5vZGU6IHRvSlModGFyZ2V0KVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSwgb3AsIG1hcCwgdG9KUyhkb2MpKVxuICB9XG59XG5cbmNvbnN0IHJlbW92ZUJ5VHlwZSA9IHtcbiAgdGV4dDogcmVtb3ZlVGV4dE9wLFxuICBsaXN0OiByZW1vdmVOb2RlT3Bcbn1cblxuY29uc3Qgb3BSZW1vdmUgPSAoXG4gIG9wOiBBdXRvbWVyZ2UuRGlmZixcbiAgW21hcCwgb3BzXTogYW55LFxuICBkb2M6IGFueSxcbiAgdG1wRG9jOiBFbGVtZW50XG4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGluZGV4LCBrZXksIHBhdGgsIG9iaiwgdHlwZSB9ID0gb3BcblxuICAgIGlmICh0eXBlID09PSAnbWFwJykge1xuICAgICAgLy8gcmVtb3ZlIGEga2V5IGZyb20gbWFwLCBtYXBwaW5nIHRvIHNsYXRlIHNldCBhIGtleSdzIHZhbHVlIHRvIHVuZGVmaW5lZC5cbiAgICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoICYmIHBhdGhbMF0gPT09ICdjaGlsZHJlbicpIHtcbiAgICAgICAgb3BzLnB1c2goc2V0RGF0YU9wKG9wLCBkb2MpKG1hcCwgdG1wRG9jKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghbWFwLmhhc093blByb3BlcnR5KG9iaikpIHtcbiAgICAgICAgICBtYXBbb2JqXSA9IHRvSlMoQXV0b21lcmdlLmdldE9iamVjdEJ5SWQoZG9jLCBvYmopKVxuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBtYXBbb2JqXVtrZXkgYXMgc3RyaW5nXVxuICAgICAgfVxuICAgICAgcmV0dXJuIFttYXAsIG9wc11cbiAgICB9XG4gICAgLypcbiAgICBpZiAoXG4gICAgICBtYXAuaGFzT3duUHJvcGVydHkob2JqKSAmJlxuICAgICAgdHlwZW9mIG1hcFtvYmpdICE9PSAnc3RyaW5nJyAmJlxuICAgICAgdHlwZSAhPT0gJ3RleHQnICYmXG4gICAgICBtYXA/Lm9iaj8ubGVuZ3RoXG4gICAgKSB7XG4gICAgICBtYXBbb2JqXS5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgICAgIHJldHVybiBbbWFwLCBvcHNdXG4gICAgfVxuXG4gICAgaWYgKCFwYXRoKSByZXR1cm4gW21hcCwgb3BzXVxuKi9cbiAgICBpZiAocGF0aCAmJiBwYXRoLmxlbmd0aCAmJiBwYXRoWzBdID09PSAnY2hpbGRyZW4nKSB7XG4gICAgICBjb25zdCByZW1vdmUgPSByZW1vdmVCeVR5cGVbdHlwZV1cblxuICAgICAgY29uc3Qgb3BlcmF0aW9uID0gcmVtb3ZlICYmIHJlbW92ZShvcCwgZG9jKShtYXAsIHRtcERvYylcblxuICAgICAgaWYgKG9wZXJhdGlvbiAmJiBvcGVyYXRpb24udHlwZSA9PT0gJ3JlbW92ZV90ZXh0Jykge1xuICAgICAgICBjb25zdCBsYXN0T3AgPSBvcHNbb3BzLmxlbmd0aCAtIDFdXG4gICAgICAgIGlmIChcbiAgICAgICAgICBsYXN0T3AgJiZcbiAgICAgICAgICBsYXN0T3AudHlwZSA9PT0gJ3JlbW92ZV90ZXh0JyAmJlxuICAgICAgICAgIG9wZXJhdGlvbi5vZmZzZXQgPT09IGxhc3RPcC5vZmZzZXQgJiZcbiAgICAgICAgICBQYXRoLmVxdWFscyhvcGVyYXRpb24ucGF0aCwgbGFzdE9wLnBhdGgpXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIHNhbWUgcG9zaXRpb24gcmVtb3ZlIHRleHQsIG1lcmdlIGl0IGludG8gb25lIG9wLlxuICAgICAgICAgIGxhc3RPcC50ZXh0ICs9IG9wZXJhdGlvbi50ZXh0XG4gICAgICAgICAgcmV0dXJuIFttYXAsIG9wc11cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgb3BlcmF0aW9uICYmXG4gICAgICAgIG9wZXJhdGlvbi50eXBlID09PSAncmVtb3ZlX25vZGUnICYmXG4gICAgICAgIG9wZXJhdGlvbi5ub2RlXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgbGFzdE9wID0gb3BzW29wcy5sZW5ndGggLSAxXVxuICAgICAgICBpZiAoXG4gICAgICAgICAgbGFzdE9wICYmXG4gICAgICAgICAgbGFzdE9wLnR5cGUgPT09ICdpbnNlcnRfdGV4dCcgJiZcbiAgICAgICAgICBvcGVyYXRpb24ubm9kZS50ZXh0ICYmXG4gICAgICAgICAgT2JqZWN0LmtleXMob3BlcmF0aW9uLm5vZGUpLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgIFBhdGguZXF1YWxzKG9wZXJhdGlvbi5wYXRoLCBQYXRoLm5leHQobGFzdE9wLnBhdGgpKSAmJlxuICAgICAgICAgIGxhc3RPcC50ZXh0LnNsaWNlKC1vcGVyYXRpb24ubm9kZS50ZXh0Lmxlbmd0aCkgPT09IG9wZXJhdGlvbi5ub2RlLnRleHRcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gcmVtb3ZlIHRleHQgbm9kZSBqdXN0IGFmdGVyIGluc2VydCBzb21lIHRleHQsIGl0IHBvc3NpYmxseSBiZSBzb21lIG1lcmdlX25vZGUgb3A/XG4gICAgICAgICAgY29uc3Qgc2xhdGVQYXRoID0gdG9TbGF0ZVBhdGgobGFzdE9wLnBhdGgpXG4gICAgICAgICAgY29uc3QgbGFzdE5vZGUgPSBnZXRUYXJnZXQodG1wRG9jLCBzbGF0ZVBhdGgpXG4gICAgICAgICAgaWYgKGxhc3RPcC5vZmZzZXQgKyBsYXN0T3AudGV4dC5sZW5ndGggPT09IGxhc3ROb2RlLnRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBwcmV2aW91cyBub2RlIHdhcyBqdXN0IGluc2VydGVkIHRleHQgdG8gdGhlIGVuZCwgc28gd2UgYXJlIG1lcmdpbmdcbiAgICAgICAgICAgIGlmIChsYXN0T3AudGV4dC5sZW5ndGggPiBvcGVyYXRpb24ubm9kZS50ZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICBsYXN0T3AudGV4dCA9IGxhc3RPcC50ZXh0LnNsaWNlKDAsIC1vcGVyYXRpb24ubm9kZS50ZXh0Lmxlbmd0aClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG9wcy5wb3AoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3BzLnB1c2goe1xuICAgICAgICAgICAgICB0eXBlOiAnbWVyZ2Vfbm9kZScsXG4gICAgICAgICAgICAgIHBhdGg6IG9wZXJhdGlvbi5wYXRoLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogbGFzdE5vZGUudGV4dC5sZW5ndGggLSBvcGVyYXRpb24ubm9kZS50ZXh0Lmxlbmd0aCxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge31cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gW21hcCwgb3BzXVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBsYXN0T3AgJiZcbiAgICAgICAgICBsYXN0T3AudHlwZSA9PT0gJ2luc2VydF9ub2RlJyAmJlxuICAgICAgICAgIG9wZXJhdGlvbi5ub2RlLmNoaWxkcmVuXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0IGxhc3RPcFBhcmVudFBhdGggPSBQYXRoLnBhcmVudChsYXN0T3AucGF0aClcbiAgICAgICAgICBjb25zdCBsYXN0T3BQYXRoSWR4ID0gbGFzdE9wLnBhdGhbbGFzdE9wLnBhdGgubGVuZ3RoIC0gMV1cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBQYXRoLmVxdWFscyhvcGVyYXRpb24ucGF0aCwgUGF0aC5uZXh0KGxhc3RPcFBhcmVudFBhdGgpKSAmJlxuICAgICAgICAgICAgKE5vZGUuZ2V0KHRtcERvYywgbGFzdE9wUGFyZW50UGF0aCkgYXMgRWxlbWVudCkuY2hpbGRyZW4ubGVuZ3RoID09PVxuICAgICAgICAgICAgICBsYXN0T3BQYXRoSWR4ICsgMVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNJbnNlcnRlZE5vZGVzID0gb3BzXG4gICAgICAgICAgICAgIC5zbGljZSgtb3BlcmF0aW9uLm5vZGUuY2hpbGRyZW4ubGVuZ3RoKVxuICAgICAgICAgICAgICAuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChzbGF0ZU9wOiBPcGVyYXRpb24sIGlkeDogbnVtYmVyKSA9PlxuICAgICAgICAgICAgICAgICAgc2xhdGVPcC50eXBlID09PSAnaW5zZXJ0X25vZGUnICYmXG4gICAgICAgICAgICAgICAgICBQYXRoLmVxdWFscyhcbiAgICAgICAgICAgICAgICAgICAgc2xhdGVPcC5wYXRoLFxuICAgICAgICAgICAgICAgICAgICBsYXN0T3BQYXJlbnRQYXRoLmNvbmNhdChcbiAgICAgICAgICAgICAgICAgICAgICBsYXN0T3BQYXRoSWR4ICsgMSAtIG9wZXJhdGlvbi5ub2RlLmNoaWxkcmVuLmxlbmd0aCArIGlkeFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgLm1hcCgoc2xhdGVPcDogT3BlcmF0aW9uKSA9PiBzbGF0ZU9wLm5vZGUpXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHByZXZpb3VzSW5zZXJ0ZWROb2Rlcy5sZW5ndGggPT09IG9wZXJhdGlvbi5ub2RlLmNoaWxkcmVuLmxlbmd0aCAmJlxuICAgICAgICAgICAgICBfLmlzRXF1YWwocHJldmlvdXNJbnNlcnRlZE5vZGVzLCBvcGVyYXRpb24ubm9kZS5jaGlsZHJlbilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBvcHMuc3BsaWNlKFxuICAgICAgICAgICAgICAgIG9wcy5sZW5ndGggLSBwcmV2aW91c0luc2VydGVkTm9kZXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIHByZXZpb3VzSW5zZXJ0ZWROb2Rlcy5sZW5ndGhcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICBvcHMucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ21lcmdlX25vZGUnLFxuICAgICAgICAgICAgICAgIHBhdGg6IG9wZXJhdGlvbi5wYXRoLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBsYXN0T3BQYXRoSWR4IC0gcHJldmlvdXNJbnNlcnRlZE5vZGVzLmxlbmd0aCArIDEsXG4gICAgICAgICAgICAgICAgcHJvcGVydGllczogXy5vbWl0KG9wZXJhdGlvbi5ub2RlLCAnY2hpbGRyZW4nKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICByZXR1cm4gW21hcCwgb3BzXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb3BzLnB1c2gob3BlcmF0aW9uKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIW1hcC5oYXNPd25Qcm9wZXJ0eShvYmopKSB7XG4gICAgICAgIG1hcFtvYmpdID0gdG9KUyhBdXRvbWVyZ2UuZ2V0T2JqZWN0QnlJZChkb2MsIG9iaikpXG4gICAgICB9XG4gICAgICBpZiAodHlwZSA9PT0gJ2xpc3QnKSB7XG4gICAgICAgIG1hcFtvYmpdLnNwbGljZShpbmRleCwgMSlcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgIG1hcFtvYmpdID0gbWFwW29ial1cbiAgICAgICAgICAuc2xpY2UoMCwgaW5kZXgpXG4gICAgICAgICAgLmNvbmNhdChtYXBbb2JqXS5zbGljZSgoaW5kZXggYXMgbnVtYmVyKSArIDEpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBbbWFwLCBvcHNdXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUsIG9wLCB0b0pTKG1hcCkpXG5cbiAgICByZXR1cm4gW21hcCwgb3BzXVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9wUmVtb3ZlXG4iXX0=