"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Automerge = _interopRequireWildcard(require("automerge"));

var _slate = require("slate");

var _path = require("../path");

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

      if (operation && operation.type === 'insert_node' && operation.node && operation.node.text && Object.keys(operation.node).length === 1) {
        var lastOp = ops[ops.length - 1];

        if (lastOp && lastOp.type === 'remove_text' && _slate.Path.equals(operation.path, _slate.Path.next(lastOp.path)) && lastOp.text.slice(-operation.node.text.length) === operation.node.text) {
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
              position: lastOp.offset
            });
            return [map, ops];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L2luc2VydC50cyJdLCJuYW1lcyI6WyJpbnNlcnRUZXh0T3AiLCJvYmoiLCJpbmRleCIsInBhdGgiLCJ2YWx1ZSIsIm1hcCIsImRvYyIsInNsYXRlUGF0aCIsIm5vZGUiLCJOb2RlIiwiZ2V0IiwidGV4dCIsInNsaWNlIiwiam9pbiIsInR5cGUiLCJvZmZzZXQiLCJpbnNlcnROb2RlT3AiLCJsaW5rIiwidG1wRG9jIiwic291cmNlIiwicGFyZW50IiwiY2hpbGRyZW4iLCJzcGxpY2UiLCJpbnNlcnRCeVR5cGUiLCJsaXN0Iiwib3BJbnNlcnQiLCJvcCIsIm9wcyIsImhhc093blByb3BlcnR5IiwiQXV0b21lcmdlIiwiZ2V0T2JqZWN0QnlJZCIsImxlbmd0aCIsImluc2VydCIsIm9wZXJhdGlvbiIsIk9iamVjdCIsImtleXMiLCJsYXN0T3AiLCJQYXRoIiwiZXF1YWxzIiwibmV4dCIsImxhc3ROb2RlIiwicG9wIiwicHVzaCIsInBvc2l0aW9uIiwiY29uY2F0IiwiZSIsImNvbnNvbGUiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsSUFBTUEsWUFBWSxHQUFHLFNBQWZBLFlBQWU7QUFBQSxNQUFHQyxHQUFILFFBQUdBLEdBQUg7QUFBQSxNQUFRQyxLQUFSLFFBQVFBLEtBQVI7QUFBQSxNQUFlQyxJQUFmLFFBQWVBLElBQWY7QUFBQSxNQUFxQkMsS0FBckIsUUFBcUJBLEtBQXJCO0FBQUEsU0FBaUQsVUFDcEVDLEdBRG9FLEVBRXBFQyxHQUZvRSxFQUdqRTtBQUNILFFBQU1DLFNBQVMsR0FBRyx3QkFBWUosSUFBWixDQUFsQjs7QUFDQSxRQUFNSyxJQUFJLEdBQUdDLFlBQUtDLEdBQUwsQ0FBU0osR0FBVCxFQUFjQyxTQUFkLENBQWI7O0FBQ0EsUUFBTUksSUFBSSxHQUFHSCxJQUFJLENBQUNHLElBQWxCO0FBQ0FILElBQUFB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QWQsRUFBaUJuQixFQUFqQixFQUFxQixpQkFBS3JCLEdBQUwsQ0FBckI7QUFFQSxXQUFPLENBQUNBLEdBQUQsRUFBTXNCLEdBQU4sQ0FBUDtBQUNEO0FBQ0YsQ0FwRkQ7O2VBc0ZlRixRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQXV0b21lcmdlIGZyb20gJ2F1dG9tZXJnZSdcbmltcG9ydCB7IEVsZW1lbnQsIE5vZGUsIFBhdGggfSBmcm9tICdzbGF0ZSdcblxuaW1wb3J0IHsgZ2V0VGFyZ2V0IH0gZnJvbSAnLi4vcGF0aCdcbmltcG9ydCB7IHRvU2xhdGVQYXRoLCB0b0pTIH0gZnJvbSAnLi4vdXRpbHMnXG5cbmltcG9ydCB7IFN5bmNEb2MgfSBmcm9tICcuLi9tb2RlbCdcblxuY29uc3QgaW5zZXJ0VGV4dE9wID0gKHsgb2JqLCBpbmRleCwgcGF0aCwgdmFsdWUgfTogQXV0b21lcmdlLkRpZmYpID0+IChcbiAgbWFwOiBhbnksXG4gIGRvYzogRWxlbWVudFxuKSA9PiB7XG4gIGNvbnN0IHNsYXRlUGF0aCA9IHRvU2xhdGVQYXRoKHBhdGgpXG4gIGNvbnN0IG5vZGUgPSBOb2RlLmdldChkb2MsIHNsYXRlUGF0aCkhXG4gIGNvbnN0IHRleHQgPSBub2RlLnRleHQhIGFzIHN0cmluZ1xuICBub2RlLnRleHQgPSBbdGV4dC5zbGljZSgwLCBpbmRleCksIHZhbHVlLCB0ZXh0LnNsaWNlKGluZGV4KV0uam9pbignJylcbiAgbWFwW29ial0gPSBub2RlLnRleHRcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnaW5zZXJ0X3RleHQnLFxuICAgIHBhdGg6IHNsYXRlUGF0aCxcbiAgICBvZmZzZXQ6IGluZGV4LFxuICAgIHRleHQ6IHZhbHVlXG4gICAgLy9tYXJrczogW11cbiAgfVxufVxuXG5jb25zdCBpbnNlcnROb2RlT3AgPSAoXG4gIHsgbGluaywgdmFsdWUsIG9iaiwgaW5kZXgsIHBhdGggfTogQXV0b21lcmdlLkRpZmYsXG4gIGRvYzogYW55XG4pID0+IChtYXA6IGFueSwgdG1wRG9jOiBFbGVtZW50KSA9PiB7XG4gIC8qY29uc3Qgb3BzOiBhbnkgPSBbXVxuXG4gIGNvbnN0IGl0ZXJhdGUgPSAoeyBjaGlsZHJlbiwgLi4uanNvbiB9OiBhbnksIHBhdGg6IGFueSkgPT4ge1xuICAgIGNvbnN0IG5vZGUgPSB0b0pTKGNoaWxkcmVuID8geyAuLi5qc29uLCBjaGlsZHJlbjogW10gfSA6IGpzb24pXG5cbiAgICBvcHMucHVzaCh7XG4gICAgICB0eXBlOiAnaW5zZXJ0X25vZGUnLFxuICAgICAgcGF0aCxcbiAgICAgIG5vZGVcbiAgICB9KVxuXG4gICAgLy8gdXBkYXRlIHRoZSB0ZW1wIGRvYyBzbyBsYXRlciByZW1vdmVfbm9kZSB3b24ndCBlcnJvci5cbiAgICBjb25zdCBwYXJlbnQgPSBOb2RlLnBhcmVudCh0bXBEb2MsIHBhdGgpXG4gICAgY29uc3QgaW5kZXggPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV1cbiAgICBwYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAwLCB0b0pTKG5vZGUpKVxuXG4gICAgY2hpbGRyZW4gJiZcbiAgICAgIGNoaWxkcmVuLmZvckVhY2goKG46IGFueSwgaTogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBtYXBbbl0gfHwgQXV0b21lcmdlLmdldE9iamVjdEJ5SWQoZG9jLCBuKVxuXG4gICAgICAgIGl0ZXJhdGUoKG5vZGUgJiYgdG9KUyhub2RlKSkgfHwgbiwgWy4uLnBhdGgsIGldKVxuICAgICAgfSlcbiAgfVxuKi9cbiAgY29uc3Qgc291cmNlID0gbGluayA/IG1hcFt2YWx1ZV0gOiB2YWx1ZVxuXG4gIGNvbnN0IHNsYXRlUGF0aCA9IHRvU2xhdGVQYXRoKHBhdGgpXG4gIGNvbnN0IHBhcmVudCA9IE5vZGUuZ2V0KHRtcERvYywgc2xhdGVQYXRoKSFcbiAgbWFwW29ial0gPSBwYXJlbnQuY2hpbGRyZW5cbiAgbWFwW29ial0uc3BsaWNlKGluZGV4LCAwLCBzb3VyY2UpXG5cbiAgLy9vcHMucHVzaCh7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ2luc2VydF9ub2RlJyxcbiAgICBwYXRoOiBbLi4uc2xhdGVQYXRoLCBpbmRleF0sXG4gICAgbm9kZTogdG9KUyhzb3VyY2UpXG4gIH0gLy8pXG5cbiAgLy9zb3VyY2UgJiYgaXRlcmF0ZShzb3VyY2UsIFsuLi50b1NsYXRlUGF0aChwYXRoKSwgaW5kZXhdKVxuXG4gIC8vcmV0dXJuIG9wc1xufVxuXG5jb25zdCBpbnNlcnRCeVR5cGUgPSB7XG4gIHRleHQ6IGluc2VydFRleHRPcCxcbiAgbGlzdDogaW5zZXJ0Tm9kZU9wXG59XG5cbmNvbnN0IG9wSW5zZXJ0ID0gKFxuICBvcDogQXV0b21lcmdlLkRpZmYsXG4gIFttYXAsIG9wc106IGFueSxcbiAgZG9jOiBTeW5jRG9jLFxuICB0bXBEb2M6IEVsZW1lbnRcbikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgbGluaywgb2JqLCBwYXRoLCBpbmRleCwgdHlwZSwgdmFsdWUgfSA9IG9wXG5cbiAgICBpZiAobGluayAmJiAhbWFwLmhhc093blByb3BlcnR5KHZhbHVlKSkge1xuICAgICAgbWFwW3ZhbHVlXSA9IHRvSlMoQXV0b21lcmdlLmdldE9iamVjdEJ5SWQoZG9jLCB2YWx1ZSkpXG4gICAgfVxuICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoICYmIHBhdGhbMF0gPT09ICdjaGlsZHJlbicpIHtcbiAgICAgIGNvbnN0IGluc2VydCA9IGluc2VydEJ5VHlwZVt0eXBlXVxuXG4gICAgICBjb25zdCBvcGVyYXRpb24gPSBpbnNlcnQgJiYgaW5zZXJ0KG9wLCBkb2MpKG1hcCwgdG1wRG9jKVxuXG4gICAgICBpZiAoXG4gICAgICAgIG9wZXJhdGlvbiAmJlxuICAgICAgICBvcGVyYXRpb24udHlwZSA9PT0gJ2luc2VydF9ub2RlJyAmJlxuICAgICAgICBvcGVyYXRpb24ubm9kZSAmJlxuICAgICAgICBvcGVyYXRpb24ubm9kZS50ZXh0ICYmXG4gICAgICAgIE9iamVjdC5rZXlzKG9wZXJhdGlvbi5ub2RlKS5sZW5ndGggPT09IDFcbiAgICAgICkge1xuICAgICAgICBjb25zdCBsYXN0T3AgPSBvcHNbb3BzLmxlbmd0aCAtIDFdXG4gICAgICAgIGlmIChcbiAgICAgICAgICBsYXN0T3AgJiZcbiAgICAgICAgICBsYXN0T3AudHlwZSA9PT0gJ3JlbW92ZV90ZXh0JyAmJlxuICAgICAgICAgIFBhdGguZXF1YWxzKG9wZXJhdGlvbi5wYXRoLCBQYXRoLm5leHQobGFzdE9wLnBhdGgpKSAmJlxuICAgICAgICAgIGxhc3RPcC50ZXh0LnNsaWNlKC1vcGVyYXRpb24ubm9kZS50ZXh0Lmxlbmd0aCkgPT09IG9wZXJhdGlvbi5ub2RlLnRleHRcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gaW5zZXJ0IHRleHQgbm9kZSBqdXN0IGFmdGVyIGRlbGV0ZSBzb21lIHRleHQsIGl0IHBvc3NpYmxseSBiZSBzb21lIHNwbGl0X25vZGUgb3A/XG4gICAgICAgICAgY29uc3Qgc2xhdGVQYXRoID0gdG9TbGF0ZVBhdGgobGFzdE9wLnBhdGgpXG4gICAgICAgICAgY29uc3QgbGFzdE5vZGUgPSBnZXRUYXJnZXQodG1wRG9jLCBzbGF0ZVBhdGgpXG4gICAgICAgICAgaWYgKGxhc3ROb2RlLnRleHQubGVuZ3RoID09PSBsYXN0T3Aub2Zmc2V0KSB7XG4gICAgICAgICAgICAvLyBwcmV2aW91cyBub2RlIHdhcyBqdXN0IGRlbGV0ZWQgdGV4dCB1bnRpbCB0aGUgZW5kLCBzbyB3ZSBhcmUgc3BsaXR0aW5nXG4gICAgICAgICAgICBpZiAobGFzdE9wLnRleHQubGVuZ3RoID4gb3BlcmF0aW9uLm5vZGUudGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgbGFzdE9wLnRleHQgPSBsYXN0T3AudGV4dC5zbGljZSgwLCAtb3BlcmF0aW9uLm5vZGUudGV4dC5sZW5ndGgpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBvcHMucG9wKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wcy5wdXNoKHtcbiAgICAgICAgICAgICAgdHlwZTogJ3NwbGl0X25vZGUnLFxuICAgICAgICAgICAgICBwYXRoOiBsYXN0T3AucGF0aCxcbiAgICAgICAgICAgICAgcG9zaXRpb246IGxhc3RPcC5vZmZzZXRcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gW21hcCwgb3BzXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gJiYgb3BlcmF0aW9uLnR5cGUgPT09ICdpbnNlcnRfdGV4dCcpIHtcbiAgICAgICAgY29uc3QgbGFzdE9wID0gb3BzW29wcy5sZW5ndGggLSAxXVxuICAgICAgICBpZiAoXG4gICAgICAgICAgbGFzdE9wICYmXG4gICAgICAgICAgbGFzdE9wLnR5cGUgPT09ICdpbnNlcnRfdGV4dCcgJiZcbiAgICAgICAgICBQYXRoLmVxdWFscyhvcGVyYXRpb24ucGF0aCwgbGFzdE9wLnBhdGgpICYmXG4gICAgICAgICAgbGFzdE9wLm9mZnNldCArIGxhc3RPcC50ZXh0Lmxlbmd0aCA9PT0gb3BlcmF0aW9uLm9mZnNldFxuICAgICAgICApIHtcbiAgICAgICAgICBsYXN0T3AudGV4dCArPSBvcGVyYXRpb24udGV4dFxuICAgICAgICAgIHJldHVybiBbbWFwLCBvcHNdXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG9wcy5wdXNoKG9wZXJhdGlvbilcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFtYXAuaGFzT3duUHJvcGVydHkob2JqKSkge1xuICAgICAgICBtYXBbb2JqXSA9IHRvSlMoQXV0b21lcmdlLmdldE9iamVjdEJ5SWQoZG9jLCBvYmopKVxuICAgICAgfVxuICAgICAgaWYgKHR5cGUgPT09ICdsaXN0Jykge1xuICAgICAgICBtYXBbb2JqXS5zcGxpY2UoaW5kZXgsIDAsIGxpbmsgPyBtYXBbdmFsdWVdIDogdmFsdWUpXG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICBtYXBbb2JqXSA9IG1hcFtvYmpdXG4gICAgICAgICAgPyBtYXBbb2JqXVxuICAgICAgICAgICAgICAuc2xpY2UoMCwgaW5kZXgpXG4gICAgICAgICAgICAgIC5jb25jYXQodmFsdWUpXG4gICAgICAgICAgICAgIC5jb25jYXQobWFwW29ial0uc2xpY2UoaW5kZXgpKVxuICAgICAgICAgIDogdmFsdWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gW21hcCwgb3BzXVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlLCBvcCwgdG9KUyhtYXApKVxuXG4gICAgcmV0dXJuIFttYXAsIG9wc11cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBvcEluc2VydFxuIl19