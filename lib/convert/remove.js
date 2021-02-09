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

      if (!Number.isInteger(index)) {
        throw new TypeError('Index is not a number');
      }

      if (parent !== null && parent !== void 0 && (_parent$children2 = parent.children) !== null && _parent$children2 !== void 0 && _parent$children2[index]) {
        parent.children.splice(index, 1);
        map[obj] = parent === null || parent === void 0 ? void 0 : parent.children;
      } else if (parent !== null && parent !== void 0 && parent[index]) {
        parent.splice(index, 1);
        map[obj] = parent;
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
      if (path[0] === 'children') {
        ops.push((0, _set.setDataOp)(op, doc)(map, tmpDoc));
      }

      return [map, ops];
    }

    if (map.hasOwnProperty(obj) && typeof map[obj] !== 'string' && type !== 'text' && map !== null && map !== void 0 && (_map$obj = map.obj) !== null && _map$obj !== void 0 && _map$obj.length) {
      map[obj].splice(index, 1);
      return [map, ops];
    }

    if (!path) return [map, ops];
    var key = path[path.length - 1];
    var fn = key === 'text' ? removeTextOp : removeNodeOp;
    return [map, [].concat(_toConsumableArray(ops), [fn(op)(map, tmpDoc)])];
  } catch (e) {
    console.error(e, op, (0, _utils.toJS)(map));
    return [map, ops];
  }
};

var _default = opRemove;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L3JlbW92ZS50cyJdLCJuYW1lcyI6WyJyZW1vdmVUZXh0T3AiLCJvcCIsIm1hcCIsImRvYyIsImluZGV4IiwicGF0aCIsIm9iaiIsInNsYXRlUGF0aCIsInNsaWNlIiwibGVuZ3RoIiwibm9kZSIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJ0ZXh0IiwidHlwZSIsIm9mZnNldCIsIm1hcmtzIiwicmVtb3ZlTm9kZU9wIiwicGFyZW50IiwidGFyZ2V0IiwiY2hpbGRyZW4iLCJUeXBlRXJyb3IiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJzcGxpY2UiLCJjb25jYXQiLCJvcFJlbW92ZSIsInRtcERvYyIsIm9wcyIsInB1c2giLCJoYXNPd25Qcm9wZXJ0eSIsImtleSIsImZuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBR0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFDQyxFQUFEO0FBQUEsU0FBd0IsVUFBQ0MsR0FBRCxFQUFXQyxHQUFYLEVBQTRCO0FBQ3ZFLFFBQUk7QUFBQTs7QUFBQSxVQUNNQyxLQUROLEdBQzJCSCxFQUQzQixDQUNNRyxLQUROO0FBQUEsVUFDYUMsSUFEYixHQUMyQkosRUFEM0IsQ0FDYUksSUFEYjtBQUFBLFVBQ21CQyxHQURuQixHQUMyQkwsRUFEM0IsQ0FDbUJLLEdBRG5CO0FBR0YsVUFBTUMsU0FBUyxHQUFHLHdCQUFZRixJQUFaLEVBQWtCRyxLQUFsQixDQUF3QixDQUF4QixFQUEyQkgsSUFBM0IsYUFBMkJBLElBQTNCLHVCQUEyQkEsSUFBSSxDQUFFSSxNQUFqQyxDQUFsQjtBQUVBLFVBQUlDLElBQUksR0FBR1IsR0FBRyxDQUFDSSxHQUFELENBQWQ7O0FBRUEsVUFBSTtBQUNGSSxRQUFBQSxJQUFJLEdBQUcscUJBQVVQLEdBQVYsRUFBZUksU0FBZixDQUFQO0FBQ0QsT0FGRCxDQUVFLE9BQU9JLENBQVAsRUFBVTtBQUNWQyxRQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBY0YsQ0FBZCxFQUFpQkosU0FBakIsRUFBNEJOLEVBQTVCLEVBQWdDQyxHQUFoQyxFQUFxQyxpQkFBS0MsR0FBTCxDQUFyQztBQUNEOztBQUVELFVBQUksT0FBT0MsS0FBUCxLQUFpQixRQUFyQixFQUErQjtBQUUvQixVQUFNVSxJQUFJLEdBQUcsVUFBQUosSUFBSSxVQUFKLG9EQUFNSSxJQUFOLDBEQUFhVixLQUFiLE1BQXVCLEdBQXBDOztBQUVBLFVBQUlNLElBQUosRUFBVTtBQUFBOztBQUNSQSxRQUFBQSxJQUFJLENBQUNJLElBQUwsR0FBWSxVQUFBSixJQUFJLFVBQUosZ0NBQU1JLElBQU4sR0FDUkosSUFBSSxDQUFDSSxJQUFMLENBQVVOLEtBQVYsQ0FBZ0IsQ0FBaEIsRUFBbUJKLEtBQW5CLElBQTRCTSxJQUFJLENBQUNJLElBQUwsQ0FBVU4sS0FBVixDQUFnQkosS0FBSyxHQUFHLENBQXhCLENBRHBCLEdBRVIsRUFGSjtBQUdEOztBQUVELGFBQU87QUFDTFcsUUFBQUEsSUFBSSxFQUFFLGFBREQ7QUFFTFYsUUFBQUEsSUFBSSxFQUFFRSxTQUZEO0FBR0xTLFFBQUFBLE1BQU0sRUFBRVosS0FISDtBQUlMVSxRQUFBQSxJQUFJLEVBQUpBLElBSks7QUFLTEcsUUFBQUEsS0FBSyxFQUFFO0FBTEYsT0FBUDtBQU9ELEtBOUJELENBOEJFLE9BQU9OLENBQVAsRUFBVTtBQUNWQyxNQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBY0YsQ0FBZCxFQUFpQlYsRUFBakIsRUFBcUJDLEdBQXJCLEVBQTBCLGlCQUFLQyxHQUFMLENBQTFCO0FBQ0Q7QUFDRixHQWxDb0I7QUFBQSxDQUFyQjs7QUFvQ0EsSUFBTWUsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBQ2pCLEVBQUQ7QUFBQSxTQUF3QixVQUFDQyxHQUFELEVBQVdDLEdBQVgsRUFBNEI7QUFDdkUsUUFBSTtBQUFBOztBQUFBLFVBQ01DLEtBRE4sR0FDMkJILEVBRDNCLENBQ01HLEtBRE47QUFBQSxVQUNhRSxHQURiLEdBQzJCTCxFQUQzQixDQUNhSyxHQURiO0FBQUEsVUFDa0JELElBRGxCLEdBQzJCSixFQUQzQixDQUNrQkksSUFEbEI7QUFHRixVQUFNRSxTQUFTLEdBQUcsd0JBQVlGLElBQVosQ0FBbEI7QUFFQSxVQUFNYyxNQUFNLEdBQUcscUJBQVVoQixHQUFWLEVBQWVJLFNBQWYsQ0FBZjtBQUNBLFVBQU1hLE1BQU0sR0FBRyxDQUFBRCxNQUFNLFNBQU4sSUFBQUEsTUFBTSxXQUFOLGdDQUFBQSxNQUFNLENBQUVFLFFBQVIsc0VBQW1CakIsS0FBbkIsT0FDYmUsTUFEYSxhQUNiQSxNQURhLHVCQUNiQSxNQUFNLENBQUdmLEtBQUgsQ0FETyxLQUNnQjtBQUFFaUIsUUFBQUEsUUFBUSxFQUFFO0FBQVosT0FEL0I7O0FBR0EsVUFBSSxDQUFDRCxNQUFMLEVBQWE7QUFDWCxjQUFNLElBQUlFLFNBQUosQ0FBYyxzQkFBZCxDQUFOO0FBQ0Q7O0FBRUQsVUFBSSxDQUFDQyxNQUFNLENBQUNDLFNBQVAsQ0FBaUJwQixLQUFqQixDQUFMLEVBQThCO0FBQzVCLGNBQU0sSUFBSWtCLFNBQUosQ0FBYyx1QkFBZCxDQUFOO0FBQ0Q7O0FBRUQsVUFBSUgsTUFBSixhQUFJQSxNQUFKLG9DQUFJQSxNQUFNLENBQUVFLFFBQVosOENBQUksa0JBQW1CakIsS0FBbkIsQ0FBSixFQUF5QztBQUN2Q2UsUUFBQUEsTUFBTSxDQUFDRSxRQUFQLENBQWdCSSxNQUFoQixDQUF1QnJCLEtBQXZCLEVBQThCLENBQTlCO0FBQ0FGLFFBQUFBLEdBQUcsQ0FBQ0ksR0FBRCxDQUFILEdBQVdhLE1BQVgsYUFBV0EsTUFBWCx1QkFBV0EsTUFBTSxDQUFFRSxRQUFuQjtBQUNELE9BSEQsTUFHTyxJQUFJRixNQUFKLGFBQUlBLE1BQUosZUFBSUEsTUFBTSxDQUFHZixLQUFILENBQVYsRUFBK0I7QUFDcENlLFFBQUFBLE1BQU0sQ0FBQ00sTUFBUCxDQUFjckIsS0FBZCxFQUFxQixDQUFyQjtBQUNBRixRQUFBQSxHQUFHLENBQUNJLEdBQUQsQ0FBSCxHQUFXYSxNQUFYO0FBQ0Q7O0FBRUQsYUFBTztBQUNMSixRQUFBQSxJQUFJLEVBQUUsYUFERDtBQUVMVixRQUFBQSxJQUFJLEVBQUVFLFNBQVMsQ0FBQ0UsTUFBVixHQUFtQkYsU0FBUyxDQUFDbUIsTUFBVixDQUFpQnRCLEtBQWpCLENBQW5CLEdBQTZDLENBQUNBLEtBQUQsQ0FGOUM7QUFHTE0sUUFBQUEsSUFBSSxFQUFFVTtBQUhELE9BQVA7QUFLRCxLQTlCRCxDQThCRSxPQUFPVCxDQUFQLEVBQVU7QUFDVkMsTUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWNGLENBQWQsRUFBaUJWLEVBQWpCLEVBQXFCQyxHQUFyQixFQUEwQixpQkFBS0MsR0FBTCxDQUExQjtBQUNEO0FBQ0YsR0FsQ29CO0FBQUEsQ0FBckI7O0FBb0NBLElBQU13QixRQUFRLEdBQUcsU0FBWEEsUUFBVyxDQUNmMUIsRUFEZSxRQUdmRSxHQUhlLEVBSWZ5QixNQUplLEVBS1o7QUFBQTtBQUFBLE1BSEYxQixHQUdFO0FBQUEsTUFIRzJCLEdBR0g7O0FBQ0gsTUFBSTtBQUFBOztBQUFBLFFBQ016QixLQUROLEdBQ2lDSCxFQURqQyxDQUNNRyxLQUROO0FBQUEsUUFDYUMsSUFEYixHQUNpQ0osRUFEakMsQ0FDYUksSUFEYjtBQUFBLFFBQ21CQyxHQURuQixHQUNpQ0wsRUFEakMsQ0FDbUJLLEdBRG5CO0FBQUEsUUFDd0JTLElBRHhCLEdBQ2lDZCxFQURqQyxDQUN3QmMsSUFEeEI7O0FBR0YsUUFBSUEsSUFBSSxLQUFLLEtBQVQsSUFBa0JWLElBQXRCLEVBQTRCO0FBQzFCO0FBQ0EsVUFBSUEsSUFBSSxDQUFDLENBQUQsQ0FBSixLQUFZLFVBQWhCLEVBQTRCO0FBQzFCd0IsUUFBQUEsR0FBRyxDQUFDQyxJQUFKLENBQVMsb0JBQVU3QixFQUFWLEVBQWNFLEdBQWQsRUFBbUJELEdBQW5CLEVBQXdCMEIsTUFBeEIsQ0FBVDtBQUNEOztBQUNELGFBQU8sQ0FBQzFCLEdBQUQsRUFBTTJCLEdBQU4sQ0FBUDtBQUNEOztBQUVELFFBQ0UzQixHQUFHLENBQUM2QixjQUFKLENBQW1CekIsR0FBbkIsS0FDQSxPQUFPSixHQUFHLENBQUNJLEdBQUQsQ0FBVixLQUFvQixRQURwQixJQUVBUyxJQUFJLEtBQUssTUFGVCxJQUdBYixHQUhBLGFBR0FBLEdBSEEsMkJBR0FBLEdBQUcsQ0FBRUksR0FITCxxQ0FHQSxTQUFVRyxNQUpaLEVBS0U7QUFDQVAsTUFBQUEsR0FBRyxDQUFDSSxHQUFELENBQUgsQ0FBU21CLE1BQVQsQ0FBZ0JyQixLQUFoQixFQUF1QixDQUF2QjtBQUVBLGFBQU8sQ0FBQ0YsR0FBRCxFQUFNMkIsR0FBTixDQUFQO0FBQ0Q7O0FBRUQsUUFBSSxDQUFDeEIsSUFBTCxFQUFXLE9BQU8sQ0FBQ0gsR0FBRCxFQUFNMkIsR0FBTixDQUFQO0FBRVgsUUFBTUcsR0FBRyxHQUFHM0IsSUFBSSxDQUFDQSxJQUFJLENBQUNJLE1BQUwsR0FBYyxDQUFmLENBQWhCO0FBRUEsUUFBTXdCLEVBQUUsR0FBR0QsR0FBRyxLQUFLLE1BQVIsR0FBaUJoQyxZQUFqQixHQUFnQ2tCLFlBQTNDO0FBRUEsV0FBTyxDQUFDaEIsR0FBRCwrQkFBVTJCLEdBQVYsSUFBZUksRUFBRSxDQUFDaEMsRUFBRCxDQUFGLENBQU9DLEdBQVAsRUFBWTBCLE1BQVosQ0FBZixHQUFQO0FBQ0QsR0E3QkQsQ0E2QkUsT0FBT2pCLENBQVAsRUFBVTtBQUNWQyxJQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBY0YsQ0FBZCxFQUFpQlYsRUFBakIsRUFBcUIsaUJBQUtDLEdBQUwsQ0FBckI7QUFFQSxXQUFPLENBQUNBLEdBQUQsRUFBTTJCLEdBQU4sQ0FBUDtBQUNEO0FBQ0YsQ0F4Q0Q7O2VBMENlRixRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQXV0b21lcmdlIGZyb20gJ2F1dG9tZXJnZSdcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tICdzbGF0ZSdcblxuaW1wb3J0IHsgdG9TbGF0ZVBhdGgsIHRvSlMgfSBmcm9tICcuLi91dGlscydcbmltcG9ydCB7IGdldFRhcmdldCB9IGZyb20gJy4uL3BhdGgnXG5pbXBvcnQgeyBzZXREYXRhT3AgfSBmcm9tICcuL3NldCdcblxuY29uc3QgcmVtb3ZlVGV4dE9wID0gKG9wOiBBdXRvbWVyZ2UuRGlmZikgPT4gKG1hcDogYW55LCBkb2M6IEVsZW1lbnQpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGluZGV4LCBwYXRoLCBvYmogfSA9IG9wXG5cbiAgICBjb25zdCBzbGF0ZVBhdGggPSB0b1NsYXRlUGF0aChwYXRoKS5zbGljZSgwLCBwYXRoPy5sZW5ndGgpXG5cbiAgICBsZXQgbm9kZSA9IG1hcFtvYmpdXG5cbiAgICB0cnkge1xuICAgICAgbm9kZSA9IGdldFRhcmdldChkb2MsIHNsYXRlUGF0aClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGUsIHNsYXRlUGF0aCwgb3AsIG1hcCwgdG9KUyhkb2MpKVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm5cblxuICAgIGNvbnN0IHRleHQgPSBub2RlPy50ZXh0Py5baW5kZXhdIHx8ICcqJ1xuXG4gICAgaWYgKG5vZGUpIHtcbiAgICAgIG5vZGUudGV4dCA9IG5vZGU/LnRleHRcbiAgICAgICAgPyBub2RlLnRleHQuc2xpY2UoMCwgaW5kZXgpICsgbm9kZS50ZXh0LnNsaWNlKGluZGV4ICsgMSlcbiAgICAgICAgOiAnJ1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAncmVtb3ZlX3RleHQnLFxuICAgICAgcGF0aDogc2xhdGVQYXRoLFxuICAgICAgb2Zmc2V0OiBpbmRleCxcbiAgICAgIHRleHQsXG4gICAgICBtYXJrczogW11cbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUsIG9wLCBtYXAsIHRvSlMoZG9jKSlcbiAgfVxufVxuXG5jb25zdCByZW1vdmVOb2RlT3AgPSAob3A6IEF1dG9tZXJnZS5EaWZmKSA9PiAobWFwOiBhbnksIGRvYzogRWxlbWVudCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgaW5kZXgsIG9iaiwgcGF0aCB9ID0gb3BcblxuICAgIGNvbnN0IHNsYXRlUGF0aCA9IHRvU2xhdGVQYXRoKHBhdGgpXG5cbiAgICBjb25zdCBwYXJlbnQgPSBnZXRUYXJnZXQoZG9jLCBzbGF0ZVBhdGgpXG4gICAgY29uc3QgdGFyZ2V0ID0gcGFyZW50Py5jaGlsZHJlbj8uW2luZGV4IGFzIG51bWJlcl0gfHxcbiAgICAgIHBhcmVudD8uW2luZGV4IGFzIG51bWJlcl0gfHwgeyBjaGlsZHJlbjogW10gfVxuXG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RhcmdldCBpcyBub3QgZm91bmQhJylcbiAgICB9XG5cbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIoaW5kZXgpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbmRleCBpcyBub3QgYSBudW1iZXInKVxuICAgIH1cblxuICAgIGlmIChwYXJlbnQ/LmNoaWxkcmVuPy5baW5kZXggYXMgbnVtYmVyXSkge1xuICAgICAgcGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSlcbiAgICAgIG1hcFtvYmpdID0gcGFyZW50Py5jaGlsZHJlblxuICAgIH0gZWxzZSBpZiAocGFyZW50Py5baW5kZXggYXMgbnVtYmVyXSkge1xuICAgICAgcGFyZW50LnNwbGljZShpbmRleCwgMSlcbiAgICAgIG1hcFtvYmpdID0gcGFyZW50XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdyZW1vdmVfbm9kZScsXG4gICAgICBwYXRoOiBzbGF0ZVBhdGgubGVuZ3RoID8gc2xhdGVQYXRoLmNvbmNhdChpbmRleCkgOiBbaW5kZXhdLFxuICAgICAgbm9kZTogdGFyZ2V0XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlLCBvcCwgbWFwLCB0b0pTKGRvYykpXG4gIH1cbn1cblxuY29uc3Qgb3BSZW1vdmUgPSAoXG4gIG9wOiBBdXRvbWVyZ2UuRGlmZixcbiAgW21hcCwgb3BzXTogYW55LFxuICBkb2M6IGFueSxcbiAgdG1wRG9jOiBFbGVtZW50XG4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGluZGV4LCBwYXRoLCBvYmosIHR5cGUgfSA9IG9wXG5cbiAgICBpZiAodHlwZSA9PT0gJ21hcCcgJiYgcGF0aCkge1xuICAgICAgLy8gcmVtb3ZlIGEga2V5IGZyb20gbWFwLCBtYXBwaW5nIHRvIHNsYXRlIHNldCBhIGtleSdzIHZhbHVlIHRvIHVuZGVmaW5lZC5cbiAgICAgIGlmIChwYXRoWzBdID09PSAnY2hpbGRyZW4nKSB7XG4gICAgICAgIG9wcy5wdXNoKHNldERhdGFPcChvcCwgZG9jKShtYXAsIHRtcERvYykpXG4gICAgICB9XG4gICAgICByZXR1cm4gW21hcCwgb3BzXVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgIG1hcC5oYXNPd25Qcm9wZXJ0eShvYmopICYmXG4gICAgICB0eXBlb2YgbWFwW29ial0gIT09ICdzdHJpbmcnICYmXG4gICAgICB0eXBlICE9PSAndGV4dCcgJiZcbiAgICAgIG1hcD8ub2JqPy5sZW5ndGhcbiAgICApIHtcbiAgICAgIG1hcFtvYmpdLnNwbGljZShpbmRleCwgMSlcblxuICAgICAgcmV0dXJuIFttYXAsIG9wc11cbiAgICB9XG5cbiAgICBpZiAoIXBhdGgpIHJldHVybiBbbWFwLCBvcHNdXG5cbiAgICBjb25zdCBrZXkgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV1cblxuICAgIGNvbnN0IGZuID0ga2V5ID09PSAndGV4dCcgPyByZW1vdmVUZXh0T3AgOiByZW1vdmVOb2RlT3BcblxuICAgIHJldHVybiBbbWFwLCBbLi4ub3BzLCBmbihvcCkobWFwLCB0bXBEb2MpXV1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSwgb3AsIHRvSlMobWFwKSlcblxuICAgIHJldHVybiBbbWFwLCBvcHNdXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgb3BSZW1vdmVcbiJdfQ==