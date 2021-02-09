"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applySlateOps = exports.applyOperation = void 0;

var _node = _interopRequireDefault(require("./node"));

var _text = _interopRequireDefault(require("./text"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var setSelection = function setSelection(doc) {
  return doc;
};

var opType = _objectSpread(_objectSpread(_objectSpread({}, _text["default"]), _node["default"]), {}, {
  set_selection: setSelection
});

var applyOperation = function applyOperation(doc, op) {
  try {
    var applyOp = opType[op.type];

    if (!applyOp) {
      throw new TypeError("Unsupported operation type: ".concat(op.type, "!"));
    }

    return applyOp(doc, op);
  } catch (e) {
    console.error(e, op, (0, _utils.toJS)(doc));
    return doc;
  }
};

exports.applyOperation = applyOperation;

var applySlateOps = function applySlateOps(doc, operations) {
  return operations.reduce(applyOperation, doc);
};

exports.applySlateOps = applySlateOps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHBseS9pbmRleC50cyJdLCJuYW1lcyI6WyJzZXRTZWxlY3Rpb24iLCJkb2MiLCJvcFR5cGUiLCJ0ZXh0Iiwibm9kZSIsInNldF9zZWxlY3Rpb24iLCJhcHBseU9wZXJhdGlvbiIsIm9wIiwiYXBwbHlPcCIsInR5cGUiLCJUeXBlRXJyb3IiLCJlIiwiY29uc29sZSIsImVycm9yIiwiYXBwbHlTbGF0ZU9wcyIsIm9wZXJhdGlvbnMiLCJyZWR1Y2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFHQTs7Ozs7Ozs7OztBQUVBLElBQU1BLFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQUNDLEdBQUQ7QUFBQSxTQUFjQSxHQUFkO0FBQUEsQ0FBckI7O0FBRUEsSUFBTUMsTUFBTSxpREFDUEMsZ0JBRE8sR0FFUEMsZ0JBRk87QUFHVkMsRUFBQUEsYUFBYSxFQUFFTDtBQUhMLEVBQVo7O0FBTUEsSUFBTU0sY0FBYyxHQUFHLFNBQWpCQSxjQUFpQixDQUFDTCxHQUFELEVBQWlCTSxFQUFqQixFQUE4QztBQUNuRSxNQUFJO0FBQ0YsUUFBTUMsT0FBTyxHQUFHTixNQUFNLENBQUNLLEVBQUUsQ0FBQ0UsSUFBSixDQUF0Qjs7QUFFQSxRQUFJLENBQUNELE9BQUwsRUFBYztBQUNaLFlBQU0sSUFBSUUsU0FBSix1Q0FBNkNILEVBQUUsQ0FBQ0UsSUFBaEQsT0FBTjtBQUNEOztBQUVELFdBQU9ELE9BQU8sQ0FBQ1AsR0FBRCxFQUFNTSxFQUFOLENBQWQ7QUFDRCxHQVJELENBUUUsT0FBT0ksQ0FBUCxFQUFVO0FBQ1ZDLElBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjRixDQUFkLEVBQWlCSixFQUFqQixFQUFxQixpQkFBS04sR0FBTCxDQUFyQjtBQUVBLFdBQU9BLEdBQVA7QUFDRDtBQUNGLENBZEQ7Ozs7QUFnQkEsSUFBTWEsYUFBYSxHQUFHLFNBQWhCQSxhQUFnQixDQUFDYixHQUFELEVBQWlCYyxVQUFqQixFQUF3RDtBQUM1RSxTQUFPQSxVQUFVLENBQUNDLE1BQVgsQ0FBa0JWLGNBQWxCLEVBQWtDTCxHQUFsQyxDQUFQO0FBQ0QsQ0FGRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdGlvbiB9IGZyb20gJ3NsYXRlJ1xuXG5pbXBvcnQgbm9kZSBmcm9tICcuL25vZGUnXG5pbXBvcnQgdGV4dCBmcm9tICcuL3RleHQnXG5cbmltcG9ydCB7IFN5bmNWYWx1ZSB9IGZyb20gJy4uL21vZGVsJ1xuaW1wb3J0IHsgdG9KUyB9IGZyb20gJy4uL3V0aWxzJ1xuXG5jb25zdCBzZXRTZWxlY3Rpb24gPSAoZG9jOiBhbnkpID0+IGRvY1xuXG5jb25zdCBvcFR5cGUgPSB7XG4gIC4uLnRleHQsXG4gIC4uLm5vZGUsXG4gIHNldF9zZWxlY3Rpb246IHNldFNlbGVjdGlvblxufVxuXG5jb25zdCBhcHBseU9wZXJhdGlvbiA9IChkb2M6IFN5bmNWYWx1ZSwgb3A6IE9wZXJhdGlvbik6IFN5bmNWYWx1ZSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgYXBwbHlPcCA9IG9wVHlwZVtvcC50eXBlXVxuXG4gICAgaWYgKCFhcHBseU9wKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBVbnN1cHBvcnRlZCBvcGVyYXRpb24gdHlwZTogJHtvcC50eXBlfSFgKVxuICAgIH1cblxuICAgIHJldHVybiBhcHBseU9wKGRvYywgb3AgYXMgYW55KVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlLCBvcCwgdG9KUyhkb2MpKVxuXG4gICAgcmV0dXJuIGRvY1xuICB9XG59XG5cbmNvbnN0IGFwcGx5U2xhdGVPcHMgPSAoZG9jOiBTeW5jVmFsdWUsIG9wZXJhdGlvbnM6IE9wZXJhdGlvbltdKTogU3luY1ZhbHVlID0+IHtcbiAgcmV0dXJuIG9wZXJhdGlvbnMucmVkdWNlKGFwcGx5T3BlcmF0aW9uLCBkb2MpXG59XG5cbmV4cG9ydCB7IGFwcGx5T3BlcmF0aW9uLCBhcHBseVNsYXRlT3BzIH1cbiJdfQ==