"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = require("../../path");

var _utils = require("../../utils");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var insertNode = function insertNode(doc, op) {
  var _getParent = (0, _path.getParent)(doc, op.path),
      _getParent2 = _slicedToArray(_getParent, 2),
      parent = _getParent2[0],
      index = _getParent2[1];

  if (parent.text) {
    throw new TypeError("Can't insert node into text node");
  }

  (0, _path.getChildren)(parent).splice(index, 0, (0, _utils.toSync)(op.node));
  return doc;
};

var _default = insertNode;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHBseS9ub2RlL2luc2VydE5vZGUudHMiXSwibmFtZXMiOlsiaW5zZXJ0Tm9kZSIsImRvYyIsIm9wIiwicGF0aCIsInBhcmVudCIsImluZGV4IiwidGV4dCIsIlR5cGVFcnJvciIsInNwbGljZSIsIm5vZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFHQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxVQUFVLEdBQUcsU0FBYkEsVUFBYSxDQUFDQyxHQUFELEVBQWlCQyxFQUFqQixFQUF3RDtBQUFBLG1CQUNqRCxxQkFBVUQsR0FBVixFQUFlQyxFQUFFLENBQUNDLElBQWxCLENBRGlEO0FBQUE7QUFBQSxNQUNsRUMsTUFEa0U7QUFBQSxNQUMxREMsS0FEMEQ7O0FBR3pFLE1BQUlELE1BQU0sQ0FBQ0UsSUFBWCxFQUFpQjtBQUNmLFVBQU0sSUFBSUMsU0FBSixDQUFjLGtDQUFkLENBQU47QUFDRDs7QUFFRCx5QkFBWUgsTUFBWixFQUFvQkksTUFBcEIsQ0FBMkJILEtBQTNCLEVBQWtDLENBQWxDLEVBQXFDLG1CQUFPSCxFQUFFLENBQUNPLElBQVYsQ0FBckM7QUFFQSxTQUFPUixHQUFQO0FBQ0QsQ0FWRDs7ZUFZZUQsVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluc2VydE5vZGVPcGVyYXRpb24gfSBmcm9tICdzbGF0ZSdcblxuaW1wb3J0IHsgU3luY1ZhbHVlIH0gZnJvbSAnLi4vLi4vbW9kZWwnXG5pbXBvcnQgeyBnZXRQYXJlbnQsIGdldENoaWxkcmVuIH0gZnJvbSAnLi4vLi4vcGF0aCdcbmltcG9ydCB7IHRvU3luYyB9IGZyb20gJy4uLy4uL3V0aWxzJ1xuXG5jb25zdCBpbnNlcnROb2RlID0gKGRvYzogU3luY1ZhbHVlLCBvcDogSW5zZXJ0Tm9kZU9wZXJhdGlvbik6IFN5bmNWYWx1ZSA9PiB7XG4gIGNvbnN0IFtwYXJlbnQsIGluZGV4XSA9IGdldFBhcmVudChkb2MsIG9wLnBhdGgpXG5cbiAgaWYgKHBhcmVudC50ZXh0KSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbid0IGluc2VydCBub2RlIGludG8gdGV4dCBub2RlXCIpXG4gIH1cblxuICBnZXRDaGlsZHJlbihwYXJlbnQpLnNwbGljZShpbmRleCwgMCwgdG9TeW5jKG9wLm5vZGUpKVxuXG4gIHJldHVybiBkb2Ncbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5zZXJ0Tm9kZVxuIl19