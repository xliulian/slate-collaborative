"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.removeText = exports.insertText = void 0;

var _path = require("../path");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var insertText = function insertText(doc, op) {
  var _node$text;

  var node = (0, _path.getTarget)(doc, op.path);
  var offset = Math.min(node.text.length, op.offset);

  (_node$text = node.text).insertAt.apply(_node$text, [offset].concat(_toConsumableArray(op.text.split(''))));

  return doc;
};

exports.insertText = insertText;

var removeText = function removeText(doc, op) {
  var node = (0, _path.getTarget)(doc, op.path);
  var offset = Math.min(node.text.length, op.offset);
  node.text.deleteAt(offset, op.text.length);
  return doc;
};

exports.removeText = removeText;
var _default = {
  insert_text: insertText,
  remove_text: removeText
};
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHBseS90ZXh0LnRzIl0sIm5hbWVzIjpbImluc2VydFRleHQiLCJkb2MiLCJvcCIsIm5vZGUiLCJwYXRoIiwib2Zmc2V0IiwiTWF0aCIsIm1pbiIsInRleHQiLCJsZW5ndGgiLCJpbnNlcnRBdCIsInNwbGl0IiwicmVtb3ZlVGV4dCIsImRlbGV0ZUF0IiwiaW5zZXJ0X3RleHQiLCJyZW1vdmVfdGV4dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7OztBQUdPLElBQU1BLFVBQVUsR0FBRyxTQUFiQSxVQUFhLENBQ3hCQyxHQUR3QixFQUV4QkMsRUFGd0IsRUFHVjtBQUFBOztBQUNkLE1BQU1DLElBQUksR0FBRyxxQkFBVUYsR0FBVixFQUFlQyxFQUFFLENBQUNFLElBQWxCLENBQWI7QUFFQSxNQUFNQyxNQUFNLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTSixJQUFJLENBQUNLLElBQUwsQ0FBVUMsTUFBbkIsRUFBMkJQLEVBQUUsQ0FBQ0csTUFBOUIsQ0FBZjs7QUFFQSxnQkFBQUYsSUFBSSxDQUFDSyxJQUFMLEVBQVVFLFFBQVYsb0JBQW1CTCxNQUFuQiw0QkFBOEJILEVBQUUsQ0FBQ00sSUFBSCxDQUFRRyxLQUFSLENBQWMsRUFBZCxDQUE5Qjs7QUFFQSxTQUFPVixHQUFQO0FBQ0QsQ0FYTTs7OztBQWFBLElBQU1XLFVBQVUsR0FBRyxTQUFiQSxVQUFhLENBQ3hCWCxHQUR3QixFQUV4QkMsRUFGd0IsRUFHVjtBQUNkLE1BQU1DLElBQUksR0FBRyxxQkFBVUYsR0FBVixFQUFlQyxFQUFFLENBQUNFLElBQWxCLENBQWI7QUFFQSxNQUFNQyxNQUFNLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTSixJQUFJLENBQUNLLElBQUwsQ0FBVUMsTUFBbkIsRUFBMkJQLEVBQUUsQ0FBQ0csTUFBOUIsQ0FBZjtBQUVBRixFQUFBQSxJQUFJLENBQUNLLElBQUwsQ0FBVUssUUFBVixDQUFtQlIsTUFBbkIsRUFBMkJILEVBQUUsQ0FBQ00sSUFBSCxDQUFRQyxNQUFuQztBQUVBLFNBQU9SLEdBQVA7QUFDRCxDQVhNOzs7ZUFhUTtBQUNiYSxFQUFBQSxXQUFXLEVBQUVkLFVBREE7QUFFYmUsRUFBQUEsV0FBVyxFQUFFSDtBQUZBLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnNlcnRUZXh0T3BlcmF0aW9uLCBSZW1vdmVUZXh0T3BlcmF0aW9uIH0gZnJvbSAnc2xhdGUnXG5cbmltcG9ydCB7IGdldFRhcmdldCB9IGZyb20gJy4uL3BhdGgnXG5pbXBvcnQgeyBTeW5jVmFsdWUgfSBmcm9tICcuLi9tb2RlbCdcblxuZXhwb3J0IGNvbnN0IGluc2VydFRleHQgPSAoXG4gIGRvYzogU3luY1ZhbHVlLFxuICBvcDogSW5zZXJ0VGV4dE9wZXJhdGlvblxuKTogU3luY1ZhbHVlID0+IHtcbiAgY29uc3Qgbm9kZSA9IGdldFRhcmdldChkb2MsIG9wLnBhdGgpXG5cbiAgY29uc3Qgb2Zmc2V0ID0gTWF0aC5taW4obm9kZS50ZXh0Lmxlbmd0aCwgb3Aub2Zmc2V0KVxuXG4gIG5vZGUudGV4dC5pbnNlcnRBdChvZmZzZXQsIC4uLm9wLnRleHQuc3BsaXQoJycpKVxuXG4gIHJldHVybiBkb2Ncbn1cblxuZXhwb3J0IGNvbnN0IHJlbW92ZVRleHQgPSAoXG4gIGRvYzogU3luY1ZhbHVlLFxuICBvcDogUmVtb3ZlVGV4dE9wZXJhdGlvblxuKTogU3luY1ZhbHVlID0+IHtcbiAgY29uc3Qgbm9kZSA9IGdldFRhcmdldChkb2MsIG9wLnBhdGgpXG5cbiAgY29uc3Qgb2Zmc2V0ID0gTWF0aC5taW4obm9kZS50ZXh0Lmxlbmd0aCwgb3Aub2Zmc2V0KVxuXG4gIG5vZGUudGV4dC5kZWxldGVBdChvZmZzZXQsIG9wLnRleHQubGVuZ3RoKVxuXG4gIHJldHVybiBkb2Ncbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBpbnNlcnRfdGV4dDogaW5zZXJ0VGV4dCxcbiAgcmVtb3ZlX3RleHQ6IHJlbW92ZVRleHRcbn1cbiJdfQ==