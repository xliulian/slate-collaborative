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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L2luc2VydC50cyJdLCJuYW1lcyI6WyJpbnNlcnRUZXh0T3AiLCJvYmoiLCJpbmRleCIsInBhdGgiLCJ2YWx1ZSIsIm1hcCIsImRvYyIsInNsYXRlUGF0aCIsIm5vZGUiLCJOb2RlIiwiZ2V0IiwidGV4dCIsInNsaWNlIiwiam9pbiIsInR5cGUiLCJvZmZzZXQiLCJpbnNlcnROb2RlT3AiLCJsaW5rIiwidG1wRG9jIiwic291cmNlIiwicGFyZW50IiwiY2hpbGRyZW4iLCJzcGxpY2UiLCJpbnNlcnRCeVR5cGUiLCJsaXN0Iiwib3BJbnNlcnQiLCJvcCIsIm9wcyIsImhhc093blByb3BlcnR5IiwiQXV0b21lcmdlIiwiZ2V0T2JqZWN0QnlJZCIsImxlbmd0aCIsImluc2VydCIsIm9wZXJhdGlvbiIsIk9iamVjdCIsImtleXMiLCJsYXN0T3AiLCJQYXRoIiwiZXF1YWxzIiwibmV4dCIsImxhc3ROb2RlIiwicG9wIiwicHVzaCIsInBvc2l0aW9uIiwiY29uY2F0IiwiZSIsImNvbnNvbGUiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsSUFBTUEsWUFBWSxHQUFHLFNBQWZBLFlBQWU7QUFBQSxNQUFHQyxHQUFILFFBQUdBLEdBQUg7QUFBQSxNQUFRQyxLQUFSLFFBQVFBLEtBQVI7QUFBQSxNQUFlQyxJQUFmLFFBQWVBLElBQWY7QUFBQSxNQUFxQkMsS0FBckIsUUFBcUJBLEtBQXJCO0FBQUEsU0FBaUQsVUFDcEVDLEdBRG9FLEVBRXBFQyxHQUZvRSxFQUdqRTtBQUNILFFBQU1DLFNBQVMsR0FBRyx3QkFBWUosSUFBWixDQUFsQjs7QUFDQSxRQUFNSyxJQUFJLEdBQUdDLFlBQUtDLEdBQUwsQ0FBU0osR0FBVCxFQUFjQyxTQUFkLENBQWI7O0FBQ0EsUUFBTUksSUFBSSxHQUFHSCxJQUFJLENBQUNHLElBQWxCO0FBQ0FILElBQUFB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QixDQUF2QixFQUEwQmUsSUFBSSxHQUFHWixHQUFHLENBQUNELEtBQUQsQ0FBTixHQUFnQkEsS0FBOUM7QUFDRCxPQUZELE1BRU8sSUFBSVUsSUFBSSxLQUFLLE1BQWIsRUFBcUI7QUFDMUJULFFBQUFBLEdBQUcsQ0FBQ0osR0FBRCxDQUFILEdBQVdJLEdBQUcsQ0FBQ0osR0FBRCxDQUFILEdBQ1BJLEdBQUcsQ0FBQ0osR0FBRCxDQUFILENBQ0dXLEtBREgsQ0FDUyxDQURULEVBQ1lWLEtBRFosRUFFRzBDLE1BRkgsQ0FFVXhDLEtBRlYsRUFHR3dDLE1BSEgsQ0FHVXZDLEdBQUcsQ0FBQ0osR0FBRCxDQUFILENBQVNXLEtBQVQsQ0FBZVYsS0FBZixDQUhWLENBRE8sR0FLUEUsS0FMSjtBQU1EO0FBQ0Y7O0FBRUQsV0FBTyxDQUFDQyxHQUFELEVBQU1zQixHQUFOLENBQVA7QUFDRCxHQTlERCxDQThERSxPQUFPa0IsQ0FBUCxFQUFVO0FBQ1ZDLElBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjRixDQUFkLEVBQWlCbkIsRUFBakIsRUFBcUIsaUJBQUtyQixHQUFMLENBQXJCO0FBRUEsV0FBTyxDQUFDQSxHQUFELEVBQU1zQixHQUFOLENBQVA7QUFDRDtBQUNGLENBekVEOztlQTJFZUYsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEF1dG9tZXJnZSBmcm9tICdhdXRvbWVyZ2UnXG5pbXBvcnQgeyBFbGVtZW50LCBOb2RlLCBQYXRoIH0gZnJvbSAnc2xhdGUnXG5cbmltcG9ydCB7IGdldFRhcmdldCB9IGZyb20gJy4uL3BhdGgnXG5pbXBvcnQgeyB0b1NsYXRlUGF0aCwgdG9KUyB9IGZyb20gJy4uL3V0aWxzJ1xuXG5pbXBvcnQgeyBTeW5jRG9jIH0gZnJvbSAnLi4vbW9kZWwnXG5cbmNvbnN0IGluc2VydFRleHRPcCA9ICh7IG9iaiwgaW5kZXgsIHBhdGgsIHZhbHVlIH06IEF1dG9tZXJnZS5EaWZmKSA9PiAoXG4gIG1hcDogYW55LFxuICBkb2M6IEVsZW1lbnRcbikgPT4ge1xuICBjb25zdCBzbGF0ZVBhdGggPSB0b1NsYXRlUGF0aChwYXRoKVxuICBjb25zdCBub2RlID0gTm9kZS5nZXQoZG9jLCBzbGF0ZVBhdGgpIVxuICBjb25zdCB0ZXh0ID0gbm9kZS50ZXh0ISBhcyBzdHJpbmdcbiAgbm9kZS50ZXh0ID0gW3RleHQuc2xpY2UoMCwgaW5kZXgpLCB2YWx1ZSwgdGV4dC5zbGljZShpbmRleCldLmpvaW4oJycpXG4gIG1hcFtvYmpdID0gbm9kZS50ZXh0XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ2luc2VydF90ZXh0JyxcbiAgICBwYXRoOiBzbGF0ZVBhdGgsXG4gICAgb2Zmc2V0OiBpbmRleCxcbiAgICB0ZXh0OiB2YWx1ZVxuICAgIC8vbWFya3M6IFtdXG4gIH1cbn1cblxuY29uc3QgaW5zZXJ0Tm9kZU9wID0gKFxuICB7IGxpbmssIHZhbHVlLCBvYmosIGluZGV4LCBwYXRoIH06IEF1dG9tZXJnZS5EaWZmLFxuICBkb2M6IGFueVxuKSA9PiAobWFwOiBhbnksIHRtcERvYzogRWxlbWVudCkgPT4ge1xuICAvKmNvbnN0IG9wczogYW55ID0gW11cblxuICBjb25zdCBpdGVyYXRlID0gKHsgY2hpbGRyZW4sIC4uLmpzb24gfTogYW55LCBwYXRoOiBhbnkpID0+IHtcbiAgICBjb25zdCBub2RlID0gdG9KUyhjaGlsZHJlbiA/IHsgLi4uanNvbiwgY2hpbGRyZW46IFtdIH0gOiBqc29uKVxuXG4gICAgb3BzLnB1c2goe1xuICAgICAgdHlwZTogJ2luc2VydF9ub2RlJyxcbiAgICAgIHBhdGgsXG4gICAgICBub2RlXG4gICAgfSlcblxuICAgIC8vIHVwZGF0ZSB0aGUgdGVtcCBkb2Mgc28gbGF0ZXIgcmVtb3ZlX25vZGUgd29uJ3QgZXJyb3IuXG4gICAgY29uc3QgcGFyZW50ID0gTm9kZS5wYXJlbnQodG1wRG9jLCBwYXRoKVxuICAgIGNvbnN0IGluZGV4ID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdXG4gICAgcGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgdG9KUyhub2RlKSlcblxuICAgIGNoaWxkcmVuICYmXG4gICAgICBjaGlsZHJlbi5mb3JFYWNoKChuOiBhbnksIGk6IGFueSkgPT4ge1xuICAgICAgICBjb25zdCBub2RlID0gbWFwW25dIHx8IEF1dG9tZXJnZS5nZXRPYmplY3RCeUlkKGRvYywgbilcblxuICAgICAgICBpdGVyYXRlKChub2RlICYmIHRvSlMobm9kZSkpIHx8IG4sIFsuLi5wYXRoLCBpXSlcbiAgICAgIH0pXG4gIH1cbiovXG4gIGNvbnN0IHNvdXJjZSA9IGxpbmsgPyBtYXBbdmFsdWVdIDogdmFsdWVcblxuICBjb25zdCBzbGF0ZVBhdGggPSB0b1NsYXRlUGF0aChwYXRoKVxuICBjb25zdCBwYXJlbnQgPSBOb2RlLmdldCh0bXBEb2MsIHNsYXRlUGF0aCkhXG4gIG1hcFtvYmpdID0gcGFyZW50LmNoaWxkcmVuXG4gIG1hcFtvYmpdLnNwbGljZShpbmRleCwgMCwgc291cmNlKVxuXG4gIC8vb3BzLnB1c2goe1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdpbnNlcnRfbm9kZScsXG4gICAgcGF0aDogWy4uLnNsYXRlUGF0aCwgaW5kZXhdLFxuICAgIG5vZGU6IHRvSlMoc291cmNlKVxuICB9IC8vKVxuXG4gIC8vc291cmNlICYmIGl0ZXJhdGUoc291cmNlLCBbLi4udG9TbGF0ZVBhdGgocGF0aCksIGluZGV4XSlcblxuICAvL3JldHVybiBvcHNcbn1cblxuY29uc3QgaW5zZXJ0QnlUeXBlID0ge1xuICB0ZXh0OiBpbnNlcnRUZXh0T3AsXG4gIGxpc3Q6IGluc2VydE5vZGVPcFxufVxuXG5jb25zdCBvcEluc2VydCA9IChcbiAgb3A6IEF1dG9tZXJnZS5EaWZmLFxuICBbbWFwLCBvcHNdOiBhbnksXG4gIGRvYzogU3luY0RvYyxcbiAgdG1wRG9jOiBFbGVtZW50XG4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGxpbmssIG9iaiwgcGF0aCwgaW5kZXgsIHR5cGUsIHZhbHVlIH0gPSBvcFxuXG4gICAgaWYgKGxpbmsgJiYgIW1hcC5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkpIHtcbiAgICAgIG1hcFt2YWx1ZV0gPSB0b0pTKEF1dG9tZXJnZS5nZXRPYmplY3RCeUlkKGRvYywgdmFsdWUpKVxuICAgIH1cbiAgICBpZiAocGF0aCAmJiBwYXRoLmxlbmd0aCAmJiBwYXRoWzBdID09PSAnY2hpbGRyZW4nKSB7XG4gICAgICBjb25zdCBpbnNlcnQgPSBpbnNlcnRCeVR5cGVbdHlwZV1cblxuICAgICAgY29uc3Qgb3BlcmF0aW9uID0gaW5zZXJ0ICYmIGluc2VydChvcCwgZG9jKShtYXAsIHRtcERvYylcblxuICAgICAgaWYgKFxuICAgICAgICBvcGVyYXRpb24gJiZcbiAgICAgICAgb3BlcmF0aW9uLnR5cGUgPT09ICdpbnNlcnRfbm9kZScgJiZcbiAgICAgICAgb3BlcmF0aW9uLm5vZGUgJiZcbiAgICAgICAgb3BlcmF0aW9uLm5vZGUudGV4dCAmJlxuICAgICAgICBPYmplY3Qua2V5cyhvcGVyYXRpb24ubm9kZSkubGVuZ3RoID09PSAxXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgbGFzdE9wID0gb3BzW29wcy5sZW5ndGggLSAxXVxuICAgICAgICBpZiAoXG4gICAgICAgICAgbGFzdE9wICYmXG4gICAgICAgICAgbGFzdE9wLnR5cGUgPT09ICdyZW1vdmVfdGV4dCcgJiZcbiAgICAgICAgICBQYXRoLmVxdWFscyhvcGVyYXRpb24ucGF0aCwgUGF0aC5uZXh0KGxhc3RPcC5wYXRoKSkgJiZcbiAgICAgICAgICBsYXN0T3AudGV4dC5zbGljZSgtb3BlcmF0aW9uLm5vZGUudGV4dC5sZW5ndGgpID09PSBvcGVyYXRpb24ubm9kZS50ZXh0XG4gICAgICAgICkge1xuICAgICAgICAgIC8vIGluc2VydCB0ZXh0IG5vZGUganVzdCBhZnRlciBkZWxldGUgc29tZSB0ZXh0LCBpdCBwb3NzaWJsbHkgYmUgc29tZSBzcGxpdF9ub2RlIG9wP1xuICAgICAgICAgIGNvbnN0IHNsYXRlUGF0aCA9IHRvU2xhdGVQYXRoKGxhc3RPcC5wYXRoKVxuICAgICAgICAgIGNvbnN0IGxhc3ROb2RlID0gZ2V0VGFyZ2V0KHRtcERvYywgc2xhdGVQYXRoKVxuICAgICAgICAgIGlmIChsYXN0Tm9kZS50ZXh0Lmxlbmd0aCA9PT0gbGFzdE9wLm9mZnNldCkge1xuICAgICAgICAgICAgLy8gcHJldmlvdXMgbm9kZSB3YXMganVzdCBkZWxldGVkIHRleHQgdW50aWwgdGhlIGVuZCwgc28gd2UgYXJlIHNwbGl0dGluZ1xuICAgICAgICAgICAgaWYgKGxhc3RPcC50ZXh0Lmxlbmd0aCA+IG9wZXJhdGlvbi5ub2RlLnRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGxhc3RPcC50ZXh0ID0gbGFzdE9wLnRleHQuc2xpY2UoMCwgLW9wZXJhdGlvbi5ub2RlLnRleHQubGVuZ3RoKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgb3BzLnBvcCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcHMucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGU6ICdzcGxpdF9ub2RlJyxcbiAgICAgICAgICAgICAgcGF0aDogbGFzdE9wLnBhdGgsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBsYXN0T3Aub2Zmc2V0XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIFttYXAsIG9wc11cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG9wcy5wdXNoKG9wZXJhdGlvbilcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFtYXAuaGFzT3duUHJvcGVydHkob2JqKSkge1xuICAgICAgICBtYXBbb2JqXSA9IHRvSlMoQXV0b21lcmdlLmdldE9iamVjdEJ5SWQoZG9jLCBvYmopKVxuICAgICAgfVxuICAgICAgaWYgKHR5cGUgPT09ICdsaXN0Jykge1xuICAgICAgICBtYXBbb2JqXS5zcGxpY2UoaW5kZXgsIDAsIGxpbmsgPyBtYXBbdmFsdWVdIDogdmFsdWUpXG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICBtYXBbb2JqXSA9IG1hcFtvYmpdXG4gICAgICAgICAgPyBtYXBbb2JqXVxuICAgICAgICAgICAgICAuc2xpY2UoMCwgaW5kZXgpXG4gICAgICAgICAgICAgIC5jb25jYXQodmFsdWUpXG4gICAgICAgICAgICAgIC5jb25jYXQobWFwW29ial0uc2xpY2UoaW5kZXgpKVxuICAgICAgICAgIDogdmFsdWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gW21hcCwgb3BzXVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlLCBvcCwgdG9KUyhtYXApKVxuXG4gICAgcmV0dXJuIFttYXAsIG9wc11cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBvcEluc2VydFxuIl19