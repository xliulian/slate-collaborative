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
        } else {
          ops.push(operation);
        }
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L3JlbW92ZS50cyJdLCJuYW1lcyI6WyJyZW1vdmVUZXh0T3AiLCJvcCIsIm1hcCIsImRvYyIsImluZGV4IiwicGF0aCIsIm9iaiIsInNsYXRlUGF0aCIsIm5vZGUiLCJ0ZXh0Iiwic2xpY2UiLCJ0eXBlIiwib2Zmc2V0IiwiZSIsImNvbnNvbGUiLCJlcnJvciIsInJlbW92ZU5vZGVPcCIsInBhcmVudCIsInRhcmdldCIsImNoaWxkcmVuIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwic3BsaWNlIiwiY29uY2F0IiwicmVtb3ZlQnlUeXBlIiwibGlzdCIsIm9wUmVtb3ZlIiwidG1wRG9jIiwib3BzIiwia2V5IiwibGVuZ3RoIiwicHVzaCIsImhhc093blByb3BlcnR5IiwiQXV0b21lcmdlIiwiZ2V0T2JqZWN0QnlJZCIsInJlbW92ZSIsIm9wZXJhdGlvbiIsImxhc3RPcCIsIlBhdGgiLCJlcXVhbHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFDQyxFQUFEO0FBQUEsU0FBd0IsVUFBQ0MsR0FBRCxFQUFXQyxHQUFYLEVBQTRCO0FBQ3ZFLFFBQUk7QUFBQTs7QUFBQSxVQUNNQyxLQUROLEdBQzJCSCxFQUQzQixDQUNNRyxLQUROO0FBQUEsVUFDYUMsSUFEYixHQUMyQkosRUFEM0IsQ0FDYUksSUFEYjtBQUFBLFVBQ21CQyxHQURuQixHQUMyQkwsRUFEM0IsQ0FDbUJLLEdBRG5CO0FBR0YsVUFBTUMsU0FBUyxHQUFHLHdCQUFZRixJQUFaLENBQWxCO0FBRUEsVUFBTUcsSUFBSSxHQUFHLHFCQUFVTCxHQUFWLEVBQWVJLFNBQWYsQ0FBYjtBQUVBLFVBQUksT0FBT0gsS0FBUCxLQUFpQixRQUFyQixFQUErQjtBQUUvQixVQUFNSyxJQUFJLEdBQUcsQ0FBQUQsSUFBSSxTQUFK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R0FBbkIsQ0FBTCxFQUE4QjtBQUM1QkosUUFBQUEsR0FBRyxDQUFDSSxHQUFELENBQUgsR0FBVyxpQkFBSzRCLFNBQVMsQ0FBQ0MsYUFBVixDQUF3QmhDLEdBQXhCLEVBQTZCRyxHQUE3QixDQUFMLENBQVg7QUFDRDs7QUFDRCxVQUFJSyxJQUFJLEtBQUssTUFBYixFQUFxQjtBQUNuQlQsUUFBQUEsR0FBRyxDQUFDSSxHQUFELENBQUgsQ0FBU2lCLE1BQVQsQ0FBZ0JuQixLQUFoQixFQUF1QixDQUF2QjtBQUNELE9BRkQsTUFFTyxJQUFJTyxJQUFJLEtBQUssTUFBYixFQUFxQjtBQUMxQlQsUUFBQUEsR0FBRyxDQUFDSSxHQUFELENBQUgsR0FBV0osR0FBRyxDQUFDSSxHQUFELENBQUgsQ0FDUkksS0FEUSxDQUNGLENBREUsRUFDQ04sS0FERCxFQUVSb0IsTUFGUSxDQUVEdEIsR0FBRyxDQUFDSSxHQUFELENBQUgsQ0FBU0ksS0FBVCxDQUFnQk4sS0FBRCxHQUFvQixDQUFuQyxDQUZDLENBQVg7QUFHRDtBQUNGOztBQUVELFdBQU8sQ0FBQ0YsR0FBRCxFQUFNMkIsR0FBTixDQUFQO0FBQ0QsR0E5REQsQ0E4REUsT0FBT2hCLENBQVAsRUFBVTtBQUNWQyxJQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBY0YsQ0FBZCxFQUFpQlosRUFBakIsRUFBcUIsaUJBQUtDLEdBQUwsQ0FBckI7QUFFQSxXQUFPLENBQUNBLEdBQUQsRUFBTTJCLEdBQU4sQ0FBUDtBQUNEO0FBQ0YsQ0F6RUQ7O2VBMkVlRixRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQXV0b21lcmdlIGZyb20gJ2F1dG9tZXJnZSdcbmltcG9ydCB7IEVsZW1lbnQsIFBhdGggfSBmcm9tICdzbGF0ZSdcblxuaW1wb3J0IHsgdG9TbGF0ZVBhdGgsIHRvSlMgfSBmcm9tICcuLi91dGlscydcbmltcG9ydCB7IGdldFRhcmdldCB9IGZyb20gJy4uL3BhdGgnXG5pbXBvcnQgeyBzZXREYXRhT3AgfSBmcm9tICcuL3NldCdcblxuY29uc3QgcmVtb3ZlVGV4dE9wID0gKG9wOiBBdXRvbWVyZ2UuRGlmZikgPT4gKG1hcDogYW55LCBkb2M6IEVsZW1lbnQpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGluZGV4LCBwYXRoLCBvYmogfSA9IG9wXG5cbiAgICBjb25zdCBzbGF0ZVBhdGggPSB0b1NsYXRlUGF0aChwYXRoKVxuXG4gICAgY29uc3Qgbm9kZSA9IGdldFRhcmdldChkb2MsIHNsYXRlUGF0aClcblxuICAgIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm5cblxuICAgIGNvbnN0IHRleHQgPSBub2RlPy50ZXh0Py5baW5kZXhdIHx8ICcqJ1xuXG4gICAgbm9kZS50ZXh0ID0gbm9kZS50ZXh0LnNsaWNlKDAsIGluZGV4KSArIG5vZGUudGV4dC5zbGljZShpbmRleCArIDEpXG5cbiAgICBtYXBbb2JqXSA9IG5vZGUudGV4dFxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdyZW1vdmVfdGV4dCcsXG4gICAgICBwYXRoOiBzbGF0ZVBhdGgsXG4gICAgICBvZmZzZXQ6IGluZGV4LFxuICAgICAgdGV4dFxuICAgICAgLy9tYXJrczogW11cbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUsIG9wLCBtYXAsIHRvSlMoZG9jKSlcbiAgfVxufVxuXG5jb25zdCByZW1vdmVOb2RlT3AgPSAob3A6IEF1dG9tZXJnZS5EaWZmKSA9PiAobWFwOiBhbnksIGRvYzogRWxlbWVudCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgaW5kZXgsIG9iaiwgcGF0aCB9ID0gb3BcblxuICAgIGNvbnN0IHNsYXRlUGF0aCA9IHRvU2xhdGVQYXRoKHBhdGgpXG5cbiAgICBjb25zdCBwYXJlbnQgPSBnZXRUYXJnZXQoZG9jLCBzbGF0ZVBhdGgpXG4gICAgY29uc3QgdGFyZ2V0ID1cbiAgICAgIHBhcmVudD8uY2hpbGRyZW4/LltpbmRleCBhcyBudW1iZXJdIHx8IHBhcmVudD8uW2luZGV4IGFzIG51bWJlcl0gLy8gfHwgeyBjaGlsZHJlbjogW10gfVxuXG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RhcmdldCBpcyBub3QgZm91bmQhJylcbiAgICB9XG5cbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIoaW5kZXgpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbmRleCBpcyBub3QgYSBudW1iZXInKVxuICAgIH1cblxuICAgIGlmIChwYXJlbnQ/LmNoaWxkcmVuPy5baW5kZXggYXMgbnVtYmVyXSkge1xuICAgICAgcGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSlcbiAgICAgIG1hcFtvYmpdID0gcGFyZW50Py5jaGlsZHJlblxuICAgIH0gZWxzZSBpZiAocGFyZW50Py5baW5kZXggYXMgbnVtYmVyXSkge1xuICAgICAgcGFyZW50LnNwbGljZShpbmRleCwgMSlcbiAgICAgIG1hcFtvYmpdID0gcGFyZW50XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdyZW1vdmVfbm9kZScsXG4gICAgICBwYXRoOiBzbGF0ZVBhdGguY29uY2F0KGluZGV4KSxcbiAgICAgIG5vZGU6IHRvSlModGFyZ2V0KVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSwgb3AsIG1hcCwgdG9KUyhkb2MpKVxuICB9XG59XG5cbmNvbnN0IHJlbW92ZUJ5VHlwZSA9IHtcbiAgdGV4dDogcmVtb3ZlVGV4dE9wLFxuICBsaXN0OiByZW1vdmVOb2RlT3Bcbn1cblxuY29uc3Qgb3BSZW1vdmUgPSAoXG4gIG9wOiBBdXRvbWVyZ2UuRGlmZixcbiAgW21hcCwgb3BzXTogYW55LFxuICBkb2M6IGFueSxcbiAgdG1wRG9jOiBFbGVtZW50XG4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGluZGV4LCBrZXksIHBhdGgsIG9iaiwgdHlwZSB9ID0gb3BcblxuICAgIGlmICh0eXBlID09PSAnbWFwJykge1xuICAgICAgLy8gcmVtb3ZlIGEga2V5IGZyb20gbWFwLCBtYXBwaW5nIHRvIHNsYXRlIHNldCBhIGtleSdzIHZhbHVlIHRvIHVuZGVmaW5lZC5cbiAgICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoICYmIHBhdGhbMF0gPT09ICdjaGlsZHJlbicpIHtcbiAgICAgICAgb3BzLnB1c2goc2V0RGF0YU9wKG9wLCBkb2MpKG1hcCwgdG1wRG9jKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghbWFwLmhhc093blByb3BlcnR5KG9iaikpIHtcbiAgICAgICAgICBtYXBbb2JqXSA9IHRvSlMoQXV0b21lcmdlLmdldE9iamVjdEJ5SWQoZG9jLCBvYmopKVxuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBtYXBbb2JqXVtrZXkgYXMgc3RyaW5nXVxuICAgICAgfVxuICAgICAgcmV0dXJuIFttYXAsIG9wc11cbiAgICB9XG4gICAgLypcbiAgICBpZiAoXG4gICAgICBtYXAuaGFzT3duUHJvcGVydHkob2JqKSAmJlxuICAgICAgdHlwZW9mIG1hcFtvYmpdICE9PSAnc3RyaW5nJyAmJlxuICAgICAgdHlwZSAhPT0gJ3RleHQnICYmXG4gICAgICBtYXA/Lm9iaj8ubGVuZ3RoXG4gICAgKSB7XG4gICAgICBtYXBbb2JqXS5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgICAgIHJldHVybiBbbWFwLCBvcHNdXG4gICAgfVxuXG4gICAgaWYgKCFwYXRoKSByZXR1cm4gW21hcCwgb3BzXVxuKi9cbiAgICBpZiAocGF0aCAmJiBwYXRoLmxlbmd0aCAmJiBwYXRoWzBdID09PSAnY2hpbGRyZW4nKSB7XG4gICAgICBjb25zdCByZW1vdmUgPSByZW1vdmVCeVR5cGVbdHlwZV1cblxuICAgICAgY29uc3Qgb3BlcmF0aW9uID0gcmVtb3ZlICYmIHJlbW92ZShvcCwgZG9jKShtYXAsIHRtcERvYylcblxuICAgICAgaWYgKG9wZXJhdGlvbiAmJiBvcGVyYXRpb24udHlwZSA9PT0gJ3JlbW92ZV90ZXh0Jykge1xuICAgICAgICBjb25zdCBsYXN0T3AgPSBvcHNbb3BzLmxlbmd0aCAtIDFdXG4gICAgICAgIGlmIChcbiAgICAgICAgICBsYXN0T3AgJiZcbiAgICAgICAgICBsYXN0T3AudHlwZSA9PT0gJ3JlbW92ZV90ZXh0JyAmJlxuICAgICAgICAgIG9wZXJhdGlvbi5vZmZzZXQgPT09IGxhc3RPcC5vZmZzZXQgJiZcbiAgICAgICAgICBQYXRoLmVxdWFscyhvcGVyYXRpb24ucGF0aCwgbGFzdE9wLnBhdGgpXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIHNhbWUgcG9zaXRpb24gcmVtb3ZlIHRleHQsIG1lcmdlIGl0IGludG8gb25lIG9wLlxuICAgICAgICAgIGxhc3RPcC50ZXh0ICs9IG9wZXJhdGlvbi50ZXh0XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3BzLnB1c2gob3BlcmF0aW9uKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghbWFwLmhhc093blByb3BlcnR5KG9iaikpIHtcbiAgICAgICAgbWFwW29ial0gPSB0b0pTKEF1dG9tZXJnZS5nZXRPYmplY3RCeUlkKGRvYywgb2JqKSlcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlID09PSAnbGlzdCcpIHtcbiAgICAgICAgbWFwW29ial0uc3BsaWNlKGluZGV4LCAxKVxuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgbWFwW29ial0gPSBtYXBbb2JqXVxuICAgICAgICAgIC5zbGljZSgwLCBpbmRleClcbiAgICAgICAgICAuY29uY2F0KG1hcFtvYmpdLnNsaWNlKChpbmRleCBhcyBudW1iZXIpICsgMSkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFttYXAsIG9wc11cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSwgb3AsIHRvSlMobWFwKSlcblxuICAgIHJldHVybiBbbWFwLCBvcHNdXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgb3BSZW1vdmVcbiJdfQ==