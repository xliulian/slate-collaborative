"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _automerge = _interopRequireDefault(require("automerge"));

var _path = require("../../path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var splitNode = function splitNode(doc, op) {
  var _getParent = (0, _path.getParent)(doc, op.path),
      _getParent2 = _slicedToArray(_getParent, 2),
      parent = _getParent2[0],
      index = _getParent2[1];

  var target = (0, _path.getChildren)(parent)[index];

  var inject = _objectSpread({}, op.properties);

  if (target.text) {
    inject.text = new _automerge["default"].Text(target.text.toString().slice(op.position));
    target.text.length > op.position && target.text.deleteAt(op.position, target.text.length - op.position);
  } else {
    inject.children = target.children.splice(op.position, target.children.length - op.position);
  }

  (0, _path.getChildren)(parent).insertAt(index + 1, inject);
  return doc;
};

var _default = splitNode;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHBseS9ub2RlL3NwbGl0Tm9kZS50cyJdLCJuYW1lcyI6WyJzcGxpdE5vZGUiLCJkb2MiLCJvcCIsInBhdGgiLCJwYXJlbnQiLCJpbmRleCIsInRhcmdldCIsImluamVjdCIsInByb3BlcnRpZXMiLCJ0ZXh0IiwiQXV0b21lcmdlIiwiVGV4dCIsInRvU3RyaW5nIiwic2xpY2UiLCJwb3NpdGlvbiIsImxlbmd0aCIsImRlbGV0ZUF0IiwiY2hpbGRyZW4iLCJzcGxpY2UiLCJpbnNlcnRBdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxHQUFHLFNBQVpBLFNBQVksQ0FBQ0MsR0FBRCxFQUFpQkMsRUFBakIsRUFBdUQ7QUFBQSxtQkFDaEMscUJBQVVELEdBQVYsRUFBZUMsRUFBRSxDQUFDQyxJQUFsQixDQURnQztBQUFBO0FBQUEsTUFDaEVDLE1BRGdFO0FBQUEsTUFDeERDLEtBRHdEOztBQUd2RSxNQUFNQyxNQUFNLEdBQUcsdUJBQVlGLE1BQVosRUFBb0JDLEtBQXBCLENBQWY7O0FBQ0EsTUFBTUUsTUFBTSxxQkFDUEwsRUFBRSxDQUFDTSxVQURJLENBQVo7O0FBSUEsTUFBSUYsTUFBTSxDQUFDRyxJQUFYLEVBQWlCO0FBQ2ZGLElBQUFBLE1BQU0sQ0FBQ0UsSUFBUCxHQUFjLElBQUlDLHNCQUFVQyxJQUFkLENBQW1CTCxNQUFNLENBQUNHLElBQVAsQ0FBWUcsUUFBWixHQUF1QkMsS0FBdkIsQ0FBNkJYLEVBQUUsQ0FBQ1ksUUFBaEMsQ0FBbkIsQ0FBZDtBQUNBUixJQUFBQSxNQUFNLENBQUNHLElBQVAsQ0FBWU0sTUFBWixHQUFxQmIsRUFBRSxDQUFDWSxRQUF4QixJQUNFUixNQUFNLENBQUNHLElBQVAsQ0FBWU8sUUFBWixDQUFxQmQsRUFBRSxDQUFDWSxRQUF4QixFQUFrQ1IsTUFBTSxDQUFDRyxJQUFQLENBQVlNLE1BQVosR0FBcUJiLEVBQUUsQ0FBQ1ksUUFBMUQsQ0FERjtBQUVELEdBSkQsTUFJTztBQUNMUCxJQUFBQSxNQUFNLENBQUNVLFFBQVAsR0FBa0JYLE1BQU0sQ0FBQ1csUUFBUCxDQUFnQkMsTUFBaEIsQ0FDaEJoQixFQUFFLENBQUNZLFFBRGEsRUFFaEJSLE1BQU0sQ0FBQ1csUUFBUCxDQUFnQkYsTUFBaEIsR0FBeUJiLEVBQUUsQ0FBQ1ksUUFGWixDQUFsQjtBQUlEOztBQUVELHlCQUFZVixNQUFaLEVBQW9CZSxRQUFwQixDQUE2QmQsS0FBSyxHQUFHLENBQXJDLEVBQXdDRSxNQUF4QztBQUVBLFNBQU9OLEdBQVA7QUFDRCxDQXRCRDs7ZUF3QmVELFMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXV0b21lcmdlIGZyb20gJ2F1dG9tZXJnZSdcbmltcG9ydCB7IFNwbGl0Tm9kZU9wZXJhdGlvbiB9IGZyb20gJ3NsYXRlJ1xuXG5pbXBvcnQgeyBTeW5jVmFsdWUgfSBmcm9tICcuLi8uLi9tb2RlbCdcbmltcG9ydCB7IGdldFBhcmVudCwgZ2V0Q2hpbGRyZW4gfSBmcm9tICcuLi8uLi9wYXRoJ1xuXG5jb25zdCBzcGxpdE5vZGUgPSAoZG9jOiBTeW5jVmFsdWUsIG9wOiBTcGxpdE5vZGVPcGVyYXRpb24pOiBTeW5jVmFsdWUgPT4ge1xuICBjb25zdCBbcGFyZW50LCBpbmRleF06IFthbnksIG51bWJlcl0gPSBnZXRQYXJlbnQoZG9jLCBvcC5wYXRoKVxuXG4gIGNvbnN0IHRhcmdldCA9IGdldENoaWxkcmVuKHBhcmVudClbaW5kZXhdXG4gIGNvbnN0IGluamVjdCA9IHtcbiAgICAuLi5vcC5wcm9wZXJ0aWVzXG4gIH1cblxuICBpZiAodGFyZ2V0LnRleHQpIHtcbiAgICBpbmplY3QudGV4dCA9IG5ldyBBdXRvbWVyZ2UuVGV4dCh0YXJnZXQudGV4dC50b1N0cmluZygpLnNsaWNlKG9wLnBvc2l0aW9uKSlcbiAgICB0YXJnZXQudGV4dC5sZW5ndGggPiBvcC5wb3NpdGlvbiAmJlxuICAgICAgdGFyZ2V0LnRleHQuZGVsZXRlQXQob3AucG9zaXRpb24sIHRhcmdldC50ZXh0Lmxlbmd0aCAtIG9wLnBvc2l0aW9uKVxuICB9IGVsc2Uge1xuICAgIGluamVjdC5jaGlsZHJlbiA9IHRhcmdldC5jaGlsZHJlbi5zcGxpY2UoXG4gICAgICBvcC5wb3NpdGlvbixcbiAgICAgIHRhcmdldC5jaGlsZHJlbi5sZW5ndGggLSBvcC5wb3NpdGlvblxuICAgIClcbiAgfVxuXG4gIGdldENoaWxkcmVuKHBhcmVudCkuaW5zZXJ0QXQoaW5kZXggKyAxLCBpbmplY3QpXG5cbiAgcmV0dXJuIGRvY1xufVxuXG5leHBvcnQgZGVmYXVsdCBzcGxpdE5vZGVcbiJdfQ==