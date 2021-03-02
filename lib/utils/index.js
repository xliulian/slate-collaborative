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
  if (node === undefined) {
    return undefined;
  }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9pbmRleC50cyJdLCJuYW1lcyI6WyJ0b0pTIiwibm9kZSIsInVuZGVmaW5lZCIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJjbG9uZU5vZGUiLCJ0b1NsYXRlUGF0aCIsInBhdGgiLCJmaWx0ZXIiLCJkIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidG9Db2xsYWJBY3Rpb24iLCJ0eXBlIiwiZm4iLCJwYXlsb2FkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFJQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBRUEsSUFBTUEsSUFBSSxHQUFHLFNBQVBBLElBQU8sQ0FBQ0MsSUFBRCxFQUFlO0FBQzFCLE1BQUlBLElBQUksS0FBS0MsU0FBYixFQUF3QjtBQUN0QixXQUFPQSxTQUFQO0FBQ0Q7O0FBQ0QsTUFBSTtBQUNGLFdBQU9DLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNFLFNBQUwsQ0FBZUosSUFBZixDQUFYLENBQVA7QUFDRCxHQUZELENBRUUsT0FBT0ssQ0FBUCxFQUFVO0FBQ1ZDLElBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLHFDQUFkO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7QUFDRixDQVZEOzs7O0FBWUEsSUFBTUMsU0FBUyxHQUFHLFNBQVpBLFNBQVksQ0FBQ1IsSUFBRDtBQUFBLFNBQWUsd0JBQU9ELElBQUksQ0FBQ0MsSUFBRCxDQUFYLENBQWY7QUFBQSxDQUFsQjs7OztBQUVBLElBQU1TLFdBQVcsR0FBRyxTQUFkQSxXQUFjLENBQUNDLElBQUQ7QUFBQSxTQUNsQkEsSUFBSSxHQUFHQSxJQUFJLENBQUNDLE1BQUwsQ0FBWSxVQUFDQyxDQUFEO0FBQUEsV0FBWUMsTUFBTSxDQUFDQyxTQUFQLENBQWlCRixDQUFqQixDQUFaO0FBQUEsR0FBWixDQUFILEdBQWtELEVBRHBDO0FBQUEsQ0FBcEI7Ozs7QUFHQSxJQUFNRyxjQUFjLEdBQUcsU0FBakJBLGNBQWlCLENBQUNDLElBQUQsRUFBWUMsRUFBWjtBQUFBLFNBQW1ELFVBQ3hFQyxPQUR3RTtBQUFBLFdBRXJFRCxFQUFFLENBQUM7QUFBRUQsTUFBQUEsSUFBSSxFQUFKQSxJQUFGO0FBQVFFLE1BQUFBLE9BQU8sRUFBUEE7QUFBUixLQUFELENBRm1FO0FBQUEsR0FBbkQ7QUFBQSxDQUF2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0b1N5bmMgZnJvbSAnLi90b1N5bmMnXG5pbXBvcnQgaGV4R2VuIGZyb20gJy4vaGV4R2VuJ1xuXG5pbXBvcnQgeyBDb2xsYWJBY3Rpb24gfSBmcm9tICcuLi9tb2RlbCdcblxuZXhwb3J0ICogZnJvbSAnLi90ZXN0VXRpbHMnXG5cbmNvbnN0IHRvSlMgPSAobm9kZTogYW55KSA9PiB7XG4gIGlmIChub2RlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cbiAgdHJ5IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShub2RlKSlcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0NvbnZlcnQgdG8ganMgZmFpbGVkISEhIFJldHVybiBudWxsJylcbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG5cbmNvbnN0IGNsb25lTm9kZSA9IChub2RlOiBhbnkpID0+IHRvU3luYyh0b0pTKG5vZGUpKVxuXG5jb25zdCB0b1NsYXRlUGF0aCA9IChwYXRoOiBhbnkpID0+XG4gIHBhdGggPyBwYXRoLmZpbHRlcigoZDogYW55KSA9PiBOdW1iZXIuaXNJbnRlZ2VyKGQpKSA6IFtdXG5cbmNvbnN0IHRvQ29sbGFiQWN0aW9uID0gKHR5cGU6IGFueSwgZm46IChhY3Rpb246IENvbGxhYkFjdGlvbikgPT4gdm9pZCkgPT4gKFxuICBwYXlsb2FkOiBhbnlcbikgPT4gZm4oeyB0eXBlLCBwYXlsb2FkIH0pXG5cbmV4cG9ydCB7IHRvU3luYywgdG9KUywgdG9TbGF0ZVBhdGgsIGhleEdlbiwgY2xvbmVOb2RlLCB0b0NvbGxhYkFjdGlvbiB9XG4iXX0=