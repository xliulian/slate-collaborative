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

var insertTextOp = function insertTextOp(_ref) {
  var obj = _ref.obj,
      index = _ref.index,
      path = _ref.path,
      value = _ref.value;
  return function (map, doc) {
    var slatePath = (0, _utils.toSlatePath)(path);

    var node = _slate.Node.get(doc, slatePath);

    var text = node.text;
    node.text = [text.slice(0, index), value, text.slice(index)].join('');
    map[obj] = node.text;
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
  var link = _ref2.link,
      value = _ref2.value,
      obj = _ref2.obj,
      index = _ref2.index,
      path = _ref2.path;
  return function (map, tmpDoc) {
    var ops = [];
    /*
      const iterate = ({ children, ...json }: any, path: any) => {
        const node = toJS(children ? { ...json, children: [] } : json)
    
        ops.push({
          type: 'insert_node',
          path,
          node
        })
    
        // update the temp doc so later remove_node won't error.
        const parent = Node.parent(tmpDoc, path)
        const index = path[path.length - 1]
        parent.children.splice(index, 0, toJS(node))
    
        children &&
          children.forEach((n: any, i: any) => {
            const node = map[n] || Automerge.getObjectById(doc, n)
    
            iterate((node && toJS(node)) || n, [...path, i])
          })
      }
    */

    var source = link ? map[value] : value;
    var slatePath = (0, _utils.toSlatePath)(path);

    var parent = _slate.Node.get(tmpDoc, slatePath);

    map[obj] = parent.children;
    map[obj].splice(index, 0, source);
    ops.push({
      type: 'insert_node',
      path: [].concat(_toConsumableArray(slatePath), [index]),
      node: (0, _utils.toJS)(source)
    }); //source && iterate(source, [...toSlatePath(path), index])

    return ops;
  };
};

var insertByType = {
  text: insertTextOp,
  list: insertNodeOp
};

var opInsert = function opInsert(op, _ref3, doc, tmpDoc) {
  var _ref4 = _slicedToArray(_ref3, 2),
      map = _ref4[0],
      ops = _ref4[1];

  try {
    var link = op.link,
        obj = op.obj,
        path = op.path,
        index = op.index,
        type = op.type,
        value = op.value;

    if (link && !map.hasOwnProperty(value)) {
      map[value] = (0, _utils.toJS)(Automerge.getObjectById(doc, value));
    }

    if (path && path.length && path[0] === 'children') {
      var insert = insertByType[type];
      var operation = insert && insert(op, doc)(map, tmpDoc);
      ops.push(operation);
    } else {
      if (!map.hasOwnProperty(obj)) {
        map[obj] = (0, _utils.toJS)(Automerge.getObjectById(doc, obj));
      }

      if (type === 'list') {
        map[obj].splice(index, 0, link ? map[value] : value);
      } else if (type === 'text') {
        map[obj] = map[obj] ? map[obj].slice(0, index).concat(value).concat(map[obj].slice(index)) : value;
      }
    }

    return [map, ops];
  } catch (e) {
    console.error(e, op, (0, _utils.toJS)(map));
    return [map, ops];
  }
};

var _default = opInsert;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L2luc2VydC50cyJdLCJuYW1lcyI6WyJpbnNlcnRUZXh0T3AiLCJvYmoiLCJpbmRleCIsInBhdGgiLCJ2YWx1ZSIsIm1hcCIsImRvYyIsInNsYXRlUGF0aCIsIm5vZGUiLCJOb2RlIiwiZ2V0IiwidGV4dCIsInNsaWNlIiwiam9pbiIsInR5cGUiLCJvZmZzZXQiLCJtYXJrcyIsImluc2VydE5vZGVPcCIsImxpbmsiLCJ0bXBEb2MiLCJvcHMiLCJzb3VyY2UiLCJwYXJlbnQiLCJjaGlsZHJlbiIsInNwbGljZSIsInB1c2giLCJpbnNlcnRCeVR5cGUiLCJsaXN0Iiwib3BJbnNlcnQiLCJvcCIsImhhc093blByb3BlcnR5IiwiQXV0b21lcmdlIiwiZ2V0T2JqZWN0QnlJZCIsImxlbmd0aCIsImluc2VydCIsIm9wZXJhdGlvbiIsImNvbmNhdCIsImUiLCJjb25zb2xlIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlBLElBQU1BLFlBQVksR0FBRyxTQUFmQSxZQUFlO0FBQUEsTUFBR0MsR0FBSCxRQUFHQSxHQUFIO0FBQUEsTUFBUUMsS0FBUixRQUFRQSxLQUFSO0FBQUEsTUFBZUMsSUFBZixRQUFlQSxJQUFmO0FBQUEsTUFBcUJDLEtBQXJCLFFBQXFCQSxLQUFyQjtBQUFBLFNBQWlELFVBQ3BFQyxHQURvRSxFQUVwRUMsR0FGb0UsRUFHakU7QUFDSCxRQUFNQyxTQUFTLEdBQUcsd0JBQVlKLElBQVosQ0FBbEI7O0FBQ0EsUUFBTUssSUFBSSxHQUFHQyxZQUFLQyxHQUFMLENBQVNKLEdBQVQsRUFBY0MsU0FBZCxDQUFiOztBQUNBLFFBQU1JLElBQUksR0FBR0gsSUFBSSxDQUFDRyxJQUFsQjtBQUNBSCxJQUFBQSxJQUFJLENBQUNHLElBQUwsR0FBWSxDQUFDQSxJQUFJLENBQUNDLEtBQUwsQ0FBVyxDQUFYLEVBQWNWLEtBQWQsQ0FBRCxFQUF1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LENBSFYsQ0FEUyxHQUtURSxLQUxGO0FBTUQ7QUFDRjs7QUFFRCxXQUFPLENBQUNDLEdBQUQsRUFBTWUsR0FBTixDQUFQO0FBQ0QsR0E3QkQsQ0E2QkUsT0FBT2lCLENBQVAsRUFBVTtBQUNWQyxJQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBY0YsQ0FBZCxFQUFpQlIsRUFBakIsRUFBcUIsaUJBQUt4QixHQUFMLENBQXJCO0FBRUEsV0FBTyxDQUFDQSxHQUFELEVBQU1lLEdBQU4sQ0FBUDtBQUNEO0FBQ0YsQ0F4Q0Q7O2VBMENlUSxRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQXV0b21lcmdlIGZyb20gJ2F1dG9tZXJnZSdcbmltcG9ydCB7IEVsZW1lbnQsIE5vZGUgfSBmcm9tICdzbGF0ZSdcblxuaW1wb3J0IHsgdG9TbGF0ZVBhdGgsIHRvSlMgfSBmcm9tICcuLi91dGlscydcblxuaW1wb3J0IHsgU3luY0RvYyB9IGZyb20gJy4uL21vZGVsJ1xuXG5jb25zdCBpbnNlcnRUZXh0T3AgPSAoeyBvYmosIGluZGV4LCBwYXRoLCB2YWx1ZSB9OiBBdXRvbWVyZ2UuRGlmZikgPT4gKFxuICBtYXA6IGFueSxcbiAgZG9jOiBFbGVtZW50XG4pID0+IHtcbiAgY29uc3Qgc2xhdGVQYXRoID0gdG9TbGF0ZVBhdGgocGF0aClcbiAgY29uc3Qgbm9kZSA9IE5vZGUuZ2V0KGRvYywgc2xhdGVQYXRoKSFcbiAgY29uc3QgdGV4dCA9IG5vZGUudGV4dCEgYXMgc3RyaW5nXG4gIG5vZGUudGV4dCA9IFt0ZXh0LnNsaWNlKDAsIGluZGV4KSwgdmFsdWUsIHRleHQuc2xpY2UoaW5kZXgpXS5qb2luKCcnKVxuICBtYXBbb2JqXSA9IG5vZGUudGV4dFxuICByZXR1cm4ge1xuICAgIHR5cGU6ICdpbnNlcnRfdGV4dCcsXG4gICAgcGF0aDogc2xhdGVQYXRoLFxuICAgIG9mZnNldDogaW5kZXgsXG4gICAgdGV4dDogdmFsdWUsXG4gICAgbWFya3M6IFtdXG4gIH1cbn1cblxuY29uc3QgaW5zZXJ0Tm9kZU9wID0gKFxuICB7IGxpbmssIHZhbHVlLCBvYmosIGluZGV4LCBwYXRoIH06IEF1dG9tZXJnZS5EaWZmLFxuICBkb2M6IGFueVxuKSA9PiAobWFwOiBhbnksIHRtcERvYzogRWxlbWVudCkgPT4ge1xuICBjb25zdCBvcHM6IGFueSA9IFtdXG4vKlxuICBjb25zdCBpdGVyYXRlID0gKHsgY2hpbGRyZW4sIC4uLmpzb24gfTogYW55LCBwYXRoOiBhbnkpID0+IHtcbiAgICBjb25zdCBub2RlID0gdG9KUyhjaGlsZHJlbiA/IHsgLi4uanNvbiwgY2hpbGRyZW46IFtdIH0gOiBqc29uKVxuXG4gICAgb3BzLnB1c2goe1xuICAgICAgdHlwZTogJ2luc2VydF9ub2RlJyxcbiAgICAgIHBhdGgsXG4gICAgICBub2RlXG4gICAgfSlcblxuICAgIC8vIHVwZGF0ZSB0aGUgdGVtcCBkb2Mgc28gbGF0ZXIgcmVtb3ZlX25vZGUgd29uJ3QgZXJyb3IuXG4gICAgY29uc3QgcGFyZW50ID0gTm9kZS5wYXJlbnQodG1wRG9jLCBwYXRoKVxuICAgIGNvbnN0IGluZGV4ID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdXG4gICAgcGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgdG9KUyhub2RlKSlcblxuICAgIGNoaWxkcmVuICYmXG4gICAgICBjaGlsZHJlbi5mb3JFYWNoKChuOiBhbnksIGk6IGFueSkgPT4ge1xuICAgICAgICBjb25zdCBub2RlID0gbWFwW25dIHx8IEF1dG9tZXJnZS5nZXRPYmplY3RCeUlkKGRvYywgbilcblxuICAgICAgICBpdGVyYXRlKChub2RlICYmIHRvSlMobm9kZSkpIHx8IG4sIFsuLi5wYXRoLCBpXSlcbiAgICAgIH0pXG4gIH1cbiovXG4gIGNvbnN0IHNvdXJjZSA9IGxpbmsgPyBtYXBbdmFsdWVdIDogdmFsdWVcblxuICBjb25zdCBzbGF0ZVBhdGggPSB0b1NsYXRlUGF0aChwYXRoKVxuICBjb25zdCBwYXJlbnQgPSBOb2RlLmdldCh0bXBEb2MsIHNsYXRlUGF0aCkhXG4gIG1hcFtvYmpdID0gcGFyZW50LmNoaWxkcmVuXG4gIG1hcFtvYmpdLnNwbGljZShpbmRleCwgMCwgc291cmNlKVxuXG4gIG9wcy5wdXNoKHtcbiAgICB0eXBlOiAnaW5zZXJ0X25vZGUnLFxuICAgIHBhdGg6IFsuLi5zbGF0ZVBhdGgsIGluZGV4XSxcbiAgICBub2RlOiB0b0pTKHNvdXJjZSlcbiAgfSlcblxuICAvL3NvdXJjZSAmJiBpdGVyYXRlKHNvdXJjZSwgWy4uLnRvU2xhdGVQYXRoKHBhdGgpLCBpbmRleF0pXG5cbiAgcmV0dXJuIG9wc1xufVxuXG5jb25zdCBpbnNlcnRCeVR5cGUgPSB7XG4gIHRleHQ6IGluc2VydFRleHRPcCxcbiAgbGlzdDogaW5zZXJ0Tm9kZU9wXG59XG5cbmNvbnN0IG9wSW5zZXJ0ID0gKFxuICBvcDogQXV0b21lcmdlLkRpZmYsXG4gIFttYXAsIG9wc106IGFueSxcbiAgZG9jOiBTeW5jRG9jLFxuICB0bXBEb2M6IEVsZW1lbnRcbikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgbGluaywgb2JqLCBwYXRoLCBpbmRleCwgdHlwZSwgdmFsdWUgfSA9IG9wXG5cbiAgICBpZiAobGluayAmJiAhbWFwLmhhc093blByb3BlcnR5KHZhbHVlKSkge1xuICAgICAgbWFwW3ZhbHVlXSA9IHRvSlMoQXV0b21lcmdlLmdldE9iamVjdEJ5SWQoZG9jLCB2YWx1ZSkpXG4gICAgfVxuICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoICYmIHBhdGhbMF0gPT09ICdjaGlsZHJlbicpIHtcbiAgICAgIGNvbnN0IGluc2VydCA9IGluc2VydEJ5VHlwZVt0eXBlXVxuXG4gICAgICBjb25zdCBvcGVyYXRpb24gPSBpbnNlcnQgJiYgaW5zZXJ0KG9wLCBkb2MpKG1hcCwgdG1wRG9jKVxuXG4gICAgICBvcHMucHVzaChvcGVyYXRpb24pXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghbWFwLmhhc093blByb3BlcnR5KG9iaikpIHtcbiAgICAgICAgbWFwW29ial0gPSB0b0pTKEF1dG9tZXJnZS5nZXRPYmplY3RCeUlkKGRvYywgb2JqKSlcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlID09PSAnbGlzdCcpIHtcbiAgICAgICAgbWFwW29ial0uc3BsaWNlKGluZGV4LCAwLCBsaW5rID8gbWFwW3ZhbHVlXSA6IHZhbHVlKVxuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgbWFwW29ial0gPSBtYXBbb2JqXVxuICAgICAgICA/IG1hcFtvYmpdXG4gICAgICAgICAgICAuc2xpY2UoMCwgaW5kZXgpXG4gICAgICAgICAgICAuY29uY2F0KHZhbHVlKVxuICAgICAgICAgICAgLmNvbmNhdChtYXBbb2JqXS5zbGljZShpbmRleCkpXG4gICAgICAgIDogdmFsdWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gW21hcCwgb3BzXVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlLCBvcCwgdG9KUyhtYXApKVxuXG4gICAgcmV0dXJuIFttYXAsIG9wc11cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBvcEluc2VydFxuIl19