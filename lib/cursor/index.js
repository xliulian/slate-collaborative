"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCursor = void 0;

var _slate = require("slate");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var setCursor = function setCursor(id, selection, doc, operations, cursorData) {
  var _cursorOps;

  var cursorOps = operations.filter(function (op) {
    return op.type === 'set_selection';
  });
  if (!doc.cursors) doc.cursors = {};
  var newCursor = ((_cursorOps = cursorOps[cursorOps.length - 1]) === null || _cursorOps === void 0 ? void 0 : _cursorOps.newProperties) || {};

  if (selection) {
    var oldCursorData = doc.cursors[id] && JSON.parse(doc.cursors[id]) || {};
    var newCursorData = Object.assign(oldCursorData, newCursor, selection, _objectSpread(_objectSpread({}, cursorData), {}, {
      isForward: _slate.Range.isForward(selection),
      seq: (oldCursorData.seq || 0) + 1
    }));
    doc.cursors[id] = JSON.stringify(newCursorData);
  } else {
    delete doc.cursors[id];
  }

  return doc;
};

exports.setCursor = setCursor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jdXJzb3IvaW5kZXgudHMiXSwibmFtZXMiOlsic2V0Q3Vyc29yIiwiaWQiLCJzZWxlY3Rpb24iLCJkb2MiLCJvcGVyYXRpb25zIiwiY3Vyc29yRGF0YSIsImN1cnNvck9wcyIsImZpbHRlciIsIm9wIiwidHlwZSIsImN1cnNvcnMiLCJuZXdDdXJzb3IiLCJsZW5ndGgiLCJuZXdQcm9wZXJ0aWVzIiwib2xkQ3Vyc29yRGF0YSIsIkpTT04iLCJwYXJzZSIsIm5ld0N1cnNvckRhdGEiLCJPYmplY3QiLCJhc3NpZ24iLCJpc0ZvcndhcmQiLCJSYW5nZSIsInNlcSIsInN0cmluZ2lmeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7OztBQUlPLElBQU1BLFNBQVMsR0FBRyxTQUFaQSxTQUFZLENBQ3ZCQyxFQUR1QixFQUV2QkMsU0FGdUIsRUFHdkJDLEdBSHVCLEVBSXZCQyxVQUp1QixFQUt2QkMsVUFMdUIsRUFNcEI7QUFBQTs7QUFDSCxNQUFNQyxTQUFTLEdBQUdGLFVBQVUsQ0FBQ0csTUFBWCxDQUFrQixVQUFBQyxFQUFFO0FBQUEsV0FBSUEsRUFBRSxDQUFDQyxJQUFILEtBQVksZUFBaEI7QUFBQSxHQUFwQixDQUFsQjtBQUVBLE1BQUksQ0FBQ04sR0FBRyxDQUFDTyxPQUFULEVBQWtCUCxHQUFHLENBQUNPLE9BQUosR0FBYyxFQUFkO0FBRWxCLE1BQU1DLFNBQVMsR0FBRyxlQUFBTCxTQUFTLENBQUNBLFNBQVMsQ0FBQ00sTUFBVixHQUFtQixDQUFwQixDQUFULDBEQUFpQ0MsYUFBakMsS0FBa0QsRUFBcEU7O0FBRUEsTUFBSVgsU0FBSixFQUFlO0FBQ2IsUUFBTVksYUFBYSxHQUFJWCxHQUFHLENBQUNPLE9BQUosQ0FBWVQsRUFBWixLQUFtQmMsSUFBSSxDQUFDQyxLQUFMLENBQVdiLEdBQUcsQ0FBQ08sT0FBSixDQUFZVCxFQUFaLENBQVgsQ0FBcEIsSUFBb0QsRUFBMUU7QUFDQSxRQUFNZ0IsYUFBYSxHQUFHQyxNQUFNLENBQUNDLE1BQVAsQ0FBY0wsYUFBZCxFQUE2QkgsU0FBN0IsRUFBd0NULFNBQXhDLGtDQUNqQkcsVUFEaUI7QUFFcEJlLE1BQUFBLFNBQVMsRUFBRUMsYUFBTUQsU0FBTixDQUFnQmxCLFNBQWhCLENBRlM7QUFHcEJvQixNQUFBQSxHQUFHLEVBQUUsQ0FBQ1IsYUFBYSxDQUFDUSxHQUFkLElBQXFCLENBQXRCLElBQTJCO0FBSFosT0FBdEI7QUFNQW5CLElBQUFBLEdBQUcsQ0FBQ08sT0FBSixDQUFZVCxFQUFaLElBQWtCYyxJQUFJLENBQUNRLFNBQUwsQ0FBZU4sYUFBZixDQUFsQjtBQUNELEdBVEQsTUFTTztBQUNMLFdBQU9kLEdBQUcsQ0FBQ08sT0FBSixDQUFZVCxFQUFaLENBQVA7QUFDRDs7QUFFRCxTQUFPRSxHQUFQO0FBQ0QsQ0EzQk0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRpb24sIFJhbmdlIH0gZnJvbSAnc2xhdGUnXG5cbmltcG9ydCB7IEN1cnNvckRhdGEgfSBmcm9tICcuLi9tb2RlbCdcblxuZXhwb3J0IGNvbnN0IHNldEN1cnNvciA9IChcbiAgaWQ6IHN0cmluZyxcbiAgc2VsZWN0aW9uOiBSYW5nZSB8IG51bGwsXG4gIGRvYzogYW55LFxuICBvcGVyYXRpb25zOiBPcGVyYXRpb25bXSxcbiAgY3Vyc29yRGF0YTogQ3Vyc29yRGF0YVxuKSA9PiB7XG4gIGNvbnN0IGN1cnNvck9wcyA9IG9wZXJhdGlvbnMuZmlsdGVyKG9wID0+IG9wLnR5cGUgPT09ICdzZXRfc2VsZWN0aW9uJylcblxuICBpZiAoIWRvYy5jdXJzb3JzKSBkb2MuY3Vyc29ycyA9IHt9XG5cbiAgY29uc3QgbmV3Q3Vyc29yID0gY3Vyc29yT3BzW2N1cnNvck9wcy5sZW5ndGggLSAxXT8ubmV3UHJvcGVydGllcyB8fCB7fVxuXG4gIGlmIChzZWxlY3Rpb24pIHtcbiAgICBjb25zdCBvbGRDdXJzb3JEYXRhID0gKGRvYy5jdXJzb3JzW2lkXSAmJiBKU09OLnBhcnNlKGRvYy5jdXJzb3JzW2lkXSkpIHx8IHt9XG4gICAgY29uc3QgbmV3Q3Vyc29yRGF0YSA9IE9iamVjdC5hc3NpZ24ob2xkQ3Vyc29yRGF0YSwgbmV3Q3Vyc29yLCBzZWxlY3Rpb24sIHtcbiAgICAgIC4uLmN1cnNvckRhdGEsXG4gICAgICBpc0ZvcndhcmQ6IFJhbmdlLmlzRm9yd2FyZChzZWxlY3Rpb24pLFxuICAgICAgc2VxOiAob2xkQ3Vyc29yRGF0YS5zZXEgfHwgMCkgKyAxXG4gICAgfSlcblxuICAgIGRvYy5jdXJzb3JzW2lkXSA9IEpTT04uc3RyaW5naWZ5KG5ld0N1cnNvckRhdGEpXG4gIH0gZWxzZSB7XG4gICAgZGVsZXRlIGRvYy5jdXJzb3JzW2lkXVxuICB9XG5cbiAgcmV0dXJuIGRvY1xufVxuIl19