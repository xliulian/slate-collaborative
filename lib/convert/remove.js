"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Automerge = _interopRequireWildcard(require("automerge"));

var _slate = require("slate");

var _utils = require("../utils");

var _path = require("../path");

var _set = require("./set");

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
      } else if (operation && operation.type === 'remove_node' && operation.node && operation.node.text && Object.keys(operation.node).length === 1) {
        var _lastOp = ops[ops.length - 1];

        if (_lastOp && _lastOp.type === 'insert_text' && _slate.Path.equals(operation.path, _slate.Path.next(_lastOp.path)) && _lastOp.text.slice(-operation.node.text.length) === operation.node.text) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L3JlbW92ZS50cyJdLCJuYW1lcyI6WyJyZW1vdmVUZXh0T3AiLCJvcCIsIm1hcCIsImRvYyIsImluZGV4IiwicGF0aCIsIm9iaiIsInNsYXRlUGF0aCIsIm5vZGUiLCJ0ZXh0Iiwic2xpY2UiLCJ0eXBlIiwib2Zmc2V0IiwiZSIsImNvbnNvbGUiLCJlcnJvciIsInJlbW92ZU5vZGVPcCIsInBhcmVudCIsInRhcmdldCIsImNoaWxkcmVuIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwic3BsaWNlIiwiY29uY2F0IiwicmVtb3ZlQnlUeXBlIiwibGlzdCIsIm9wUmVtb3ZlIiwidG1wRG9jIiwib3BzIiwia2V5IiwibGVuZ3RoIiwicHVzaCIsImhhc093blByb3BlcnR5IiwiQXV0b21lcmdlIiwiZ2V0T2JqZWN0QnlJZCIsInJlbW92ZSIsIm9wZXJhdGlvbiIsImxhc3RPcCIsIlBhdGgiLCJlcXVhbHMiLCJPYmplY3QiLCJrZXlzIiwibmV4dCIsImxhc3ROb2RlIiwicG9wIiwicG9zaXRpb24iLCJwcm9wZXJ0aWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBQ0MsRUFBRDtBQUFBLFNBQXdCLFVBQUNDLEdBQUQsRUFBV0MsR0FBWCxFQUE0QjtBQUN2RSxRQUFJO0FBQUE7O0FBQUEsVUFDTUMsS0FETixHQUMyQkgsRUFEM0IsQ0FDTUcsS0FETjtBQUFBLFVBQ2FDLElBRGIsR0FDMkJKLEVBRDNCLENBQ2FJLElBRGI7QUFBQSxVQUNtQkMsR0FEbkIsR0FDMkJMLEVBRDNCLENBQ21CSyxHQURuQjtBQUdGLFVBQU1DLFNBQVMsR0FBRyx3QkFBWUYsSUFBWixDQUFsQjtBQUVBLFVBQU1HLElBQUksR0FBRyxxQkFBVUwsR0FBVixFQUFlSSxTQUFmLENBQWI7QUFFQSxVQUFJLE9B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TUFGUSxDQUVEdEIsR0FBRyxDQUFDSSxHQUFELENBQUgsQ0FBU0ksS0FBVCxDQUFnQk4sS0FBRCxHQUFvQixDQUFuQyxDQUZDLENBQVg7QUFHRDtBQUNGOztBQUVELFdBQU8sQ0FBQ0YsR0FBRCxFQUFNMkIsR0FBTixDQUFQO0FBQ0QsR0EvRkQsQ0ErRkUsT0FBT2hCLENBQVAsRUFBVTtBQUNWQyxJQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBY0YsQ0FBZCxFQUFpQlosRUFBakIsRUFBcUIsaUJBQUtDLEdBQUwsQ0FBckI7QUFFQSxXQUFPLENBQUNBLEdBQUQsRUFBTTJCLEdBQU4sQ0FBUDtBQUNEO0FBQ0YsQ0ExR0Q7O2VBNEdlRixRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQXV0b21lcmdlIGZyb20gJ2F1dG9tZXJnZSdcbmltcG9ydCB7IEVsZW1lbnQsIFBhdGggfSBmcm9tICdzbGF0ZSdcblxuaW1wb3J0IHsgdG9TbGF0ZVBhdGgsIHRvSlMgfSBmcm9tICcuLi91dGlscydcbmltcG9ydCB7IGdldFRhcmdldCB9IGZyb20gJy4uL3BhdGgnXG5pbXBvcnQgeyBzZXREYXRhT3AgfSBmcm9tICcuL3NldCdcblxuY29uc3QgcmVtb3ZlVGV4dE9wID0gKG9wOiBBdXRvbWVyZ2UuRGlmZikgPT4gKG1hcDogYW55LCBkb2M6IEVsZW1lbnQpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGluZGV4LCBwYXRoLCBvYmogfSA9IG9wXG5cbiAgICBjb25zdCBzbGF0ZVBhdGggPSB0b1NsYXRlUGF0aChwYXRoKVxuXG4gICAgY29uc3Qgbm9kZSA9IGdldFRhcmdldChkb2MsIHNsYXRlUGF0aClcblxuICAgIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm5cblxuICAgIGNvbnN0IHRleHQgPSBub2RlPy50ZXh0Py5baW5kZXhdIHx8ICcqJ1xuXG4gICAgbm9kZS50ZXh0ID0gbm9kZS50ZXh0LnNsaWNlKDAsIGluZGV4KSArIG5vZGUudGV4dC5zbGljZShpbmRleCArIDEpXG5cbiAgICBtYXBbb2JqXSA9IG5vZGUudGV4dFxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdyZW1vdmVfdGV4dCcsXG4gICAgICBwYXRoOiBzbGF0ZVBhdGgsXG4gICAgICBvZmZzZXQ6IGluZGV4LFxuICAgICAgdGV4dFxuICAgICAgLy9tYXJrczogW11cbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUsIG9wLCBtYXAsIHRvSlMoZG9jKSlcbiAgfVxufVxuXG5jb25zdCByZW1vdmVOb2RlT3AgPSAob3A6IEF1dG9tZXJnZS5EaWZmKSA9PiAobWFwOiBhbnksIGRvYzogRWxlbWVudCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgaW5kZXgsIG9iaiwgcGF0aCB9ID0gb3BcblxuICAgIGNvbnN0IHNsYXRlUGF0aCA9IHRvU2xhdGVQYXRoKHBhdGgpXG5cbiAgICBjb25zdCBwYXJlbnQgPSBnZXRUYXJnZXQoZG9jLCBzbGF0ZVBhdGgpXG4gICAgY29uc3QgdGFyZ2V0ID1cbiAgICAgIHBhcmVudD8uY2hpbGRyZW4/LltpbmRleCBhcyBudW1iZXJdIHx8IHBhcmVudD8uW2luZGV4IGFzIG51bWJlcl0gLy8gfHwgeyBjaGlsZHJlbjogW10gfVxuXG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RhcmdldCBpcyBub3QgZm91bmQhJylcbiAgICB9XG5cbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIoaW5kZXgpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbmRleCBpcyBub3QgYSBudW1iZXInKVxuICAgIH1cblxuICAgIGlmIChwYXJlbnQ/LmNoaWxkcmVuPy5baW5kZXggYXMgbnVtYmVyXSkge1xuICAgICAgcGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSlcbiAgICAgIG1hcFtvYmpdID0gcGFyZW50Py5jaGlsZHJlblxuICAgIH0gZWxzZSBpZiAocGFyZW50Py5baW5kZXggYXMgbnVtYmVyXSkge1xuICAgICAgcGFyZW50LnNwbGljZShpbmRleCwgMSlcbiAgICAgIG1hcFtvYmpdID0gcGFyZW50XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdyZW1vdmVfbm9kZScsXG4gICAgICBwYXRoOiBzbGF0ZVBhdGguY29uY2F0KGluZGV4KSxcbiAgICAgIG5vZGU6IHRvSlModGFyZ2V0KVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSwgb3AsIG1hcCwgdG9KUyhkb2MpKVxuICB9XG59XG5cbmNvbnN0IHJlbW92ZUJ5VHlwZSA9IHtcbiAgdGV4dDogcmVtb3ZlVGV4dE9wLFxuICBsaXN0OiByZW1vdmVOb2RlT3Bcbn1cblxuY29uc3Qgb3BSZW1vdmUgPSAoXG4gIG9wOiBBdXRvbWVyZ2UuRGlmZixcbiAgW21hcCwgb3BzXTogYW55LFxuICBkb2M6IGFueSxcbiAgdG1wRG9jOiBFbGVtZW50XG4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGluZGV4LCBrZXksIHBhdGgsIG9iaiwgdHlwZSB9ID0gb3BcblxuICAgIGlmICh0eXBlID09PSAnbWFwJykge1xuICAgICAgLy8gcmVtb3ZlIGEga2V5IGZyb20gbWFwLCBtYXBwaW5nIHRvIHNsYXRlIHNldCBhIGtleSdzIHZhbHVlIHRvIHVuZGVmaW5lZC5cbiAgICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoICYmIHBhdGhbMF0gPT09ICdjaGlsZHJlbicpIHtcbiAgICAgICAgb3BzLnB1c2goc2V0RGF0YU9wKG9wLCBkb2MpKG1hcCwgdG1wRG9jKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghbWFwLmhhc093blByb3BlcnR5KG9iaikpIHtcbiAgICAgICAgICBtYXBbb2JqXSA9IHRvSlMoQXV0b21lcmdlLmdldE9iamVjdEJ5SWQoZG9jLCBvYmopKVxuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBtYXBbb2JqXVtrZXkgYXMgc3RyaW5nXVxuICAgICAgfVxuICAgICAgcmV0dXJuIFttYXAsIG9wc11cbiAgICB9XG4gICAgLypcbiAgICBpZiAoXG4gICAgICBtYXAuaGFzT3duUHJvcGVydHkob2JqKSAmJlxuICAgICAgdHlwZW9mIG1hcFtvYmpdICE9PSAnc3RyaW5nJyAmJlxuICAgICAgdHlwZSAhPT0gJ3RleHQnICYmXG4gICAgICBtYXA/Lm9iaj8ubGVuZ3RoXG4gICAgKSB7XG4gICAgICBtYXBbb2JqXS5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgICAgIHJldHVybiBbbWFwLCBvcHNdXG4gICAgfVxuXG4gICAgaWYgKCFwYXRoKSByZXR1cm4gW21hcCwgb3BzXVxuKi9cbiAgICBpZiAocGF0aCAmJiBwYXRoLmxlbmd0aCAmJiBwYXRoWzBdID09PSAnY2hpbGRyZW4nKSB7XG4gICAgICBjb25zdCByZW1vdmUgPSByZW1vdmVCeVR5cGVbdHlwZV1cblxuICAgICAgY29uc3Qgb3BlcmF0aW9uID0gcmVtb3ZlICYmIHJlbW92ZShvcCwgZG9jKShtYXAsIHRtcERvYylcblxuICAgICAgaWYgKG9wZXJhdGlvbiAmJiBvcGVyYXRpb24udHlwZSA9PT0gJ3JlbW92ZV90ZXh0Jykge1xuICAgICAgICBjb25zdCBsYXN0T3AgPSBvcHNbb3BzLmxlbmd0aCAtIDFdXG4gICAgICAgIGlmIChcbiAgICAgICAgICBsYXN0T3AgJiZcbiAgICAgICAgICBsYXN0T3AudHlwZSA9PT0gJ3JlbW92ZV90ZXh0JyAmJlxuICAgICAgICAgIG9wZXJhdGlvbi5vZmZzZXQgPT09IGxhc3RPcC5vZmZzZXQgJiZcbiAgICAgICAgICBQYXRoLmVxdWFscyhvcGVyYXRpb24ucGF0aCwgbGFzdE9wLnBhdGgpXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIHNhbWUgcG9zaXRpb24gcmVtb3ZlIHRleHQsIG1lcmdlIGl0IGludG8gb25lIG9wLlxuICAgICAgICAgIGxhc3RPcC50ZXh0ICs9IG9wZXJhdGlvbi50ZXh0XG4gICAgICAgICAgcmV0dXJuIFttYXAsIG9wc11cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgb3BlcmF0aW9uICYmXG4gICAgICAgIG9wZXJhdGlvbi50eXBlID09PSAncmVtb3ZlX25vZGUnICYmXG4gICAgICAgIG9wZXJhdGlvbi5ub2RlICYmXG4gICAgICAgIG9wZXJhdGlvbi5ub2RlLnRleHQgJiZcbiAgICAgICAgT2JqZWN0LmtleXMob3BlcmF0aW9uLm5vZGUpLmxlbmd0aCA9PT0gMVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGxhc3RPcCA9IG9wc1tvcHMubGVuZ3RoIC0gMV1cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGxhc3RPcCAmJlxuICAgICAgICAgIGxhc3RPcC50eXBlID09PSAnaW5zZXJ0X3RleHQnICYmXG4gICAgICAgICAgUGF0aC5lcXVhbHMob3BlcmF0aW9uLnBhdGgsIFBhdGgubmV4dChsYXN0T3AucGF0aCkpICYmXG4gICAgICAgICAgbGFzdE9wLnRleHQuc2xpY2UoLW9wZXJhdGlvbi5ub2RlLnRleHQubGVuZ3RoKSA9PT0gb3BlcmF0aW9uLm5vZGUudGV4dFxuICAgICAgICApIHtcbiAgICAgICAgICAvLyByZW1vdmUgdGV4dCBub2RlIGp1c3QgYWZ0ZXIgaW5zZXJ0IHNvbWUgdGV4dCwgaXQgcG9zc2libGx5IGJlIHNvbWUgbWVyZ2Vfbm9kZSBvcD9cbiAgICAgICAgICBjb25zdCBzbGF0ZVBhdGggPSB0b1NsYXRlUGF0aChsYXN0T3AucGF0aClcbiAgICAgICAgICBjb25zdCBsYXN0Tm9kZSA9IGdldFRhcmdldCh0bXBEb2MsIHNsYXRlUGF0aClcbiAgICAgICAgICBpZiAobGFzdE9wLm9mZnNldCArIGxhc3RPcC50ZXh0Lmxlbmd0aCA9PT0gbGFzdE5vZGUudGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIHByZXZpb3VzIG5vZGUgd2FzIGp1c3QgaW5zZXJ0ZWQgdGV4dCB0byB0aGUgZW5kLCBzbyB3ZSBhcmUgbWVyZ2luZ1xuICAgICAgICAgICAgaWYgKGxhc3RPcC50ZXh0Lmxlbmd0aCA+IG9wZXJhdGlvbi5ub2RlLnRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGxhc3RPcC50ZXh0ID0gbGFzdE9wLnRleHQuc2xpY2UoMCwgLW9wZXJhdGlvbi5ub2RlLnRleHQubGVuZ3RoKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgb3BzLnBvcCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcHMucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGU6ICdtZXJnZV9ub2RlJyxcbiAgICAgICAgICAgICAgcGF0aDogb3BlcmF0aW9uLnBhdGgsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBsYXN0Tm9kZS50ZXh0Lmxlbmd0aCAtIG9wZXJhdGlvbi5ub2RlLnRleHQubGVuZ3RoLFxuICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7fVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBbbWFwLCBvcHNdXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvcHMucHVzaChvcGVyYXRpb24pXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghbWFwLmhhc093blByb3BlcnR5KG9iaikpIHtcbiAgICAgICAgbWFwW29ial0gPSB0b0pTKEF1dG9tZXJnZS5nZXRPYmplY3RCeUlkKGRvYywgb2JqKSlcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlID09PSAnbGlzdCcpIHtcbiAgICAgICAgbWFwW29ial0uc3BsaWNlKGluZGV4LCAxKVxuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgbWFwW29ial0gPSBtYXBbb2JqXVxuICAgICAgICAgIC5zbGljZSgwLCBpbmRleClcbiAgICAgICAgICAuY29uY2F0KG1hcFtvYmpdLnNsaWNlKChpbmRleCBhcyBudW1iZXIpICsgMSkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFttYXAsIG9wc11cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSwgb3AsIHRvSlMobWFwKSlcblxuICAgIHJldHVybiBbbWFwLCBvcHNdXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgb3BSZW1vdmVcbiJdfQ==