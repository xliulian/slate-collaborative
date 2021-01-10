"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("../../utils");

var _path = require("../../path");

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

var moveNode = function moveNode(doc, op) {
  var _getChildren;

  var _getParent = (0, _path.getParent)(doc, op.path),
      _getParent2 = _slicedToArray(_getParent, 2),
      from = _getParent2[0],
      fromIndex = _getParent2[1];

  var _getParent3 = (0, _path.getParent)(doc, op.newPath),
      _getParent4 = _slicedToArray(_getParent3, 2),
      to = _getParent4[0],
      toIndex = _getParent4[1];

  if (from.text || to.text) {
    throw new TypeError("Can't move node as child of a text node");
  }

  (_getChildren = (0, _path.getChildren)(to)).splice.apply(_getChildren, [toIndex, 0].concat(_toConsumableArray((0, _path.getChildren)(from).splice(fromIndex, 1).map(_utils.cloneNode))));

  return doc;
};

var _default = moveNode;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHBseS9ub2RlL21vdmVOb2RlLnRzIl0sIm5hbWVzIjpbIm1vdmVOb2RlIiwiZG9jIiwib3AiLCJwYXRoIiwiZnJvbSIsImZyb21JbmRleCIsIm5ld1BhdGgiLCJ0byIsInRvSW5kZXgiLCJ0ZXh0IiwiVHlwZUVycm9yIiwic3BsaWNlIiwibWFwIiwiY2xvbmVOb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxRQUFRLEdBQUcsU0FBWEEsUUFBVyxDQUFDQyxHQUFELEVBQWlCQyxFQUFqQixFQUFzRDtBQUFBOztBQUFBLG1CQUMzQyxxQkFBVUQsR0FBVixFQUFlQyxFQUFFLENBQUNDLElBQWxCLENBRDJDO0FBQUE7QUFBQSxNQUM5REMsSUFEOEQ7QUFBQSxNQUN4REMsU0FEd0Q7O0FBQUEsb0JBRS9DLHFCQUFVSixHQUFWLEVBQWVDLEVBQUUsQ0FBQ0ksT0FBbEIsQ0FGK0M7QUFBQTtBQUFBLE1BRTlEQyxFQUY4RDtBQUFBLE1BRTFEQyxPQUYwRDs7QUFJckUsTUFBSUosSUFBSSxDQUFDSyxJQUFMLElBQWFGLEVBQUUsQ0FBQ0UsSUFBcEIsRUFBMEI7QUFDeEIsVUFBTSxJQUFJQyxTQUFKLENBQWMseUNBQWQsQ0FBTjtBQUNEOztBQUVELHlDQUFZSCxFQUFaLEdBQWdCSSxNQUFoQixzQkFDRUgsT0FERixFQUVFLENBRkYsNEJBR0ssdUJBQVlKLElBQVosRUFDQU8sTUFEQSxDQUNPTixTQURQLEVBQ2tCLENBRGxCLEVBRUFPLEdBRkEsQ0FFSUMsZ0JBRkosQ0FITDs7QUFRQSxTQUFPWixHQUFQO0FBQ0QsQ0FqQkQ7O2VBbUJlRCxRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW92ZU5vZGVPcGVyYXRpb24gfSBmcm9tICdzbGF0ZSdcblxuaW1wb3J0IHsgY2xvbmVOb2RlIH0gZnJvbSAnLi4vLi4vdXRpbHMnXG5pbXBvcnQgeyBTeW5jVmFsdWUgfSBmcm9tICcuLi8uLi9tb2RlbCdcbmltcG9ydCB7IGdldFBhcmVudCwgZ2V0Q2hpbGRyZW4gfSBmcm9tICcuLi8uLi9wYXRoJ1xuXG5jb25zdCBtb3ZlTm9kZSA9IChkb2M6IFN5bmNWYWx1ZSwgb3A6IE1vdmVOb2RlT3BlcmF0aW9uKTogU3luY1ZhbHVlID0+IHtcbiAgY29uc3QgW2Zyb20sIGZyb21JbmRleF0gPSBnZXRQYXJlbnQoZG9jLCBvcC5wYXRoKVxuICBjb25zdCBbdG8sIHRvSW5kZXhdID0gZ2V0UGFyZW50KGRvYywgb3AubmV3UGF0aClcblxuICBpZiAoZnJvbS50ZXh0IHx8IHRvLnRleHQpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2FuJ3QgbW92ZSBub2RlIGFzIGNoaWxkIG9mIGEgdGV4dCBub2RlXCIpXG4gIH1cblxuICBnZXRDaGlsZHJlbih0bykuc3BsaWNlKFxuICAgIHRvSW5kZXgsXG4gICAgMCxcbiAgICAuLi5nZXRDaGlsZHJlbihmcm9tKVxuICAgICAgLnNwbGljZShmcm9tSW5kZXgsIDEpXG4gICAgICAubWFwKGNsb25lTm9kZSlcbiAgKVxuXG4gIHJldHVybiBkb2Ncbn1cblxuZXhwb3J0IGRlZmF1bHQgbW92ZU5vZGVcbiJdfQ==