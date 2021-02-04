"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("../utils");

var _path = require("../path");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var removeTextOp = function removeTextOp(op) {
  return function (map, doc) {
    try {
      var _node, _node$text;

      var index = op.index,
          path = op.path,
          obj = op.obj;
      var slatePath = (0, _utils.toSlatePath)(path).slice(0, path === null || path === void 0 ? void 0 : path.length);
      var node = map[obj];

      try {
        node = (0, _path.getTarget)(doc, slatePath);
      } catch (e) {
        console.error(e, slatePath, op, map, (0, _utils.toJS)(doc));
      }

      if (typeof index !== 'number') return;
      var text = ((_node = node) === null || _node === void 0 ? void 0 : (_node$text = _node.text) === null || _node$text === void 0 ? void 0 : _node$text[index]) || '*';

      if (node) {
        var _node2;

        node.text = (_node2 = node) !== null && _node2 !== void 0 && _node2.text ? node.text.slice(0, index) + node.text.slice(index + 1) : '';
      }

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
      var target = (parent === null || parent === void 0 ? void 0 : (_parent$children = parent.children) === null || _parent$children === void 0 ? void 0 : _parent$children[index]) || (parent === null || parent === void 0 ? void 0 : parent[index]) || {
        children: []
      };

      if (!target) {
        throw new TypeError('Target is not found!');
      }

      if (!map.hasOwnProperty(obj)) {
        map[obj] = target;
      }

      if (!Number.isInteger(index)) {
        throw new TypeError('Index is not a number');
      }

      if (parent !== null && parent !== void 0 && (_parent$children2 = parent.children) !== null && _parent$children2 !== void 0 && _parent$children2[index]) {
        parent.children.splice(index, 1);
      } else if (parent !== null && parent !== void 0 && parent[index]) {
        parent.splice(index, 1);
      }

      return {
        type: 'remove_node',
        path: slatePath.length ? slatePath.concat(index) : [index],
        node: target
      };
    } catch (e) {
      console.error(e, op, map, (0, _utils.toJS)(doc));
    }
  };
};

var opRemove = function opRemove(op, _ref, doc, tmpDoc) {
  var _ref2 = _slicedToArray(_ref, 2),
      map = _ref2[0],
      ops = _ref2[1];

  try {
    var _map$obj;

    var index = op.index,
        path = op.path,
        obj = op.obj,
        type = op.type;

    if (map.hasOwnProperty(obj) && typeof map[obj] !== 'string' && type !== 'text' && map !== null && map !== void 0 && (_map$obj = map.obj) !== null && _map$obj !== void 0 && _map$obj.length) {
      map[obj].splice(index, 1);
      return [map, ops];
    }

    if (!path) return [map, ops];
    var key = path[path.length - 1];
    if (key === 'cursors' || op.key === 'cursors') return [map, ops];
    var fn = key === 'text' ? removeTextOp : removeNodeOp;
    return [map, [].concat(_toConsumableArray(ops), [fn(op)(map, tmpDoc)])];
  } catch (e) {
    console.error(e, op, (0, _utils.toJS)(map));
    return [map, ops];
  }
};

var _default = opRemove;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L3JlbW92ZS50cyJdLCJuYW1lcyI6WyJyZW1vdmVUZXh0T3AiLCJvcCIsIm1hcCIsImRvYyIsImluZGV4IiwicGF0aCIsIm9iaiIsInNsYXRlUGF0aCIsInNsaWNlIiwibGVuZ3RoIiwibm9kZSIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJ0ZXh0IiwidHlwZSIsIm9mZnNldCIsIm1hcmtzIiwicmVtb3ZlTm9kZU9wIiwicGFyZW50IiwidGFyZ2V0IiwiY2hpbGRyZW4iLCJUeXBlRXJyb3IiLCJoYXNPd25Qcm9wZXJ0eSIsIk51bWJlciIsImlzSW50ZWdlciIsInNwbGljZSIsImNvbmNhdCIsIm9wUmVtb3ZlIiwidG1wRG9jIiwib3BzIiwia2V5IiwiZm4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFHQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQUNDLEVBQUQ7QUFBQSxTQUF3QixVQUFDQyxHQUFELEVBQVdDLEdBQVgsRUFBNEI7QUFDdkUsUUFBSTtBQUFBOztBQUFBLFVBQ01DLEtBRE4sR0FDMkJILEVBRDNCLENBQ01HLEtBRE47QUFBQSxVQUNhQyxJQURiLEdBQzJCSixFQUQzQixDQUNhSSxJQURiO0FBQUEsVUFDbUJDLEdBRG5CLEdBQzJCTCxFQUQzQixDQUNtQkssR0FEbkI7QUFHRixVQUFNQyxTQUFTLEdBQUcsd0JBQVlGLElBQVosRUFBa0JHLEtBQWxCLENBQXdCLENBQXhCLEVBQTJCSCxJQUEzQixhQUEyQkEsSUFBM0IsdUJBQTJCQSxJQUFJLENBQUVJLE1BQWpDLENBQWxCO0FBRUEsVUFBSUMsSUFBSSxHQUFHUixHQUFHLENBQUNJLEdBQUQsQ0FBZDs7QUFFQSxVQUFJO0FBQ0ZJLFFBQUFBLElBQUksR0FBRyxxQkFBVVAsR0FBVixFQUFlSSxTQUFmLENBQVA7QUFDRCxPQUZELENBRUUsT0FBT0ksQ0FBUCxFQUFVO0FBQ1ZDLFFBQUFBLE9BQU8sQ0FB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RDs7QUFFRCxRQUFJLENBQUN6QixJQUFMLEVBQVcsT0FBTyxDQUFDSCxHQUFELEVBQU00QixHQUFOLENBQVA7QUFFWCxRQUFNQyxHQUFHLEdBQUcxQixJQUFJLENBQUNBLElBQUksQ0FBQ0ksTUFBTCxHQUFjLENBQWYsQ0FBaEI7QUFFQSxRQUFJc0IsR0FBRyxLQUFLLFNBQVIsSUFBcUI5QixFQUFFLENBQUM4QixHQUFILEtBQVcsU0FBcEMsRUFBK0MsT0FBTyxDQUFDN0IsR0FBRCxFQUFNNEIsR0FBTixDQUFQO0FBRS9DLFFBQU1FLEVBQUUsR0FBR0QsR0FBRyxLQUFLLE1BQVIsR0FBaUIvQixZQUFqQixHQUFnQ2tCLFlBQTNDO0FBRUEsV0FBTyxDQUFDaEIsR0FBRCwrQkFBVTRCLEdBQVYsSUFBZUUsRUFBRSxDQUFDL0IsRUFBRCxDQUFGLENBQU9DLEdBQVAsRUFBWTJCLE1BQVosQ0FBZixHQUFQO0FBQ0QsR0F2QkQsQ0F1QkUsT0FBT2xCLENBQVAsRUFBVTtBQUNWQyxJQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBY0YsQ0FBZCxFQUFpQlYsRUFBakIsRUFBcUIsaUJBQUtDLEdBQUwsQ0FBckI7QUFFQSxXQUFPLENBQUNBLEdBQUQsRUFBTTRCLEdBQU4sQ0FBUDtBQUNEO0FBQ0YsQ0FsQ0Q7O2VBb0NlRixRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQXV0b21lcmdlIGZyb20gJ2F1dG9tZXJnZSdcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tICdzbGF0ZSdcblxuaW1wb3J0IHsgdG9TbGF0ZVBhdGgsIHRvSlMgfSBmcm9tICcuLi91dGlscydcbmltcG9ydCB7IGdldFRhcmdldCB9IGZyb20gJy4uL3BhdGgnXG5cbmNvbnN0IHJlbW92ZVRleHRPcCA9IChvcDogQXV0b21lcmdlLkRpZmYpID0+IChtYXA6IGFueSwgZG9jOiBFbGVtZW50KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBpbmRleCwgcGF0aCwgb2JqIH0gPSBvcFxuXG4gICAgY29uc3Qgc2xhdGVQYXRoID0gdG9TbGF0ZVBhdGgocGF0aCkuc2xpY2UoMCwgcGF0aD8ubGVuZ3RoKVxuXG4gICAgbGV0IG5vZGUgPSBtYXBbb2JqXVxuXG4gICAgdHJ5IHtcbiAgICAgIG5vZGUgPSBnZXRUYXJnZXQoZG9jLCBzbGF0ZVBhdGgpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlLCBzbGF0ZVBhdGgsIG9wLCBtYXAsIHRvSlMoZG9jKSlcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykgcmV0dXJuXG5cbiAgICBjb25zdCB0ZXh0ID0gbm9kZT8udGV4dD8uW2luZGV4XSB8fCAnKidcblxuICAgIGlmIChub2RlKSB7XG4gICAgICBub2RlLnRleHQgPSBub2RlPy50ZXh0XG4gICAgICAgID8gbm9kZS50ZXh0LnNsaWNlKDAsIGluZGV4KSArIG5vZGUudGV4dC5zbGljZShpbmRleCArIDEpXG4gICAgICAgIDogJydcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ3JlbW92ZV90ZXh0JyxcbiAgICAgIHBhdGg6IHNsYXRlUGF0aCxcbiAgICAgIG9mZnNldDogaW5kZXgsXG4gICAgICB0ZXh0LFxuICAgICAgbWFya3M6IFtdXG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlLCBvcCwgbWFwLCB0b0pTKGRvYykpXG4gIH1cbn1cblxuY29uc3QgcmVtb3ZlTm9kZU9wID0gKG9wOiBBdXRvbWVyZ2UuRGlmZikgPT4gKG1hcDogYW55LCBkb2M6IEVsZW1lbnQpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGluZGV4LCBvYmosIHBhdGggfSA9IG9wXG5cbiAgICBjb25zdCBzbGF0ZVBhdGggPSB0b1NsYXRlUGF0aChwYXRoKVxuXG4gICAgY29uc3QgcGFyZW50ID0gZ2V0VGFyZ2V0KGRvYywgc2xhdGVQYXRoKVxuICAgIGNvbnN0IHRhcmdldCA9IHBhcmVudD8uY2hpbGRyZW4/LltpbmRleCBhcyBudW1iZXJdIHx8XG4gICAgICBwYXJlbnQ/LltpbmRleCBhcyBudW1iZXJdIHx8IHsgY2hpbGRyZW46IFtdIH1cblxuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUYXJnZXQgaXMgbm90IGZvdW5kIScpXG4gICAgfVxuXG4gICAgaWYgKCFtYXAuaGFzT3duUHJvcGVydHkob2JqKSkge1xuICAgICAgbWFwW29ial0gPSB0YXJnZXRcbiAgICB9XG5cbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIoaW5kZXgpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbmRleCBpcyBub3QgYSBudW1iZXInKVxuICAgIH1cblxuICAgIGlmIChwYXJlbnQ/LmNoaWxkcmVuPy5baW5kZXggYXMgbnVtYmVyXSkge1xuICAgICAgcGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSlcbiAgICB9IGVsc2UgaWYgKHBhcmVudD8uW2luZGV4IGFzIG51bWJlcl0pIHtcbiAgICAgIHBhcmVudC5zcGxpY2UoaW5kZXgsIDEpXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdyZW1vdmVfbm9kZScsXG4gICAgICBwYXRoOiBzbGF0ZVBhdGgubGVuZ3RoID8gc2xhdGVQYXRoLmNvbmNhdChpbmRleCkgOiBbaW5kZXhdLFxuICAgICAgbm9kZTogdGFyZ2V0XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlLCBvcCwgbWFwLCB0b0pTKGRvYykpXG4gIH1cbn1cblxuY29uc3Qgb3BSZW1vdmUgPSAoXG4gIG9wOiBBdXRvbWVyZ2UuRGlmZixcbiAgW21hcCwgb3BzXTogYW55LFxuICBkb2M6IGFueSxcbiAgdG1wRG9jOiBFbGVtZW50XG4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGluZGV4LCBwYXRoLCBvYmosIHR5cGUgfSA9IG9wXG5cbiAgICBpZiAoXG4gICAgICBtYXAuaGFzT3duUHJvcGVydHkob2JqKSAmJlxuICAgICAgdHlwZW9mIG1hcFtvYmpdICE9PSAnc3RyaW5nJyAmJlxuICAgICAgdHlwZSAhPT0gJ3RleHQnICYmXG4gICAgICBtYXA/Lm9iaj8ubGVuZ3RoXG4gICAgKSB7XG4gICAgICBtYXBbb2JqXS5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgICAgIHJldHVybiBbbWFwLCBvcHNdXG4gICAgfVxuXG4gICAgaWYgKCFwYXRoKSByZXR1cm4gW21hcCwgb3BzXVxuXG4gICAgY29uc3Qga2V5ID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdXG5cbiAgICBpZiAoa2V5ID09PSAnY3Vyc29ycycgfHwgb3Aua2V5ID09PSAnY3Vyc29ycycpIHJldHVybiBbbWFwLCBvcHNdXG5cbiAgICBjb25zdCBmbiA9IGtleSA9PT0gJ3RleHQnID8gcmVtb3ZlVGV4dE9wIDogcmVtb3ZlTm9kZU9wXG5cbiAgICByZXR1cm4gW21hcCwgWy4uLm9wcywgZm4ob3ApKG1hcCwgdG1wRG9jKV1dXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUsIG9wLCB0b0pTKG1hcCkpXG5cbiAgICByZXR1cm4gW21hcCwgb3BzXVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9wUmVtb3ZlXG4iXX0=