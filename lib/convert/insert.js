"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Automerge = _interopRequireWildcard(require("automerge"));

var _slate = require("slate");

var _lodash = _interopRequireDefault(require("lodash"));

var _path = require("../path");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
      text: value //marks: []

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
    /*const ops: any = []
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
    map[obj].splice(index, 0, source); //ops.push({

    return {
      type: 'insert_node',
      path: [].concat(_toConsumableArray(slatePath), [index]),
      node: (0, _utils.toJS)(source)
    }; //)
    //source && iterate(source, [...toSlatePath(path), index])
    //return ops
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

      if (operation && operation.type === 'insert_node' && operation.node) {
        var lastOp = ops[ops.length - 1];

        if (operation.node.text && Object.keys(operation.node).length === 1 && lastOp && lastOp.type === 'remove_text' && _slate.Path.equals(operation.path, _slate.Path.next(lastOp.path)) && lastOp.text.slice(-operation.node.text.length) === operation.node.text) {
          // insert text node just after delete some text, it possiblly be some split_node op?
          var slatePath = (0, _utils.toSlatePath)(lastOp.path);
          var lastNode = (0, _path.getTarget)(tmpDoc, slatePath);

          if (lastNode.text.length === lastOp.offset) {
            // previous node was just deleted text until the end, so we are splitting
            if (lastOp.text.length > operation.node.text.length) {
              lastOp.text = lastOp.text.slice(0, -operation.node.text.length);
            } else {
              ops.pop();
            }

            ops.push({
              type: 'split_node',
              path: lastOp.path,
              position: lastOp.offset,
              properties: {}
            });
            return [map, ops];
          }
        } else if (lastOp && lastOp.type === 'remove_node' && _lodash["default"].isEqual(lastOp.node, operation.node)) {
          ops.pop(); // XXX: fix the newPath since it currently is the case old path was removed
          //      but we need consider if the old path is not removed, what the newPath
          //      should be.
          //   1. if newPath is before path, it is not effected.
          //   2. if newPath same or under path, at the path end position, should add 1
          //   3. if newPath above path, remove path does not effect above path
          //   4. if newPath is after path, and is or under siblings after lowest level of path, add 1
          //   5. if newPath is after path, but not share same parent, it is not effected.

          var newPath = operation.path;

          if (!_slate.Path.isBefore(operation.path, lastOp.path) && _slate.Path.isCommon(_slate.Path.parent(lastOp.path), operation.path)) {
            newPath[lastOp.path.length - 1] += 1;
          }

          ops.push({
            type: 'move_node',
            path: lastOp.path,
            newPath: newPath
          });
          return [map, ops];
        }
      } else if (operation && operation.type === 'insert_text') {
        var _lastOp = ops[ops.length - 1];

        if (_lastOp && _lastOp.type === 'insert_text' && _slate.Path.equals(operation.path, _lastOp.path) && _lastOp.offset + _lastOp.text.length === operation.offset) {
          _lastOp.text += operation.text;
          return [map, ops];
        }
      }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L2luc2VydC50cyJdLCJuYW1lcyI6WyJpbnNlcnRUZXh0T3AiLCJvYmoiLCJpbmRleCIsInBhdGgiLCJ2YWx1ZSIsIm1hcCIsImRvYyIsInNsYXRlUGF0aCIsIm5vZGUiLCJOb2RlIiwiZ2V0IiwidGV4dCIsInNsaWNlIiwiam9pbiIsInR5cGUiLCJvZmZzZXQiLCJpbnNlcnROb2RlT3AiLCJsaW5rIiwidG1wRG9jIiwic291cmNlIiwicGFyZW50IiwiY2hpbGRyZW4iLCJzcGxpY2UiLCJpbnNlcnRCeVR5cGUiLCJsaXN0Iiwib3BJbnNlcnQiLCJvcCIsIm9wcyIsImhhc093blByb3BlcnR5IiwiQXV0b21lcmdlIiwiZ2V0T2JqZWN0QnlJZCIsImxlbmd0aCIsImluc2VydCIsIm9wZXJhdGlvbiIsImxhc3RPcCIsIk9iamVjdCIsImtleXMiLCJQYXRoIiwiZXF1YWxzIiwibmV4dCIsImxhc3ROb2RlIiwicG9wIiwicHVzaCIsInBvc2l0aW9uIiwicHJvcGVydGllcyIsIl8iLCJpc0VxdWFsIiwibmV3UGF0aCIsImlzQmVmb3JlIiwiaXNDb21tb24iLCJjb25jYXQiLCJlIiwiY29uc29sZSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlBLElBQU1BLFlBQVksR0FBRyxTQUFmQSxZQUFlO0FBQUEsTUFBR0MsR0FBSCxRQUFHQSxHQUFIO0FBQUEsTUFBUUMsS0FBUixRQUFRQSxLQUFSO0FBQUEsTUFBZUMsSUFBZixRQUFlQSxJQUFmO0FBQUEsTUFBcUJDLEtBQXJCLFFBQXFCQSxLQUFyQjtBQUFBLFNBQWlELFVBQ3BFQyxHQURvRSxFQUVwRUMsR0FGb0UsRUFHakU7QUFDSCxRQUFNQyxTQUFTLEdBQUcsd0JBQVlKLElBQVosQ0FBbEI7O0FBQ0EsUUFBTUssSUFBSSxHQUFHQyxZQUFLQyxHQUFMLENBQVNKLEdBQVQs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RDs7ZUE4R2VGLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBBdXRvbWVyZ2UgZnJvbSAnYXV0b21lcmdlJ1xuaW1wb3J0IHsgRWxlbWVudCwgTm9kZSwgUGF0aCB9IGZyb20gJ3NsYXRlJ1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuXG5pbXBvcnQgeyBnZXRUYXJnZXQgfSBmcm9tICcuLi9wYXRoJ1xuaW1wb3J0IHsgdG9TbGF0ZVBhdGgsIHRvSlMgfSBmcm9tICcuLi91dGlscydcblxuaW1wb3J0IHsgU3luY0RvYyB9IGZyb20gJy4uL21vZGVsJ1xuXG5jb25zdCBpbnNlcnRUZXh0T3AgPSAoeyBvYmosIGluZGV4LCBwYXRoLCB2YWx1ZSB9OiBBdXRvbWVyZ2UuRGlmZikgPT4gKFxuICBtYXA6IGFueSxcbiAgZG9jOiBFbGVtZW50XG4pID0+IHtcbiAgY29uc3Qgc2xhdGVQYXRoID0gdG9TbGF0ZVBhdGgocGF0aClcbiAgY29uc3Qgbm9kZSA9IE5vZGUuZ2V0KGRvYywgc2xhdGVQYXRoKSFcbiAgY29uc3QgdGV4dCA9IG5vZGUudGV4dCEgYXMgc3RyaW5nXG4gIG5vZGUudGV4dCA9IFt0ZXh0LnNsaWNlKDAsIGluZGV4KSwgdmFsdWUsIHRleHQuc2xpY2UoaW5kZXgpXS5qb2luKCcnKVxuICBtYXBbb2JqXSA9IG5vZGUudGV4dFxuICByZXR1cm4ge1xuICAgIHR5cGU6ICdpbnNlcnRfdGV4dCcsXG4gICAgcGF0aDogc2xhdGVQYXRoLFxuICAgIG9mZnNldDogaW5kZXgsXG4gICAgdGV4dDogdmFsdWVcbiAgICAvL21hcmtzOiBbXVxuICB9XG59XG5cbmNvbnN0IGluc2VydE5vZGVPcCA9IChcbiAgeyBsaW5rLCB2YWx1ZSwgb2JqLCBpbmRleCwgcGF0aCB9OiBBdXRvbWVyZ2UuRGlmZixcbiAgZG9jOiBhbnlcbikgPT4gKG1hcDogYW55LCB0bXBEb2M6IEVsZW1lbnQpID0+IHtcbiAgLypjb25zdCBvcHM6IGFueSA9IFtdXG5cbiAgY29uc3QgaXRlcmF0ZSA9ICh7IGNoaWxkcmVuLCAuLi5qc29uIH06IGFueSwgcGF0aDogYW55KSA9PiB7XG4gICAgY29uc3Qgbm9kZSA9IHRvSlMoY2hpbGRyZW4gPyB7IC4uLmpzb24sIGNoaWxkcmVuOiBbXSB9IDoganNvbilcblxuICAgIG9wcy5wdXNoKHtcbiAgICAgIHR5cGU6ICdpbnNlcnRfbm9kZScsXG4gICAgICBwYXRoLFxuICAgICAgbm9kZVxuICAgIH0pXG5cbiAgICAvLyB1cGRhdGUgdGhlIHRlbXAgZG9jIHNvIGxhdGVyIHJlbW92ZV9ub2RlIHdvbid0IGVycm9yLlxuICAgIGNvbnN0IHBhcmVudCA9IE5vZGUucGFyZW50KHRtcERvYywgcGF0aClcbiAgICBjb25zdCBpbmRleCA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXVxuICAgIHBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDAsIHRvSlMobm9kZSkpXG5cbiAgICBjaGlsZHJlbiAmJlxuICAgICAgY2hpbGRyZW4uZm9yRWFjaCgobjogYW55LCBpOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG1hcFtuXSB8fCBBdXRvbWVyZ2UuZ2V0T2JqZWN0QnlJZChkb2MsIG4pXG5cbiAgICAgICAgaXRlcmF0ZSgobm9kZSAmJiB0b0pTKG5vZGUpKSB8fCBuLCBbLi4ucGF0aCwgaV0pXG4gICAgICB9KVxuICB9XG4qL1xuICBjb25zdCBzb3VyY2UgPSBsaW5rID8gbWFwW3ZhbHVlXSA6IHZhbHVlXG5cbiAgY29uc3Qgc2xhdGVQYXRoID0gdG9TbGF0ZVBhdGgocGF0aClcbiAgY29uc3QgcGFyZW50ID0gTm9kZS5nZXQodG1wRG9jLCBzbGF0ZVBhdGgpIVxuICBtYXBbb2JqXSA9IHBhcmVudC5jaGlsZHJlblxuICBtYXBbb2JqXS5zcGxpY2UoaW5kZXgsIDAsIHNvdXJjZSlcblxuICAvL29wcy5wdXNoKHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnaW5zZXJ0X25vZGUnLFxuICAgIHBhdGg6IFsuLi5zbGF0ZVBhdGgsIGluZGV4XSxcbiAgICBub2RlOiB0b0pTKHNvdXJjZSlcbiAgfSAvLylcblxuICAvL3NvdXJjZSAmJiBpdGVyYXRlKHNvdXJjZSwgWy4uLnRvU2xhdGVQYXRoKHBhdGgpLCBpbmRleF0pXG5cbiAgLy9yZXR1cm4gb3BzXG59XG5cbmNvbnN0IGluc2VydEJ5VHlwZSA9IHtcbiAgdGV4dDogaW5zZXJ0VGV4dE9wLFxuICBsaXN0OiBpbnNlcnROb2RlT3Bcbn1cblxuY29uc3Qgb3BJbnNlcnQgPSAoXG4gIG9wOiBBdXRvbWVyZ2UuRGlmZixcbiAgW21hcCwgb3BzXTogYW55LFxuICBkb2M6IFN5bmNEb2MsXG4gIHRtcERvYzogRWxlbWVudFxuKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBsaW5rLCBvYmosIHBhdGgsIGluZGV4LCB0eXBlLCB2YWx1ZSB9ID0gb3BcblxuICAgIGlmIChsaW5rICYmICFtYXAuaGFzT3duUHJvcGVydHkodmFsdWUpKSB7XG4gICAgICBtYXBbdmFsdWVdID0gdG9KUyhBdXRvbWVyZ2UuZ2V0T2JqZWN0QnlJZChkb2MsIHZhbHVlKSlcbiAgICB9XG4gICAgaWYgKHBhdGggJiYgcGF0aC5sZW5ndGggJiYgcGF0aFswXSA9PT0gJ2NoaWxkcmVuJykge1xuICAgICAgY29uc3QgaW5zZXJ0ID0gaW5zZXJ0QnlUeXBlW3R5cGVdXG5cbiAgICAgIGNvbnN0IG9wZXJhdGlvbiA9IGluc2VydCAmJiBpbnNlcnQob3AsIGRvYykobWFwLCB0bXBEb2MpXG5cbiAgICAgIGlmIChvcGVyYXRpb24gJiYgb3BlcmF0aW9uLnR5cGUgPT09ICdpbnNlcnRfbm9kZScgJiYgb3BlcmF0aW9uLm5vZGUpIHtcbiAgICAgICAgY29uc3QgbGFzdE9wID0gb3BzW29wcy5sZW5ndGggLSAxXVxuICAgICAgICBpZiAoXG4gICAgICAgICAgb3BlcmF0aW9uLm5vZGUudGV4dCAmJlxuICAgICAgICAgIE9iamVjdC5rZXlzKG9wZXJhdGlvbi5ub2RlKS5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICBsYXN0T3AgJiZcbiAgICAgICAgICBsYXN0T3AudHlwZSA9PT0gJ3JlbW92ZV90ZXh0JyAmJlxuICAgICAgICAgIFBhdGguZXF1YWxzKG9wZXJhdGlvbi5wYXRoLCBQYXRoLm5leHQobGFzdE9wLnBhdGgpKSAmJlxuICAgICAgICAgIGxhc3RPcC50ZXh0LnNsaWNlKC1vcGVyYXRpb24ubm9kZS50ZXh0Lmxlbmd0aCkgPT09IG9wZXJhdGlvbi5ub2RlLnRleHRcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gaW5zZXJ0IHRleHQgbm9kZSBqdXN0IGFmdGVyIGRlbGV0ZSBzb21lIHRleHQsIGl0IHBvc3NpYmxseSBiZSBzb21lIHNwbGl0X25vZGUgb3A/XG4gICAgICAgICAgY29uc3Qgc2xhdGVQYXRoID0gdG9TbGF0ZVBhdGgobGFzdE9wLnBhdGgpXG4gICAgICAgICAgY29uc3QgbGFzdE5vZGUgPSBnZXRUYXJnZXQodG1wRG9jLCBzbGF0ZVBhdGgpXG4gICAgICAgICAgaWYgKGxhc3ROb2RlLnRleHQubGVuZ3RoID09PSBsYXN0T3Aub2Zmc2V0KSB7XG4gICAgICAgICAgICAvLyBwcmV2aW91cyBub2RlIHdhcyBqdXN0IGRlbGV0ZWQgdGV4dCB1bnRpbCB0aGUgZW5kLCBzbyB3ZSBhcmUgc3BsaXR0aW5nXG4gICAgICAgICAgICBpZiAobGFzdE9wLnRleHQubGVuZ3RoID4gb3BlcmF0aW9uLm5vZGUudGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgbGFzdE9wLnRleHQgPSBsYXN0T3AudGV4dC5zbGljZSgwLCAtb3BlcmF0aW9uLm5vZGUudGV4dC5sZW5ndGgpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBvcHMucG9wKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wcy5wdXNoKHtcbiAgICAgICAgICAgICAgdHlwZTogJ3NwbGl0X25vZGUnLFxuICAgICAgICAgICAgICBwYXRoOiBsYXN0T3AucGF0aCxcbiAgICAgICAgICAgICAgcG9zaXRpb246IGxhc3RPcC5vZmZzZXQsXG4gICAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIFttYXAsIG9wc11cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgbGFzdE9wICYmXG4gICAgICAgICAgbGFzdE9wLnR5cGUgPT09ICdyZW1vdmVfbm9kZScgJiZcbiAgICAgICAgICBfLmlzRXF1YWwobGFzdE9wLm5vZGUsIG9wZXJhdGlvbi5ub2RlKVxuICAgICAgICApIHtcbiAgICAgICAgICBvcHMucG9wKClcbiAgICAgICAgICAvLyBYWFg6IGZpeCB0aGUgbmV3UGF0aCBzaW5jZSBpdCBjdXJyZW50bHkgaXMgdGhlIGNhc2Ugb2xkIHBhdGggd2FzIHJlbW92ZWRcbiAgICAgICAgICAvLyAgICAgIGJ1dCB3ZSBuZWVkIGNvbnNpZGVyIGlmIHRoZSBvbGQgcGF0aCBpcyBub3QgcmVtb3ZlZCwgd2hhdCB0aGUgbmV3UGF0aFxuICAgICAgICAgIC8vICAgICAgc2hvdWxkIGJlLlxuICAgICAgICAgIC8vICAgMS4gaWYgbmV3UGF0aCBpcyBiZWZvcmUgcGF0aCwgaXQgaXMgbm90IGVmZmVjdGVkLlxuICAgICAgICAgIC8vICAgMi4gaWYgbmV3UGF0aCBzYW1lIG9yIHVuZGVyIHBhdGgsIGF0IHRoZSBwYXRoIGVuZCBwb3NpdGlvbiwgc2hvdWxkIGFkZCAxXG4gICAgICAgICAgLy8gICAzLiBpZiBuZXdQYXRoIGFib3ZlIHBhdGgsIHJlbW92ZSBwYXRoIGRvZXMgbm90IGVmZmVjdCBhYm92ZSBwYXRoXG4gICAgICAgICAgLy8gICA0LiBpZiBuZXdQYXRoIGlzIGFmdGVyIHBhdGgsIGFuZCBpcyBvciB1bmRlciBzaWJsaW5ncyBhZnRlciBsb3dlc3QgbGV2ZWwgb2YgcGF0aCwgYWRkIDFcbiAgICAgICAgICAvLyAgIDUuIGlmIG5ld1BhdGggaXMgYWZ0ZXIgcGF0aCwgYnV0IG5vdCBzaGFyZSBzYW1lIHBhcmVudCwgaXQgaXMgbm90IGVmZmVjdGVkLlxuICAgICAgICAgIGNvbnN0IG5ld1BhdGggPSBvcGVyYXRpb24ucGF0aFxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFQYXRoLmlzQmVmb3JlKG9wZXJhdGlvbi5wYXRoLCBsYXN0T3AucGF0aCkgJiZcbiAgICAgICAgICAgIFBhdGguaXNDb21tb24oUGF0aC5wYXJlbnQobGFzdE9wLnBhdGgpLCBvcGVyYXRpb24ucGF0aClcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIG5ld1BhdGhbbGFzdE9wLnBhdGgubGVuZ3RoIC0gMV0gKz0gMVxuICAgICAgICAgIH1cbiAgICAgICAgICBvcHMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiAnbW92ZV9ub2RlJyxcbiAgICAgICAgICAgIHBhdGg6IGxhc3RPcC5wYXRoLFxuICAgICAgICAgICAgbmV3UGF0aFxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuIFttYXAsIG9wc11cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gJiYgb3BlcmF0aW9uLnR5cGUgPT09ICdpbnNlcnRfdGV4dCcpIHtcbiAgICAgICAgY29uc3QgbGFzdE9wID0gb3BzW29wcy5sZW5ndGggLSAxXVxuICAgICAgICBpZiAoXG4gICAgICAgICAgbGFzdE9wICYmXG4gICAgICAgICAgbGFzdE9wLnR5cGUgPT09ICdpbnNlcnRfdGV4dCcgJiZcbiAgICAgICAgICBQYXRoLmVxdWFscyhvcGVyYXRpb24ucGF0aCwgbGFzdE9wLnBhdGgpICYmXG4gICAgICAgICAgbGFzdE9wLm9mZnNldCArIGxhc3RPcC50ZXh0Lmxlbmd0aCA9PT0gb3BlcmF0aW9uLm9mZnNldFxuICAgICAgICApIHtcbiAgICAgICAgICBsYXN0T3AudGV4dCArPSBvcGVyYXRpb24udGV4dFxuICAgICAgICAgIHJldHVybiBbbWFwLCBvcHNdXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG9wcy5wdXNoKG9wZXJhdGlvbilcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFtYXAuaGFzT3duUHJvcGVydHkob2JqKSkge1xuICAgICAgICBtYXBbb2JqXSA9IHRvSlMoQXV0b21lcmdlLmdldE9iamVjdEJ5SWQoZG9jLCBvYmopKVxuICAgICAgfVxuICAgICAgaWYgKHR5cGUgPT09ICdsaXN0Jykge1xuICAgICAgICBtYXBbb2JqXS5zcGxpY2UoaW5kZXgsIDAsIGxpbmsgPyBtYXBbdmFsdWVdIDogdmFsdWUpXG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICBtYXBbb2JqXSA9IG1hcFtvYmpdXG4gICAgICAgICAgPyBtYXBbb2JqXVxuICAgICAgICAgICAgICAuc2xpY2UoMCwgaW5kZXgpXG4gICAgICAgICAgICAgIC5jb25jYXQodmFsdWUpXG4gICAgICAgICAgICAgIC5jb25jYXQobWFwW29ial0uc2xpY2UoaW5kZXgpKVxuICAgICAgICAgIDogdmFsdWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gW21hcCwgb3BzXVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlLCBvcCwgdG9KUyhtYXApKVxuXG4gICAgcmV0dXJuIFttYXAsIG9wc11cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBvcEluc2VydFxuIl19