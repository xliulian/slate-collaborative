"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Automerge = _interopRequireWildcard(require("automerge"));

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
  return function () {
    return {
      type: 'insert_text',
      path: (0, _utils.toSlatePath)(path),
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
  return function (map) {
    var ops = [];

    var iterate = function iterate(_ref3, path) {
      var children = _ref3.children,
          json = _objectWithoutProperties(_ref3, ["children"]);

      var node = children ? _objectSpread(_objectSpread({}, json), {}, {
        children: []
      }) : json;
      ops.push({
        type: 'insert_node',
        path: path,
        node: node
      });
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

var opInsert = function opInsert(op, _ref4, doc) {
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
    } else {
      var insert = insertByType[type];
      var operation = insert && insert(op, doc);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L2luc2VydC50cyJdLCJuYW1lcyI6WyJpbnNlcnRUZXh0T3AiLCJpbmRleCIsInBhdGgiLCJ2YWx1ZSIsInR5cGUiLCJvZmZzZXQiLCJ0ZXh0IiwibWFya3MiLCJpbnNlcnROb2RlT3AiLCJkb2MiLCJvYmoiLCJtYXAiLCJvcHMiLCJpdGVyYXRlIiwiY2hpbGRyZW4iLCJqc29uIiwibm9kZSIsInB1c2giLCJmb3JFYWNoIiwibiIsImkiLCJBdXRvbWVyZ2UiLCJnZXRPYmplY3RCeUlkIiwic291cmNlIiwiaW5zZXJ0QnlUeXBlIiwibGlzdCIsIm9wSW5zZXJ0Iiwib3AiLCJsaW5rIiwiaGFzT3duUHJvcGVydHkiLCJzcGxpY2UiLCJzbGljZSIsImNvbmNhdCIsImluc2VydCIsIm9wZXJhdGlvbiIsImUiLCJjb25zb2xlIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJQSxJQUFNQSxZQUFZLEdBQUcsU0FBZkEsWUFBZTtBQUFBLE1BQUdDLEtBQUgsUUFBR0EsS0FBSDtBQUFBLE1BQVVDLElBQVYsUUFBVUEsSUFBVjtBQUFBLE1BQWdCQyxLQUFoQixRQUFnQkEsS0FBaEI7QUFBQSxTQUE0QztBQUFBLFdBQU87QUFDdEVDLE1BQUFBLElBQUksRUFBRSxhQURnRTtBQUV0RUYsTUFBQUEsSUFBSSxFQUFFLHdCQUFZQSxJQUFaLENBRmdFO0FBR3RFRyxNQUFBQSxNQUFNLEVBQUVKLEtBSDhEO0FBSXRFSyxNQUFBQSxJQUFJLEVBQUVILEtBSmdFO0FBS3RFSSxNQUFBQSxLQUFLLEVBQUU7QUFMK0QsS0FBUDtBQUFBLEdBQTVDO0FBQUEsQ0FBckI7O0FBUUEsSUFBTUMsWUFBWSxHQUFHLFNBQWZBLFlBQWUsUUFFbkJDLEdBRm1CO0FBQUEsTUFDakJOLEtBRGlCLFNBQ2pCQSxLQURpQjtBQUFBLE1BQ1ZPLEdBRFUsU0FDVkEsR0FEVTtBQUFB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S0FESCxDQUNTLENBRFQsRUFDWTlCLEtBRFosRUFFRytCLE1BRkgsQ0FFVTdCLEtBRlYsRUFHRzZCLE1BSEgsQ0FHVXJCLEdBQUcsQ0FBQ0QsR0FBRCxDQUFILENBQVNxQixLQUFULENBQWU5QixLQUFmLENBSFYsQ0FETyxHQUtQRSxLQUxKO0FBTUQsS0FQTSxNQU9BO0FBQ0wsVUFBTThCLE1BQU0sR0FBR1QsWUFBWSxDQUFDcEIsSUFBRCxDQUEzQjtBQUVBLFVBQU04QixTQUFTLEdBQUdELE1BQU0sSUFBSUEsTUFBTSxDQUFDTixFQUFELEVBQUtsQixHQUFMLENBQWxDO0FBRUFHLE1BQUFBLEdBQUcsQ0FBQ0ssSUFBSixDQUFTaUIsU0FBVDtBQUNEOztBQUVELFdBQU8sQ0FBQ3ZCLEdBQUQsRUFBTUMsR0FBTixDQUFQO0FBQ0QsR0FyQkQsQ0FxQkUsT0FBT3VCLENBQVAsRUFBVTtBQUNWQyxJQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBY0YsQ0FBZCxFQUFpQlIsRUFBakIsRUFBcUIsaUJBQUtoQixHQUFMLENBQXJCO0FBRUEsV0FBTyxDQUFDQSxHQUFELEVBQU1DLEdBQU4sQ0FBUDtBQUNEO0FBQ0YsQ0EzQkQ7O2VBNkJlYyxRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQXV0b21lcmdlIGZyb20gJ2F1dG9tZXJnZSdcblxuaW1wb3J0IHsgdG9TbGF0ZVBhdGgsIHRvSlMgfSBmcm9tICcuLi91dGlscydcblxuaW1wb3J0IHsgU3luY0RvYyB9IGZyb20gJy4uL21vZGVsJ1xuXG5jb25zdCBpbnNlcnRUZXh0T3AgPSAoeyBpbmRleCwgcGF0aCwgdmFsdWUgfTogQXV0b21lcmdlLkRpZmYpID0+ICgpID0+ICh7XG4gIHR5cGU6ICdpbnNlcnRfdGV4dCcsXG4gIHBhdGg6IHRvU2xhdGVQYXRoKHBhdGgpLFxuICBvZmZzZXQ6IGluZGV4LFxuICB0ZXh0OiB2YWx1ZSxcbiAgbWFya3M6IFtdXG59KVxuXG5jb25zdCBpbnNlcnROb2RlT3AgPSAoXG4gIHsgdmFsdWUsIG9iaiwgaW5kZXgsIHBhdGggfTogQXV0b21lcmdlLkRpZmYsXG4gIGRvYzogYW55XG4pID0+IChtYXA6IGFueSkgPT4ge1xuICBjb25zdCBvcHM6IGFueSA9IFtdXG5cbiAgY29uc3QgaXRlcmF0ZSA9ICh7IGNoaWxkcmVuLCAuLi5qc29uIH06IGFueSwgcGF0aDogYW55KSA9PiB7XG4gICAgY29uc3Qgbm9kZSA9IGNoaWxkcmVuID8geyAuLi5qc29uLCBjaGlsZHJlbjogW10gfSA6IGpzb25cblxuICAgIG9wcy5wdXNoKHtcbiAgICAgIHR5cGU6ICdpbnNlcnRfbm9kZScsXG4gICAgICBwYXRoLFxuICAgICAgbm9kZVxuICAgIH0pXG5cbiAgICBjaGlsZHJlbiAmJlxuICAgICAgY2hpbGRyZW4uZm9yRWFjaCgobjogYW55LCBpOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG1hcFtuXSB8fCBBdXRvbWVyZ2UuZ2V0T2JqZWN0QnlJZChkb2MsIG4pXG5cbiAgICAgICAgaXRlcmF0ZSgobm9kZSAmJiB0b0pTKG5vZGUpKSB8fCBuLCBbLi4ucGF0aCwgaV0pXG4gICAgICB9KVxuICB9XG5cbiAgY29uc3Qgc291cmNlID1cbiAgICBtYXBbdmFsdWVdIHx8IHRvSlMobWFwW29ial0gfHwgQXV0b21lcmdlLmdldE9iamVjdEJ5SWQoZG9jLCB2YWx1ZSkpXG5cbiAgc291cmNlICYmIGl0ZXJhdGUoc291cmNlLCBbLi4udG9TbGF0ZVBhdGgocGF0aCksIGluZGV4XSlcblxuICByZXR1cm4gb3BzXG59XG5cbmNvbnN0IGluc2VydEJ5VHlwZSA9IHtcbiAgdGV4dDogaW5zZXJ0VGV4dE9wLFxuICBsaXN0OiBpbnNlcnROb2RlT3Bcbn1cblxuY29uc3Qgb3BJbnNlcnQgPSAob3A6IEF1dG9tZXJnZS5EaWZmLCBbbWFwLCBvcHNdOiBhbnksIGRvYzogU3luY0RvYykgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgbGluaywgb2JqLCBwYXRoLCBpbmRleCwgdHlwZSwgdmFsdWUgfSA9IG9wXG5cbiAgICBpZiAobGluayAmJiBtYXAuaGFzT3duUHJvcGVydHkob2JqKSkge1xuICAgICAgbWFwW29ial0uc3BsaWNlKGluZGV4LCAwLCBtYXBbdmFsdWVdIHx8IHZhbHVlKVxuICAgIH0gZWxzZSBpZiAoKHR5cGUgPT09ICd0ZXh0JyB8fCB0eXBlID09PSAnbGlzdCcpICYmICFwYXRoKSB7XG4gICAgICBtYXBbb2JqXSA9IG1hcFtvYmpdXG4gICAgICAgID8gbWFwW29ial1cbiAgICAgICAgICAgIC5zbGljZSgwLCBpbmRleClcbiAgICAgICAgICAgIC5jb25jYXQodmFsdWUpXG4gICAgICAgICAgICAuY29uY2F0KG1hcFtvYmpdLnNsaWNlKGluZGV4KSlcbiAgICAgICAgOiB2YWx1ZVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpbnNlcnQgPSBpbnNlcnRCeVR5cGVbdHlwZV1cblxuICAgICAgY29uc3Qgb3BlcmF0aW9uID0gaW5zZXJ0ICYmIGluc2VydChvcCwgZG9jKVxuXG4gICAgICBvcHMucHVzaChvcGVyYXRpb24pXG4gICAgfVxuXG4gICAgcmV0dXJuIFttYXAsIG9wc11cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSwgb3AsIHRvSlMobWFwKSlcblxuICAgIHJldHVybiBbbWFwLCBvcHNdXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgb3BJbnNlcnRcbiJdfQ==