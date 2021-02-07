"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.setDataOp = void 0;

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

exports.setDataOp = setDataOp;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L3NldC50cyJdLCJuYW1lcyI6WyJzZXREYXRhT3AiLCJkb2MiLCJrZXkiLCJvYmoiLCJwYXRoIiwidmFsdWUiLCJtYXAiLCJ0bXBEb2MiLCJzbGF0ZVBhdGgiLCJub2RlIiwiTm9kZSIsImdldCIsInR5cGUiLCJwcm9wZXJ0aWVzIiwiQXV0b21lcmdlIiwiZ2V0T2JqZWN0QnlJZCIsIm5ld1Byb3BlcnRpZXMiLCJvcFNldCIsIm9wIiwib3BzIiwibGluayIsImxlbmd0aCIsInB1c2giLCJlIiwiY29uc29sZSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFTyxJQUFNQSxTQUFTLEdBQUcsU0FBWkEsU0FBWSxPQUV2QkMsR0FGdUI7QUFBQSxzQkFDckJDLEdBRHFCO0FBQUEsTUFDckJBLEdBRHFCLHlCQUNmLEVBRGU7QUFBQSxNQUNYQyxHQURXLFFBQ1hBLEdBRFc7QUFBQSxNQUNOQyxJQURNLFFBQ05BLElBRE07QUFBQSxNQUNBQyxLQURBLFFBQ0FBLEtBREE7QUFBQSxTQUdwQixVQUFDQyxHQUFELEVBQVdDLE1BQVgsRUFBK0I7QUFBQTs7QUFDbEMsUUFBTUMsU0FBUyxHQUFHLHdCQUFZSixJQUFaLENBQWxCOztBQUNBLFFBQU1LLElBQUksR0FBR0MsWUFBS0MsR0FBTCxDQUFTSixNQUFULEVBQWlCQyxTQUFqQixDQUFiOztBQUNBQyxJQUFBQSxJQUFJLENBQUNQLEdBQUQsQ0FBSixHQUFZLGlCQUFLLENBQUFJLEdBQUcsU0FBSCxJQUFBQSxHQUFHLFdBQUgsWUFBQUEsR0FBRyxDQUFHRCxLQUFILENBQUgsS0FBZ0JBLEtBQXJCLENBQVo7QUFDQSxXQUFPO0FBQ0xPLE1BQUFBLElBQUksRUFBRSxVQUREO0FBRUxSLE1BQUFBLElBQUksRUFBRUksU0FGRDtBQUdMSyxNQUFBQSxVQUFVLHNCQUNQWCxHQURPLEVBQ0QsMENBQUtZLFNBQVMsQ0FBQ0MsYUFBVixDQUF3QmQsR0FBeEIsRUFBNkJFLEdBQTdCLENBQUwsMERBQUssc0JBQW9DRCxHQUFwQyxDQUFMLENBREMsQ0FITDtBQU1MYyxNQUFBQSxhQUFhLHNCQUNWZCxHQURVLEVBQ0osaUJBQUtPLElBQUksQ0FBQ1AsR0FBRCxDQUFULENBREk7QUFOUixLQUFQO0FBVUQsR0FqQndCO0FBQUEsQ0FBbEI7Ozs7QUFtQlAsSUFBTWUsS0FBSyxHQUFHLFNBQVJBLEtBQVEsQ0FBQ0MsRUFBRCxTQUFzQ2pCLEdBQXRDLEVBQWdETSxNQUFoRCxFQUFnRTtBQUFBO0FBQUEsTUFBMUNELEdBQTBDO0FBQUEsTUFBckNhLEdBQXFDOztBQUFBLE1BQ3BFQyxJQURvRSxHQUNwQ0YsRUFEb0MsQ0FDcEVFLElBRG9FO0FBQUEsTUFDOURmLEtBRDhELEdBQ3BDYSxFQURvQyxDQUM5RGIsS0FEOEQ7QUFBQSxNQUN2REQsSUFEdUQsR0FDcENjLEVBRG9DLENBQ3ZEZCxJQUR1RDtBQUFBLE1BQ2pERCxHQURpRCxHQUNwQ2UsRUFEb0MsQ0FDakRmLEdBRGlEO0FBQUEsTUFDNUNELEdBRDRDLEdBQ3BDZ0IsRUFEb0MsQ0FDNUNoQixHQUQ0Qzs7QUFHNUUsTUFBSTtBQUNGLFFBQUlFLElBQUksSUFBSUEsSUFBSSxDQUFDaUIsTUFBYixJQUF1QmpCLElBQUksQ0FBQyxDQUFELENBQUosS0FBWSxTQUF2QyxFQUFrRDtBQUNoRGUsTUFBQUEsR0FBRyxDQUFDRyxJQUFKLENBQVN0QixTQUFTLENBQUNrQixFQUFELEVBQUtqQixHQUFMLENBQVQsQ0FBbUJLLEdBQW5CLEVBQXdCQyxNQUF4QixDQUFUO0FBQ0QsS0FGRCxNQUVPLElBQUlELEdBQUcsQ0FBQ0gsR0FBRCxDQUFQLEVBQWM7QUFDbkJHLE1BQUFBLEdBQUcsQ0FBQ0gsR0FBRCxDQUFILENBQVNELEdBQVQsSUFBdUJrQixJQUFJLEdBQUdkLEdBQUcsQ0FBQ0QsS0FBRCxDQUFOLEdBQWdCQSxLQUEzQztBQUNEOztBQUVELFdBQU8sQ0FBQ0MsR0FBRCxFQUFNYSxHQUFOLENBQVA7QUFDRCxHQVJELENBUUUsT0FBT0ksQ0FBUCxFQUFVO0FBQ1ZDLElBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjRixDQUFkLEVBQWlCTCxFQUFqQixFQUFxQixpQkFBS1osR0FBTCxDQUFyQjtBQUVBLFdBQU8sQ0FBQ0EsR0FBRCxFQUFNYSxHQUFOLENBQVA7QUFDRDtBQUNGLENBaEJEOztlQWtCZUYsSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEF1dG9tZXJnZSBmcm9tICdhdXRvbWVyZ2UnXG5pbXBvcnQgeyBFbGVtZW50LCBOb2RlIH0gZnJvbSAnc2xhdGUnXG5cbmltcG9ydCB7IHRvU2xhdGVQYXRoLCB0b0pTIH0gZnJvbSAnLi4vdXRpbHMnXG5cbmV4cG9ydCBjb25zdCBzZXREYXRhT3AgPSAoXG4gIHsga2V5ID0gJycsIG9iaiwgcGF0aCwgdmFsdWUgfTogQXV0b21lcmdlLkRpZmYsXG4gIGRvYzogYW55XG4pID0+IChtYXA6IGFueSwgdG1wRG9jOiBFbGVtZW50KSA9PiB7XG4gIGNvbnN0IHNsYXRlUGF0aCA9IHRvU2xhdGVQYXRoKHBhdGgpXG4gIGNvbnN0IG5vZGUgPSBOb2RlLmdldCh0bXBEb2MsIHNsYXRlUGF0aClcbiAgbm9kZVtrZXldID0gdG9KUyhtYXA/Llt2YWx1ZV0gfHwgdmFsdWUpXG4gIHJldHVybiB7XG4gICAgdHlwZTogJ3NldF9ub2RlJyxcbiAgICBwYXRoOiBzbGF0ZVBhdGgsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgW2tleV06IHRvSlMoQXV0b21lcmdlLmdldE9iamVjdEJ5SWQoZG9jLCBvYmopPy5ba2V5XSlcbiAgICB9LFxuICAgIG5ld1Byb3BlcnRpZXM6IHtcbiAgICAgIFtrZXldOiB0b0pTKG5vZGVba2V5XSlcbiAgICB9XG4gIH1cbn1cblxuY29uc3Qgb3BTZXQgPSAob3A6IEF1dG9tZXJnZS5EaWZmLCBbbWFwLCBvcHNdOiBhbnksIGRvYzogYW55LCB0bXBEb2M6IGFueSkgPT4ge1xuICBjb25zdCB7IGxpbmssIHZhbHVlLCBwYXRoLCBvYmosIGtleSB9ID0gb3BcblxuICB0cnkge1xuICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoICYmIHBhdGhbMF0gIT09ICdjdXJzb3JzJykge1xuICAgICAgb3BzLnB1c2goc2V0RGF0YU9wKG9wLCBkb2MpKG1hcCwgdG1wRG9jKSlcbiAgICB9IGVsc2UgaWYgKG1hcFtvYmpdKSB7XG4gICAgICBtYXBbb2JqXVtrZXkgYXMgYW55XSA9IGxpbmsgPyBtYXBbdmFsdWVdIDogdmFsdWVcbiAgICB9XG5cbiAgICByZXR1cm4gW21hcCwgb3BzXVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlLCBvcCwgdG9KUyhtYXApKVxuXG4gICAgcmV0dXJuIFttYXAsIG9wc11cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBvcFNldFxuIl19