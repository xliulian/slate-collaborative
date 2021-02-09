"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.setDataOp = void 0;

var _slate = require("slate");

var _utils = require("../utils");

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
    var slatePath = (0, _utils.toSlatePath)(path);

    var node = _slate.Node.get(tmpDoc, slatePath);

    var oldValue = node[key];
    var newValue = (0, _utils.toJS)((map === null || map === void 0 ? void 0 : map[value]) || value);
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
    if (path && path.length && path[0] === 'children') {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L3NldC50cyJdLCJuYW1lcyI6WyJzZXREYXRhT3AiLCJkb2MiLCJrZXkiLCJvYmoiLCJwYXRoIiwidmFsdWUiLCJtYXAiLCJ0bXBEb2MiLCJzbGF0ZVBhdGgiLCJub2RlIiwiTm9kZSIsImdldCIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJ0eXBlIiwicHJvcGVydGllcyIsIm5ld1Byb3BlcnRpZXMiLCJvcFNldCIsIm9wIiwib3BzIiwibGluayIsImxlbmd0aCIsInB1c2giLCJlIiwiY29uc29sZSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFTyxJQUFNQSxTQUFTLEdBQUcsU0FBWkEsU0FBWSxPQUV2QkMsR0FGdUI7QUFBQSxzQkFDckJDLEdBRHFCO0FBQUEsTUFDckJBLEdBRHFCLHlCQUNmLEVBRGU7QUFBQSxNQUNYQyxHQURXLFFBQ1hBLEdBRFc7QUFBQSxNQUNOQyxJQURNLFFBQ05BLElBRE07QUFBQSxNQUNBQyxLQURBLFFBQ0FBLEtBREE7QUFBQSxTQUdwQixVQUFDQyxHQUFELEVBQVdDLE1BQVgsRUFBK0I7QUFDbEMsUUFBTUMsU0FBUyxHQUFHLHdCQUFZSixJQUFaLENBQWxCOztBQUNBLFFBQU1LLElBQUksR0FBR0MsWUFBS0MsR0FBTCxDQUFTSixNQUFULEVBQWlCQyxTQUFqQixDQUFiOztBQUNBLFFBQU1JLFFBQVEsR0FBR0gsSUFBSSxDQUFDUCxHQUFELENBQXJCO0FBQ0EsUUFBTVcsUUFBUSxHQUFHLGlCQUFLLENBQUFQLEdBQUcsU0FBSCxJQUFBQSxHQUFHLFdBQUgsWUFBQUEsR0FBRyxDQUFHRCxLQUFILENBQUgsS0FBZ0JBLEtBQXJCLENBQWpCO0FBQ0FDLElBQUFBLEdBQUcsQ0FBQ0gsR0FBRCxDQUFILEdBQVdNLElBQVgsQ0FMa0MsQ0FLbEI7O0FBRWhCLFFBQUlJLFFBQVEsSUFBSSxJQUFoQixFQUFzQjtBQUNwQjtBQUNBLGFBQU9KLElBQUksQ0FBQ1AsR0FBRCxDQUFYO0FBQ0QsS0FIRCxNQUdPO0FBQ0xPLE1BQUFBLElBQUksQ0FBQ1AsR0FBRCxDQUFKLEdBQVlXLFFBQVo7QUFDRDs7QUFDRCxXQUFPO0FBQ0xDLE1BQUFBLElBQUksRUFBRSxVQUREO0FBRUxWLE1BQUFBLElBQUksRUFBRUksU0FGRDtBQUdMTyxNQUFBQSxVQUFVLHNCQUNQYixHQURPLEVBQ0QsaUJBQUtVLFFBQUwsQ0FEQyxDQUhMO0FBTUxJLE1BQUFBLGFBQWEsc0JBQ1ZkLEdBRFUsRUFDSixpQkFBS1csUUFBTCxDQURJO0FBTlIsS0FBUDtBQVVELEdBMUJ3QjtBQUFBLENBQWxCOzs7O0FBNEJQLElBQU1JLEtBQUssR0FBRyxTQUFSQSxLQUFRLENBQUNDLEVBQUQsU0FBc0NqQixHQUF0QyxFQUFnRE0sTUFBaEQsRUFBZ0U7QUFBQTtBQUFBLE1BQTFDRCxHQUEwQztBQUFBLE1BQXJDYSxHQUFxQzs7QUFBQSxNQUNwRUMsSUFEb0UsR0FDcENGLEVBRG9DLENBQ3BFRSxJQURvRTtBQUFBLE1BQzlEZixLQUQ4RCxHQUNwQ2EsRUFEb0MsQ0FDOURiLEtBRDhEO0FBQUEsTUFDdkRELElBRHVELEdBQ3BDYyxFQURvQyxDQUN2RGQsSUFEdUQ7QUFBQSxNQUNqREQsR0FEaUQsR0FDcENlLEVBRG9DLENBQ2pEZixHQURpRDtBQUFBLE1BQzVDRCxHQUQ0QyxHQUNwQ2dCLEVBRG9DLENBQzVDaEIsR0FENEM7O0FBRzVFLE1BQUk7QUFDRixRQUFJRSxJQUFJLElBQUlBLElBQUksQ0FBQ2lCLE1BQWIsSUFBdUJqQixJQUFJLENBQUMsQ0FBRCxDQUFKLEtBQVksVUFBdkMsRUFBbUQ7QUFDakRlLE1BQUFBLEdBQUcsQ0FBQ0csSUFBSixDQUFTdEIsU0FBUyxDQUFDa0IsRUFBRCxFQUFLakIsR0FBTCxDQUFULENBQW1CSyxHQUFuQixFQUF3QkMsTUFBeEIsQ0FBVDtBQUNELEtBRkQsTUFFTyxJQUFJRCxHQUFHLENBQUNILEdBQUQsQ0FBUCxFQUFjO0FBQ25CRyxNQUFBQSxHQUFHLENBQUNILEdBQUQsQ0FBSCxDQUFTRCxHQUFULElBQXVCa0IsSUFBSSxHQUFHZCxHQUFHLENBQUNELEtBQUQsQ0FBTixHQUFnQkEsS0FBM0M7QUFDRDs7QUFFRCxXQUFPLENBQUNDLEdBQUQsRUFBTWEsR0FBTixDQUFQO0FBQ0QsR0FSRCxDQVFFLE9BQU9JLENBQVAsRUFBVTtBQUNWQyxJQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBY0YsQ0FBZCxFQUFpQkwsRUFBakIsRUFBcUIsaUJBQUtaLEdBQUwsQ0FBckI7QUFFQSxXQUFPLENBQUNBLEdBQUQsRUFBTWEsR0FBTixDQUFQO0FBQ0Q7QUFDRixDQWhCRDs7ZUFrQmVGLEsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBBdXRvbWVyZ2UgZnJvbSAnYXV0b21lcmdlJ1xuaW1wb3J0IHsgRWxlbWVudCwgTm9kZSB9IGZyb20gJ3NsYXRlJ1xuXG5pbXBvcnQgeyB0b1NsYXRlUGF0aCwgdG9KUyB9IGZyb20gJy4uL3V0aWxzJ1xuXG5leHBvcnQgY29uc3Qgc2V0RGF0YU9wID0gKFxuICB7IGtleSA9ICcnLCBvYmosIHBhdGgsIHZhbHVlIH06IEF1dG9tZXJnZS5EaWZmLFxuICBkb2M6IGFueVxuKSA9PiAobWFwOiBhbnksIHRtcERvYzogRWxlbWVudCkgPT4ge1xuICBjb25zdCBzbGF0ZVBhdGggPSB0b1NsYXRlUGF0aChwYXRoKVxuICBjb25zdCBub2RlID0gTm9kZS5nZXQodG1wRG9jLCBzbGF0ZVBhdGgpXG4gIGNvbnN0IG9sZFZhbHVlID0gbm9kZVtrZXldXG4gIGNvbnN0IG5ld1ZhbHVlID0gdG9KUyhtYXA/Llt2YWx1ZV0gfHwgdmFsdWUpXG4gIG1hcFtvYmpdID0gbm9kZSAvLyBub2RlIGZyb20gdG1wRG9jIGlzIHRoZSBuZXdlc3QgdmFsdWUgYXQgdGhlIG1vbWVudCwga2VlcCBtYXAgc3luY1xuXG4gIGlmIChuZXdWYWx1ZSA9PSBudWxsKSB7XG4gICAgLy8gc2xhdGUgZG9lcyB0aGlzIGNoZWNrLlxuICAgIGRlbGV0ZSBub2RlW2tleV1cbiAgfSBlbHNlIHtcbiAgICBub2RlW2tleV0gPSBuZXdWYWx1ZVxuICB9XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ3NldF9ub2RlJyxcbiAgICBwYXRoOiBzbGF0ZVBhdGgsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgW2tleV06IHRvSlMob2xkVmFsdWUpXG4gICAgfSxcbiAgICBuZXdQcm9wZXJ0aWVzOiB7XG4gICAgICBba2V5XTogdG9KUyhuZXdWYWx1ZSlcbiAgICB9XG4gIH1cbn1cblxuY29uc3Qgb3BTZXQgPSAob3A6IEF1dG9tZXJnZS5EaWZmLCBbbWFwLCBvcHNdOiBhbnksIGRvYzogYW55LCB0bXBEb2M6IGFueSkgPT4ge1xuICBjb25zdCB7IGxpbmssIHZhbHVlLCBwYXRoLCBvYmosIGtleSB9ID0gb3BcblxuICB0cnkge1xuICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoICYmIHBhdGhbMF0gPT09ICdjaGlsZHJlbicpIHtcbiAgICAgIG9wcy5wdXNoKHNldERhdGFPcChvcCwgZG9jKShtYXAsIHRtcERvYykpXG4gICAgfSBlbHNlIGlmIChtYXBbb2JqXSkge1xuICAgICAgbWFwW29ial1ba2V5IGFzIGFueV0gPSBsaW5rID8gbWFwW3ZhbHVlXSA6IHZhbHVlXG4gICAgfVxuXG4gICAgcmV0dXJuIFttYXAsIG9wc11cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSwgb3AsIHRvSlMobWFwKSlcblxuICAgIHJldHVybiBbbWFwLCBvcHNdXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgb3BTZXRcbiJdfQ==