"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  toJS: true,
  toSlatePath: true,
  cloneNode: true,
  toCollabAction: true,
  toSync: true,
  hexGen: true
};
Object.defineProperty(exports, "toSync", {
  enumerable: true,
  get: function get() {
    return _toSync["default"];
  }
});
Object.defineProperty(exports, "hexGen", {
  enumerable: true,
  get: function get() {
    return _hexGen["default"];
  }
});
exports.toCollabAction = exports.cloneNode = exports.toSlatePath = exports.toJS = void 0;

var _toSync = _interopRequireDefault(require("./toSync"));

var _hexGen = _interopRequireDefault(require("./hexGen"));

var _testUtils = require("./testUtils");

Object.keys(_testUtils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _testUtils[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _testUtils[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var toJS = function toJS(node) {
  try {
    return JSON.parse(JSON.stringify(node));
  } catch (e) {
    console.error('Convert to js failed!!! Return null');
    return null;
  }
};

exports.toJS = toJS;

var cloneNode = function cloneNode(node) {
  return (0, _toSync["default"])(toJS(node));
};

exports.cloneNode = cloneNode;

var toSlatePath = function toSlatePath(path) {
  return path ? path.filter(function (d) {
    return Number.isInteger(d);
  }) : [];
};

exports.toSlatePath = toSlatePath;

var toCollabAction = function toCollabAction(type, fn) {
  return function (payload) {
    return fn({
      type: type,
      payload: payload
    });
  };
};

exports.toCollabAction = toCollabAction;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9pbmRleC50cyJdLCJuYW1lcyI6WyJ0b0pTIiwibm9kZSIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJjbG9uZU5vZGUiLCJ0b1NsYXRlUGF0aCIsInBhdGgiLCJmaWx0ZXIiLCJkIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidG9Db2xsYWJBY3Rpb24iLCJ0eXBlIiwiZm4iLCJwYXlsb2FkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFJQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBRUEsSUFBTUEsSUFBSSxHQUFHLFNBQVBBLElBQU8sQ0FBQ0MsSUFBRCxFQUFlO0FBQzFCLE1BQUk7QUFDRixXQUFPQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0QsSUFBSSxDQUFDRSxTQUFMLENBQWVILElBQWYsQ0FBWCxDQUFQO0FBQ0QsR0FGRCxDQUVFLE9BQU9JLENBQVAsRUFBVTtBQUNWQyxJQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyxxQ0FBZDtBQUNBLFdBQU8sSUFBUDtBQUNEO0FBQ0YsQ0FQRDs7OztBQVNBLElBQU1DLFNBQVMsR0FBRyxTQUFaQSxTQUFZLENBQUNQLElBQUQ7QUFBQSxTQUFlLHdCQUFPRCxJQUFJLENBQUNDLElBQUQsQ0FBWCxDQUFmO0FBQUEsQ0FBbEI7Ozs7QUFFQSxJQUFNUSxXQUFXLEdBQUcsU0FBZEEsV0FBYyxDQUFDQyxJQUFEO0FBQUEsU0FDbEJBLElBQUksR0FBR0EsSUFBSSxDQUFDQyxNQUFMLENBQVksVUFBQ0MsQ0FBRDtBQUFBLFdBQVlDLE1BQU0sQ0FBQ0MsU0FBUCxDQUFpQkYsQ0FBakIsQ0FBWjtBQUFBLEdBQVosQ0FBSCxHQUFrRCxFQURwQztBQUFBLENBQXBCOzs7O0FBR0EsSUFBTUcsY0FBYyxHQUFHLFNBQWpCQSxjQUFpQixDQUFDQyxJQUFELEVBQVlDLEVBQVo7QUFBQSxTQUFtRCxVQUN4RUMsT0FEd0U7QUFBQSxXQUVyRUQsRUFBRSxDQUFDO0FBQUVELE1BQUFBLElBQUksRUFBSkEsSUFBRjtBQUFRRSxNQUFBQSxPQUFPLEVBQVBBO0FBQVIsS0FBRCxDQUZtRTtBQUFBLEdBQW5EO0FBQUEsQ0FBdkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdG9TeW5jIGZyb20gJy4vdG9TeW5jJ1xuaW1wb3J0IGhleEdlbiBmcm9tICcuL2hleEdlbidcblxuaW1wb3J0IHsgQ29sbGFiQWN0aW9uIH0gZnJvbSAnLi4vbW9kZWwnXG5cbmV4cG9ydCAqIGZyb20gJy4vdGVzdFV0aWxzJ1xuXG5jb25zdCB0b0pTID0gKG5vZGU6IGFueSkgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG5vZGUpKVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcignQ29udmVydCB0byBqcyBmYWlsZWQhISEgUmV0dXJuIG51bGwnKVxuICAgIHJldHVybiBudWxsXG4gIH1cbn1cblxuY29uc3QgY2xvbmVOb2RlID0gKG5vZGU6IGFueSkgPT4gdG9TeW5jKHRvSlMobm9kZSkpXG5cbmNvbnN0IHRvU2xhdGVQYXRoID0gKHBhdGg6IGFueSkgPT5cbiAgcGF0aCA/IHBhdGguZmlsdGVyKChkOiBhbnkpID0+IE51bWJlci5pc0ludGVnZXIoZCkpIDogW11cblxuY29uc3QgdG9Db2xsYWJBY3Rpb24gPSAodHlwZTogYW55LCBmbjogKGFjdGlvbjogQ29sbGFiQWN0aW9uKSA9PiB2b2lkKSA9PiAoXG4gIHBheWxvYWQ6IGFueVxuKSA9PiBmbih7IHR5cGUsIHBheWxvYWQgfSlcblxuZXhwb3J0IHsgdG9TeW5jLCB0b0pTLCB0b1NsYXRlUGF0aCwgaGV4R2VuLCBjbG9uZU5vZGUsIHRvQ29sbGFiQWN0aW9uIH1cbiJdfQ==