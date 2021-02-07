"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = require("../../path");

var _utils = require("../../utils");

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

  var inject = _objectSpread(_objectSpread({}, (0, _utils.cloneNode)(target)), op.properties);

  if (target.text) {
    target.text.length > op.position && target.text.deleteAt(op.position, target.text.length - op.position);
    op.position && inject.text.deleteAt(0, op.position);
  } else {
    target.children.splice(op.position, target.children.length - op.position);
    op.position && inject.children.splice(0, op.position);
  }

  (0, _path.getChildren)(parent).insertAt(index + 1, inject);
  return doc;
};

var _default = splitNode;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHBseS9ub2RlL3NwbGl0Tm9kZS50cyJdLCJuYW1lcyI6WyJzcGxpdE5vZGUiLCJkb2MiLCJvcCIsInBhdGgiLCJwYXJlbnQiLCJpbmRleCIsInRhcmdldCIsImluamVjdCIsInByb3BlcnRpZXMiLCJ0ZXh0IiwibGVuZ3RoIiwicG9zaXRpb24iLCJkZWxldGVBdCIsImNoaWxkcmVuIiwic3BsaWNlIiwiaW5zZXJ0QXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFHQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTLEdBQUcsU0FBWkEsU0FBWSxDQUFDQyxHQUFELEVBQWlCQyxFQUFqQixFQUF1RDtBQUFBLG1CQUNoQyxxQkFBVUQsR0FBVixFQUFlQyxFQUFFLENBQUNDLElBQWxCLENBRGdDO0FBQUE7QUFBQSxNQUNoRUMsTUFEZ0U7QUFBQSxNQUN4REMsS0FEd0Q7O0FBR3ZFLE1BQU1DLE1BQU0sR0FBRyx1QkFBWUYsTUFBWixFQUFvQkMsS0FBcEIsQ0FBZjs7QUFDQSxNQUFNRSxNQUFNLG1DQUNQLHNCQUFVRCxNQUFWLENBRE8sR0FFUEosRUFBRSxDQUFDTSxVQUZJLENBQVo7O0FBS0EsTUFBSUYsTUFBTSxDQUFDRyxJQUFYLEVBQWlCO0FBQ2ZILElBQUFBLE1BQU0sQ0FBQ0csSUFBUCxDQUFZQyxNQUFaLEdBQXFCUixFQUFFLENBQUNTLFFBQXhCLElBQ0VMLE1BQU0sQ0FBQ0csSUFBUCxDQUFZRyxRQUFaLENBQXFCVixFQUFFLENBQUNTLFFBQXhCLEVBQWtDTCxNQUFNLENBQUNHLElBQVAsQ0FBWUMsTUFBWixHQUFxQlIsRUFBRSxDQUFDUyxRQUExRCxDQURGO0FBRUFULElBQUFBLEVBQUUsQ0FBQ1MsUUFBSCxJQUFlSixNQUFNLENBQUNFLElBQVAsQ0FBWUcsUUFBWixDQUFxQixDQUFyQixFQUF3QlYsRUFBRSxDQUFDUyxRQUEzQixDQUFmO0FBQ0QsR0FKRCxNQUlPO0FBQ0xMLElBQUFBLE1BQU0sQ0FBQ08sUUFBUCxDQUFnQkMsTUFBaEIsQ0FBdUJaLEVBQUUsQ0FBQ1MsUUFBMUIsRUFBb0NMLE1BQU0sQ0FBQ08sUUFBUCxDQUFnQkgsTUFBaEIsR0FBeUJSLEVBQUUsQ0FBQ1MsUUFBaEU7QUFDQVQsSUFBQUEsRUFBRSxDQUFDUyxRQUFILElBQWVKLE1BQU0sQ0FBQ00sUUFBUCxDQUFnQkMsTUFBaEIsQ0FBdUIsQ0FBdkIsRUFBMEJaLEVBQUUsQ0FBQ1MsUUFBN0IsQ0FBZjtBQUNEOztBQUVELHlCQUFZUCxNQUFaLEVBQW9CVyxRQUFwQixDQUE2QlYsS0FBSyxHQUFHLENBQXJDLEVBQXdDRSxNQUF4QztBQUVBLFNBQU9OLEdBQVA7QUFDRCxDQXJCRDs7ZUF1QmVELFMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTcGxpdE5vZGVPcGVyYXRpb24gfSBmcm9tICdzbGF0ZSdcblxuaW1wb3J0IHsgU3luY1ZhbHVlIH0gZnJvbSAnLi4vLi4vbW9kZWwnXG5pbXBvcnQgeyBnZXRQYXJlbnQsIGdldENoaWxkcmVuIH0gZnJvbSAnLi4vLi4vcGF0aCdcbmltcG9ydCB7IGNsb25lTm9kZSB9IGZyb20gJy4uLy4uL3V0aWxzJ1xuXG5jb25zdCBzcGxpdE5vZGUgPSAoZG9jOiBTeW5jVmFsdWUsIG9wOiBTcGxpdE5vZGVPcGVyYXRpb24pOiBTeW5jVmFsdWUgPT4ge1xuICBjb25zdCBbcGFyZW50LCBpbmRleF06IFthbnksIG51bWJlcl0gPSBnZXRQYXJlbnQoZG9jLCBvcC5wYXRoKVxuXG4gIGNvbnN0IHRhcmdldCA9IGdldENoaWxkcmVuKHBhcmVudClbaW5kZXhdXG4gIGNvbnN0IGluamVjdCA9IHtcbiAgICAuLi5jbG9uZU5vZGUodGFyZ2V0KSxcbiAgICAuLi5vcC5wcm9wZXJ0aWVzXG4gIH1cblxuICBpZiAodGFyZ2V0LnRleHQpIHtcbiAgICB0YXJnZXQudGV4dC5sZW5ndGggPiBvcC5wb3NpdGlvbiAmJlxuICAgICAgdGFyZ2V0LnRleHQuZGVsZXRlQXQob3AucG9zaXRpb24sIHRhcmdldC50ZXh0Lmxlbmd0aCAtIG9wLnBvc2l0aW9uKVxuICAgIG9wLnBvc2l0aW9uICYmIGluamVjdC50ZXh0LmRlbGV0ZUF0KDAsIG9wLnBvc2l0aW9uKVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5jaGlsZHJlbi5zcGxpY2Uob3AucG9zaXRpb24sIHRhcmdldC5jaGlsZHJlbi5sZW5ndGggLSBvcC5wb3NpdGlvbilcbiAgICBvcC5wb3NpdGlvbiAmJiBpbmplY3QuY2hpbGRyZW4uc3BsaWNlKDAsIG9wLnBvc2l0aW9uKVxuICB9XG5cbiAgZ2V0Q2hpbGRyZW4ocGFyZW50KS5pbnNlcnRBdChpbmRleCArIDEsIGluamVjdClcblxuICByZXR1cm4gZG9jXG59XG5cbmV4cG9ydCBkZWZhdWx0IHNwbGl0Tm9kZVxuIl19