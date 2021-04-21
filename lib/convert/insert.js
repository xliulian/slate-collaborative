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
        } else if (lastOp && lastOp.type === 'remove_node') {
          var lastOpParentPath = _slate.Path.parent(lastOp.path);

          if (_lodash["default"].isEqual(lastOp.node, operation.node)) {
            ops.pop(); // XXX: fix the newPath since it currently is the case old path was removed
            //      but we need consider if the old path is not removed, what the newPath
            //      should be.
            //   1. if newPath is before path, it is not effected.
            //   2. if newPath same or under path, at the path end position, should add 1
            //   3. if newPath above path, remove path does not effect above path
            //   4. if newPath is after path, and is or under siblings after lowest level of path, add 1
            //   5. if newPath is after path, but not share same parent, it is not effected.

            var newPath = operation.path;

            if (!_slate.Path.isBefore(operation.path, lastOp.path) && operation.path.length >= lastOp.path.length && // parent also match !isBefore, but not effected.
            _slate.Path.isCommon(lastOpParentPath, operation.path)) {
              newPath[lastOp.path.length - 1] += 1;
            }

            ops.push({
              type: 'move_node',
              path: lastOp.path,
              newPath: newPath
            });
            return [map, ops];
          } else if (operation.node.children && _slate.Path.equals(operation.path, _slate.Path.next(lastOpParentPath)) && _slate.Node.get(tmpDoc, lastOpParentPath).children.length === lastOp.path[lastOp.path.length - 1]) {
            var previousRemovedNodes = ops.slice(-operation.node.children.length).filter(function (slateOp) {
              return slateOp.type === 'remove_node' && _slate.Path.equals(slateOp.path, lastOp.path);
            }).map(function (slateOp) {
              return slateOp.node;
            });

            if (previousRemovedNodes.length === operation.node.children.length && _lodash["default"].isEqual(previousRemovedNodes, operation.node.children)) {
              ops.splice(ops.length - previousRemovedNodes.length, previousRemovedNodes.length);
              ops.push({
                type: 'split_node',
                path: lastOpParentPath,
                position: lastOp.path[lastOp.path.length - 1],
                properties: _lodash["default"].omit(operation.node, 'children')
              });
              return [map, ops];
            }
          }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L2luc2VydC50cyJdLCJuYW1lcyI6WyJpbnNlcnRUZXh0T3AiLCJvYmoiLCJpbmRleCIsInBhdGgiLCJ2YWx1ZSIsIm1hcCIsImRvYyIsInNsYXRlUGF0aCIsIm5vZGUiLCJOb2RlIiwiZ2V0IiwidGV4dCIsInNsaWNlIiwiam9pbiIsInR5cGUiLCJvZmZzZXQiLCJpbnNlcnROb2RlT3AiLCJsaW5rIiwidG1wRG9jIiwic291cmNlIiwicGFyZW50IiwiY2hpbGRyZW4iLCJzcGxpY2UiLCJpbnNlcnRCeVR5cGUiLCJsaXN0Iiwib3BJbnNlcnQiLCJvcCIsIm9wcyIsImhhc093blByb3BlcnR5IiwiQXV0b21lcmdlIiwiZ2V0T2JqZWN0QnlJZCIsImxlbmd0aCIsImluc2VydCIsIm9wZXJhdGlvbiIsImxhc3RPcCIsIk9iamVjdCIsImtleXMiLCJQYXRoIiwiZXF1YWxzIiwibmV4dCIsImxhc3ROb2RlIiwicG9wIiwicHVzaCIsInBvc2l0aW9uIiwicHJvcGVydGllcyIsImxhc3RPcFBhcmVudFBhdGgiLCJfIiwiaXNFcXVhbCIsIm5ld1BhdGgiLCJpc0JlZm9yZSIsImlzQ29tbW9uIiwicHJldmlvdXNSZW1vdmVkTm9kZXMiLCJmaWx0ZXIiLCJzbGF0ZU9wIiwib21pdCIsImNvbmNhdCIsImUiLCJjb25zb2xlIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsSUFBTUEsWUFBWSxHQUFHLFNBQWZBLFlBQWU7QUFBQSxNQUFHQyxHQUFILFFBQUdBLEdBQUg7QUFBQSxNQUFRQyxLQUFSLFFBQVFBLEtBQVI7QUFBQSxNQUFlQyxJQUFmLFFBQWVBLElBQWY7QUFBQSxNQUFxQkMsS0FBckIsUUFBcUJBLEtBQXJCO0FBQUEsU0FBaUQsVUFDcEVDLEdBRG9FLEVBRXBFQyxHQUZvRSxFQUdqRTtBQUNILFFBQU1DLFNBQVMs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LEtBQUQsQ0FBTixHQUFnQkEsS0FBOUM7QUFDRCxPQUZELE1BRU8sSUFBSVUsSUFBSSxLQUFLLE1BQWIsRUFBcUI7QUFDMUJULFFBQUFBLEdBQUcsQ0FBQ0osR0FBRCxDQUFILEdBQVdJLEdBQUcsQ0FBQ0osR0FBRCxDQUFILEdBQ1BJLEdBQUcsQ0FBQ0osR0FBRCxDQUFILENBQ0dXLEtBREgsQ0FDUyxDQURULEVBQ1lWLEtBRFosRUFFR3FELE1BRkgsQ0FFVW5ELEtBRlYsRUFHR21ELE1BSEgsQ0FHVWxELEdBQUcsQ0FBQ0osR0FBRCxDQUFILENBQVNXLEtBQVQsQ0FBZVYsS0FBZixDQUhWLENBRE8sR0FLUEUsS0FMSjtBQU1EO0FBQ0Y7O0FBRUQsV0FBTyxDQUFDQyxHQUFELEVBQU1zQixHQUFOLENBQVA7QUFDRCxHQS9IRCxDQStIRSxPQUFPNkIsQ0FBUCxFQUFVO0FBQ1ZDLElBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjRixDQUFkLEVBQWlCOUIsRUFBakIsRUFBcUIsaUJBQUtyQixHQUFMLENBQXJCO0FBRUEsV0FBTyxDQUFDQSxHQUFELEVBQU1zQixHQUFOLENBQVA7QUFDRDtBQUNGLENBMUlEOztlQTRJZUYsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEF1dG9tZXJnZSBmcm9tICdhdXRvbWVyZ2UnXG5pbXBvcnQgeyBFbGVtZW50LCBOb2RlLCBQYXRoLCBPcGVyYXRpb24gfSBmcm9tICdzbGF0ZSdcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCdcblxuaW1wb3J0IHsgZ2V0VGFyZ2V0IH0gZnJvbSAnLi4vcGF0aCdcbmltcG9ydCB7IHRvU2xhdGVQYXRoLCB0b0pTIH0gZnJvbSAnLi4vdXRpbHMnXG5cbmltcG9ydCB7IFN5bmNEb2MgfSBmcm9tICcuLi9tb2RlbCdcblxuY29uc3QgaW5zZXJ0VGV4dE9wID0gKHsgb2JqLCBpbmRleCwgcGF0aCwgdmFsdWUgfTogQXV0b21lcmdlLkRpZmYpID0+IChcbiAgbWFwOiBhbnksXG4gIGRvYzogRWxlbWVudFxuKSA9PiB7XG4gIGNvbnN0IHNsYXRlUGF0aCA9IHRvU2xhdGVQYXRoKHBhdGgpXG4gIGNvbnN0IG5vZGUgPSBOb2RlLmdldChkb2MsIHNsYXRlUGF0aCkhXG4gIGNvbnN0IHRleHQgPSBub2RlLnRleHQhIGFzIHN0cmluZ1xuICBub2RlLnRleHQgPSBbdGV4dC5zbGljZSgwLCBpbmRleCksIHZhbHVlLCB0ZXh0LnNsaWNlKGluZGV4KV0uam9pbignJylcbiAgbWFwW29ial0gPSBub2RlLnRleHRcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnaW5zZXJ0X3RleHQnLFxuICAgIHBhdGg6IHNsYXRlUGF0aCxcbiAgICBvZmZzZXQ6IGluZGV4LFxuICAgIHRleHQ6IHZhbHVlXG4gICAgLy9tYXJrczogW11cbiAgfVxufVxuXG5jb25zdCBpbnNlcnROb2RlT3AgPSAoXG4gIHsgbGluaywgdmFsdWUsIG9iaiwgaW5kZXgsIHBhdGggfTogQXV0b21lcmdlLkRpZmYsXG4gIGRvYzogYW55XG4pID0+IChtYXA6IGFueSwgdG1wRG9jOiBFbGVtZW50KSA9PiB7XG4gIC8qY29uc3Qgb3BzOiBhbnkgPSBbXVxuXG4gIGNvbnN0IGl0ZXJhdGUgPSAoeyBjaGlsZHJlbiwgLi4uanNvbiB9OiBhbnksIHBhdGg6IGFueSkgPT4ge1xuICAgIGNvbnN0IG5vZGUgPSB0b0pTKGNoaWxkcmVuID8geyAuLi5qc29uLCBjaGlsZHJlbjogW10gfSA6IGpzb24pXG5cbiAgICBvcHMucHVzaCh7XG4gICAgICB0eXBlOiAnaW5zZXJ0X25vZGUnLFxuICAgICAgcGF0aCxcbiAgICAgIG5vZGVcbiAgICB9KVxuXG4gICAgLy8gdXBkYXRlIHRoZSB0ZW1wIGRvYyBzbyBsYXRlciByZW1vdmVfbm9kZSB3b24ndCBlcnJvci5cbiAgICBjb25zdCBwYXJlbnQgPSBOb2RlLnBhcmVudCh0bXBEb2MsIHBhdGgpXG4gICAgY29uc3QgaW5kZXggPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV1cbiAgICBwYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAwLCB0b0pTKG5vZGUpKVxuXG4gICAgY2hpbGRyZW4gJiZcbiAgICAgIGNoaWxkcmVuLmZvckVhY2goKG46IGFueSwgaTogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBtYXBbbl0gfHwgQXV0b21lcmdlLmdldE9iamVjdEJ5SWQoZG9jLCBuKVxuXG4gICAgICAgIGl0ZXJhdGUoKG5vZGUgJiYgdG9KUyhub2RlKSkgfHwgbiwgWy4uLnBhdGgsIGldKVxuICAgICAgfSlcbiAgfVxuKi9cbiAgY29uc3Qgc291cmNlID0gbGluayA/IG1hcFt2YWx1ZV0gOiB2YWx1ZVxuXG4gIGNvbnN0IHNsYXRlUGF0aCA9IHRvU2xhdGVQYXRoKHBhdGgpXG4gIGNvbnN0IHBhcmVudCA9IE5vZGUuZ2V0KHRtcERvYywgc2xhdGVQYXRoKSFcbiAgbWFwW29ial0gPSBwYXJlbnQuY2hpbGRyZW5cbiAgbWFwW29ial0uc3BsaWNlKGluZGV4LCAwLCBzb3VyY2UpXG5cbiAgLy9vcHMucHVzaCh7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ2luc2VydF9ub2RlJyxcbiAgICBwYXRoOiBbLi4uc2xhdGVQYXRoLCBpbmRleF0sXG4gICAgbm9kZTogdG9KUyhzb3VyY2UpXG4gIH0gLy8pXG5cbiAgLy9zb3VyY2UgJiYgaXRlcmF0ZShzb3VyY2UsIFsuLi50b1NsYXRlUGF0aChwYXRoKSwgaW5kZXhdKVxuXG4gIC8vcmV0dXJuIG9wc1xufVxuXG5jb25zdCBpbnNlcnRCeVR5cGUgPSB7XG4gIHRleHQ6IGluc2VydFRleHRPcCxcbiAgbGlzdDogaW5zZXJ0Tm9kZU9wXG59XG5cbmNvbnN0IG9wSW5zZXJ0ID0gKFxuICBvcDogQXV0b21lcmdlLkRpZmYsXG4gIFttYXAsIG9wc106IGFueSxcbiAgZG9jOiBTeW5jRG9jLFxuICB0bXBEb2M6IEVsZW1lbnRcbikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgbGluaywgb2JqLCBwYXRoLCBpbmRleCwgdHlwZSwgdmFsdWUgfSA9IG9wXG5cbiAgICBpZiAobGluayAmJiAhbWFwLmhhc093blByb3BlcnR5KHZhbHVlKSkge1xuICAgICAgbWFwW3ZhbHVlXSA9IHRvSlMoQXV0b21lcmdlLmdldE9iamVjdEJ5SWQoZG9jLCB2YWx1ZSkpXG4gICAgfVxuICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoICYmIHBhdGhbMF0gPT09ICdjaGlsZHJlbicpIHtcbiAgICAgIGNvbnN0IGluc2VydCA9IGluc2VydEJ5VHlwZVt0eXBlXVxuXG4gICAgICBjb25zdCBvcGVyYXRpb24gPSBpbnNlcnQgJiYgaW5zZXJ0KG9wLCBkb2MpKG1hcCwgdG1wRG9jKVxuXG4gICAgICBpZiAob3BlcmF0aW9uICYmIG9wZXJhdGlvbi50eXBlID09PSAnaW5zZXJ0X25vZGUnICYmIG9wZXJhdGlvbi5ub2RlKSB7XG4gICAgICAgIGNvbnN0IGxhc3RPcCA9IG9wc1tvcHMubGVuZ3RoIC0gMV1cbiAgICAgICAgaWYgKFxuICAgICAgICAgIG9wZXJhdGlvbi5ub2RlLnRleHQgJiZcbiAgICAgICAgICBPYmplY3Qua2V5cyhvcGVyYXRpb24ubm9kZSkubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgbGFzdE9wICYmXG4gICAgICAgICAgbGFzdE9wLnR5cGUgPT09ICdyZW1vdmVfdGV4dCcgJiZcbiAgICAgICAgICBQYXRoLmVxdWFscyhvcGVyYXRpb24ucGF0aCwgUGF0aC5uZXh0KGxhc3RPcC5wYXRoKSkgJiZcbiAgICAgICAgICBsYXN0T3AudGV4dC5zbGljZSgtb3BlcmF0aW9uLm5vZGUudGV4dC5sZW5ndGgpID09PSBvcGVyYXRpb24ubm9kZS50ZXh0XG4gICAgICAgICkge1xuICAgICAgICAgIC8vIGluc2VydCB0ZXh0IG5vZGUganVzdCBhZnRlciBkZWxldGUgc29tZSB0ZXh0LCBpdCBwb3NzaWJsbHkgYmUgc29tZSBzcGxpdF9ub2RlIG9wP1xuICAgICAgICAgIGNvbnN0IHNsYXRlUGF0aCA9IHRvU2xhdGVQYXRoKGxhc3RPcC5wYXRoKVxuICAgICAgICAgIGNvbnN0IGxhc3ROb2RlID0gZ2V0VGFyZ2V0KHRtcERvYywgc2xhdGVQYXRoKVxuICAgICAgICAgIGlmIChsYXN0Tm9kZS50ZXh0Lmxlbmd0aCA9PT0gbGFzdE9wLm9mZnNldCkge1xuICAgICAgICAgICAgLy8gcHJldmlvdXMgbm9kZSB3YXMganVzdCBkZWxldGVkIHRleHQgdW50aWwgdGhlIGVuZCwgc28gd2UgYXJlIHNwbGl0dGluZ1xuICAgICAgICAgICAgaWYgKGxhc3RPcC50ZXh0Lmxlbmd0aCA+IG9wZXJhdGlvbi5ub2RlLnRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGxhc3RPcC50ZXh0ID0gbGFzdE9wLnRleHQuc2xpY2UoMCwgLW9wZXJhdGlvbi5ub2RlLnRleHQubGVuZ3RoKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgb3BzLnBvcCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcHMucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGU6ICdzcGxpdF9ub2RlJyxcbiAgICAgICAgICAgICAgcGF0aDogbGFzdE9wLnBhdGgsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBsYXN0T3Aub2Zmc2V0LFxuICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7fVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBbbWFwLCBvcHNdXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGxhc3RPcCAmJiBsYXN0T3AudHlwZSA9PT0gJ3JlbW92ZV9ub2RlJykge1xuICAgICAgICAgIGNvbnN0IGxhc3RPcFBhcmVudFBhdGggPSBQYXRoLnBhcmVudChsYXN0T3AucGF0aClcbiAgICAgICAgICBpZiAoXy5pc0VxdWFsKGxhc3RPcC5ub2RlLCBvcGVyYXRpb24ubm9kZSkpIHtcbiAgICAgICAgICAgIG9wcy5wb3AoKVxuICAgICAgICAgICAgLy8gWFhYOiBmaXggdGhlIG5ld1BhdGggc2luY2UgaXQgY3VycmVudGx5IGlzIHRoZSBjYXNlIG9sZCBwYXRoIHdhcyByZW1vdmVkXG4gICAgICAgICAgICAvLyAgICAgIGJ1dCB3ZSBuZWVkIGNvbnNpZGVyIGlmIHRoZSBvbGQgcGF0aCBpcyBub3QgcmVtb3ZlZCwgd2hhdCB0aGUgbmV3UGF0aFxuICAgICAgICAgICAgLy8gICAgICBzaG91bGQgYmUuXG4gICAgICAgICAgICAvLyAgIDEuIGlmIG5ld1BhdGggaXMgYmVmb3JlIHBhdGgsIGl0IGlzIG5vdCBlZmZlY3RlZC5cbiAgICAgICAgICAgIC8vICAgMi4gaWYgbmV3UGF0aCBzYW1lIG9yIHVuZGVyIHBhdGgsIGF0IHRoZSBwYXRoIGVuZCBwb3NpdGlvbiwgc2hvdWxkIGFkZCAxXG4gICAgICAgICAgICAvLyAgIDMuIGlmIG5ld1BhdGggYWJvdmUgcGF0aCwgcmVtb3ZlIHBhdGggZG9lcyBub3QgZWZmZWN0IGFib3ZlIHBhdGhcbiAgICAgICAgICAgIC8vICAgNC4gaWYgbmV3UGF0aCBpcyBhZnRlciBwYXRoLCBhbmQgaXMgb3IgdW5kZXIgc2libGluZ3MgYWZ0ZXIgbG93ZXN0IGxldmVsIG9mIHBhdGgsIGFkZCAxXG4gICAgICAgICAgICAvLyAgIDUuIGlmIG5ld1BhdGggaXMgYWZ0ZXIgcGF0aCwgYnV0IG5vdCBzaGFyZSBzYW1lIHBhcmVudCwgaXQgaXMgbm90IGVmZmVjdGVkLlxuICAgICAgICAgICAgY29uc3QgbmV3UGF0aCA9IG9wZXJhdGlvbi5wYXRoXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICFQYXRoLmlzQmVmb3JlKG9wZXJhdGlvbi5wYXRoLCBsYXN0T3AucGF0aCkgJiZcbiAgICAgICAgICAgICAgb3BlcmF0aW9uLnBhdGgubGVuZ3RoID49IGxhc3RPcC5wYXRoLmxlbmd0aCAmJiAvLyBwYXJlbnQgYWxzbyBtYXRjaCAhaXNCZWZvcmUsIGJ1dCBub3QgZWZmZWN0ZWQuXG4gICAgICAgICAgICAgIFBhdGguaXNDb21tb24obGFzdE9wUGFyZW50UGF0aCwgb3BlcmF0aW9uLnBhdGgpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgbmV3UGF0aFtsYXN0T3AucGF0aC5sZW5ndGggLSAxXSArPSAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcHMucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGU6ICdtb3ZlX25vZGUnLFxuICAgICAgICAgICAgICBwYXRoOiBsYXN0T3AucGF0aCxcbiAgICAgICAgICAgICAgbmV3UGF0aFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBbbWFwLCBvcHNdXG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIG9wZXJhdGlvbi5ub2RlLmNoaWxkcmVuICYmXG4gICAgICAgICAgICBQYXRoLmVxdWFscyhvcGVyYXRpb24ucGF0aCwgUGF0aC5uZXh0KGxhc3RPcFBhcmVudFBhdGgpKSAmJlxuICAgICAgICAgICAgKE5vZGUuZ2V0KHRtcERvYywgbGFzdE9wUGFyZW50UGF0aCkgYXMgRWxlbWVudCkuY2hpbGRyZW4ubGVuZ3RoID09PVxuICAgICAgICAgICAgICBsYXN0T3AucGF0aFtsYXN0T3AucGF0aC5sZW5ndGggLSAxXVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNSZW1vdmVkTm9kZXMgPSBvcHNcbiAgICAgICAgICAgICAgLnNsaWNlKC1vcGVyYXRpb24ubm9kZS5jaGlsZHJlbi5sZW5ndGgpXG4gICAgICAgICAgICAgIC5maWx0ZXIoXG4gICAgICAgICAgICAgICAgKHNsYXRlT3A6IE9wZXJhdGlvbikgPT5cbiAgICAgICAgICAgICAgICAgIHNsYXRlT3AudHlwZSA9PT0gJ3JlbW92ZV9ub2RlJyAmJlxuICAgICAgICAgICAgICAgICAgUGF0aC5lcXVhbHMoc2xhdGVPcC5wYXRoLCBsYXN0T3AucGF0aClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAubWFwKChzbGF0ZU9wOiBPcGVyYXRpb24pID0+IHNsYXRlT3Aubm9kZSlcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgcHJldmlvdXNSZW1vdmVkTm9kZXMubGVuZ3RoID09PSBvcGVyYXRpb24ubm9kZS5jaGlsZHJlbi5sZW5ndGggJiZcbiAgICAgICAgICAgICAgXy5pc0VxdWFsKHByZXZpb3VzUmVtb3ZlZE5vZGVzLCBvcGVyYXRpb24ubm9kZS5jaGlsZHJlbilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBvcHMuc3BsaWNlKFxuICAgICAgICAgICAgICAgIG9wcy5sZW5ndGggLSBwcmV2aW91c1JlbW92ZWROb2Rlcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgcHJldmlvdXNSZW1vdmVkTm9kZXMubGVuZ3RoXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgb3BzLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdzcGxpdF9ub2RlJyxcbiAgICAgICAgICAgICAgICBwYXRoOiBsYXN0T3BQYXJlbnRQYXRoLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBsYXN0T3AucGF0aFtsYXN0T3AucGF0aC5sZW5ndGggLSAxXSxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiBfLm9taXQob3BlcmF0aW9uLm5vZGUsICdjaGlsZHJlbicpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIHJldHVybiBbbWFwLCBvcHNdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiAmJiBvcGVyYXRpb24udHlwZSA9PT0gJ2luc2VydF90ZXh0Jykge1xuICAgICAgICBjb25zdCBsYXN0T3AgPSBvcHNbb3BzLmxlbmd0aCAtIDFdXG4gICAgICAgIGlmIChcbiAgICAgICAgICBsYXN0T3AgJiZcbiAgICAgICAgICBsYXN0T3AudHlwZSA9PT0gJ2luc2VydF90ZXh0JyAmJlxuICAgICAgICAgIFBhdGguZXF1YWxzKG9wZXJhdGlvbi5wYXRoLCBsYXN0T3AucGF0aCkgJiZcbiAgICAgICAgICBsYXN0T3Aub2Zmc2V0ICsgbGFzdE9wLnRleHQubGVuZ3RoID09PSBvcGVyYXRpb24ub2Zmc2V0XG4gICAgICAgICkge1xuICAgICAgICAgIGxhc3RPcC50ZXh0ICs9IG9wZXJhdGlvbi50ZXh0XG4gICAgICAgICAgcmV0dXJuIFttYXAsIG9wc11cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb3BzLnB1c2gob3BlcmF0aW9uKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIW1hcC5oYXNPd25Qcm9wZXJ0eShvYmopKSB7XG4gICAgICAgIG1hcFtvYmpdID0gdG9KUyhBdXRvbWVyZ2UuZ2V0T2JqZWN0QnlJZChkb2MsIG9iaikpXG4gICAgICB9XG4gICAgICBpZiAodHlwZSA9PT0gJ2xpc3QnKSB7XG4gICAgICAgIG1hcFtvYmpdLnNwbGljZShpbmRleCwgMCwgbGluayA/IG1hcFt2YWx1ZV0gOiB2YWx1ZSlcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgIG1hcFtvYmpdID0gbWFwW29ial1cbiAgICAgICAgICA/IG1hcFtvYmpdXG4gICAgICAgICAgICAgIC5zbGljZSgwLCBpbmRleClcbiAgICAgICAgICAgICAgLmNvbmNhdCh2YWx1ZSlcbiAgICAgICAgICAgICAgLmNvbmNhdChtYXBbb2JqXS5zbGljZShpbmRleCkpXG4gICAgICAgICAgOiB2YWx1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBbbWFwLCBvcHNdXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUsIG9wLCB0b0pTKG1hcCkpXG5cbiAgICByZXR1cm4gW21hcCwgb3BzXVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9wSW5zZXJ0XG4iXX0=