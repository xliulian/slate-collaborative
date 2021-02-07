"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Automerge = _interopRequireWildcard(require("automerge"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var toSync = function toSync(node) {
  if (!node) {
    return;
  }

  if (node.hasOwnProperty('text')) {
    return _objectSpread(_objectSpread({}, node), {}, {
      text: new Automerge.Text(node.text)
    });
  } else if (node.children) {
    return _objectSpread(_objectSpread({}, node), {}, {
      children: node.children.map(toSync)
    });
  }

  return node;
};

var _default = toSync;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy90b1N5bmMudHMiXSwibmFtZXMiOlsidG9TeW5jIiwibm9kZSIsImhhc093blByb3BlcnR5IiwidGV4dCIsIkF1dG9tZXJnZSIsIlRleHQiLCJjaGlsZHJlbiIsIm1hcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLE1BQU0sR0FBRyxTQUFUQSxNQUFTLENBQUNDLElBQUQsRUFBZTtBQUM1QixNQUFJLENBQUNBLElBQUwsRUFBVztBQUNUO0FBQ0Q7O0FBRUQsTUFBSUEsSUFBSSxDQUFDQyxjQUFMLENBQW9CLE1BQXBCLENBQUosRUFBaUM7QUFDL0IsMkNBQ0tELElBREw7QUFFRUUsTUFBQUEsSUFBSSxFQUFFLElBQUlDLFNBQVMsQ0FBQ0MsSUFBZCxDQUFtQkosSUFBSSxDQUFDRSxJQUF4QjtBQUZSO0FBSUQsR0FMRCxNQUtPLElBQUlGLElBQUksQ0FBQ0ssUUFBVCxFQUFtQjtBQUN4QiwyQ0FDS0wsSUFETDtBQUVFSyxNQUFBQSxRQUFRLEVBQUVMLElBQUksQ0FBQ0ssUUFBTCxDQUFjQyxHQUFkLENBQWtCUCxNQUFsQjtBQUZaO0FBSUQ7O0FBRUQsU0FBT0MsSUFBUDtBQUNELENBbEJEOztlQW9CZUQsTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEF1dG9tZXJnZSBmcm9tICdhdXRvbWVyZ2UnXG5cbmNvbnN0IHRvU3luYyA9IChub2RlOiBhbnkpID0+IHtcbiAgaWYgKCFub2RlKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiAobm9kZS5oYXNPd25Qcm9wZXJ0eSgndGV4dCcpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm5vZGUsXG4gICAgICB0ZXh0OiBuZXcgQXV0b21lcmdlLlRleHQobm9kZS50ZXh0KVxuICAgIH1cbiAgfSBlbHNlIGlmIChub2RlLmNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm5vZGUsXG4gICAgICBjaGlsZHJlbjogbm9kZS5jaGlsZHJlbi5tYXAodG9TeW5jKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBub2RlXG59XG5cbmV4cG9ydCBkZWZhdWx0IHRvU3luY1xuIl19