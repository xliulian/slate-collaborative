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
    var newCursorData = Object.assign(doc.cursors[id] && JSON.parse(doc.cursors[id]) || {}, newCursor, selection, _objectSpread(_objectSpread({}, cursorData), {}, {
      isForward: _slate.Range.isForward(selection)
    }));
    doc.cursors[id] = JSON.stringify(newCursorData);
  } else {
    delete doc.cursors[id];
  }

  return doc;
};

exports.setCursor = setCursor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jdXJzb3IvaW5kZXgudHMiXSwibmFtZXMiOlsic2V0Q3Vyc29yIiwiaWQiLCJzZWxlY3Rpb24iLCJkb2MiLCJvcGVyYXRpb25zIiwiY3Vyc29yRGF0YSIsImN1cnNvck9wcyIsImZpbHRlciIsIm9wIiwidHlwZSIsImN1cnNvcnMiLCJuZXdDdXJzb3IiLCJsZW5ndGgiLCJuZXdQcm9wZXJ0aWVzIiwibmV3Q3Vyc29yRGF0YSIsIk9iamVjdCIsImFzc2lnbiIsIkpTT04iLCJwYXJzZSIsImlzRm9yd2FyZCIsIlJhbmdlIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7O0FBSU8sSUFBTUEsU0FBUyxHQUFHLFNBQVpBLFNBQVksQ0FDdkJDLEVBRHVCLEVBRXZCQyxTQUZ1QixFQUd2QkMsR0FIdUIsRUFJdkJDLFVBSnVCLEVBS3ZCQyxVQUx1QixFQU1wQjtBQUFBOztBQUNILE1BQU1DLFNBQVMsR0FBR0YsVUFBVSxDQUFDRyxNQUFYLENBQWtCLFVBQUFDLEVBQUU7QUFBQSxXQUFJQSxFQUFFLENBQUNDLElBQUgsS0FBWSxlQUFoQjtBQUFBLEdBQXBCLENBQWxCO0FBRUEsTUFBSSxDQUFDTixHQUFHLENBQUNPLE9BQVQsRUFBa0JQLEdBQUcsQ0FBQ08sT0FBSixHQUFjLEVBQWQ7QUFFbEIsTUFBTUMsU0FBUyxHQUFHLGVBQUFMLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDTSxNQUFWLEdBQW1CLENBQXBCLENBQVQsMERBQWlDQyxhQUFqQyxLQUFrRCxFQUFwRTs7QUFFQSxNQUFJWCxTQUFKLEVBQWU7QUFDYixRQUFNWSxhQUFhLEdBQUdDLE1BQU0sQ0FBQ0MsTUFBUCxDQUNuQmIsR0FBRyxDQUFDTyxPQUFKLENBQVlULEVBQVosS0FBbUJnQixJQUFJLENBQUNDLEtBQUwsQ0FBV2YsR0FBRyxDQUFDTyxPQUFKLENBQVlULEVBQVosQ0FBWCxDQUFwQixJQUFvRCxFQURoQyxFQUVwQlUsU0FGb0IsRUFHcEJULFNBSG9CLGtDQUtmRyxVQUxlO0FBTWxCYyxNQUFBQSxTQUFTLEVBQUVDLGFBQU1ELFNBQU4sQ0FBZ0JqQixTQUFoQjtBQU5PLE9BQXRCO0FBVUFDLElBQUFBLEdBQUcsQ0FBQ08sT0FBSixDQUFZVCxFQUFaLElBQWtCZ0IsSUFBSSxDQUFDSSxTQUFMLENBQWVQLGFBQWYsQ0FBbEI7QUFDRCxHQVpELE1BWU87QUFDTCxXQUFPWCxHQUFHLENBQUNPLE9BQUosQ0FBWVQsRUFBWixDQUFQO0FBQ0Q7O0FBRUQsU0FBT0UsR0FBUDtBQUNELENBOUJNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0aW9uLCBSYW5nZSB9IGZyb20gJ3NsYXRlJ1xuXG5pbXBvcnQgeyBDdXJzb3JEYXRhIH0gZnJvbSAnLi4vbW9kZWwnXG5cbmV4cG9ydCBjb25zdCBzZXRDdXJzb3IgPSAoXG4gIGlkOiBzdHJpbmcsXG4gIHNlbGVjdGlvbjogUmFuZ2UgfCBudWxsLFxuICBkb2M6IGFueSxcbiAgb3BlcmF0aW9uczogT3BlcmF0aW9uW10sXG4gIGN1cnNvckRhdGE6IEN1cnNvckRhdGFcbikgPT4ge1xuICBjb25zdCBjdXJzb3JPcHMgPSBvcGVyYXRpb25zLmZpbHRlcihvcCA9PiBvcC50eXBlID09PSAnc2V0X3NlbGVjdGlvbicpXG5cbiAgaWYgKCFkb2MuY3Vyc29ycykgZG9jLmN1cnNvcnMgPSB7fVxuXG4gIGNvbnN0IG5ld0N1cnNvciA9IGN1cnNvck9wc1tjdXJzb3JPcHMubGVuZ3RoIC0gMV0/Lm5ld1Byb3BlcnRpZXMgfHwge31cblxuICBpZiAoc2VsZWN0aW9uKSB7XG4gICAgY29uc3QgbmV3Q3Vyc29yRGF0YSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAoZG9jLmN1cnNvcnNbaWRdICYmIEpTT04ucGFyc2UoZG9jLmN1cnNvcnNbaWRdKSkgfHwge30sXG4gICAgICBuZXdDdXJzb3IsXG4gICAgICBzZWxlY3Rpb24sXG4gICAgICB7XG4gICAgICAgIC4uLmN1cnNvckRhdGEsXG4gICAgICAgIGlzRm9yd2FyZDogUmFuZ2UuaXNGb3J3YXJkKHNlbGVjdGlvbilcbiAgICAgIH1cbiAgICApXG5cbiAgICBkb2MuY3Vyc29yc1tpZF0gPSBKU09OLnN0cmluZ2lmeShuZXdDdXJzb3JEYXRhKVxuICB9IGVsc2Uge1xuICAgIGRlbGV0ZSBkb2MuY3Vyc29yc1tpZF1cbiAgfVxuXG4gIHJldHVybiBkb2Ncbn1cbiJdfQ==