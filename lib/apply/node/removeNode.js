"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.removeNode = void 0;

var _path = require("../../path");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var removeNode = function removeNode(doc, op) {
  var _getParent = (0, _path.getParent)(doc, op.path),
      _getParent2 = _slicedToArray(_getParent, 2),
      parent = _getParent2[0],
      index = _getParent2[1];

  if (parent.text) {
    throw new TypeError("Can't remove node from text node");
  }

  (0, _path.getChildren)(parent).splice(index, 1);
  return doc;
};

exports.removeNode = removeNode;
var _default = removeNode;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHBseS9ub2RlL3JlbW92ZU5vZGUudHMiXSwibmFtZXMiOlsicmVtb3ZlTm9kZSIsImRvYyIsIm9wIiwicGF0aCIsInBhcmVudCIsImluZGV4IiwidGV4dCIsIlR5cGVFcnJvciIsInNwbGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOzs7Ozs7Ozs7Ozs7OztBQUVPLElBQU1BLFVBQVUsR0FBRyxTQUFiQSxVQUFhLENBQ3hCQyxHQUR3QixFQUV4QkMsRUFGd0IsRUFHVjtBQUFBLG1CQUNVLHFCQUFVRCxHQUFWLEVBQWVDLEVBQUUsQ0FBQ0MsSUFBbEIsQ0FEVjtBQUFBO0FBQUEsTUFDUEMsTUFETztBQUFBLE1BQ0NDLEtBREQ7O0FBR2QsTUFBSUQsTUFBTSxDQUFDRSxJQUFYLEVBQWlCO0FBQ2YsVUFBTSxJQUFJQyxTQUFKLENBQWMsa0NBQWQsQ0FBTjtBQUNEOztBQUVELHlCQUFZSCxNQUFaLEVBQW9CSSxNQUFwQixDQUEyQkgsS0FBM0IsRUFBa0MsQ0FBbEM7QUFFQSxTQUFPSixHQUFQO0FBQ0QsQ0FiTTs7O2VBZVFELFUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZW1vdmVOb2RlT3BlcmF0aW9uIH0gZnJvbSAnc2xhdGUnXG5cbmltcG9ydCB7IFN5bmNWYWx1ZSB9IGZyb20gJy4uLy4uL21vZGVsJ1xuaW1wb3J0IHsgZ2V0UGFyZW50LCBnZXRDaGlsZHJlbiB9IGZyb20gJy4uLy4uL3BhdGgnXG5cbmV4cG9ydCBjb25zdCByZW1vdmVOb2RlID0gKFxuICBkb2M6IFN5bmNWYWx1ZSxcbiAgb3A6IFJlbW92ZU5vZGVPcGVyYXRpb25cbik6IFN5bmNWYWx1ZSA9PiB7XG4gIGNvbnN0IFtwYXJlbnQsIGluZGV4XSA9IGdldFBhcmVudChkb2MsIG9wLnBhdGgpXG5cbiAgaWYgKHBhcmVudC50ZXh0KSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbid0IHJlbW92ZSBub2RlIGZyb20gdGV4dCBub2RlXCIpXG4gIH1cblxuICBnZXRDaGlsZHJlbihwYXJlbnQpLnNwbGljZShpbmRleCwgMSlcblxuICByZXR1cm4gZG9jXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJlbW92ZU5vZGVcbiJdfQ==