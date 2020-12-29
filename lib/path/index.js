"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChildren = exports.getParent = exports.getParentPath = exports.getTarget = exports.isTree = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var isTree = function isTree(node) {
  return Boolean(node === null || node === void 0 ? void 0 : node.children);
};

exports.isTree = isTree;

var getTarget = function getTarget(doc, path) {
  var iterate = function iterate(current, idx) {
    if (!(isTree(current) || current[idx])) {
      throw new TypeError("path ".concat(path.toString(), " does not match tree ").concat(JSON.stringify(current)));
    }

    return current[idx] || (current === null || current === void 0 ? void 0 : current.children[idx]);
  };

  return path.reduce(iterate, doc);
};

exports.getTarget = getTarget;

var getParentPath = function getParentPath(path) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  if (level > path.length) {
    throw new TypeError('requested ancestor is higher than root');
  }

  return [path[path.length - level], path.slice(0, path.length - level)];
};

exports.getParentPath = getParentPath;

var getParent = function getParent(doc, path) {
  var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var _getParentPath = getParentPath(path, level),
      _getParentPath2 = _slicedToArray(_getParentPath, 2),
      idx = _getParentPath2[0],
      parentPath = _getParentPath2[1];

  return [getTarget(doc, parentPath), idx];
};

exports.getParent = getParent;

var getChildren = function getChildren(node) {
  return node.children || node;
};

exports.getChildren = getChildren;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXRoL2luZGV4LnRzIl0sIm5hbWVzIjpbImlzVHJlZSIsIm5vZGUiLCJCb29sZWFuIiwiY2hpbGRyZW4iLCJnZXRUYXJnZXQiLCJkb2MiLCJwYXRoIiwiaXRlcmF0ZSIsImN1cnJlbnQiLCJpZHgiLCJUeXBlRXJyb3IiLCJ0b1N0cmluZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJyZWR1Y2UiLCJnZXRQYXJlbnRQYXRoIiwibGV2ZWwiLCJsZW5ndGgiLCJzbGljZSIsImdldFBhcmVudCIsInBhcmVudFBhdGgiLCJnZXRDaGlsZHJlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlPLElBQU1BLE1BQU0sR0FBRyxTQUFUQSxNQUFTLENBQUNDLElBQUQ7QUFBQSxTQUF5QkMsT0FBTyxDQUFDRCxJQUFELGFBQUNBLElBQUQsdUJBQUNBLElBQUksQ0FBRUUsUUFBUCxDQUFoQztBQUFBLENBQWY7Ozs7QUFFQSxJQUFNQyxTQUFTLEdBQUcsU0FBWkEsU0FBWSxDQUFDQyxHQUFELEVBQTJCQyxJQUEzQixFQUEwQztBQUNqRSxNQUFNQyxPQUFPLEdBQUcsU0FBVkEsT0FBVSxDQUFDQyxPQUFELEVBQWVDLEdBQWYsRUFBK0I7QUFDN0MsUUFBSSxFQUFFVCxNQUFNLENBQUNRLE9BQUQsQ0FBTixJQUFtQkEsT0FBTyxDQUFDQyxHQUFELENBQTVCLENBQUosRUFBd0M7QUFDdEMsWUFBTSxJQUFJQyxTQUFKLGdCQUNJSixJQUFJLENBQUNLLFFBQUwsRUFESixrQ0FDMkNDLElBQUksQ0FBQ0MsU0FBTCxDQUFlTCxPQUFmLENBRDNDLEVBQU47QUFHRDs7QUFFRCxXQUFPQSxPQUFPLENBQUNDLEdBQUQsQ0FBUCxLQUFnQkQsT0FBaEIsYUFBZ0JBLE9BQWhCLHVCQUFnQkEsT0FBTyxDQUFFTCxRQUFULENBQWtCTSxHQUFsQixDQUFoQixDQUFQO0FBQ0QsR0FSRDs7QUFVQSxTQUFPSCxJQUFJLENBQUNRLE1BQUwsQ0FBWVAsT0FBWixFQUFxQkYsR0FBckIsQ0FBUDtBQUNELENBWk07Ozs7QUFjQSxJQUFNVSxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLENBQzNCVCxJQUQyQixFQUdSO0FBQUEsTUFEbkJVLEtBQ21CLHVFQURILENBQ0c7O0FBQ25CLE1BQUlBLEtBQUssR0FBR1YsSUFBSSxDQUFDVyxNQUFqQixFQUF5QjtBQUN2QixVQUFNLElBQUlQLFNBQUosQ0FBYyx3Q0FBZCxDQUFOO0FBQ0Q7O0FBRUQsU0FBTyxDQUFDSixJQUFJLENBQUNBLElBQUksQ0FBQ1csTUFBTCxHQUFjRCxLQUFmLENBQUwsRUFBNEJWLElBQUksQ0FBQ1ksS0FBTCxDQUFXLENBQVgsRUFBY1osSUFBSSxDQUFDVyxNQUFMLEdBQWNELEtBQTVCLENBQTVCLENBQVA7QUFDRCxDQVRNOzs7O0FBV0EsSUFBTUcsU0FBUyxHQUFHLFNBQVpBLFNBQVksQ0FDdkJkLEdBRHVCLEVBRXZCQyxJQUZ1QixFQUlMO0FBQUEsTUFEbEJVLEtBQ2tCLHVFQURWLENBQ1U7O0FBQUEsdUJBQ1FELGFBQWEsQ0FBQ1QsSUFBRCxFQUFPVSxLQUFQLENBRHJCO0FBQUE7QUFBQSxNQUNYUCxHQURXO0FBQUEsTUFDTlcsVUFETTs7QUFHbEIsU0FBTyxDQUFDaEIsU0FBUyxDQUFDQyxHQUFELEVBQU1lLFVBQU4sQ0FBVixFQUE2QlgsR0FBN0IsQ0FBUDtBQUNELENBUk07Ozs7QUFVQSxJQUFNWSxXQUFXLEdBQUcsU0FBZEEsV0FBYyxDQUFDcEIsSUFBRDtBQUFBLFNBQWVBLElBQUksQ0FBQ0UsUUFBTCxJQUFpQkYsSUFBaEM7QUFBQSxDQUFwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVsZW1lbnQsIE5vZGUsIFBhdGggfSBmcm9tICdzbGF0ZSdcblxuaW1wb3J0IHsgU3luY1ZhbHVlIH0gZnJvbSAnLi4vbW9kZWwnXG5cbmV4cG9ydCBjb25zdCBpc1RyZWUgPSAobm9kZTogTm9kZSk6IGJvb2xlYW4gPT4gQm9vbGVhbihub2RlPy5jaGlsZHJlbilcblxuZXhwb3J0IGNvbnN0IGdldFRhcmdldCA9IChkb2M6IFN5bmNWYWx1ZSB8IEVsZW1lbnQsIHBhdGg6IFBhdGgpID0+IHtcbiAgY29uc3QgaXRlcmF0ZSA9IChjdXJyZW50OiBhbnksIGlkeDogbnVtYmVyKSA9PiB7XG4gICAgaWYgKCEoaXNUcmVlKGN1cnJlbnQpIHx8IGN1cnJlbnRbaWR4XSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgIGBwYXRoICR7cGF0aC50b1N0cmluZygpfSBkb2VzIG5vdCBtYXRjaCB0cmVlICR7SlNPTi5zdHJpbmdpZnkoY3VycmVudCl9YFxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiBjdXJyZW50W2lkeF0gfHwgY3VycmVudD8uY2hpbGRyZW5baWR4XVxuICB9XG5cbiAgcmV0dXJuIHBhdGgucmVkdWNlKGl0ZXJhdGUsIGRvYylcbn1cblxuZXhwb3J0IGNvbnN0IGdldFBhcmVudFBhdGggPSAoXG4gIHBhdGg6IFBhdGgsXG4gIGxldmVsOiBudW1iZXIgPSAxXG4pOiBbbnVtYmVyLCBQYXRoXSA9PiB7XG4gIGlmIChsZXZlbCA+IHBhdGgubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncmVxdWVzdGVkIGFuY2VzdG9yIGlzIGhpZ2hlciB0aGFuIHJvb3QnKVxuICB9XG5cbiAgcmV0dXJuIFtwYXRoW3BhdGgubGVuZ3RoIC0gbGV2ZWxdLCBwYXRoLnNsaWNlKDAsIHBhdGgubGVuZ3RoIC0gbGV2ZWwpXVxufVxuXG5leHBvcnQgY29uc3QgZ2V0UGFyZW50ID0gKFxuICBkb2M6IFN5bmNWYWx1ZSB8IEVsZW1lbnQsXG4gIHBhdGg6IFBhdGgsXG4gIGxldmVsID0gMVxuKTogW2FueSwgbnVtYmVyXSA9PiB7XG4gIGNvbnN0IFtpZHgsIHBhcmVudFBhdGhdID0gZ2V0UGFyZW50UGF0aChwYXRoLCBsZXZlbClcblxuICByZXR1cm4gW2dldFRhcmdldChkb2MsIHBhcmVudFBhdGgpLCBpZHhdXG59XG5cbmV4cG9ydCBjb25zdCBnZXRDaGlsZHJlbiA9IChub2RlOiBhbnkpID0+IG5vZGUuY2hpbGRyZW4gfHwgbm9kZVxuIl19