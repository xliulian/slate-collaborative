"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var createByType = function createByType(type) {
  return type === 'map' ? {} : type === 'list' ? [] : '';
};

var opCreate = function opCreate(_ref, _ref2) {
  var obj = _ref.obj,
      type = _ref.type;

  var _ref3 = _slicedToArray(_ref2, 2),
      map = _ref3[0],
      ops = _ref3[1];

  map[obj] = createByType(type);
  return [map, ops];
};

var _default = opCreate;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L2NyZWF0ZS50cyJdLCJuYW1lcyI6WyJjcmVhdGVCeVR5cGUiLCJ0eXBlIiwib3BDcmVhdGUiLCJvYmoiLCJtYXAiLCJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFDQyxJQUFEO0FBQUEsU0FDbkJBLElBQUksS0FBSyxLQUFULEdBQWlCLEVBQWpCLEdBQXNCQSxJQUFJLEtBQUssTUFBVCxHQUFrQixFQUFsQixHQUF1QixFQUQxQjtBQUFBLENBQXJCOztBQUdBLElBQU1DLFFBQVEsR0FBRyxTQUFYQSxRQUFXLGNBQW9EO0FBQUEsTUFBakRDLEdBQWlELFFBQWpEQSxHQUFpRDtBQUFBLE1BQTVDRixJQUE0QyxRQUE1Q0EsSUFBNEM7O0FBQUE7QUFBQSxNQUFuQkcsR0FBbUI7QUFBQSxNQUFkQyxHQUFjOztBQUNuRUQsRUFBQUEsR0FBRyxDQUFDRCxHQUFELENBQUgsR0FBV0gsWUFBWSxDQUFDQyxJQUFELENBQXZCO0FBRUEsU0FBTyxDQUFDRyxHQUFELEVBQU1DLEdBQU4sQ0FBUDtBQUNELENBSkQ7O2VBTWVILFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBBdXRvbWVyZ2UgZnJvbSAnYXV0b21lcmdlJ1xuXG5jb25zdCBjcmVhdGVCeVR5cGUgPSAodHlwZTogQXV0b21lcmdlLkNvbGxlY3Rpb25UeXBlKSA9PlxuICB0eXBlID09PSAnbWFwJyA/IHt9IDogdHlwZSA9PT0gJ2xpc3QnID8gW10gOiAnJ1xuXG5jb25zdCBvcENyZWF0ZSA9ICh7IG9iaiwgdHlwZSB9OiBBdXRvbWVyZ2UuRGlmZiwgW21hcCwgb3BzXTogYW55KSA9PiB7XG4gIG1hcFtvYmpdID0gY3JlYXRlQnlUeXBlKHR5cGUpXG5cbiAgcmV0dXJuIFttYXAsIG9wc11cbn1cblxuZXhwb3J0IGRlZmF1bHQgb3BDcmVhdGVcbiJdfQ==