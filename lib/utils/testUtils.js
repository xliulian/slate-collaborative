"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloneDoc = exports.createDoc = exports.createValue = exports.createNode = exports.createText = void 0;

var Automerge = _interopRequireWildcard(require("automerge"));

var _ = require("../");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createText = function createText() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return {
    text: text
  };
};

exports.createText = createText;

var createNode = function createNode() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'paragraph';
  var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var data = arguments.length > 2 ? arguments[2] : undefined;
  return _objectSpread({
    type: type,
    children: [createText(text)]
  }, data);
};

exports.createNode = createNode;

var createValue = function createValue(children) {
  return {
    children: children || [createNode()]
  };
};

exports.createValue = createValue;

var createDoc = function createDoc(children) {
  return Automerge.from((0, _.toSync)(createValue(children)));
};

exports.createDoc = createDoc;

var cloneDoc = function cloneDoc(doc) {
  return Automerge.change(doc, '', function (d) {
    return d;
  });
};

exports.cloneDoc = cloneDoc;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy90ZXN0VXRpbHMudHMiXSwibmFtZXMiOlsiY3JlYXRlVGV4dCIsInRleHQiLCJjcmVhdGVOb2RlIiwidHlwZSIsImRhdGEiLCJjaGlsZHJlbiIsImNyZWF0ZVZhbHVlIiwiY3JlYXRlRG9jIiwiQXV0b21lcmdlIiwiZnJvbSIsImNsb25lRG9jIiwiZG9jIiwiY2hhbmdlIiwiZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBRUE7Ozs7Ozs7Ozs7OztBQUlPLElBQU1BLFVBQVUsR0FBRyxTQUFiQSxVQUFhO0FBQUEsTUFBQ0MsSUFBRCx1RUFBZ0IsRUFBaEI7QUFBQSxTQUF3QjtBQUNoREEsSUFBQUEsSUFBSSxFQUFKQTtBQURnRCxHQUF4QjtBQUFBLENBQW5COzs7O0FBSUEsSUFBTUMsVUFBVSxHQUFHLFNBQWJBLFVBQWE7QUFBQSxNQUN4QkMsSUFEd0IsdUVBQ1QsV0FEUztBQUFBLE1BRXhCRixJQUZ3Qix1RUFFVCxFQUZTO0FBQUEsTUFHeEJHLElBSHdCO0FBQUE7QUFLeEJELElBQUFBLElBQUksRUFBSkEsSUFMd0I7QUFNeEJFLElBQUFBLFFBQVEsRUFBRSxDQUFDTCxVQUFVLENBQUNDLElBQUQsQ0FBWDtBQU5jLEtBT3JCRyxJQVBxQjtBQUFBLENBQW5COzs7O0FBVUEsSUFBTUUsV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBQ0QsUUFBRDtBQUFBLFNBQTJDO0FBQ3BFQSxJQUFBQSxRQUFRLEVBQUVBLFFBQVEsSUFBSSxDQUFDSCxVQUFVLEVBQVg7QUFEOEMsR0FBM0M7QUFBQSxDQUFwQjs7OztBQUlBLElBQU1LLFNBQVMsR0FBRyxTQUFaQSxTQUFZLENBQUNGLFFBQUQ7QUFBQSxTQUN2QkcsU0FBUyxDQUFDQyxJQUFWLENBQWUsY0FBT0gsV0FBVyxDQUFDRCxRQUFELENBQWxCLENBQWYsQ0FEdUI7QUFBQSxDQUFsQjs7OztBQUdBLElBQU1LLFFBQVEsR0FBRyxTQUFYQSxRQUFXLENBQUNDLEdBQUQ7QUFBQSxTQUFjSCxTQUFTLENBQUNJLE1BQVYsQ0FBaUJELEdBQWpCLEVBQXNCLEVBQXRCLEVBQTBCLFVBQUFFLENBQUM7QUFBQSxXQUFJQSxDQUFKO0FBQUEsR0FBM0IsQ0FBZDtBQUFBLENBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQXV0b21lcmdlIGZyb20gJ2F1dG9tZXJnZSdcblxuaW1wb3J0IHsgdG9TeW5jIH0gZnJvbSAnLi4vJ1xuXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnc2xhdGUnXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVUZXh0ID0gKHRleHQ6IHN0cmluZyA9ICcnKSA9PiAoe1xuICB0ZXh0XG59KVxuXG5leHBvcnQgY29uc3QgY3JlYXRlTm9kZSA9IChcbiAgdHlwZTogc3RyaW5nID0gJ3BhcmFncmFwaCcsXG4gIHRleHQ6IHN0cmluZyA9ICcnLFxuICBkYXRhPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfVxuKSA9PiAoe1xuICB0eXBlLFxuICBjaGlsZHJlbjogW2NyZWF0ZVRleHQodGV4dCldLFxuICAuLi5kYXRhXG59KVxuXG5leHBvcnQgY29uc3QgY3JlYXRlVmFsdWUgPSAoY2hpbGRyZW4/OiBhbnkpOiB7IGNoaWxkcmVuOiBOb2RlW10gfSA9PiAoe1xuICBjaGlsZHJlbjogY2hpbGRyZW4gfHwgW2NyZWF0ZU5vZGUoKV1cbn0pXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVEb2MgPSAoY2hpbGRyZW4/OiBhbnkpID0+XG4gIEF1dG9tZXJnZS5mcm9tKHRvU3luYyhjcmVhdGVWYWx1ZShjaGlsZHJlbikpKVxuXG5leHBvcnQgY29uc3QgY2xvbmVEb2MgPSAoZG9jOiBhbnkpID0+IEF1dG9tZXJnZS5jaGFuZ2UoZG9jLCAnJywgZCA9PiBkKVxuIl19