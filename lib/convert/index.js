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
  var tempDoc = (0, _utils.toJS)(doc);

  var iterate = function iterate(acc, op) {
    var action = byAction[op.action];
    var result = action ? action(op, acc, doc, tempDoc) : acc;
    return result;
  };

  var _ops$reduce = ops.reduce(iterate, [_defineProperty({}, rootKey, {}), []]),
      _ops$reduce2 = _slicedToArray(_ops$reduce, 2),
      tempTree = _ops$reduce2[0],
      defer = _ops$reduce2[1];

  return defer.flatMap(function (op) {
    return op;
  }).filter(function (op) {
    return op;
  });
};

exports.toSlateOp = toSlateOp;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L2luZGV4LnRzIl0sIm5hbWVzIjpbImJ5QWN0aW9uIiwiY3JlYXRlIiwib3BDcmVhdGUiLCJyZW1vdmUiLCJvcFJlbW92ZSIsInNldCIsIm9wU2V0IiwiaW5zZXJ0Iiwib3BJbnNlcnQiLCJyb290S2V5IiwidG9TbGF0ZU9wIiwib3BzIiwiZG9jIiwidGVtcERvYyIsIml0ZXJhdGUiLCJhY2MiLCJvcCIsImFjdGlvbiIsInJlc3VsdCIsInJlZHVjZSIsInRlbXBUcmVlIiwiZGVmZXIiLCJmbGF0TWFwIiwiZmlsdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlBLElBQU1BLFFBQVEsR0FBRztBQUNmQyxFQUFBQSxNQUFNLEVBQUVDLGtCQURPO0FBRWZDLEVBQUFBLE1BQU0sRUFBRUMsa0JBRk87QUFHZkMsRUFBQUEsR0FBRyxFQUFFQyxlQUhVO0FBSWZDLEVBQUFBLE1BQU0sRUFBRUM7QUFKTyxDQUFqQjtBQU9BLElBQU1DLE9BQU8sR0FBRyxzQ0FBaEI7O0FBRUEsSUFBTUMsU0FBUyxHQUFHLFNBQVpBLFNBQVksQ0FBQ0MsR0FBRCxFQUF3QkMsR0FBeEIsRUFBeUM7QUFDekQsTUFBTUMsT0FBTyxHQUFHLGlCQUFLRCxHQUFMLENBQWhCOztBQUVBLE1BQU1FLE9BQU8sR0FBRyxTQUFWQSxPQUFVLENBQUNDLEdBQUQsRUFBb0JDLEVBQXBCLEVBQWdEO0FBQzlELFFBQU1DLE1BQU0sR0FBR2pCLFFBQVEsQ0FBQ2dCLEVBQUUsQ0FBQ0MsTUFBSixDQUF2QjtBQUVBLFFBQU1DLE1BQU0sR0FBR0QsTUFBTSxHQUFHQSxNQUFNLENBQUNELEVBQUQsRUFBS0QsR0FBTCxFQUFVSCxHQUFWLEVBQWVDLE9BQWYsQ0FBVCxHQUFtQ0UsR0FBeEQ7QUFFQSxXQUFPRyxNQUFQO0FBQ0QsR0FORDs7QUFIeUQsb0JBVy9CUCxHQUFHLENBQUNRLE1BQUosQ0FBV0wsT0FBWCxFQUFvQixxQkFFekNMLE9BRnlDLEVBRS9CLEVBRitCLEdBSTVDLEVBSjRDLENBQXBCLENBWCtCO0FBQUE7QUFBQSxNQVdsRFcsUUFYa0Q7QUFBQSxNQVd4Q0MsS0FYd0M7O0FBa0J6RCxTQUFPQSxLQUFLLENBQUNDLE9BQU4sQ0FBYyxVQUFBTixFQUFFO0FBQUEsV0FBSUEsRUFBSjtBQUFBLEdBQWhCLEVBQXdCTyxNQUF4QixDQUErQixVQUFBUCxFQUFFO0FBQUEsV0FBSUEsRUFBSjtBQUFBLEdBQWpDLENBQVA7QUFDRCxDQW5CRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEF1dG9tZXJnZSBmcm9tICdhdXRvbWVyZ2UnXG5cbmltcG9ydCBvcEluc2VydCBmcm9tICcuL2luc2VydCdcbmltcG9ydCBvcFJlbW92ZSBmcm9tICcuL3JlbW92ZSdcbmltcG9ydCBvcFNldCBmcm9tICcuL3NldCdcbmltcG9ydCBvcENyZWF0ZSBmcm9tICcuL2NyZWF0ZSdcblxuaW1wb3J0IHsgdG9KUyB9IGZyb20gJy4uL3V0aWxzJ1xuXG5pbXBvcnQgeyBTeW5jRG9jIH0gZnJvbSAnLi4vbW9kZWwnXG5cbmNvbnN0IGJ5QWN0aW9uID0ge1xuICBjcmVhdGU6IG9wQ3JlYXRlLFxuICByZW1vdmU6IG9wUmVtb3ZlLFxuICBzZXQ6IG9wU2V0LFxuICBpbnNlcnQ6IG9wSW5zZXJ0XG59XG5cbmNvbnN0IHJvb3RLZXkgPSAnMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwJ1xuXG5jb25zdCB0b1NsYXRlT3AgPSAob3BzOiBBdXRvbWVyZ2UuRGlmZltdLCBkb2M6IFN5bmNEb2MpID0+IHtcbiAgY29uc3QgdGVtcERvYyA9IHRvSlMoZG9jKVxuXG4gIGNvbnN0IGl0ZXJhdGUgPSAoYWNjOiBbYW55LCBhbnlbXV0sIG9wOiBBdXRvbWVyZ2UuRGlmZik6IGFueSA9PiB7XG4gICAgY29uc3QgYWN0aW9uID0gYnlBY3Rpb25bb3AuYWN0aW9uXVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYWN0aW9uID8gYWN0aW9uKG9wLCBhY2MsIGRvYywgdGVtcERvYykgOiBhY2NcblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIGNvbnN0IFt0ZW1wVHJlZSwgZGVmZXJdID0gb3BzLnJlZHVjZShpdGVyYXRlLCBbXG4gICAge1xuICAgICAgW3Jvb3RLZXldOiB7fVxuICAgIH0sXG4gICAgW11cbiAgXSlcblxuICByZXR1cm4gZGVmZXIuZmxhdE1hcChvcCA9PiBvcCkuZmlsdGVyKG9wID0+IG9wKVxufVxuXG5leHBvcnQgeyB0b1NsYXRlT3AgfVxuIl19