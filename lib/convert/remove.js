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
    var _node;

    var index = op.index,
        path = op.path,
        obj = op.obj;
    var slatePath = (0, _utils.toSlatePath)(path).slice(0, path === null || path === void 0 ? void 0 : path.length);
    var node;

    try {
      node = (0, _path.getTarget)(doc, slatePath) || map[obj];
    } catch (e) {
      console.error(e, op, doc);
    }

    if (typeof index !== 'number') return;
    var text = ((_node = node) === null || _node === void 0 ? void 0 : _node.text[index]) || '*';

    if (node) {
      var _node$text, _node$text2;

      node.text = ((_node$text = node.text) === null || _node$text === void 0 ? void 0 : _node$text.slice(0, index)) + ((_node$text2 = node.text) === null || _node$text2 === void 0 ? void 0 : _node$text2.slice(index + 1));
    }

    return {
      type: 'remove_text',
      path: slatePath,
      offset: index,
      text: text,
      marks: []
    };
  };
};

var removeNodeOp = function removeNodeOp(_ref) {
  var index = _ref.index,
      obj = _ref.obj,
      path = _ref.path;
  return function (map, doc) {
    var slatePath = (0, _utils.toSlatePath)(path);
    var parent = (0, _path.getTarget)(doc, slatePath);
    var target = (parent === null || parent === void 0 ? void 0 : parent.children[index]) || {
      children: []
    };

    if (!map.hasOwnProperty(obj)) {
      map[obj] = target;
    }

    return {
      type: 'remove_node',
      path: slatePath.length ? slatePath.concat(index) : [index],
      node: target
    };
  };
};

var opRemove = function opRemove(op, _ref2) {
  var _ref3 = _slicedToArray(_ref2, 2),
      map = _ref3[0],
      ops = _ref3[1];

  try {
    var index = op.index,
        path = op.path,
        obj = op.obj,
        type = op.type;

    if (map.hasOwnProperty(obj) && typeof map[obj] !== 'string' && type !== 'text') {
      map[obj].splice(index, 1);
      return [map, ops];
    }

    if (!path) return [map, ops];
    var key = path[path.length - 1];
    if (key === 'cursors') return [map, ops];
    var fn = key === 'text' ? removeTextOp : removeNodeOp;
    return [map, [].concat(_toConsumableArray(ops), [fn(op)])];
  } catch (e) {
    console.error(e, op, (0, _utils.toJS)(map));
    return [map, ops];
  }
};

var _default = opRemove;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L3JlbW92ZS50cyJdLCJuYW1lcyI6WyJyZW1vdmVUZXh0T3AiLCJvcCIsIm1hcCIsImRvYyIsImluZGV4IiwicGF0aCIsIm9iaiIsInNsYXRlUGF0aCIsInNsaWNlIiwibGVuZ3RoIiwibm9kZSIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJ0ZXh0IiwidHlwZSIsIm9mZnNldCIsIm1hcmtzIiwicmVtb3ZlTm9kZU9wIiwicGFyZW50IiwidGFyZ2V0IiwiY2hpbGRyZW4iLCJoYXNPd25Qcm9wZXJ0eSIsImNvbmNhdCIsIm9wUmVtb3ZlIiwib3BzIiwic3BsaWNlIiwia2V5IiwiZm4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFHQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQUNDLEVBQUQ7QUFBQSxTQUF3QixVQUFDQyxHQUFELEVBQVdDLEdBQVgsRUFBNEI7QUFBQTs7QUFBQSxRQUMvREMsS0FEK0QsR0FDMUNILEVBRDBDLENBQy9ERyxLQUQrRDtBQUFBLFFBQ3hEQyxJQUR3RCxHQUMxQ0osRUFEMEMsQ0FDeERJLElBRHdEO0FBQUEsUUFDbERDLEdBRGtELEdBQzFDTCxFQUQwQyxDQUNsREssR0FEa0Q7QUFHdkUsUUFBTUMsU0FBUyxHQUFHLHdCQUFZRixJQUFaLEVBQWtCRyxLQUFsQixDQUF3QixDQUF4QixFQUEyQkgsSUFBM0IsYUFBMkJBLElBQTNCLHVCQUEyQkEsSUFBSSxDQUFFSSxNQUFqQyxDQUFsQjtBQUVBLFFBQUlDLElBQUo7O0FBRUEsUUFBSTtBQUNGQSxNQUFBQSxJQUFJLEdBQUcscUJBQVVQLEdBQVYsRUFBZUksU0FBZixLQUE2QkwsR0FBRyxDQUFDSSxHQUFELENBQXZDO0FBQ0QsS0FGRCxDQUVFLE9BQU9LLENBQVAsRUFBVTtBQUNWQyxNQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBY0YsQ0FBZCxFQUFpQlYsRUFBakIsRUFBcUJFLEdBQXJCO0FB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ZixDQUFoQjtBQUVBLFFBQUlrQixHQUFHLEtBQUssU0FBWixFQUF1QixPQUFPLENBQUN6QixHQUFELEVBQU11QixHQUFOLENBQVA7QUFFdkIsUUFBTUcsRUFBRSxHQUFHRCxHQUFHLEtBQUssTUFBUixHQUFpQjNCLFlBQWpCLEdBQWdDa0IsWUFBM0M7QUFFQSxXQUFPLENBQUNoQixHQUFELCtCQUFVdUIsR0FBVixJQUFlRyxFQUFFLENBQUMzQixFQUFELENBQWpCLEdBQVA7QUFDRCxHQXRCRCxDQXNCRSxPQUFPVSxDQUFQLEVBQVU7QUFDVkMsSUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWNGLENBQWQsRUFBaUJWLEVBQWpCLEVBQXFCLGlCQUFLQyxHQUFMLENBQXJCO0FBRUEsV0FBTyxDQUFDQSxHQUFELEVBQU11QixHQUFOLENBQVA7QUFDRDtBQUNGLENBNUJEOztlQThCZUQsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEF1dG9tZXJnZSBmcm9tICdhdXRvbWVyZ2UnXG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSAnc2xhdGUnXG5cbmltcG9ydCB7IHRvU2xhdGVQYXRoLCB0b0pTIH0gZnJvbSAnLi4vdXRpbHMnXG5pbXBvcnQgeyBnZXRUYXJnZXQgfSBmcm9tICcuLi9wYXRoJ1xuXG5jb25zdCByZW1vdmVUZXh0T3AgPSAob3A6IEF1dG9tZXJnZS5EaWZmKSA9PiAobWFwOiBhbnksIGRvYzogRWxlbWVudCkgPT4ge1xuICBjb25zdCB7IGluZGV4LCBwYXRoLCBvYmogfSA9IG9wXG5cbiAgY29uc3Qgc2xhdGVQYXRoID0gdG9TbGF0ZVBhdGgocGF0aCkuc2xpY2UoMCwgcGF0aD8ubGVuZ3RoKVxuXG4gIGxldCBub2RlXG5cbiAgdHJ5IHtcbiAgICBub2RlID0gZ2V0VGFyZ2V0KGRvYywgc2xhdGVQYXRoKSB8fCBtYXBbb2JqXVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlLCBvcCwgZG9jKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVyblxuXG4gIGNvbnN0IHRleHQgPSBub2RlPy50ZXh0W2luZGV4XSB8fCAnKidcblxuICBpZiAobm9kZSkge1xuICAgIG5vZGUudGV4dCA9IG5vZGUudGV4dD8uc2xpY2UoMCwgaW5kZXgpICsgbm9kZS50ZXh0Py5zbGljZShpbmRleCArIDEpXG4gIH1cblxuICByZXR1cm4ge1xuICAgIHR5cGU6ICdyZW1vdmVfdGV4dCcsXG4gICAgcGF0aDogc2xhdGVQYXRoLFxuICAgIG9mZnNldDogaW5kZXgsXG4gICAgdGV4dCxcbiAgICBtYXJrczogW11cbiAgfVxufVxuXG5jb25zdCByZW1vdmVOb2RlT3AgPSAoeyBpbmRleCwgb2JqLCBwYXRoIH06IEF1dG9tZXJnZS5EaWZmKSA9PiAoXG4gIG1hcDogYW55LFxuICBkb2M6IEVsZW1lbnRcbikgPT4ge1xuICBjb25zdCBzbGF0ZVBhdGggPSB0b1NsYXRlUGF0aChwYXRoKVxuXG4gIGNvbnN0IHBhcmVudCA9IGdldFRhcmdldChkb2MsIHNsYXRlUGF0aClcbiAgY29uc3QgdGFyZ2V0ID0gcGFyZW50Py5jaGlsZHJlbltpbmRleCBhcyBudW1iZXJdIHx8IHsgY2hpbGRyZW46IFtdIH1cblxuICBpZiAoIW1hcC5oYXNPd25Qcm9wZXJ0eShvYmopKSB7XG4gICAgbWFwW29ial0gPSB0YXJnZXRcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHlwZTogJ3JlbW92ZV9ub2RlJyxcbiAgICBwYXRoOiBzbGF0ZVBhdGgubGVuZ3RoID8gc2xhdGVQYXRoLmNvbmNhdChpbmRleCkgOiBbaW5kZXhdLFxuICAgIG5vZGU6IHRhcmdldFxuICB9XG59XG5cbmNvbnN0IG9wUmVtb3ZlID0gKG9wOiBBdXRvbWVyZ2UuRGlmZiwgW21hcCwgb3BzXTogYW55KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBpbmRleCwgcGF0aCwgb2JqLCB0eXBlIH0gPSBvcFxuXG4gICAgaWYgKFxuICAgICAgbWFwLmhhc093blByb3BlcnR5KG9iaikgJiZcbiAgICAgIHR5cGVvZiBtYXBbb2JqXSAhPT0gJ3N0cmluZycgJiZcbiAgICAgIHR5cGUgIT09ICd0ZXh0J1xuICAgICkge1xuICAgICAgbWFwW29ial0uc3BsaWNlKGluZGV4LCAxKVxuXG4gICAgICByZXR1cm4gW21hcCwgb3BzXVxuICAgIH1cblxuICAgIGlmICghcGF0aCkgcmV0dXJuIFttYXAsIG9wc11cblxuICAgIGNvbnN0IGtleSA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXVxuXG4gICAgaWYgKGtleSA9PT0gJ2N1cnNvcnMnKSByZXR1cm4gW21hcCwgb3BzXVxuXG4gICAgY29uc3QgZm4gPSBrZXkgPT09ICd0ZXh0JyA/IHJlbW92ZVRleHRPcCA6IHJlbW92ZU5vZGVPcFxuXG4gICAgcmV0dXJuIFttYXAsIFsuLi5vcHMsIGZuKG9wKV1dXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUsIG9wLCB0b0pTKG1hcCkpXG5cbiAgICByZXR1cm4gW21hcCwgb3BzXVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9wUmVtb3ZlXG4iXX0=