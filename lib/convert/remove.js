"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("../utils");

var _path = require("../path");

var _set = require("./set");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var removeTextOp = function removeTextOp(op) {
  return function (map, doc) {
    try {
      var _node, _node$text;

      var index = op.index,
          path = op.path,
          obj = op.obj;
      var slatePath = (0, _utils.toSlatePath)(path).slice(0, path === null || path === void 0 ? void 0 : path.length);
      var node = map[obj];

      try {
        node = (0, _path.getTarget)(doc, slatePath);
      } catch (e) {
        console.error(e, slatePath, op, map, (0, _utils.toJS)(doc));
      }

      if (typeof index !== 'number') return;
      var text = ((_node = node) === null || _node === void 0 ? void 0 : (_node$text = _node.text) === null || _node$text === void 0 ? void 0 : _node$text[index]) || '*';

      if (node) {
        var _node2;

        node.text = (_node2 = node) !== null && _node2 !== void 0 && _node2.text ? node.text.slice(0, index) + node.text.slice(index + 1) : '';
      }

      return {
        type: 'remove_text',
        path: slatePath,
        offset: index,
        text: text,
        marks: []
      };
    } catch (e) {
      console.error(e, op, map, (0, _utils.toJS)(doc));
    }
  };
};

var removeNodeOp = function removeNodeOp(op) {
  return function (map, doc) {
    try {
      var _parent$children, _parent$children2;

      var index = op.index,
          obj = op.obj,
          path = op.path;
      var slatePath = (0, _utils.toSlatePath)(path);
      var parent = (0, _path.getTarget)(doc, slatePath);
      var target = (parent === null || parent === void 0 ? void 0 : (_parent$children = parent.children) === null || _parent$children === void 0 ? void 0 : _parent$children[index]) || (parent === null || parent === void 0 ? void 0 : parent[index]) || {
        children: []
      };

      if (!target) {
        throw new TypeError('Target is not found!');
      }

      if (!map.hasOwnProperty(obj)) {
        map[obj] = target;
      }

      if (!Number.isInteger(index)) {
        throw new TypeError('Index is not a number');
      }

      if (parent !== null && parent !== void 0 && (_parent$children2 = parent.children) !== null && _parent$children2 !== void 0 && _parent$children2[index]) {
        parent.children.splice(index, 1);
      } else if (parent !== null && parent !== void 0 && parent[index]) {
        parent.splice(index, 1);
      }

      return {
        type: 'remove_node',
        path: slatePath.length ? slatePath.concat(index) : [index],
        node: target
      };
    } catch (e) {
      console.error(e, op, map, (0, _utils.toJS)(doc));
    }
  };
};

var opRemove = function opRemove(op, _ref, doc, tmpDoc) {
  var _ref2 = _slicedToArray(_ref, 2),
      map = _ref2[0],
      ops = _ref2[1];

  try {
    var _map$obj;

    var index = op.index,
        path = op.path,
        obj = op.obj,
        type = op.type;

    if (type === 'map' && path) {
      // remove a key from map, mapping to slate set a key's value to undefined.
      ops.push((0, _set.setDataOp)(op, doc)(map, tmpDoc));
      return [map, ops];
    }

    if (map.hasOwnProperty(obj) && typeof map[obj] !== 'string' && type !== 'text' && map !== null && map !== void 0 && (_map$obj = map.obj) !== null && _map$obj !== void 0 && _map$obj.length) {
      map[obj].splice(index, 1);
      return [map, ops];
    }

    if (!path) return [map, ops];
    var key = path[path.length - 1];
    if (key === 'cursors' || op.key === 'cursors') return [map, ops];
    var fn = key === 'text' ? removeTextOp : removeNodeOp;
    return [map, [].concat(_toConsumableArray(ops), [fn(op)(map, tmpDoc)])];
  } catch (e) {
    console.error(e, op, (0, _utils.toJS)(map));
    return [map, ops];
  }
};

var _default = opRemove;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L3JlbW92ZS50cyJdLCJuYW1lcyI6WyJyZW1vdmVUZXh0T3AiLCJvcCIsIm1hcCIsImRvYyIsImluZGV4IiwicGF0aCIsIm9iaiIsInNsYXRlUGF0aCIsInNsaWNlIiwibGVuZ3RoIiwibm9kZSIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJ0ZXh0IiwidHlwZSIsIm9mZnNldCIsIm1hcmtzIiwicmVtb3ZlTm9kZU9wIiwicGFyZW50IiwidGFyZ2V0IiwiY2hpbGRyZW4iLCJUeXBlRXJyb3IiLCJoYXNPd25Qcm9wZXJ0eSIsIk51bWJlciIsImlzSW50ZWdlciIsInNwbGljZSIsImNvbmNhdCIsIm9wUmVtb3ZlIiwidG1wRG9jIiwib3BzIiwicHVzaCIsImtleSIsImZuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBR0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFDQyxFQUFEO0FBQUEsU0FBd0IsVUFBQ0MsR0FBRCxFQUFXQyxHQUFYLEVBQTRCO0FBQ3ZFLFFBQUk7QUFBQTs7QUFBQSxVQUNNQyxLQUROLEdBQzJCSCxFQUQzQixDQUNNRyxLQUROO0FBQUEsVUFDYUMsSUFEYixHQUMyQkosRUFEM0IsQ0FDYUksSUFEYjtBQUFBLFVBQ21CQyxHQURuQixHQUMyQkwsRUFEM0IsQ0FDbUJLLEdBRG5CO0FBR0YsVUFBTUMsU0FBUyxHQUFHLHdCQUFZRixJQUFaLEVBQWtCRyxLQUFsQixDQUF3QixDQUF4QixFQUEyQkgsSUFBM0IsYUFBMkJBLElBQTNCLHVCQUEyQkEsSUFBSSxDQUFFSSxNQUFqQyxDQUFsQjtBQUVBLFVBQUlDLElBQUksR0FBR1IsR0FBRyxDQUFDSSxHQUFELENBQWQ7O0FBRUEsVUFBSTtBQUNGSSxRQUFBQSxJQUFJLEdBQUcscUJBQVVQLEdBQVYsRUFBZUksU0FBZixDQUFQO0FBQ0QsT0FGRCxDQUVFLE9BQU9JLENBQVAsRUFBVTtBQUNWQyxRQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBY0YsQ0FBZCxFQUFpQkosU0FBakIsRUFBNEJOLEVBQTVCLEVBQWdDQyxHQUFoQyxFQUFxQyxpQkFBS0MsR0FBTCxDQUFyQztBQUNEOztBQUVELFVBQUksT0FBT0MsS0FBUCxLQUFpQixRQUFyQixFQUErQjtBQUUvQixVQUFNVSxJQUFJLEdBQUcsVUFBQUosSUFBSSxVQUFKLG9EQUFNSSxJQUFOLDBEQUFhVixLQUFiLE1BQXVCLEdBQXBDOztBQUVBLFVBQUlNLElBQUosRUFBVTtBQUFBOztBQUNSQSxRQUFBQSxJQUFJLENBQUNJLElBQUwsR0FBWSxVQUFBSixJQUFJLFVBQUosZ0NBQU1JLElBQU4sR0FDUkosSUFBSSxDQUFDSSxJQUFMLENBQVVOLEtBQVYsQ0FBZ0IsQ0FBaEIsRUFBbUJKLEtBQW5CLElBQTRCTSxJQUFJLENBQUNJLElBQUwsQ0FBVU4sS0FBVixDQUFnQkosS0FBSyxHQUFHLENBQXhCLENBRHBCLEdBRVIsRUFGSjtBQUdEOztBQUVELGFBQU87QUFDTFcsUUFBQUEsSUFBSSxFQUFFLGFBREQ7QUFFTFYsUUFBQUEsSUFBSSxFQUFFRSxTQUZEO0FBR0xTLFFBQUFBLE1BQU0sRUFBRVosS0FISDtBQUlMVSxRQUFBQSxJQUFJLEVBQUpBLElBSks7QUFLTEcsUUFBQUEsS0FBSyxFQUFFO0FBTEYsT0FBUDtBQU9ELEtBOUJELENBOEJFLE9BQU9OLENBQVAsRUFBVTtBQUNWQyxNQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBY0YsQ0FBZCxFQUFpQlYsRUFBakIsRUFBcUJDLEdBQXJCLEVBQTBCLGlCQUFLQyxHQUFMLENBQTFCO0FBQ0Q7QUFDRixHQWxDb0I7QUFBQSxDQUFyQjs7QUFvQ0EsSUFBTWUsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBQ2pCLEVBQUQ7QUFBQSxTQUF3QixVQUFDQyxHQUFELEVBQVdDLEdBQVgsRUFBNEI7QUFDdkUsUUFBSTtBQUFBOztBQUFBLFVBQ01DLEtBRE4sR0FDMkJILEVBRDNCLENBQ01HLEtBRE47QUFBQSxVQUNhRSxHQURiLEdBQzJCTCxFQUQzQixDQUNhSyxHQURiO0FBQUEsVUFDa0JELElBRGxCLEdBQzJCSixFQUQzQixDQUNrQkksSUFEbEI7QUFHRixVQUFNRSxTQUFTLEdBQUcsd0JBQVlGLElBQVosQ0FBbEI7QUFFQSxVQUFNYyxNQUFNLEdBQUcscUJBQVVoQixHQUFWLEVBQWVJLFNBQWYsQ0FBZjtBQUNBLFVBQU1hLE1BQU0sR0FBRyxDQUFBRCxNQUFNLFNBQU4sSUFBQUEsTUFBTSxXQUFOLGdDQUFBQSxNQUFNLENBQUVFLFFBQVIsc0VBQW1CakIsS0FBbkIsT0FDYmUsTUFEYSxhQUNiQSxNQURhLHVCQUNiQSxNQUFNLENBQUdmLEtBQUgsQ0FETyxLQUNnQjtBQUFFaUIsUUFBQUEsUUFBUSxFQUFFO0FBQVosT0FEL0I7O0FBR0EsVUFBSSxDQUFDRCxNQUFMLEVBQWE7QUFDWCxjQUFNLElBQUlFLFNBQUosQ0FBYyxzQkFBZCxDQUFOO0FBQ0Q7O0FBRUQsVUFBSSxDQUFDcEIsR0FBRyxDQUFDcUIsY0FBSixDQUFtQmpCLEdBQW5CLENBQUwsRUFBOEI7QUFDNUJKLFFBQUFBLEdBQUcsQ0FBQ0ksR0FBRCxDQUFILEdBQVdjLE1BQVg7QUFDRDs7QUFFRCxVQUFJLENBQUNJLE1BQU0sQ0FBQ0MsU0FBUCxDQUFpQnJCLEtBQWpCLENBQUwsRUFBOEI7QUFDNUIsY0FBTSxJQUFJa0IsU0FBSixDQUFjLHVCQUFkLENBQU47QUFDRDs7QUFFRCxVQUFJSCxNQUFKLGFBQUlBLE1BQUosb0NBQUlBLE1BQU0sQ0FBRUUsUUFBWiw4Q0FBSSxrQkFBbUJqQixLQUFuQixDQUFKLEVBQXlDO0FBQ3ZDZSxRQUFBQSxNQUFNLENBQUNFLFFBQVAsQ0FBZ0JLLE1BQWhCLENBQXVCdEIsS0FBdkIsRUFBOEIsQ0FBOUI7QUFDRCxPQUZELE1BRU8sSUFBSWUsTUFBSixhQUFJQSxNQUFKLGVBQUlBLE1BQU0sQ0FBR2YsS0FBSCxDQUFWLEVBQStCO0FBQ3BDZSxRQUFBQSxNQUFNLENBQUNPLE1BQVAsQ0FBY3RCLEtBQWQsRUFBcUIsQ0FBckI7QUFDRDs7QUFFRCxhQUFPO0FBQ0xXLFFBQUFBLElBQUksRUFBRSxhQUREO0FBRUxWLFFBQUFBLElBQUksRUFBRUUsU0FBUyxDQUFDRSxNQUFWLEdBQW1CRixTQUFTLENBQUNvQixNQUFWLENBQWlCdkIsS0FBakIsQ0FBbkIsR0FBNkMsQ0FBQ0EsS0FBRCxDQUY5QztBQUdMTSxRQUFBQSxJQUFJLEVBQUVVO0FBSEQsT0FBUDtBQUtELEtBaENELENBZ0NFLE9BQU9ULENBQVAsRUFBVTtBQUNWQyxNQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBY0YsQ0FBZCxFQUFpQlYsRUFBakIsRUFBcUJDLEdBQXJCLEVBQTBCLGlCQUFLQyxHQUFMLENBQTFCO0FBQ0Q7QUFDRixHQXBDb0I7QUFBQSxDQUFyQjs7QUFzQ0EsSUFBTXlCLFFBQVEsR0FBRyxTQUFYQSxRQUFXLENBQ2YzQixFQURlLFFBR2ZFLEdBSGUsRUFJZjBCLE1BSmUsRUFLWjtBQUFBO0FBQUEsTUFIRjNCLEdBR0U7QUFBQSxNQUhHNEIsR0FHSDs7QUFDSCxNQUFJO0FBQUE7O0FBQUEsUUFDTTFCLEtBRE4sR0FDaUNILEVBRGpDLENBQ01HLEtBRE47QUFBQSxRQUNhQyxJQURiLEdBQ2lDSixFQURqQyxDQUNhSSxJQURiO0FBQUEsUUFDbUJDLEdBRG5CLEdBQ2lDTCxFQURqQyxDQUNtQkssR0FEbkI7QUFBQSxRQUN3QlMsSUFEeEIsR0FDaUNkLEVBRGpDLENBQ3dCYyxJQUR4Qjs7QUFHRixRQUFJQSxJQUFJLEtBQUssS0FBVCxJQUFrQlYsSUFBdEIsRUFBNEI7QUFDMUI7QUFDQXlCLE1BQUFBLEdBQUcsQ0FBQ0MsSUFBSixDQUFTLG9CQUFVOUIsRUFBVixFQUFjRSxHQUFkLEVBQW1CRCxHQUFuQixFQUF3QjJCLE1BQXhCLENBQVQ7QUFDQSxhQUFPLENBQUMzQixHQUFELEVBQU00QixHQUFOLENBQVA7QUFDRDs7QUFFRCxRQUNFNUIsR0FBRyxDQUFDcUIsY0FBSixDQUFtQmpCLEdBQW5CLEtBQ0EsT0FBT0osR0FBRyxDQUFDSSxHQUFELENBQVYsS0FBb0IsUUFEcEIsSUFFQVMsSUFBSSxLQUFLLE1BRlQsSUFHQWIsR0FIQSxhQUdBQSxHQUhBLDJCQUdBQSxHQUFHLENBQUVJLEdBSEwscUNBR0EsU0FBVUcsTUFKWixFQUtFO0FBQ0FQLE1BQUFBLEdBQUcsQ0FBQ0ksR0FBRCxDQUFILENBQVNvQixNQUFULENBQWdCdEIsS0FBaEIsRUFBdUIsQ0FBdkI7QUFFQSxhQUFPLENBQUNGLEdBQUQsRUFBTTRCLEdBQU4sQ0FBUDtBQUNEOztBQUVELFFBQUksQ0FBQ3pCLElBQUwsRUFBVyxPQUFPLENBQUNILEdBQUQsRUFBTTRCLEdBQU4sQ0FBUDtBQUVYLFFBQU1FLEdBQUcsR0FBRzNCLElBQUksQ0FBQ0EsSUFBSSxDQUFDSSxNQUFMLEdBQWMsQ0FBZixDQUFoQjtBQUVBLFFBQUl1QixHQUFHLEtBQUssU0FBUixJQUFxQi9CLEVBQUUsQ0FBQytCLEdBQUgsS0FBVyxTQUFwQyxFQUErQyxPQUFPLENBQUM5QixHQUFELEVBQU00QixHQUFOLENBQVA7QUFFL0MsUUFBTUcsRUFBRSxHQUFHRCxHQUFHLEtBQUssTUFBUixHQUFpQmhDLFlBQWpCLEdBQWdDa0IsWUFBM0M7QUFFQSxXQUFPLENBQUNoQixHQUFELCtCQUFVNEIsR0FBVixJQUFlRyxFQUFFLENBQUNoQyxFQUFELENBQUYsQ0FBT0MsR0FBUCxFQUFZMkIsTUFBWixDQUFmLEdBQVA7QUFDRCxHQTdCRCxDQTZCRSxPQUFPbEIsQ0FBUCxFQUFVO0FBQ1ZDLElBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjRixDQUFkLEVBQWlCVixFQUFqQixFQUFxQixpQkFBS0MsR0FBTCxDQUFyQjtBQUVBLFdBQU8sQ0FBQ0EsR0FBRCxFQUFNNEIsR0FBTixDQUFQO0FBQ0Q7QUFDRixDQXhDRDs7ZUEwQ2VGLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBBdXRvbWVyZ2UgZnJvbSAnYXV0b21lcmdlJ1xuaW1wb3J0IHsgRWxlbWVudCB9IGZyb20gJ3NsYXRlJ1xuXG5pbXBvcnQgeyB0b1NsYXRlUGF0aCwgdG9KUyB9IGZyb20gJy4uL3V0aWxzJ1xuaW1wb3J0IHsgZ2V0VGFyZ2V0IH0gZnJvbSAnLi4vcGF0aCdcbmltcG9ydCB7IHNldERhdGFPcCB9IGZyb20gJy4vc2V0J1xuXG5jb25zdCByZW1vdmVUZXh0T3AgPSAob3A6IEF1dG9tZXJnZS5EaWZmKSA9PiAobWFwOiBhbnksIGRvYzogRWxlbWVudCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgaW5kZXgsIHBhdGgsIG9iaiB9ID0gb3BcblxuICAgIGNvbnN0IHNsYXRlUGF0aCA9IHRvU2xhdGVQYXRoKHBhdGgpLnNsaWNlKDAsIHBhdGg/Lmxlbmd0aClcblxuICAgIGxldCBub2RlID0gbWFwW29ial1cblxuICAgIHRyeSB7XG4gICAgICBub2RlID0gZ2V0VGFyZ2V0KGRvYywgc2xhdGVQYXRoKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSwgc2xhdGVQYXRoLCBvcCwgbWFwLCB0b0pTKGRvYykpXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVyblxuXG4gICAgY29uc3QgdGV4dCA9IG5vZGU/LnRleHQ/LltpbmRleF0gfHwgJyonXG5cbiAgICBpZiAobm9kZSkge1xuICAgICAgbm9kZS50ZXh0ID0gbm9kZT8udGV4dFxuICAgICAgICA/IG5vZGUudGV4dC5zbGljZSgwLCBpbmRleCkgKyBub2RlLnRleHQuc2xpY2UoaW5kZXggKyAxKVxuICAgICAgICA6ICcnXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdyZW1vdmVfdGV4dCcsXG4gICAgICBwYXRoOiBzbGF0ZVBhdGgsXG4gICAgICBvZmZzZXQ6IGluZGV4LFxuICAgICAgdGV4dCxcbiAgICAgIG1hcmtzOiBbXVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSwgb3AsIG1hcCwgdG9KUyhkb2MpKVxuICB9XG59XG5cbmNvbnN0IHJlbW92ZU5vZGVPcCA9IChvcDogQXV0b21lcmdlLkRpZmYpID0+IChtYXA6IGFueSwgZG9jOiBFbGVtZW50KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBpbmRleCwgb2JqLCBwYXRoIH0gPSBvcFxuXG4gICAgY29uc3Qgc2xhdGVQYXRoID0gdG9TbGF0ZVBhdGgocGF0aClcblxuICAgIGNvbnN0IHBhcmVudCA9IGdldFRhcmdldChkb2MsIHNsYXRlUGF0aClcbiAgICBjb25zdCB0YXJnZXQgPSBwYXJlbnQ/LmNoaWxkcmVuPy5baW5kZXggYXMgbnVtYmVyXSB8fFxuICAgICAgcGFyZW50Py5baW5kZXggYXMgbnVtYmVyXSB8fCB7IGNoaWxkcmVuOiBbXSB9XG5cbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGFyZ2V0IGlzIG5vdCBmb3VuZCEnKVxuICAgIH1cblxuICAgIGlmICghbWFwLmhhc093blByb3BlcnR5KG9iaikpIHtcbiAgICAgIG1hcFtvYmpdID0gdGFyZ2V0XG4gICAgfVxuXG4gICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGluZGV4KSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW5kZXggaXMgbm90IGEgbnVtYmVyJylcbiAgICB9XG5cbiAgICBpZiAocGFyZW50Py5jaGlsZHJlbj8uW2luZGV4IGFzIG51bWJlcl0pIHtcbiAgICAgIHBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpXG4gICAgfSBlbHNlIGlmIChwYXJlbnQ/LltpbmRleCBhcyBudW1iZXJdKSB7XG4gICAgICBwYXJlbnQuc3BsaWNlKGluZGV4LCAxKVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAncmVtb3ZlX25vZGUnLFxuICAgICAgcGF0aDogc2xhdGVQYXRoLmxlbmd0aCA/IHNsYXRlUGF0aC5jb25jYXQoaW5kZXgpIDogW2luZGV4XSxcbiAgICAgIG5vZGU6IHRhcmdldFxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSwgb3AsIG1hcCwgdG9KUyhkb2MpKVxuICB9XG59XG5cbmNvbnN0IG9wUmVtb3ZlID0gKFxuICBvcDogQXV0b21lcmdlLkRpZmYsXG4gIFttYXAsIG9wc106IGFueSxcbiAgZG9jOiBhbnksXG4gIHRtcERvYzogRWxlbWVudFxuKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBpbmRleCwgcGF0aCwgb2JqLCB0eXBlIH0gPSBvcFxuXG4gICAgaWYgKHR5cGUgPT09ICdtYXAnICYmIHBhdGgpIHtcbiAgICAgIC8vIHJlbW92ZSBhIGtleSBmcm9tIG1hcCwgbWFwcGluZyB0byBzbGF0ZSBzZXQgYSBrZXkncyB2YWx1ZSB0byB1bmRlZmluZWQuXG4gICAgICBvcHMucHVzaChzZXREYXRhT3Aob3AsIGRvYykobWFwLCB0bXBEb2MpKVxuICAgICAgcmV0dXJuIFttYXAsIG9wc11cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBtYXAuaGFzT3duUHJvcGVydHkob2JqKSAmJlxuICAgICAgdHlwZW9mIG1hcFtvYmpdICE9PSAnc3RyaW5nJyAmJlxuICAgICAgdHlwZSAhPT0gJ3RleHQnICYmXG4gICAgICBtYXA/Lm9iaj8ubGVuZ3RoXG4gICAgKSB7XG4gICAgICBtYXBbb2JqXS5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgICAgIHJldHVybiBbbWFwLCBvcHNdXG4gICAgfVxuXG4gICAgaWYgKCFwYXRoKSByZXR1cm4gW21hcCwgb3BzXVxuXG4gICAgY29uc3Qga2V5ID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdXG5cbiAgICBpZiAoa2V5ID09PSAnY3Vyc29ycycgfHwgb3Aua2V5ID09PSAnY3Vyc29ycycpIHJldHVybiBbbWFwLCBvcHNdXG5cbiAgICBjb25zdCBmbiA9IGtleSA9PT0gJ3RleHQnID8gcmVtb3ZlVGV4dE9wIDogcmVtb3ZlTm9kZU9wXG5cbiAgICByZXR1cm4gW21hcCwgWy4uLm9wcywgZm4ob3ApKG1hcCwgdG1wRG9jKV1dXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUsIG9wLCB0b0pTKG1hcCkpXG5cbiAgICByZXR1cm4gW21hcCwgb3BzXVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9wUmVtb3ZlXG4iXX0=