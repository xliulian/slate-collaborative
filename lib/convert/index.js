"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toSlateOp = void 0;

var _insert = _interopRequireDefault(require("./insert"));

var _remove = _interopRequireDefault(require("./remove"));

var _set = _interopRequireDefault(require("./set"));

var _create = _interopRequireDefault(require("./create"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var byAction = {
  create: _create["default"],
  remove: _remove["default"],
  set: _set["default"],
  insert: _insert["default"]
};
var rootKey = '00000000-0000-0000-0000-000000000000';

var toSlateOp = function toSlateOp(ops, doc) {
  var iterate = function iterate(acc, op) {
    var action = byAction[op.action];
    var result = action ? action(op, acc, doc) : acc;
    return result;
  };

  var _ops$reduce = ops.reduce(iterate, [_defineProperty({}, rootKey, {}), []]),
      _ops$reduce2 = _slicedToArray(_ops$reduce, 2),
      tempTree = _ops$reduce2[0],
      defer = _ops$reduce2[1];

  var tempDoc = (0, _utils.toJS)(doc);
  return defer.flatMap(function (op) {
    return op(tempTree, tempDoc);
  }).filter(function (op) {
    return op;
  });
};

exports.toSlateOp = toSlateOp;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L2luZGV4LnRzIl0sIm5hbWVzIjpbImJ5QWN0aW9uIiwiY3JlYXRlIiwib3BDcmVhdGUiLCJyZW1vdmUiLCJvcFJlbW92ZSIsInNldCIsIm9wU2V0IiwiaW5zZXJ0Iiwib3BJbnNlcnQiLCJyb290S2V5IiwidG9TbGF0ZU9wIiwib3BzIiwiZG9jIiwiaXRlcmF0ZSIsImFjYyIsIm9wIiwiYWN0aW9uIiwicmVzdWx0IiwicmVkdWNlIiwidGVtcFRyZWUiLCJkZWZlciIsInRlbXBEb2MiLCJmbGF0TWFwIiwiZmlsdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlBLElBQU1BLFFBQVEsR0FBRztBQUNmQyxFQUFBQSxNQUFNLEVBQUVDLGtCQURPO0FBRWZDLEVBQUFBLE1BQU0sRUFBRUMsa0JBRk87QUFHZkMsRUFBQUEsR0FBRyxFQUFFQyxlQUhVO0FBSWZDLEVBQUFBLE1BQU0sRUFBRUM7QUFKTyxDQUFqQjtBQU9BLElBQU1DLE9BQU8sR0FBRyxzQ0FBaEI7O0FBRUEsSUFBTUMsU0FBUyxHQUFHLFNBQVpBLFNBQVksQ0FBQ0MsR0FBRCxFQUF3QkMsR0FBeEIsRUFBeUM7QUFDekQsTUFBTUMsT0FBTyxHQUFHLFNBQVZBLE9BQVUsQ0FBQ0MsR0FBRCxFQUFvQkMsRUFBcEIsRUFBZ0Q7QUFDOUQsUUFBTUMsTUFBTSxHQUFHaEIsUUFBUSxDQUFDZSxFQUFFLENBQUNDLE1BQUosQ0FBdkI7QUFFQSxRQUFNQyxNQUFNLEdBQUdELE1BQU0sR0FBR0EsTUFBTSxDQUFDRCxFQUFELEVBQUtELEdBQUwsRUFBVUYsR0FBVixDQUFULEdBQTBCRSxHQUEvQztBQUVBLFdBQU9HLE1BQVA7QUFDRCxHQU5EOztBQUR5RCxvQkFTL0JOLEdBQUcsQ0FBQ08sTUFBSixDQUFXTCxPQUFYLEVBQW9CLHFCQUV6Q0osT0FGeUMsRUFFL0IsRUFGK0IsR0FJNUMsRUFKNEMsQ0FBcEIsQ0FUK0I7QUFBQTtBQUFBLE1BU2xEVSxRQVRrRDtBQUFBLE1BU3hDQyxLQVR3Qzs7QUFnQnpELE1BQU1DLE9BQU8sR0FBRyxpQkFBS1QsR0FBTCxDQUFoQjtBQUVBLFNBQU9RLEtBQUssQ0FBQ0UsT0FBTixDQUFjLFVBQUFQLEVBQUU7QUFBQSxXQUFJQSxFQUFFLENBQUNJLFFBQUQsRUFBV0UsT0FBWCxDQUFOO0FBQUEsR0FBaEIsRUFBMkNFLE1BQTNDLENBQWtELFVBQUFSLEVBQUU7QUFBQSxXQUFJQSxFQUFKO0FBQUEsR0FBcEQsQ0FBUDtBQUNELENBbkJEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQXV0b21lcmdlIGZyb20gJ2F1dG9tZXJnZSdcblxuaW1wb3J0IG9wSW5zZXJ0IGZyb20gJy4vaW5zZXJ0J1xuaW1wb3J0IG9wUmVtb3ZlIGZyb20gJy4vcmVtb3ZlJ1xuaW1wb3J0IG9wU2V0IGZyb20gJy4vc2V0J1xuaW1wb3J0IG9wQ3JlYXRlIGZyb20gJy4vY3JlYXRlJ1xuXG5pbXBvcnQgeyB0b0pTIH0gZnJvbSAnLi4vdXRpbHMnXG5cbmltcG9ydCB7IFN5bmNEb2MgfSBmcm9tICcuLi9tb2RlbCdcblxuY29uc3QgYnlBY3Rpb24gPSB7XG4gIGNyZWF0ZTogb3BDcmVhdGUsXG4gIHJlbW92ZTogb3BSZW1vdmUsXG4gIHNldDogb3BTZXQsXG4gIGluc2VydDogb3BJbnNlcnRcbn1cblxuY29uc3Qgcm9vdEtleSA9ICcwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAnXG5cbmNvbnN0IHRvU2xhdGVPcCA9IChvcHM6IEF1dG9tZXJnZS5EaWZmW10sIGRvYzogU3luY0RvYykgPT4ge1xuICBjb25zdCBpdGVyYXRlID0gKGFjYzogW2FueSwgYW55W11dLCBvcDogQXV0b21lcmdlLkRpZmYpOiBhbnkgPT4ge1xuICAgIGNvbnN0IGFjdGlvbiA9IGJ5QWN0aW9uW29wLmFjdGlvbl1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGFjdGlvbiA/IGFjdGlvbihvcCwgYWNjLCBkb2MpIDogYWNjXG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBjb25zdCBbdGVtcFRyZWUsIGRlZmVyXSA9IG9wcy5yZWR1Y2UoaXRlcmF0ZSwgW1xuICAgIHtcbiAgICAgIFtyb290S2V5XToge31cbiAgICB9LFxuICAgIFtdXG4gIF0pXG5cbiAgY29uc3QgdGVtcERvYyA9IHRvSlMoZG9jKVxuXG4gIHJldHVybiBkZWZlci5mbGF0TWFwKG9wID0+IG9wKHRlbXBUcmVlLCB0ZW1wRG9jKSkuZmlsdGVyKG9wID0+IG9wKVxufVxuXG5leHBvcnQgeyB0b1NsYXRlT3AgfVxuIl19