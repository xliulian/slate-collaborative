"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = require("../../path");

var _utils = require("../../utils");

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

var mergeNode = function mergeNode(doc, op) {
  var _getParent = (0, _path.getParent)(doc, op.path),
      _getParent2 = _slicedToArray(_getParent, 2),
      parent = _getParent2[0],
      index = _getParent2[1];

  var prev = parent[index - 1] || parent.children[index - 1];
  var next = parent[index] || parent.children[index];

  if (prev.text) {
    var _prev$text;

    (_prev$text = prev.text).insertAt.apply(_prev$text, [prev.text.length].concat(_toConsumableArray((0, _utils.toJS)(next.text).split(''))));
  } else {
    (0, _path.getChildren)(next).forEach(function (n) {
      return (0, _path.getChildren)(prev).push((0, _utils.cloneNode)(n));
    });
  }

  (0, _path.getChildren)(parent).deleteAt(index, 1);
  return doc;
};

var _default = mergeNode;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHBseS9ub2RlL21lcmdlTm9kZS50cyJdLCJuYW1lcyI6WyJtZXJnZU5vZGUiLCJkb2MiLCJvcCIsInBhdGgiLCJwYXJlbnQiLCJpbmRleCIsInByZXYiLCJjaGlsZHJlbiIsIm5leHQiLCJ0ZXh0IiwiaW5zZXJ0QXQiLCJsZW5ndGgiLCJzcGxpdCIsImZvckVhY2giLCJuIiwicHVzaCIsImRlbGV0ZUF0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBR0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTLEdBQUcsU0FBWkEsU0FBWSxDQUFDQyxHQUFELEVBQWlCQyxFQUFqQixFQUF1RDtBQUFBLG1CQUNoQyxxQkFBVUQsR0FBVixFQUFlQyxFQUFFLENBQUNDLElBQWxCLENBRGdDO0FBQUE7QUFBQSxNQUNoRUMsTUFEZ0U7QUFBQSxNQUN4REMsS0FEd0Q7O0FBR3ZFLE1BQU1DLElBQUksR0FBR0YsTUFBTSxDQUFDQyxLQUFLLEdBQUcsQ0FBVCxDQUFOLElBQXFCRCxNQUFNLENBQUNHLFFBQVAsQ0FBZ0JGLEtBQUssR0FBRyxDQUF4QixDQUFsQztBQUNBLE1BQU1HLElBQUksR0FBR0osTUFBTSxDQUFDQyxLQUFELENBQU4sSUFBaUJELE1BQU0sQ0FBQ0csUUFBUCxDQUFnQkYsS0FBaEIsQ0FBOUI7O0FBRUEsTUFBSUMsSUFBSSxDQUFDRyxJQUFULEVBQWU7QUFBQTs7QUFDYixrQkFBQUgsSUFBSSxDQUFDRyxJQUFMLEVBQVVDLFFBQVYsb0JBQW1CSixJQUFJLENBQUNHLElBQUwsQ0FBVUUsTUFBN0IsNEJBQXdDLGlCQUFLSCxJQUFJLENBQUNDLElBQVYsRUFBZ0JHLEtBQWhCLENBQXNCLEVBQXRCLENBQXhDO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsMkJBQVlKLElBQVosRUFBa0JLLE9BQWxCLENBQTBCLFVBQUNDLENBQUQ7QUFBQSxhQUFhLHVCQUFZUixJQUFaLEVBQWtCUyxJQUFsQixDQUF1QixzQkFBVUQsQ0FBVixDQUF2QixDQUFiO0FBQUEsS0FBMUI7QUFDRDs7QUFFRCx5QkFBWVYsTUFBWixFQUFvQlksUUFBcEIsQ0FBNkJYLEtBQTdCLEVBQW9DLENBQXBDO0FBRUEsU0FBT0osR0FBUDtBQUNELENBZkQ7O2VBaUJlRCxTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWVyZ2VOb2RlT3BlcmF0aW9uLCBOb2RlIH0gZnJvbSAnc2xhdGUnXG5cbmltcG9ydCB7IFN5bmNWYWx1ZSB9IGZyb20gJy4uLy4uL21vZGVsJ1xuaW1wb3J0IHsgZ2V0UGFyZW50LCBnZXRDaGlsZHJlbiB9IGZyb20gJy4uLy4uL3BhdGgnXG5pbXBvcnQgeyB0b0pTLCBjbG9uZU5vZGUgfSBmcm9tICcuLi8uLi91dGlscydcblxuY29uc3QgbWVyZ2VOb2RlID0gKGRvYzogU3luY1ZhbHVlLCBvcDogTWVyZ2VOb2RlT3BlcmF0aW9uKTogU3luY1ZhbHVlID0+IHtcbiAgY29uc3QgW3BhcmVudCwgaW5kZXhdOiBbYW55LCBudW1iZXJdID0gZ2V0UGFyZW50KGRvYywgb3AucGF0aClcblxuICBjb25zdCBwcmV2ID0gcGFyZW50W2luZGV4IC0gMV0gfHwgcGFyZW50LmNoaWxkcmVuW2luZGV4IC0gMV1cbiAgY29uc3QgbmV4dCA9IHBhcmVudFtpbmRleF0gfHwgcGFyZW50LmNoaWxkcmVuW2luZGV4XVxuXG4gIGlmIChwcmV2LnRleHQpIHtcbiAgICBwcmV2LnRleHQuaW5zZXJ0QXQocHJldi50ZXh0Lmxlbmd0aCwgLi4udG9KUyhuZXh0LnRleHQpLnNwbGl0KCcnKSlcbiAgfSBlbHNlIHtcbiAgICBnZXRDaGlsZHJlbihuZXh0KS5mb3JFYWNoKChuOiBOb2RlKSA9PiBnZXRDaGlsZHJlbihwcmV2KS5wdXNoKGNsb25lTm9kZShuKSkpXG4gIH1cblxuICBnZXRDaGlsZHJlbihwYXJlbnQpLmRlbGV0ZUF0KGluZGV4LCAxKVxuXG4gIHJldHVybiBkb2Ncbn1cblxuZXhwb3J0IGRlZmF1bHQgbWVyZ2VOb2RlXG4iXX0=