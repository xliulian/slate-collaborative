"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Automerge = _interopRequireWildcard(require("automerge"));

var _slate = require("slate");

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
  return function (map, tmpDoc) {
    var _Automerge$getObjectB;

    var slatePath = (0, _utils.toSlatePath)(path);

    var node = _slate.Node.get(tmpDoc, slatePath);

    node[key] = (0, _utils.toJS)((map === null || map === void 0 ? void 0 : map[value]) || value);
    return {
      type: 'set_node',
      path: slatePath,
      properties: _defineProperty({}, key, (0, _utils.toJS)((_Automerge$getObjectB = Automerge.getObjectById(doc, obj)) === null || _Automerge$getObjectB === void 0 ? void 0 : _Automerge$getObjectB[key])),
      newProperties: _defineProperty({}, key, (0, _utils.toJS)(node[key]))
    };
  };
};

var opSet = function opSet(op, _ref2, doc, tmpDoc) {
  var _ref3 = _slicedToArray(_ref2, 2),
      map = _ref3[0],
      ops = _ref3[1];

  var link = op.link,
      value = op.value,
      path = op.path,
      obj = op.obj,
      key = op.key;

  try {
    if (path && path.length && path[0] !== 'cursors') {
      ops.push(setDataOp(op, doc)(map, tmpDoc));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L3NldC50cyJdLCJuYW1lcyI6WyJzZXREYXRhT3AiLCJkb2MiLCJrZXkiLCJvYmoiLCJwYXRoIiwidmFsdWUiLCJtYXAiLCJ0bXBEb2MiLCJzbGF0ZVBhdGgiLCJub2RlIiwiTm9kZSIsImdldCIsInR5cGUiLCJwcm9wZXJ0aWVzIiwiQXV0b21lcmdlIiwiZ2V0T2JqZWN0QnlJZCIsIm5ld1Byb3BlcnRpZXMiLCJvcFNldCIsIm9wIiwib3BzIiwibGluayIsImxlbmd0aCIsInB1c2giLCJlIiwiY29uc29sZSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTLEdBQUcsU0FBWkEsU0FBWSxPQUVoQkMsR0FGZ0I7QUFBQSxzQkFDZEMsR0FEYztBQUFBLE1BQ2RBLEdBRGMseUJBQ1IsRUFEUTtBQUFBLE1BQ0pDLEdBREksUUFDSkEsR0FESTtBQUFBLE1BQ0NDLElBREQsUUFDQ0EsSUFERDtBQUFBLE1BQ09DLEtBRFAsUUFDT0EsS0FEUDtBQUFBLFNBR2IsVUFBQ0MsR0FBRCxFQUFXQyxNQUFYLEVBQStCO0FBQUE7O0FBQ2xDLFFBQU1DLFNBQVMsR0FBRyx3QkFBWUosSUFBWixDQUFsQjs7QUFDQSxRQUFNSyxJQUFJLEdBQUdDLFlBQUtDLEdBQUwsQ0FBU0osTUFBVCxFQUFpQkMsU0FBakIsQ0FBYjs7QUFDQUMsSUFBQUEsSUFBSSxDQUFDUCxHQUFELENBQUosR0FBWSxpQkFBSyxDQUFBSSxHQUFHLFNBQUgsSUFBQUEsR0FBRyxXQUFILFlBQUFBLEdBQUcsQ0FBR0QsS0FBSCxDQUFILEtBQWdCQSxLQUFyQixDQUFaO0FBQ0EsV0FBTztBQUNMTyxNQUFBQSxJQUFJLEVBQUUsVUFERDtBQUVMUixNQUFBQSxJQUFJLEVBQUVJLFNBRkQ7QUFHTEssTUFBQUEsVUFBVSxzQkFDUFgsR0FETyxFQUNELDBDQUFLWSxTQUFTLENBQUNDLGFBQVYsQ0FBd0JkLEdBQXhCLEVBQTZCRSxHQUE3QixDQUFMLDBEQUFLLHNCQUFvQ0QsR0FBcEMsQ0FBTCxDQURDLENBSEw7QUFNTGMsTUFBQUEsYUFBYSxzQkFDVmQsR0FEVSxFQUNKLGlCQUFLTyxJQUFJLENBQUNQLEdBQUQsQ0FBVCxDQURJO0FBTlIsS0FBUDtBQVVELEdBakJpQjtBQUFBLENBQWxCOztBQW1CQSxJQUFNZSxLQUFLLEdBQUcsU0FBUkEsS0FBUSxDQUFDQyxFQUFELFNBQXNDakIsR0FBdEMsRUFBZ0RNLE1BQWhELEVBQWdFO0FBQUE7QUFBQSxNQUExQ0QsR0FBMEM7QUFBQSxNQUFyQ2EsR0FBcUM7O0FBQUEsTUFDcEVDLElBRG9FLEdBQ3BDRixFQURvQyxDQUNwRUUsSUFEb0U7QUFBQSxNQUM5RGYsS0FEOEQsR0FDcENhLEVBRG9DLENBQzlEYixLQUQ4RDtBQUFBLE1BQ3ZERCxJQUR1RCxHQUNwQ2MsRUFEb0MsQ0FDdkRkLElBRHVEO0FBQUEsTUFDakRELEdBRGlELEdBQ3BDZSxFQURvQyxDQUNqRGYsR0FEaUQ7QUFBQSxNQUM1Q0QsR0FENEMsR0FDcENnQixFQURvQyxDQUM1Q2hCLEdBRDRDOztBQUc1RSxNQUFJO0FBQ0YsUUFBSUUsSUFBSSxJQUFJQSxJQUFJLENBQUNpQixNQUFiLElBQXVCakIsSUFBSSxDQUFDLENBQUQsQ0FBSixLQUFZLFNBQXZDLEVBQWtEO0FBQ2hEZSxNQUFBQSxHQUFHLENBQUNHLElBQUosQ0FBU3RCLFNBQVMsQ0FBQ2tCLEVBQUQsRUFBS2pCLEdBQUwsQ0FBVCxDQUFtQkssR0FBbkIsRUFBd0JDLE1BQXhCLENBQVQ7QUFDRCxLQUZELE1BRU8sSUFBSUQsR0FBRyxDQUFDSCxHQUFELENBQVAsRUFBYztBQUNuQkcsTUFBQUEsR0FBRyxDQUFDSCxHQUFELENBQUgsQ0FBU0QsR0FBVCxJQUF1QmtCLElBQUksR0FBR2QsR0FBRyxDQUFDRCxLQUFELENBQU4sR0FBZ0JBLEtBQTNDO0FBQ0Q7O0FBRUQsV0FBTyxDQUFDQyxHQUFELEVBQU1hLEdBQU4sQ0FBUDtBQUNELEdBUkQsQ0FRRSxPQUFPSSxDQUFQLEVBQVU7QUFDVkMsSUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWNGLENBQWQsRUFBaUJMLEVBQWpCLEVBQXFCLGlCQUFLWixHQUFMLENBQXJCO0FBRUEsV0FBTyxDQUFDQSxHQUFELEVBQU1hLEdBQU4sQ0FBUDtBQUNEO0FBQ0YsQ0FoQkQ7O2VBa0JlRixLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQXV0b21lcmdlIGZyb20gJ2F1dG9tZXJnZSdcbmltcG9ydCB7IEVsZW1lbnQsIE5vZGUgfSBmcm9tICdzbGF0ZSdcblxuaW1wb3J0IHsgdG9TbGF0ZVBhdGgsIHRvSlMgfSBmcm9tICcuLi91dGlscydcblxuY29uc3Qgc2V0RGF0YU9wID0gKFxuICB7IGtleSA9ICcnLCBvYmosIHBhdGgsIHZhbHVlIH06IEF1dG9tZXJnZS5EaWZmLFxuICBkb2M6IGFueVxuKSA9PiAobWFwOiBhbnksIHRtcERvYzogRWxlbWVudCkgPT4ge1xuICBjb25zdCBzbGF0ZVBhdGggPSB0b1NsYXRlUGF0aChwYXRoKVxuICBjb25zdCBub2RlID0gTm9kZS5nZXQodG1wRG9jLCBzbGF0ZVBhdGgpXG4gIG5vZGVba2V5XSA9IHRvSlMobWFwPy5bdmFsdWVdIHx8IHZhbHVlKVxuICByZXR1cm4ge1xuICAgIHR5cGU6ICdzZXRfbm9kZScsXG4gICAgcGF0aDogc2xhdGVQYXRoLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIFtrZXldOiB0b0pTKEF1dG9tZXJnZS5nZXRPYmplY3RCeUlkKGRvYywgb2JqKT8uW2tleV0pXG4gICAgfSxcbiAgICBuZXdQcm9wZXJ0aWVzOiB7XG4gICAgICBba2V5XTogdG9KUyhub2RlW2tleV0pXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IG9wU2V0ID0gKG9wOiBBdXRvbWVyZ2UuRGlmZiwgW21hcCwgb3BzXTogYW55LCBkb2M6IGFueSwgdG1wRG9jOiBhbnkpID0+IHtcbiAgY29uc3QgeyBsaW5rLCB2YWx1ZSwgcGF0aCwgb2JqLCBrZXkgfSA9IG9wXG5cbiAgdHJ5IHtcbiAgICBpZiAocGF0aCAmJiBwYXRoLmxlbmd0aCAmJiBwYXRoWzBdICE9PSAnY3Vyc29ycycpIHtcbiAgICAgIG9wcy5wdXNoKHNldERhdGFPcChvcCwgZG9jKShtYXAsIHRtcERvYykpXG4gICAgfSBlbHNlIGlmIChtYXBbb2JqXSkge1xuICAgICAgbWFwW29ial1ba2V5IGFzIGFueV0gPSBsaW5rID8gbWFwW3ZhbHVlXSA6IHZhbHVlXG4gICAgfVxuXG4gICAgcmV0dXJuIFttYXAsIG9wc11cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSwgb3AsIHRvSlMobWFwKSlcblxuICAgIHJldHVybiBbbWFwLCBvcHNdXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgb3BTZXRcbiJdfQ==