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
      link = _ref.link,
      value = _ref.value;
  return function (map, tmpDoc) {
    var slatePath = (0, _utils.toSlatePath)(path);

    var node = _slate.Node.get(tmpDoc, slatePath);

    var oldValue = node[key];
    var newValue = link ? map[value] : value; // FIXME: is it possible the map is newer than the tmpDoc (data in map modified without path)?

    map[obj] = node; // node from tmpDoc is the newest value at the moment, keep map sync

    if (newValue == null) {
      // slate does this check.
      delete node[key];
    } else {
      node[key] = newValue;
    }

    return {
      type: 'set_node',
      path: slatePath,
      properties: _defineProperty({}, key, (0, _utils.toJS)(oldValue)),
      newProperties: _defineProperty({}, key, (0, _utils.toJS)(newValue))
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
    if (link && !map.hasOwnProperty(value)) {
      map[value] = (0, _utils.toJS)(Automerge.getObjectById(doc, value));
    }

    if (path && path.length && path[0] === 'children') {
      ops.push(setDataOp(op, doc)(map, tmpDoc));
    } else {
      if (!map.hasOwnProperty(obj)) {
        map[obj] = (0, _utils.toJS)(Automerge.getObjectById(doc, obj));
      }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L3NldC50cyJdLCJuYW1lcyI6WyJzZXREYXRhT3AiLCJkb2MiLCJrZXkiLCJvYmoiLCJwYXRoIiwibGluayIsInZhbHVlIiwibWFwIiwidG1wRG9jIiwic2xhdGVQYXRoIiwibm9kZSIsIk5vZGUiLCJnZXQiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwidHlwZSIsInByb3BlcnRpZXMiLCJuZXdQcm9wZXJ0aWVzIiwib3BTZXQiLCJvcCIsIm9wcyIsImhhc093blByb3BlcnR5IiwiQXV0b21lcmdlIiwiZ2V0T2JqZWN0QnlJZCIsImxlbmd0aCIsInB1c2giLCJlIiwiY29uc29sZSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFTyxJQUFNQSxTQUFTLEdBQUcsU0FBWkEsU0FBWSxPQUV2QkMsR0FGdUI7QUFBQSxzQkFDckJDLEdBRHFCO0FBQUEsTUFDckJBLEdBRHFCLHlCQUNmLEVBRGU7QUFBQSxNQUNYQyxHQURXLFFBQ1hBLEdBRFc7QUFBQSxNQUNOQyxJQURNLFFBQ05BLElBRE07QUFBQSxNQUNBQyxJQURBLFFBQ0FBLElBREE7QUFBQSxNQUNNQyxLQUROLFFBQ01BLEtBRE47QUFBQSxTQUdwQixVQUFDQyxHQUFELEVBQVdDLE1BQVgsRUFBK0I7QUFDbEMsUUFBTUMsU0FBUyxHQUFHLHdCQUFZTCxJQUFaLENBQWxCOztBQUNBLFFBQU1NLElBQUksR0FBR0MsWUFBS0MsR0FBTCxDQUFTSixNQUFULEVBQWlCQyxTQUFqQixDQUFiOztBQUNBLFFBQU1JLFFBQVEsR0FBR0gsSUFBSSxDQUFDUixHQUFELENBQXJCO0FBQ0EsUUFBTVksUUFBUSxHQUFHVCxJQUFJLEdBQUdFLEdBQUcsQ0FBQ0QsS0FBRCxDQUFOLEdBQWdCQSxLQUFyQyxDQUprQyxDQUtsQzs7QUFDQUMsSUFBQUEsR0FBRyxDQUFDSixHQUFELENBQUgsR0FBV08sSUFBWCxDQU5rQyxDQU1sQjs7QUFFaEIsUUFBSUksUUFBUSxJQUFJLElBQWhCLEVBQXNCO0FBQ3BCO0FBQ0EsYUFBT0osSUFBSSxDQUFDUixHQUFELENBQVg7QUFDRCxLQUhELE1BR087QUFDTFEsTUFBQUEsSUFBSSxDQUFDUixHQUFELENBQUosR0FBWVksUUFBWjtBQUNEOztBQUNELFdBQU87QUFDTEMsTUFBQUEsSUFBSSxFQUFFLFVBREQ7QUFFTFgsTUFBQUEsSUFBSSxFQUFFSyxTQUZEO0FBR0xPLE1BQUFBLFVBQVUsc0JBQ1BkLEdBRE8sRUFDRCxpQkFBS1csUUFBTCxDQURDLENBSEw7QUFNTEksTUFBQUEsYUFBYSxzQkFDVmYsR0FEVSxFQUNKLGlCQUFLWSxRQUFMLENBREk7QUFOUixLQUFQO0FBVUQsR0EzQndCO0FBQUEsQ0FBbEI7Ozs7QUE2QlAsSUFBTUksS0FBSyxHQUFHLFNBQVJBLEtBQVEsQ0FBQ0MsRUFBRCxTQUFzQ2xCLEdBQXRDLEVBQWdETyxNQUFoRCxFQUFnRTtBQUFBO0FBQUEsTUFBMUNELEdBQTBDO0FBQUEsTUFBckNhLEdBQXFDOztBQUFBLE1BQ3BFZixJQURvRSxHQUNwQ2MsRUFEb0MsQ0FDcEVkLElBRG9FO0FBQUEsTUFDOURDLEtBRDhELEdBQ3BDYSxFQURvQyxDQUM5RGIsS0FEOEQ7QUFBQSxNQUN2REYsSUFEdUQsR0FDcENlLEVBRG9DLENBQ3ZEZixJQUR1RDtBQUFBLE1BQ2pERCxHQURpRCxHQUNwQ2dCLEVBRG9DLENBQ2pEaEIsR0FEaUQ7QUFBQSxNQUM1Q0QsR0FENEMsR0FDcENpQixFQURvQyxDQUM1Q2pCLEdBRDRDOztBQUc1RSxNQUFJO0FBQ0YsUUFBSUcsSUFBSSxJQUFJLENBQUNFLEdBQUcsQ0FBQ2MsY0FBSixDQUFtQmYsS0FBbkIsQ0FBYixFQUF3QztBQUN0Q0MsTUFBQUEsR0FBRyxDQUFDRCxLQUFELENBQUgsR0FBYSxpQkFBS2dCLFNBQVMsQ0FBQ0MsYUFBVixDQUF3QnRCLEdBQXhCLEVBQTZCSyxLQUE3QixDQUFMLENBQWI7QUFDRDs7QUFDRCxRQUFJRixJQUFJLElBQUlBLElBQUksQ0FBQ29CLE1BQWIsSUFBdUJwQixJQUFJLENBQUMsQ0FBRCxDQUFKLEtBQVksVUFBdkMsRUFBbUQ7QUFDakRnQixNQUFBQSxHQUFHLENBQUNLLElBQUosQ0FBU3pCLFNBQVMsQ0FBQ21CLEVBQUQsRUFBS2xCLEdBQUwsQ0FBVCxDQUFtQk0sR0FBbkIsRUFBd0JDLE1BQXhCLENBQVQ7QUFDRCxLQUZELE1BRU87QUFDTCxVQUFJLENBQUNELEdBQUcsQ0FBQ2MsY0FBSixDQUFtQmxCLEdBQW5CLENBQUwsRUFBOEI7QUFDNUJJLFFBQUFBLEdBQUcsQ0FBQ0osR0FBRCxDQUFILEdBQVcsaUJBQUttQixTQUFTLENBQUNDLGFBQVYsQ0FBd0J0QixHQUF4QixFQUE2QkUsR0FBN0IsQ0FBTCxDQUFYO0FBQ0Q7O0FBQ0RJLE1BQUFBLEdBQUcsQ0FBQ0osR0FBRCxDQUFILENBQVNELEdBQVQsSUFBMEJHLElBQUksR0FBR0UsR0FBRyxDQUFDRCxLQUFELENBQU4sR0FBZ0JBLEtBQTlDO0FBQ0Q7O0FBRUQsV0FBTyxDQUFDQyxHQUFELEVBQU1hLEdBQU4sQ0FBUDtBQUNELEdBZEQsQ0FjRSxPQUFPTSxDQUFQLEVBQVU7QUFDVkMsSUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWNGLENBQWQsRUFBaUJQLEVBQWpCLEVBQXFCLGlCQUFLWixHQUFMLENBQXJCO0FBRUEsV0FBTyxDQUFDQSxHQUFELEVBQU1hLEdBQU4sQ0FBUDtBQUNEO0FBQ0YsQ0F0QkQ7O2VBd0JlRixLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQXV0b21lcmdlIGZyb20gJ2F1dG9tZXJnZSdcbmltcG9ydCB7IEVsZW1lbnQsIE5vZGUgfSBmcm9tICdzbGF0ZSdcblxuaW1wb3J0IHsgdG9TbGF0ZVBhdGgsIHRvSlMgfSBmcm9tICcuLi91dGlscydcblxuZXhwb3J0IGNvbnN0IHNldERhdGFPcCA9IChcbiAgeyBrZXkgPSAnJywgb2JqLCBwYXRoLCBsaW5rLCB2YWx1ZSB9OiBBdXRvbWVyZ2UuRGlmZixcbiAgZG9jOiBhbnlcbikgPT4gKG1hcDogYW55LCB0bXBEb2M6IEVsZW1lbnQpID0+IHtcbiAgY29uc3Qgc2xhdGVQYXRoID0gdG9TbGF0ZVBhdGgocGF0aClcbiAgY29uc3Qgbm9kZSA9IE5vZGUuZ2V0KHRtcERvYywgc2xhdGVQYXRoKVxuICBjb25zdCBvbGRWYWx1ZSA9IG5vZGVba2V5XVxuICBjb25zdCBuZXdWYWx1ZSA9IGxpbmsgPyBtYXBbdmFsdWVdIDogdmFsdWVcbiAgLy8gRklYTUU6IGlzIGl0IHBvc3NpYmxlIHRoZSBtYXAgaXMgbmV3ZXIgdGhhbiB0aGUgdG1wRG9jIChkYXRhIGluIG1hcCBtb2RpZmllZCB3aXRob3V0IHBhdGgpP1xuICBtYXBbb2JqXSA9IG5vZGUgLy8gbm9kZSBmcm9tIHRtcERvYyBpcyB0aGUgbmV3ZXN0IHZhbHVlIGF0IHRoZSBtb21lbnQsIGtlZXAgbWFwIHN5bmNcblxuICBpZiAobmV3VmFsdWUgPT0gbnVsbCkge1xuICAgIC8vIHNsYXRlIGRvZXMgdGhpcyBjaGVjay5cbiAgICBkZWxldGUgbm9kZVtrZXldXG4gIH0gZWxzZSB7XG4gICAgbm9kZVtrZXldID0gbmV3VmFsdWVcbiAgfVxuICByZXR1cm4ge1xuICAgIHR5cGU6ICdzZXRfbm9kZScsXG4gICAgcGF0aDogc2xhdGVQYXRoLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIFtrZXldOiB0b0pTKG9sZFZhbHVlKVxuICAgIH0sXG4gICAgbmV3UHJvcGVydGllczoge1xuICAgICAgW2tleV06IHRvSlMobmV3VmFsdWUpXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IG9wU2V0ID0gKG9wOiBBdXRvbWVyZ2UuRGlmZiwgW21hcCwgb3BzXTogYW55LCBkb2M6IGFueSwgdG1wRG9jOiBhbnkpID0+IHtcbiAgY29uc3QgeyBsaW5rLCB2YWx1ZSwgcGF0aCwgb2JqLCBrZXkgfSA9IG9wXG5cbiAgdHJ5IHtcbiAgICBpZiAobGluayAmJiAhbWFwLmhhc093blByb3BlcnR5KHZhbHVlKSkge1xuICAgICAgbWFwW3ZhbHVlXSA9IHRvSlMoQXV0b21lcmdlLmdldE9iamVjdEJ5SWQoZG9jLCB2YWx1ZSkpXG4gICAgfVxuICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoICYmIHBhdGhbMF0gPT09ICdjaGlsZHJlbicpIHtcbiAgICAgIG9wcy5wdXNoKHNldERhdGFPcChvcCwgZG9jKShtYXAsIHRtcERvYykpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghbWFwLmhhc093blByb3BlcnR5KG9iaikpIHtcbiAgICAgICAgbWFwW29ial0gPSB0b0pTKEF1dG9tZXJnZS5nZXRPYmplY3RCeUlkKGRvYywgb2JqKSlcbiAgICAgIH1cbiAgICAgIG1hcFtvYmpdW2tleSBhcyBzdHJpbmddID0gbGluayA/IG1hcFt2YWx1ZV0gOiB2YWx1ZVxuICAgIH1cblxuICAgIHJldHVybiBbbWFwLCBvcHNdXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUsIG9wLCB0b0pTKG1hcCkpXG5cbiAgICByZXR1cm4gW21hcCwgb3BzXVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9wU2V0XG4iXX0=