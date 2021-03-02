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

            if (!_slate.Path.isBefore(operation.path, lastOp.path) && operation.path.length >= lastOp.path && // parent also match !isBefore, but not effected.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L2luc2VydC50cyJdLCJuYW1lcyI6WyJpbnNlcnRUZXh0T3AiLCJvYmoiLCJpbmRleCIsInBhdGgiLCJ2YWx1ZSIsIm1hcCIsImRvYyIsInNsYXRlUGF0aCIsIm5vZGUiLCJOb2RlIiwiZ2V0IiwidGV4dCIsInNsaWNlIiwiam9pbiIsInR5cGUiLCJvZmZzZXQiLCJpbnNlcnROb2RlT3AiLCJsaW5rIiwidG1wRG9jIiwic291cmNlIiwicGFyZW50IiwiY2hpbGRyZW4iLCJzcGxpY2UiLCJpbnNlcnRCeVR5cGUiLCJsaXN0Iiwib3BJbnNlcnQiLCJvcCIsIm9wcyIsImhhc093blByb3BlcnR5IiwiQXV0b21lcmdlIiwiZ2V0T2JqZWN0QnlJZCIsImxlbmd0aCIsImluc2VydCIsIm9wZXJhdGlvbiIsImxhc3RPcCIsIk9iamVjdCIsImtleXMiLCJQYXRoIiwiZXF1YWxzIiwibmV4dCIsImxhc3ROb2RlIiwicG9wIiwicHVzaCIsInBvc2l0aW9uIiwicHJvcGVydGllcyIsImxhc3RPcFBhcmVudFBhdGgiLCJfIiwiaXNFcXVhbCIsIm5ld1BhdGgiLCJpc0JlZm9yZSIsImlzQ29tbW9uIiwicHJldmlvdXNSZW1vdmVkTm9kZXMiLCJmaWx0ZXIiLCJzbGF0ZU9wIiwib21pdCIsImNvbmNhdCIsImUiLCJjb25zb2xlIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsSUFBTUEsWUFBWSxHQUFHLFNBQWZBLFlBQWU7QUFBQSxNQUFHQyxHQUFILFFBQUdBLEdBQUg7QUFBQSxNQUFRQyxLQUFSLFFBQVFBLEtBQVI7QUFBQSxNQUFlQyxJQUFmLFFBQWVBLElBQWY7QUFBQSxNQUFxQkMsS0FBckIsUUFBcUJBLEtBQXJCO0FBQUEsU0FBaUQsVUFDcEVDLEdBRG9FLEVBRXBFQyxHQUZvRSxFQUdqRTtBQUNILFFBQU1DLFNBQVMs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R0FBZ0JBLEtBQTlDO0FBQ0QsT0FGRCxNQUVPLElBQUlVLElBQUksS0FBSyxNQUFiLEVBQXFCO0FBQzFCVCxRQUFBQSxHQUFHLENBQUNKLEdBQUQsQ0FBSCxHQUFXSSxHQUFHLENBQUNKLEdBQUQsQ0FBSCxHQUNQSSxHQUFHLENBQUNKLEdBQUQsQ0FBSCxDQUNHVyxLQURILENBQ1MsQ0FEVCxFQUNZVixLQURaLEVBRUdxRCxNQUZILENBRVVuRCxLQUZWLEVBR0dtRCxNQUhILENBR1VsRCxHQUFHLENBQUNKLEdBQUQsQ0FBSCxDQUFTVyxLQUFULENBQWVWLEtBQWYsQ0FIVixDQURPLEdBS1BFLEtBTEo7QUFNRDtBQUNGOztBQUVELFdBQU8sQ0FBQ0MsR0FBRCxFQUFNc0IsR0FBTixDQUFQO0FBQ0QsR0EvSEQsQ0ErSEUsT0FBTzZCLENBQVAsRUFBVTtBQUNWQyxJQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBY0YsQ0FBZCxFQUFpQjlCLEVBQWpCLEVBQXFCLGlCQUFLckIsR0FBTCxDQUFyQjtBQUVBLFdBQU8sQ0FBQ0EsR0FBRCxFQUFNc0IsR0FBTixDQUFQO0FBQ0Q7QUFDRixDQTFJRDs7ZUE0SWVGLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBBdXRvbWVyZ2UgZnJvbSAnYXV0b21lcmdlJ1xuaW1wb3J0IHsgRWxlbWVudCwgTm9kZSwgUGF0aCwgT3BlcmF0aW9uIH0gZnJvbSAnc2xhdGUnXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5cbmltcG9ydCB7IGdldFRhcmdldCB9IGZyb20gJy4uL3BhdGgnXG5pbXBvcnQgeyB0b1NsYXRlUGF0aCwgdG9KUyB9IGZyb20gJy4uL3V0aWxzJ1xuXG5pbXBvcnQgeyBTeW5jRG9jIH0gZnJvbSAnLi4vbW9kZWwnXG5cbmNvbnN0IGluc2VydFRleHRPcCA9ICh7IG9iaiwgaW5kZXgsIHBhdGgsIHZhbHVlIH06IEF1dG9tZXJnZS5EaWZmKSA9PiAoXG4gIG1hcDogYW55LFxuICBkb2M6IEVsZW1lbnRcbikgPT4ge1xuICBjb25zdCBzbGF0ZVBhdGggPSB0b1NsYXRlUGF0aChwYXRoKVxuICBjb25zdCBub2RlID0gTm9kZS5nZXQoZG9jLCBzbGF0ZVBhdGgpIVxuICBjb25zdCB0ZXh0ID0gbm9kZS50ZXh0ISBhcyBzdHJpbmdcbiAgbm9kZS50ZXh0ID0gW3RleHQuc2xpY2UoMCwgaW5kZXgpLCB2YWx1ZSwgdGV4dC5zbGljZShpbmRleCldLmpvaW4oJycpXG4gIG1hcFtvYmpdID0gbm9kZS50ZXh0XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ2luc2VydF90ZXh0JyxcbiAgICBwYXRoOiBzbGF0ZVBhdGgsXG4gICAgb2Zmc2V0OiBpbmRleCxcbiAgICB0ZXh0OiB2YWx1ZVxuICAgIC8vbWFya3M6IFtdXG4gIH1cbn1cblxuY29uc3QgaW5zZXJ0Tm9kZU9wID0gKFxuICB7IGxpbmssIHZhbHVlLCBvYmosIGluZGV4LCBwYXRoIH06IEF1dG9tZXJnZS5EaWZmLFxuICBkb2M6IGFueVxuKSA9PiAobWFwOiBhbnksIHRtcERvYzogRWxlbWVudCkgPT4ge1xuICAvKmNvbnN0IG9wczogYW55ID0gW11cblxuICBjb25zdCBpdGVyYXRlID0gKHsgY2hpbGRyZW4sIC4uLmpzb24gfTogYW55LCBwYXRoOiBhbnkpID0+IHtcbiAgICBjb25zdCBub2RlID0gdG9KUyhjaGlsZHJlbiA/IHsgLi4uanNvbiwgY2hpbGRyZW46IFtdIH0gOiBqc29uKVxuXG4gICAgb3BzLnB1c2goe1xuICAgICAgdHlwZTogJ2luc2VydF9ub2RlJyxcbiAgICAgIHBhdGgsXG4gICAgICBub2RlXG4gICAgfSlcblxuICAgIC8vIHVwZGF0ZSB0aGUgdGVtcCBkb2Mgc28gbGF0ZXIgcmVtb3ZlX25vZGUgd29uJ3QgZXJyb3IuXG4gICAgY29uc3QgcGFyZW50ID0gTm9kZS5wYXJlbnQodG1wRG9jLCBwYXRoKVxuICAgIGNvbnN0IGluZGV4ID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdXG4gICAgcGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgdG9KUyhub2RlKSlcblxuICAgIGNoaWxkcmVuICYmXG4gICAgICBjaGlsZHJlbi5mb3JFYWNoKChuOiBhbnksIGk6IGFueSkgPT4ge1xuICAgICAgICBjb25zdCBub2RlID0gbWFwW25dIHx8IEF1dG9tZXJnZS5nZXRPYmplY3RCeUlkKGRvYywgbilcblxuICAgICAgICBpdGVyYXRlKChub2RlICYmIHRvSlMobm9kZSkpIHx8IG4sIFsuLi5wYXRoLCBpXSlcbiAgICAgIH0pXG4gIH1cbiovXG4gIGNvbnN0IHNvdXJjZSA9IGxpbmsgPyBtYXBbdmFsdWVdIDogdmFsdWVcblxuICBjb25zdCBzbGF0ZVBhdGggPSB0b1NsYXRlUGF0aChwYXRoKVxuICBjb25zdCBwYXJlbnQgPSBOb2RlLmdldCh0bXBEb2MsIHNsYXRlUGF0aCkhXG4gIG1hcFtvYmpdID0gcGFyZW50LmNoaWxkcmVuXG4gIG1hcFtvYmpdLnNwbGljZShpbmRleCwgMCwgc291cmNlKVxuXG4gIC8vb3BzLnB1c2goe1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdpbnNlcnRfbm9kZScsXG4gICAgcGF0aDogWy4uLnNsYXRlUGF0aCwgaW5kZXhdLFxuICAgIG5vZGU6IHRvSlMoc291cmNlKVxuICB9IC8vKVxuXG4gIC8vc291cmNlICYmIGl0ZXJhdGUoc291cmNlLCBbLi4udG9TbGF0ZVBhdGgocGF0aCksIGluZGV4XSlcblxuICAvL3JldHVybiBvcHNcbn1cblxuY29uc3QgaW5zZXJ0QnlUeXBlID0ge1xuICB0ZXh0OiBpbnNlcnRUZXh0T3AsXG4gIGxpc3Q6IGluc2VydE5vZGVPcFxufVxuXG5jb25zdCBvcEluc2VydCA9IChcbiAgb3A6IEF1dG9tZXJnZS5EaWZmLFxuICBbbWFwLCBvcHNdOiBhbnksXG4gIGRvYzogU3luY0RvYyxcbiAgdG1wRG9jOiBFbGVtZW50XG4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGxpbmssIG9iaiwgcGF0aCwgaW5kZXgsIHR5cGUsIHZhbHVlIH0gPSBvcFxuXG4gICAgaWYgKGxpbmsgJiYgIW1hcC5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkpIHtcbiAgICAgIG1hcFt2YWx1ZV0gPSB0b0pTKEF1dG9tZXJnZS5nZXRPYmplY3RCeUlkKGRvYywgdmFsdWUpKVxuICAgIH1cbiAgICBpZiAocGF0aCAmJiBwYXRoLmxlbmd0aCAmJiBwYXRoWzBdID09PSAnY2hpbGRyZW4nKSB7XG4gICAgICBjb25zdCBpbnNlcnQgPSBpbnNlcnRCeVR5cGVbdHlwZV1cblxuICAgICAgY29uc3Qgb3BlcmF0aW9uID0gaW5zZXJ0ICYmIGluc2VydChvcCwgZG9jKShtYXAsIHRtcERvYylcblxuICAgICAgaWYgKG9wZXJhdGlvbiAmJiBvcGVyYXRpb24udHlwZSA9PT0gJ2luc2VydF9ub2RlJyAmJiBvcGVyYXRpb24ubm9kZSkge1xuICAgICAgICBjb25zdCBsYXN0T3AgPSBvcHNbb3BzLmxlbmd0aCAtIDFdXG4gICAgICAgIGlmIChcbiAgICAgICAgICBvcGVyYXRpb24ubm9kZS50ZXh0ICYmXG4gICAgICAgICAgT2JqZWN0LmtleXMob3BlcmF0aW9uLm5vZGUpLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgIGxhc3RPcCAmJlxuICAgICAgICAgIGxhc3RPcC50eXBlID09PSAncmVtb3ZlX3RleHQnICYmXG4gICAgICAgICAgUGF0aC5lcXVhbHMob3BlcmF0aW9uLnBhdGgsIFBhdGgubmV4dChsYXN0T3AucGF0aCkpICYmXG4gICAgICAgICAgbGFzdE9wLnRleHQuc2xpY2UoLW9wZXJhdGlvbi5ub2RlLnRleHQubGVuZ3RoKSA9PT0gb3BlcmF0aW9uLm5vZGUudGV4dFxuICAgICAgICApIHtcbiAgICAgICAgICAvLyBpbnNlcnQgdGV4dCBub2RlIGp1c3QgYWZ0ZXIgZGVsZXRlIHNvbWUgdGV4dCwgaXQgcG9zc2libGx5IGJlIHNvbWUgc3BsaXRfbm9kZSBvcD9cbiAgICAgICAgICBjb25zdCBzbGF0ZVBhdGggPSB0b1NsYXRlUGF0aChsYXN0T3AucGF0aClcbiAgICAgICAgICBjb25zdCBsYXN0Tm9kZSA9IGdldFRhcmdldCh0bXBEb2MsIHNsYXRlUGF0aClcbiAgICAgICAgICBpZiAobGFzdE5vZGUudGV4dC5sZW5ndGggPT09IGxhc3RPcC5vZmZzZXQpIHtcbiAgICAgICAgICAgIC8vIHByZXZpb3VzIG5vZGUgd2FzIGp1c3QgZGVsZXRlZCB0ZXh0IHVudGlsIHRoZSBlbmQsIHNvIHdlIGFyZSBzcGxpdHRpbmdcbiAgICAgICAgICAgIGlmIChsYXN0T3AudGV4dC5sZW5ndGggPiBvcGVyYXRpb24ubm9kZS50ZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICBsYXN0T3AudGV4dCA9IGxhc3RPcC50ZXh0LnNsaWNlKDAsIC1vcGVyYXRpb24ubm9kZS50ZXh0Lmxlbmd0aClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG9wcy5wb3AoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3BzLnB1c2goe1xuICAgICAgICAgICAgICB0eXBlOiAnc3BsaXRfbm9kZScsXG4gICAgICAgICAgICAgIHBhdGg6IGxhc3RPcC5wYXRoLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogbGFzdE9wLm9mZnNldCxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge31cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gW21hcCwgb3BzXVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChsYXN0T3AgJiYgbGFzdE9wLnR5cGUgPT09ICdyZW1vdmVfbm9kZScpIHtcbiAgICAgICAgICBjb25zdCBsYXN0T3BQYXJlbnRQYXRoID0gUGF0aC5wYXJlbnQobGFzdE9wLnBhdGgpXG4gICAgICAgICAgaWYgKF8uaXNFcXVhbChsYXN0T3Aubm9kZSwgb3BlcmF0aW9uLm5vZGUpKSB7XG4gICAgICAgICAgICBvcHMucG9wKClcbiAgICAgICAgICAgIC8vIFhYWDogZml4IHRoZSBuZXdQYXRoIHNpbmNlIGl0IGN1cnJlbnRseSBpcyB0aGUgY2FzZSBvbGQgcGF0aCB3YXMgcmVtb3ZlZFxuICAgICAgICAgICAgLy8gICAgICBidXQgd2UgbmVlZCBjb25zaWRlciBpZiB0aGUgb2xkIHBhdGggaXMgbm90IHJlbW92ZWQsIHdoYXQgdGhlIG5ld1BhdGhcbiAgICAgICAgICAgIC8vICAgICAgc2hvdWxkIGJlLlxuICAgICAgICAgICAgLy8gICAxLiBpZiBuZXdQYXRoIGlzIGJlZm9yZSBwYXRoLCBpdCBpcyBub3QgZWZmZWN0ZWQuXG4gICAgICAgICAgICAvLyAgIDIuIGlmIG5ld1BhdGggc2FtZSBvciB1bmRlciBwYXRoLCBhdCB0aGUgcGF0aCBlbmQgcG9zaXRpb24sIHNob3VsZCBhZGQgMVxuICAgICAgICAgICAgLy8gICAzLiBpZiBuZXdQYXRoIGFib3ZlIHBhdGgsIHJlbW92ZSBwYXRoIGRvZXMgbm90IGVmZmVjdCBhYm92ZSBwYXRoXG4gICAgICAgICAgICAvLyAgIDQuIGlmIG5ld1BhdGggaXMgYWZ0ZXIgcGF0aCwgYW5kIGlzIG9yIHVuZGVyIHNpYmxpbmdzIGFmdGVyIGxvd2VzdCBsZXZlbCBvZiBwYXRoLCBhZGQgMVxuICAgICAgICAgICAgLy8gICA1LiBpZiBuZXdQYXRoIGlzIGFmdGVyIHBhdGgsIGJ1dCBub3Qgc2hhcmUgc2FtZSBwYXJlbnQsIGl0IGlzIG5vdCBlZmZlY3RlZC5cbiAgICAgICAgICAgIGNvbnN0IG5ld1BhdGggPSBvcGVyYXRpb24ucGF0aFxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAhUGF0aC5pc0JlZm9yZShvcGVyYXRpb24ucGF0aCwgbGFzdE9wLnBhdGgpICYmXG4gICAgICAgICAgICAgIG9wZXJhdGlvbi5wYXRoLmxlbmd0aCA+PSBsYXN0T3AucGF0aCAmJiAvLyBwYXJlbnQgYWxzbyBtYXRjaCAhaXNCZWZvcmUsIGJ1dCBub3QgZWZmZWN0ZWQuXG4gICAgICAgICAgICAgIFBhdGguaXNDb21tb24obGFzdE9wUGFyZW50UGF0aCwgb3BlcmF0aW9uLnBhdGgpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgbmV3UGF0aFtsYXN0T3AucGF0aC5sZW5ndGggLSAxXSArPSAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcHMucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGU6ICdtb3ZlX25vZGUnLFxuICAgICAgICAgICAgICBwYXRoOiBsYXN0T3AucGF0aCxcbiAgICAgICAgICAgICAgbmV3UGF0aFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBbbWFwLCBvcHNdXG4gICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIG9wZXJhdGlvbi5ub2RlLmNoaWxkcmVuICYmXG4gICAgICAgICAgICBQYXRoLmVxdWFscyhvcGVyYXRpb24ucGF0aCwgUGF0aC5uZXh0KGxhc3RPcFBhcmVudFBhdGgpKSAmJlxuICAgICAgICAgICAgKE5vZGUuZ2V0KHRtcERvYywgbGFzdE9wUGFyZW50UGF0aCkgYXMgRWxlbWVudCkuY2hpbGRyZW4ubGVuZ3RoID09PVxuICAgICAgICAgICAgICBsYXN0T3AucGF0aFtsYXN0T3AucGF0aC5sZW5ndGggLSAxXVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNSZW1vdmVkTm9kZXMgPSBvcHNcbiAgICAgICAgICAgICAgLnNsaWNlKC1vcGVyYXRpb24ubm9kZS5jaGlsZHJlbi5sZW5ndGgpXG4gICAgICAgICAgICAgIC5maWx0ZXIoXG4gICAgICAgICAgICAgICAgKHNsYXRlT3A6IE9wZXJhdGlvbikgPT5cbiAgICAgICAgICAgICAgICAgIHNsYXRlT3AudHlwZSA9PT0gJ3JlbW92ZV9ub2RlJyAmJlxuICAgICAgICAgICAgICAgICAgUGF0aC5lcXVhbHMoc2xhdGVPcC5wYXRoLCBsYXN0T3AucGF0aClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAubWFwKChzbGF0ZU9wOiBPcGVyYXRpb24pID0+IHNsYXRlT3Aubm9kZSlcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgcHJldmlvdXNSZW1vdmVkTm9kZXMubGVuZ3RoID09PSBvcGVyYXRpb24ubm9kZS5jaGlsZHJlbi5sZW5ndGggJiZcbiAgICAgICAgICAgICAgXy5pc0VxdWFsKHByZXZpb3VzUmVtb3ZlZE5vZGVzLCBvcGVyYXRpb24ubm9kZS5jaGlsZHJlbilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBvcHMuc3BsaWNlKFxuICAgICAgICAgICAgICAgIG9wcy5sZW5ndGggLSBwcmV2aW91c1JlbW92ZWROb2Rlcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgcHJldmlvdXNSZW1vdmVkTm9kZXMubGVuZ3RoXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgb3BzLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdzcGxpdF9ub2RlJyxcbiAgICAgICAgICAgICAgICBwYXRoOiBsYXN0T3BQYXJlbnRQYXRoLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBsYXN0T3AucGF0aFtsYXN0T3AucGF0aC5sZW5ndGggLSAxXSxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiBfLm9taXQob3BlcmF0aW9uLm5vZGUsICdjaGlsZHJlbicpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIHJldHVybiBbbWFwLCBvcHNdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiAmJiBvcGVyYXRpb24udHlwZSA9PT0gJ2luc2VydF90ZXh0Jykge1xuICAgICAgICBjb25zdCBsYXN0T3AgPSBvcHNbb3BzLmxlbmd0aCAtIDFdXG4gICAgICAgIGlmIChcbiAgICAgICAgICBsYXN0T3AgJiZcbiAgICAgICAgICBsYXN0T3AudHlwZSA9PT0gJ2luc2VydF90ZXh0JyAmJlxuICAgICAgICAgIFBhdGguZXF1YWxzKG9wZXJhdGlvbi5wYXRoLCBsYXN0T3AucGF0aCkgJiZcbiAgICAgICAgICBsYXN0T3Aub2Zmc2V0ICsgbGFzdE9wLnRleHQubGVuZ3RoID09PSBvcGVyYXRpb24ub2Zmc2V0XG4gICAgICAgICkge1xuICAgICAgICAgIGxhc3RPcC50ZXh0ICs9IG9wZXJhdGlvbi50ZXh0XG4gICAgICAgICAgcmV0dXJuIFttYXAsIG9wc11cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb3BzLnB1c2gob3BlcmF0aW9uKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIW1hcC5oYXNPd25Qcm9wZXJ0eShvYmopKSB7XG4gICAgICAgIG1hcFtvYmpdID0gdG9KUyhBdXRvbWVyZ2UuZ2V0T2JqZWN0QnlJZChkb2MsIG9iaikpXG4gICAgICB9XG4gICAgICBpZiAodHlwZSA9PT0gJ2xpc3QnKSB7XG4gICAgICAgIG1hcFtvYmpdLnNwbGljZShpbmRleCwgMCwgbGluayA/IG1hcFt2YWx1ZV0gOiB2YWx1ZSlcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgIG1hcFtvYmpdID0gbWFwW29ial1cbiAgICAgICAgICA/IG1hcFtvYmpdXG4gICAgICAgICAgICAgIC5zbGljZSgwLCBpbmRleClcbiAgICAgICAgICAgICAgLmNvbmNhdCh2YWx1ZSlcbiAgICAgICAgICAgICAgLmNvbmNhdChtYXBbb2JqXS5zbGljZShpbmRleCkpXG4gICAgICAgICAgOiB2YWx1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBbbWFwLCBvcHNdXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUsIG9wLCB0b0pTKG1hcCkpXG5cbiAgICByZXR1cm4gW21hcCwgb3BzXVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9wSW5zZXJ0XG4iXX0=