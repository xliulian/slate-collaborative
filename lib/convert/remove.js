"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Automerge = _interopRequireWildcard(require("automerge"));

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
        text: text,
        marks: []
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L3JlbW92ZS50cyJdLCJuYW1lcyI6WyJyZW1vdmVUZXh0T3AiLCJvcCIsIm1hcCIsImRvYyIsImluZGV4IiwicGF0aCIsIm9iaiIsInNsYXRlUGF0aCIsIm5vZGUiLCJ0ZXh0Iiwic2xpY2UiLCJ0eXBlIiwib2Zmc2V0IiwibWFya3MiLCJlIiwiY29uc29sZSIsImVycm9yIiwicmVtb3ZlTm9kZU9wIiwicGFyZW50IiwidGFyZ2V0IiwiY2hpbGRyZW4iLCJUeXBlRXJyb3IiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJzcGxpY2UiLCJjb25jYXQiLCJyZW1vdmVCeVR5cGUiLCJsaXN0Iiwib3BSZW1vdmUiLCJ0bXBEb2MiLCJvcHMiLCJrZXkiLCJsZW5ndGgiLCJwdXNoIiwiaGFzT3duUHJvcGVydHkiLCJBdXRvbWVyZ2UiLCJnZXRPYmplY3RCeUlkIiwicmVtb3ZlIiwib3BlcmF0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFHQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBQ0MsRUFBRDtBQUFBLFNBQXdCLFVBQUNDLEdBQUQsRUFBV0MsR0FBWCxFQUE0QjtBQUN2RSxRQUFJO0FBQUE7O0FBQUEsVUFDTUMsS0FETixHQUMyQkgsRUFEM0IsQ0FDTUcsS0FETjtBQUFBLFVBQ2FDLElBRGIsR0FDMkJKLEVBRDNCLENBQ2FJLElBRGI7QUFBQSxVQUNtQkMsR0FEbkIsR0FDMkJMLEVBRDNCLENBQ21CSyxHQURuQjtBQUdGLFVBQU1DLFNBQVMsR0FBRyx3QkFBWUYsSUFBWixDQUFsQjtBQUVBLFVBQU1HLElBQUksR0FBRyxxQkFBVUwsR0FBVixFQUFlSSxTQUFmLENBQWI7QUFFQSxVQUFJLE9BQU9ILEtBQVAsS0FBaUIsUUFBckIsRUFBK0I7QUFFL0IsVUFBTUssSUFBSSxHQUFHLENBQUFELElBQUksU0FBSixJQUFBQSxJQUFJLFdBQUosMEJBQUFB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QUFELENBQUgsQ0FBU0ksS0FBVCxDQUFlTixLQUFLLEdBQWEsQ0FBakMsQ0FGQyxDQUFYO0FBR0Q7QUFDRjs7QUFFRCxXQUFPLENBQUNGLEdBQUQsRUFBTTRCLEdBQU4sQ0FBUDtBQUNELEdBbERELENBa0RFLE9BQU9oQixDQUFQLEVBQVU7QUFDVkMsSUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWNGLENBQWQsRUFBaUJiLEVBQWpCLEVBQXFCLGlCQUFLQyxHQUFMLENBQXJCO0FBRUEsV0FBTyxDQUFDQSxHQUFELEVBQU00QixHQUFOLENBQVA7QUFDRDtBQUNGLENBN0REOztlQStEZUYsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEF1dG9tZXJnZSBmcm9tICdhdXRvbWVyZ2UnXG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSAnc2xhdGUnXG5cbmltcG9ydCB7IHRvU2xhdGVQYXRoLCB0b0pTIH0gZnJvbSAnLi4vdXRpbHMnXG5pbXBvcnQgeyBnZXRUYXJnZXQgfSBmcm9tICcuLi9wYXRoJ1xuaW1wb3J0IHsgc2V0RGF0YU9wIH0gZnJvbSAnLi9zZXQnXG5cbmNvbnN0IHJlbW92ZVRleHRPcCA9IChvcDogQXV0b21lcmdlLkRpZmYpID0+IChtYXA6IGFueSwgZG9jOiBFbGVtZW50KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBpbmRleCwgcGF0aCwgb2JqIH0gPSBvcFxuXG4gICAgY29uc3Qgc2xhdGVQYXRoID0gdG9TbGF0ZVBhdGgocGF0aClcblxuICAgIGNvbnN0IG5vZGUgPSBnZXRUYXJnZXQoZG9jLCBzbGF0ZVBhdGgpXG5cbiAgICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykgcmV0dXJuXG5cbiAgICBjb25zdCB0ZXh0ID0gbm9kZT8udGV4dD8uW2luZGV4XSB8fCAnKidcblxuICAgIG5vZGUudGV4dCA9IG5vZGUudGV4dC5zbGljZSgwLCBpbmRleCkgKyBub2RlLnRleHQuc2xpY2UoaW5kZXggKyAxKVxuXG4gICAgbWFwW29ial0gPSBub2RlLnRleHRcblxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAncmVtb3ZlX3RleHQnLFxuICAgICAgcGF0aDogc2xhdGVQYXRoLFxuICAgICAgb2Zmc2V0OiBpbmRleCxcbiAgICAgIHRleHQsXG4gICAgICBtYXJrczogW11cbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUsIG9wLCBtYXAsIHRvSlMoZG9jKSlcbiAgfVxufVxuXG5jb25zdCByZW1vdmVOb2RlT3AgPSAob3A6IEF1dG9tZXJnZS5EaWZmKSA9PiAobWFwOiBhbnksIGRvYzogRWxlbWVudCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgaW5kZXgsIG9iaiwgcGF0aCB9ID0gb3BcblxuICAgIGNvbnN0IHNsYXRlUGF0aCA9IHRvU2xhdGVQYXRoKHBhdGgpXG5cbiAgICBjb25zdCBwYXJlbnQgPSBnZXRUYXJnZXQoZG9jLCBzbGF0ZVBhdGgpXG4gICAgY29uc3QgdGFyZ2V0ID0gcGFyZW50Py5jaGlsZHJlbj8uW2luZGV4IGFzIG51bWJlcl0gfHxcbiAgICAgIHBhcmVudD8uW2luZGV4IGFzIG51bWJlcl0vLyB8fCB7IGNoaWxkcmVuOiBbXSB9XG5cbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGFyZ2V0IGlzIG5vdCBmb3VuZCEnKVxuICAgIH1cblxuICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihpbmRleCkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0luZGV4IGlzIG5vdCBhIG51bWJlcicpXG4gICAgfVxuXG4gICAgaWYgKHBhcmVudD8uY2hpbGRyZW4/LltpbmRleCBhcyBudW1iZXJdKSB7XG4gICAgICBwYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKVxuICAgICAgbWFwW29ial0gPSBwYXJlbnQ/LmNoaWxkcmVuXG4gICAgfSBlbHNlIGlmIChwYXJlbnQ/LltpbmRleCBhcyBudW1iZXJdKSB7XG4gICAgICBwYXJlbnQuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgbWFwW29ial0gPSBwYXJlbnRcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ3JlbW92ZV9ub2RlJyxcbiAgICAgIHBhdGg6IHNsYXRlUGF0aC5jb25jYXQoaW5kZXgpLFxuICAgICAgbm9kZTogdG9KUyh0YXJnZXQpXG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlLCBvcCwgbWFwLCB0b0pTKGRvYykpXG4gIH1cbn1cblxuY29uc3QgcmVtb3ZlQnlUeXBlID0ge1xuICB0ZXh0OiByZW1vdmVUZXh0T3AsXG4gIGxpc3Q6IHJlbW92ZU5vZGVPcFxufVxuXG5jb25zdCBvcFJlbW92ZSA9IChcbiAgb3A6IEF1dG9tZXJnZS5EaWZmLFxuICBbbWFwLCBvcHNdOiBhbnksXG4gIGRvYzogYW55LFxuICB0bXBEb2M6IEVsZW1lbnRcbikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgaW5kZXgsIGtleSwgcGF0aCwgb2JqLCB0eXBlIH0gPSBvcFxuXG4gICAgaWYgKHR5cGUgPT09ICdtYXAnKSB7XG4gICAgICAvLyByZW1vdmUgYSBrZXkgZnJvbSBtYXAsIG1hcHBpbmcgdG8gc2xhdGUgc2V0IGEga2V5J3MgdmFsdWUgdG8gdW5kZWZpbmVkLlxuICAgICAgaWYgKHBhdGggJiYgcGF0aC5sZW5ndGggJiYgcGF0aFswXSA9PT0gJ2NoaWxkcmVuJykge1xuICAgICAgICBvcHMucHVzaChzZXREYXRhT3Aob3AsIGRvYykobWFwLCB0bXBEb2MpKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlmICghbWFwLmhhc093blByb3BlcnR5KG9iaikpIHtcbiAgICAgICAgICBtYXBbb2JqXSA9IHRvSlMoQXV0b21lcmdlLmdldE9iamVjdEJ5SWQoZG9jLCBvYmopKVxuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBtYXBbb2JqXVtrZXkgYXMgc3RyaW5nXVxuICAgICAgfVxuICAgICAgcmV0dXJuIFttYXAsIG9wc11cbiAgICB9XG4vKlxuICAgIGlmIChcbiAgICAgIG1hcC5oYXNPd25Qcm9wZXJ0eShvYmopICYmXG4gICAgICB0eXBlb2YgbWFwW29ial0gIT09ICdzdHJpbmcnICYmXG4gICAgICB0eXBlICE9PSAndGV4dCcgJiZcbiAgICAgIG1hcD8ub2JqPy5sZW5ndGhcbiAgICApIHtcbiAgICAgIG1hcFtvYmpdLnNwbGljZShpbmRleCwgMSlcblxuICAgICAgcmV0dXJuIFttYXAsIG9wc11cbiAgICB9XG5cbiAgICBpZiAoIXBhdGgpIHJldHVybiBbbWFwLCBvcHNdXG4qL1xuICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoICYmIHBhdGhbMF0gPT09ICdjaGlsZHJlbicpIHtcbiAgICAgIGNvbnN0IHJlbW92ZSA9IHJlbW92ZUJ5VHlwZVt0eXBlXVxuXG4gICAgICBjb25zdCBvcGVyYXRpb24gPSByZW1vdmUgJiYgcmVtb3ZlKG9wLCBkb2MpKG1hcCwgdG1wRG9jKVxuXG4gICAgICBvcHMucHVzaChvcGVyYXRpb24pXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghbWFwLmhhc093blByb3BlcnR5KG9iaikpIHtcbiAgICAgICAgbWFwW29ial0gPSB0b0pTKEF1dG9tZXJnZS5nZXRPYmplY3RCeUlkKGRvYywgb2JqKSlcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlID09PSAnbGlzdCcpIHtcbiAgICAgICAgbWFwW29ial0uc3BsaWNlKGluZGV4LCAxKVxuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgbWFwW29ial0gPSBtYXBbb2JqXVxuICAgICAgICAgIC5zbGljZSgwLCBpbmRleClcbiAgICAgICAgICAuY29uY2F0KG1hcFtvYmpdLnNsaWNlKGluZGV4IGFzIG51bWJlciArIDEpKVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gW21hcCwgb3BzXVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlLCBvcCwgdG9KUyhtYXApKVxuXG4gICAgcmV0dXJuIFttYXAsIG9wc11cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBvcFJlbW92ZVxuIl19