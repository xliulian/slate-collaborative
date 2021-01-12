"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Automerge = _interopRequireWildcard(require("automerge"));

var _utils = require("../utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var setDataOp = function setDataOp(_ref, doc) {
  var _ref$key = _ref.key,
      key = _ref$key === void 0 ? '' : _ref$key,
      obj = _ref.obj,
      path = _ref.path,
      value = _ref.value;
  return function (map) {
    var _Automerge$getObjectB;

    return {
      type: 'set_node',
      path: (0, _utils.toSlatePath)(path),
      properties: _defineProperty({}, key, (_Automerge$getObjectB = Automerge.getObjectById(doc, obj)) === null || _Automerge$getObjectB === void 0 ? void 0 : _Automerge$getObjectB[key]),
      newProperties: _defineProperty({}, key, value)
    };
  };
};

var opSet = function opSet(op, _ref2, doc) {
  var _ref3 = _slicedToArray(_ref2, 2),
      map = _ref3[0],
      ops = _ref3[1];

  var link = op.link,
      value = op.value,
      path = op.path,
      obj = op.obj,
      key = op.key;

  try {
    if (path && path[0] !== 'cursors') {
      ops.push(setDataOp(op, doc));
    } else if (map[obj]) {
      map[obj][key] = link ? map[value] : value;
    }

    return [map, ops];
  } catch (e) {
    console.error(e, op, (0, _utils.toJS)(map));
    return [map, ops];
  }
};

var _default = opSet;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L3NldC50cyJdLCJuYW1lcyI6WyJzZXREYXRhT3AiLCJkb2MiLCJrZXkiLCJvYmoiLCJwYXRoIiwidmFsdWUiLCJtYXAiLCJ0eXBlIiwicHJvcGVydGllcyIsIkF1dG9tZXJnZSIsImdldE9iamVjdEJ5SWQiLCJuZXdQcm9wZXJ0aWVzIiwib3BTZXQiLCJvcCIsIm9wcyIsImxpbmsiLCJwdXNoIiwiZSIsImNvbnNvbGUiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxHQUFHLFNBQVpBLFNBQVksT0FFaEJDLEdBRmdCO0FBQUEsc0JBQ2RDLEdBRGM7QUFBQSxNQUNkQSxHQURjLHlCQUNSLEVBRFE7QUFBQSxNQUNKQyxHQURJLFFBQ0pBLEdBREk7QUFBQSxNQUNDQyxJQURELFFBQ0NBLElBREQ7QUFBQSxNQUNPQyxLQURQLFFBQ09BLEtBRFA7QUFBQSxTQUdiLFVBQUNDLEdBQUQsRUFBYztBQUFBOztBQUNqQixXQUFPO0FBQ0xDLE1BQUFBLElBQUksRUFBRSxVQUREO0FBRUxILE1BQUFBLElBQUksRUFBRSx3QkFBWUEsSUFBWixDQUZEO0FBR0xJLE1BQUFBLFVBQVUsc0JBQ1BOLEdBRE8sMkJBQ0RPLFNBQVMsQ0FBQ0MsYUFBVixDQUF3QlQsR0FBeEIsRUFBNkJFLEdBQTdCLENBREMsMERBQ0Qsc0JBQW9DRCxHQUFwQyxDQURDLENBSEw7QUFNTFMsTUFBQUEsYUFBYSxzQkFDVlQsR0FEVSxFQUNKRyxLQURJO0FBTlIsS0FBUDtBQVVELEdBZGlCO0FBQUEsQ0FBbEI7O0FBZ0JBLElBQU1PLEtBQUssR0FBRyxTQUFSQSxLQUFRLENBQUNDLEVBQUQsU0FBc0NaLEdBQXRDLEVBQW1EO0FBQUE7QUFBQSxNQUE3QkssR0FBNkI7QUFBQSxNQUF4QlEsR0FBd0I7O0FBQUEsTUFDdkRDLElBRHVELEdBQ3ZCRixFQUR1QixDQUN2REUsSUFEdUQ7QUFBQSxNQUNqRFYsS0FEaUQsR0FDdkJRLEVBRHVCLENBQ2pEUixLQURpRDtBQUFBLE1BQzFDRCxJQUQwQyxHQUN2QlMsRUFEdUIsQ0FDMUNULElBRDBDO0FBQUEsTUFDcENELEdBRG9DLEdBQ3ZCVSxFQUR1QixDQUNwQ1YsR0FEb0M7QUFBQSxNQUMvQkQsR0FEK0IsR0FDdkJXLEVBRHVCLENBQy9CWCxHQUQrQjs7QUFHL0QsTUFBSTtBQUNGLFFBQUlFLElBQUksSUFBSUEsSUFBSSxDQUFDLENBQUQsQ0FBSixLQUFZLFNBQXhCLEVBQW1DO0FBQ2pDVSxNQUFBQSxHQUFHLENBQUNFLElBQUosQ0FBU2hCLFNBQVMsQ0FBQ2EsRUFBRCxFQUFLWixHQUFMLENBQWxCO0FBQ0QsS0FGRCxNQUVPLElBQUlLLEdBQUcsQ0FBQ0gsR0FBRCxDQUFQLEVBQWM7QUFDbkJHLE1BQUFBLEdBQUcsQ0FBQ0gsR0FBRCxDQUFILENBQVNELEdBQVQsSUFBdUJhLElBQUksR0FBR1QsR0FBRyxDQUFDRCxLQUFELENBQU4sR0FBZ0JBLEtBQTNDO0FBQ0Q7O0FBRUQsV0FBTyxDQUFDQyxHQUFELEVBQU1RLEdBQU4sQ0FBUDtBQUNELEdBUkQsQ0FRRSxPQUFPRyxDQUFQLEVBQVU7QUFDVkMsSUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWNGLENBQWQsRUFBaUJKLEVBQWpCLEVBQXFCLGlCQUFLUCxHQUFMLENBQXJCO0FBRUEsV0FBTyxDQUFDQSxHQUFELEVBQU1RLEdBQU4sQ0FBUDtBQUNEO0FBQ0YsQ0FoQkQ7O2VBa0JlRixLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQXV0b21lcmdlIGZyb20gJ2F1dG9tZXJnZSdcblxuaW1wb3J0IHsgdG9TbGF0ZVBhdGgsIHRvSlMgfSBmcm9tICcuLi91dGlscydcblxuY29uc3Qgc2V0RGF0YU9wID0gKFxuICB7IGtleSA9ICcnLCBvYmosIHBhdGgsIHZhbHVlIH06IEF1dG9tZXJnZS5EaWZmLFxuICBkb2M6IGFueVxuKSA9PiAobWFwOiBhbnkpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnc2V0X25vZGUnLFxuICAgIHBhdGg6IHRvU2xhdGVQYXRoKHBhdGgpLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIFtrZXldOiBBdXRvbWVyZ2UuZ2V0T2JqZWN0QnlJZChkb2MsIG9iaik/LltrZXldXG4gICAgfSxcbiAgICBuZXdQcm9wZXJ0aWVzOiB7XG4gICAgICBba2V5XTogdmFsdWVcbiAgICB9XG4gIH1cbn1cblxuY29uc3Qgb3BTZXQgPSAob3A6IEF1dG9tZXJnZS5EaWZmLCBbbWFwLCBvcHNdOiBhbnksIGRvYzogYW55KSA9PiB7XG4gIGNvbnN0IHsgbGluaywgdmFsdWUsIHBhdGgsIG9iaiwga2V5IH0gPSBvcFxuXG4gIHRyeSB7XG4gICAgaWYgKHBhdGggJiYgcGF0aFswXSAhPT0gJ2N1cnNvcnMnKSB7XG4gICAgICBvcHMucHVzaChzZXREYXRhT3Aob3AsIGRvYykpXG4gICAgfSBlbHNlIGlmIChtYXBbb2JqXSkge1xuICAgICAgbWFwW29ial1ba2V5IGFzIGFueV0gPSBsaW5rID8gbWFwW3ZhbHVlXSA6IHZhbHVlXG4gICAgfVxuXG4gICAgcmV0dXJuIFttYXAsIG9wc11cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSwgb3AsIHRvSlMobWFwKSlcblxuICAgIHJldHVybiBbbWFwLCBvcHNdXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgb3BTZXRcbiJdfQ==