"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Automerge = _interopRequireWildcard(require("automerge"));

var _slate = require("slate");

var _utils = require("../utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var insertTextOp = function insertTextOp(_ref) {
  var index = _ref.index,
      path = _ref.path,
      value = _ref.value;
  return function (map, doc) {
    var slatePath = (0, _utils.toSlatePath)(path);

    var node = _slate.Node.get(doc, slatePath);

    var text = node.text;
    node.text = [text.slice(0, index), value, text.slice(index)].join('');
    return {
      type: 'insert_text',
      path: slatePath,
      offset: index,
      text: value,
      marks: []
    };
  };
};

var insertNodeOp = function insertNodeOp(_ref2, doc) {
  var value = _ref2.value,
      obj = _ref2.obj,
      index = _ref2.index,
      path = _ref2.path;
  return function (map, tmpDoc) {
    var ops = [];

    var iterate = function iterate(_ref3, path) {
      var children = _ref3.children,
          json = _objectWithoutProperties(_ref3, ["children"]);

      var node = (0, _utils.toJS)(children ? _objectSpread(_objectSpread({}, json), {}, {
        children: []
      }) : json);
      ops.push({
        type: 'insert_node',
        path: path,
        node: node
      }); // update the temp doc so later remove_node won't error.

      var parent = _slate.Node.parent(tmpDoc, path);

      var index = path[path.length - 1];
      parent.children.splice(index, 0, (0, _utils.toJS)(node));
      children && children.forEach(function (n, i) {
        var node = map[n] || Automerge.getObjectById(doc, n);
        iterate(node && (0, _utils.toJS)(node) || n, [].concat(_toConsumableArray(path), [i]));
      });
    };

    var source = map[value] || (0, _utils.toJS)(map[obj] || Automerge.getObjectById(doc, value));
    source && iterate(source, [].concat(_toConsumableArray((0, _utils.toSlatePath)(path)), [index]));
    return ops;
  };
};

var insertByType = {
  text: insertTextOp,
  list: insertNodeOp
};

var opInsert = function opInsert(op, _ref4, doc, tmpDoc) {
  var _ref5 = _slicedToArray(_ref4, 2),
      map = _ref5[0],
      ops = _ref5[1];

  try {
    var link = op.link,
        obj = op.obj,
        path = op.path,
        index = op.index,
        type = op.type,
        value = op.value;

    if (link && map.hasOwnProperty(obj)) {
      map[obj].splice(index, 0, map[value] || value);
    } else if ((type === 'text' || type === 'list') && !path) {
      map[obj] = map[obj] ? map[obj].slice(0, index).concat(value).concat(map[obj].slice(index)) : value;
    }

    if (path) {
      var insert = insertByType[type];
      var operation = insert && insert(op, doc)(map, tmpDoc);
      ops.push(operation);
    }

    return [map, ops];
  } catch (e) {
    console.error(e, op, (0, _utils.toJS)(map));
    return [map, ops];
  }
};

var _default = opInsert;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L2luc2VydC50cyJdLCJuYW1lcyI6WyJpbnNlcnRUZXh0T3AiLCJpbmRleCIsInBhdGgiLCJ2YWx1ZSIsIm1hcCIsImRvYyIsInNsYXRlUGF0aCIsIm5vZGUiLCJOb2RlIiwiZ2V0IiwidGV4dCIsInNsaWNlIiwiam9pbiIsInR5cGUiLCJvZmZzZXQiLCJtYXJrcyIsImluc2VydE5vZGVPcCIsIm9iaiIsInRtcERvYyIsIm9wcyIsIml0ZXJhdGUiLCJjaGlsZHJlbiIsImpzb24iLCJwdXNoIiwicGFyZW50IiwibGVuZ3RoIiwic3BsaWNlIiwiZm9yRWFjaCIsIm4iLCJpIiwiQXV0b21lcmdlIiwiZ2V0T2JqZWN0QnlJZCIsInNvdXJjZSIsImluc2VydEJ5VHlwZSIsImxpc3QiLCJvcEluc2VydCIsIm9wIiwibGluayIsImhhc093blByb3BlcnR5IiwiY29uY2F0IiwiaW5zZXJ0Iiwib3BlcmF0aW9uIiwiZSIsImNvbnNvbGUiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlBLElBQU1BLFlBQVksR0FBRyxTQUFmQSxZQUFlO0FBQUEsTUFBR0MsS0FBSCxRQUFHQSxLQUFIO0FBQUEsTUFBVUMsSUFBVixRQUFVQSxJQUFWO0FBQUEsTUFBZ0JDLEtBQWhCLFFBQWdCQSxLQUFoQjtBQUFBLFNBQTRDLFVBQy9EQyxHQUQrRCxFQUUvREMsR0FGK0QsRUFHNUQ7QUFDSCxRQUFNQyxTQUFTLEdBQUcsd0JBQVlKLElBQVosQ0FBbEI7O0FBQ0EsUUFBTUssSUFBSSxHQUFHQyxZQUFLQyxHQUFMLENBQVNKLEdBQVQsRUFBY0MsU0FBZCxDQUFiOztBQUNBLFFBQU1JLElBQUksR0FBR0gsSUFBSSxDQUFDRyxJQUFsQjtBQUNBSCxJQUFBQSxJQUFJLENBQUNHLElBQUwsR0FBWSxDQUFDQSxJQUFJLENBQUNDLEtBQUwsQ0FBVyxDQUFYLEVB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QUFDSixFQUFELEVBQUsvQixHQUFMLENBQU4sQ0FBZ0JELEdBQWhCLEVBQXFCYyxNQUFyQixDQUE1QjtBQUVBQyxNQUFBQSxHQUFHLENBQUNJLElBQUosQ0FBU2tCLFNBQVQ7QUFDRDs7QUFFRCxXQUFPLENBQUNyQyxHQUFELEVBQU1lLEdBQU4sQ0FBUDtBQUNELEdBdEJELENBc0JFLE9BQU91QixDQUFQLEVBQVU7QUFDVkMsSUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWNGLENBQWQsRUFBaUJOLEVBQWpCLEVBQXFCLGlCQUFLaEMsR0FBTCxDQUFyQjtBQUVBLFdBQU8sQ0FBQ0EsR0FBRCxFQUFNZSxHQUFOLENBQVA7QUFDRDtBQUNGLENBakNEOztlQW1DZWdCLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBBdXRvbWVyZ2UgZnJvbSAnYXV0b21lcmdlJ1xuaW1wb3J0IHsgRWxlbWVudCwgTm9kZSB9IGZyb20gJ3NsYXRlJ1xuXG5pbXBvcnQgeyB0b1NsYXRlUGF0aCwgdG9KUyB9IGZyb20gJy4uL3V0aWxzJ1xuXG5pbXBvcnQgeyBTeW5jRG9jIH0gZnJvbSAnLi4vbW9kZWwnXG5cbmNvbnN0IGluc2VydFRleHRPcCA9ICh7IGluZGV4LCBwYXRoLCB2YWx1ZSB9OiBBdXRvbWVyZ2UuRGlmZikgPT4gKFxuICBtYXA6IGFueSxcbiAgZG9jOiBFbGVtZW50XG4pID0+IHtcbiAgY29uc3Qgc2xhdGVQYXRoID0gdG9TbGF0ZVBhdGgocGF0aClcbiAgY29uc3Qgbm9kZSA9IE5vZGUuZ2V0KGRvYywgc2xhdGVQYXRoKSFcbiAgY29uc3QgdGV4dCA9IG5vZGUudGV4dCEgYXMgc3RyaW5nXG4gIG5vZGUudGV4dCA9IFt0ZXh0LnNsaWNlKDAsIGluZGV4KSwgdmFsdWUsIHRleHQuc2xpY2UoaW5kZXgpXS5qb2luKCcnKVxuICByZXR1cm4ge1xuICAgIHR5cGU6ICdpbnNlcnRfdGV4dCcsXG4gICAgcGF0aDogc2xhdGVQYXRoLFxuICAgIG9mZnNldDogaW5kZXgsXG4gICAgdGV4dDogdmFsdWUsXG4gICAgbWFya3M6IFtdXG4gIH1cbn1cblxuY29uc3QgaW5zZXJ0Tm9kZU9wID0gKFxuICB7IHZhbHVlLCBvYmosIGluZGV4LCBwYXRoIH06IEF1dG9tZXJnZS5EaWZmLFxuICBkb2M6IGFueVxuKSA9PiAobWFwOiBhbnksIHRtcERvYzogRWxlbWVudCkgPT4ge1xuICBjb25zdCBvcHM6IGFueSA9IFtdXG5cbiAgY29uc3QgaXRlcmF0ZSA9ICh7IGNoaWxkcmVuLCAuLi5qc29uIH06IGFueSwgcGF0aDogYW55KSA9PiB7XG4gICAgY29uc3Qgbm9kZSA9IHRvSlMoY2hpbGRyZW4gPyB7IC4uLmpzb24sIGNoaWxkcmVuOiBbXSB9IDoganNvbilcblxuICAgIG9wcy5wdXNoKHtcbiAgICAgIHR5cGU6ICdpbnNlcnRfbm9kZScsXG4gICAgICBwYXRoLFxuICAgICAgbm9kZVxuICAgIH0pXG5cbiAgICAvLyB1cGRhdGUgdGhlIHRlbXAgZG9jIHNvIGxhdGVyIHJlbW92ZV9ub2RlIHdvbid0IGVycm9yLlxuICAgIGNvbnN0IHBhcmVudCA9IE5vZGUucGFyZW50KHRtcERvYywgcGF0aClcbiAgICBjb25zdCBpbmRleCA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXVxuICAgIHBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDAsIHRvSlMobm9kZSkpXG5cbiAgICBjaGlsZHJlbiAmJlxuICAgICAgY2hpbGRyZW4uZm9yRWFjaCgobjogYW55LCBpOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG1hcFtuXSB8fCBBdXRvbWVyZ2UuZ2V0T2JqZWN0QnlJZChkb2MsIG4pXG5cbiAgICAgICAgaXRlcmF0ZSgobm9kZSAmJiB0b0pTKG5vZGUpKSB8fCBuLCBbLi4ucGF0aCwgaV0pXG4gICAgICB9KVxuICB9XG5cbiAgY29uc3Qgc291cmNlID1cbiAgICBtYXBbdmFsdWVdIHx8IHRvSlMobWFwW29ial0gfHwgQXV0b21lcmdlLmdldE9iamVjdEJ5SWQoZG9jLCB2YWx1ZSkpXG5cbiAgc291cmNlICYmIGl0ZXJhdGUoc291cmNlLCBbLi4udG9TbGF0ZVBhdGgocGF0aCksIGluZGV4XSlcblxuICByZXR1cm4gb3BzXG59XG5cbmNvbnN0IGluc2VydEJ5VHlwZSA9IHtcbiAgdGV4dDogaW5zZXJ0VGV4dE9wLFxuICBsaXN0OiBpbnNlcnROb2RlT3Bcbn1cblxuY29uc3Qgb3BJbnNlcnQgPSAoXG4gIG9wOiBBdXRvbWVyZ2UuRGlmZixcbiAgW21hcCwgb3BzXTogYW55LFxuICBkb2M6IFN5bmNEb2MsXG4gIHRtcERvYzogRWxlbWVudFxuKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBsaW5rLCBvYmosIHBhdGgsIGluZGV4LCB0eXBlLCB2YWx1ZSB9ID0gb3BcblxuICAgIGlmIChsaW5rICYmIG1hcC5oYXNPd25Qcm9wZXJ0eShvYmopKSB7XG4gICAgICBtYXBbb2JqXS5zcGxpY2UoaW5kZXgsIDAsIG1hcFt2YWx1ZV0gfHwgdmFsdWUpXG4gICAgfSBlbHNlIGlmICgodHlwZSA9PT0gJ3RleHQnIHx8IHR5cGUgPT09ICdsaXN0JykgJiYgIXBhdGgpIHtcbiAgICAgIG1hcFtvYmpdID0gbWFwW29ial1cbiAgICAgICAgPyBtYXBbb2JqXVxuICAgICAgICAgICAgLnNsaWNlKDAsIGluZGV4KVxuICAgICAgICAgICAgLmNvbmNhdCh2YWx1ZSlcbiAgICAgICAgICAgIC5jb25jYXQobWFwW29ial0uc2xpY2UoaW5kZXgpKVxuICAgICAgICA6IHZhbHVlXG4gICAgfVxuICAgIGlmIChwYXRoKSB7XG4gICAgICBjb25zdCBpbnNlcnQgPSBpbnNlcnRCeVR5cGVbdHlwZV1cblxuICAgICAgY29uc3Qgb3BlcmF0aW9uID0gaW5zZXJ0ICYmIGluc2VydChvcCwgZG9jKShtYXAsIHRtcERvYylcblxuICAgICAgb3BzLnB1c2gob3BlcmF0aW9uKVxuICAgIH1cblxuICAgIHJldHVybiBbbWFwLCBvcHNdXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUsIG9wLCB0b0pTKG1hcCkpXG5cbiAgICByZXR1cm4gW21hcCwgb3BzXVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9wSW5zZXJ0XG4iXX0=