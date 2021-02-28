"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var Automerge = _interopRequireWildcard(require("automerge"));

var _utils = require("../utils");

var _ = require("./");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var transforms = [['insert_text', [(0, _utils.createNode)('paragraph', '')], [{
  marks: [],
  offset: 0,
  path: [0, 0],
  text: 'Hello ',
  type: 'insert_text'
}, {
  marks: [],
  offset: 6,
  path: [0, 0],
  text: 'collaborator',
  type: 'insert_text'
}, {
  marks: [],
  offset: 18,
  path: [0, 0],
  text: '!',
  type: 'insert_text'
}], [(0, _utils.createNode)('paragraph', 'Hello collaborator!')]], ['remove_text', [(0, _utils.createNode)('paragraph', 'Hello collaborator!')], [{
  offset: 11,
  path: [0, 0],
  text: 'borator',
  type: 'remove_text'
}, {
  offset: 5,
  path: [0, 0],
  text: ' colla',
  type: 'remove_text'
}], [(0, _utils.createNode)('paragraph', 'Hello!')]], ['insert_node', null, [{
  type: 'insert_node',
  path: [1],
  node: {
    type: 'paragraph',
    children: []
  }
}, {
  type: 'insert_node',
  path: [1, 0],
  node: {
    text: 'Hello collaborator!'
  }
}], [(0, _utils.createNode)(), (0, _utils.createNode)('paragraph', 'Hello collaborator!')]], ['merge_node', [(0, _utils.createNode)('paragraph', 'Hello '), (0, _utils.createNode)('paragraph', 'collaborator!')], [{
  path: [1],
  position: 1,
  properties: {
    type: 'paragraph'
  },
  target: null,
  type: 'merge_node'
}, {
  path: [0, 1],
  position: 6,
  properties: {},
  target: null,
  type: 'merge_node'
}], [(0, _utils.createNode)('paragraph', 'Hello collaborator!')]], ['move_node', [(0, _utils.createNode)('paragraph', 'first'), (0, _utils.createNode)('paragraph', 'second'), (0, _utils.createNode)('paragraph', 'third'), (0, _utils.createNode)('paragraph', 'fourth')], [{
  newPath: [0],
  path: [1],
  type: 'move_node'
}, {
  newPath: [3, 0],
  path: [2, 0],
  type: 'move_node'
}], [(0, _utils.createNode)('paragraph', 'second'), (0, _utils.createNode)('paragraph', 'first'), {
  type: 'paragraph',
  children: []
}, {
  type: 'paragraph',
  children: [(0, _utils.createText)('third'), (0, _utils.createText)('fourth')]
}]], ['remove_node', [(0, _utils.createNode)('paragraph', 'first'), (0, _utils.createNode)('paragraph', 'second'), (0, _utils.createNode)('paragraph', 'third')], [{
  path: [1, 0],
  type: 'remove_node'
}, {
  path: [0],
  type: 'remove_node'
}], [{
  type: 'paragraph',
  children: []
}, (0, _utils.createNode)('paragraph', 'third')]], ['set_node', [(0, _utils.createNode)('paragraph', 'first', {
  test: '1234'
}), (0, _utils.createNode)('paragraph', 'second')], [{
  path: [0],
  type: 'set_node',
  properties: {
    test: '1234'
  },
  newProperties: {
    test: '4567'
  }
}, {
  path: [1, 0],
  type: 'set_node',
  newProperties: {
    data: '4567'
  }
}], [(0, _utils.createNode)('paragraph', 'first', {
  test: '4567'
}), {
  type: 'paragraph',
  children: [{
    data: '4567',
    text: 'second'
  }]
}]], ['split_node', [(0, _utils.createNode)('paragraph', 'Hello collaborator!')], [{
  path: [0, 0],
  position: 6,
  target: null,
  type: 'split_node'
}, {
  path: [0],
  position: 1,
  properties: {
    type: 'paragraph'
  },
  target: 6,
  type: 'split_node'
}], [(0, _utils.createNode)('paragraph', 'Hello '), (0, _utils.createNode)('paragraph', 'collaborator!')]]];
describe('apply slate operations to Automerge document', function () {
  transforms.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 4),
        op = _ref2[0],
        input = _ref2[1],
        operations = _ref2[2],
        output = _ref2[3];

    it("apply ".concat(op, " operations"), function () {
      var doc = (0, _utils.createDoc)(input);
      var updated = Automerge.change(doc, function (d) {
        (0, _.applySlateOps)(d.children, operations);
      });
      var expected = (0, _utils.createDoc)(output);
      expect((0, _utils.toJS)(expected)).toStrictEqual((0, _utils.toJS)(updated));
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHBseS9hcHBseS5zcGVjLnRzIl0sIm5hbWVzIjpbInRyYW5zZm9ybXMiLCJtYXJrcyIsIm9mZnNldCIsInBhdGgiLCJ0ZXh0IiwidHlwZSIsIm5vZGUiLCJjaGlsZHJlbiIsInBvc2l0aW9uIiwicHJvcGVydGllcyIsInRhcmdldCIsIm5ld1BhdGgiLCJ0ZXN0IiwibmV3UHJvcGVydGllcyIsImRhdGEiLCJkZXNjcmliZSIsImZvckVhY2giLCJvcCIsImlucHV0Iiwib3BlcmF0aW9ucyIsIm91dHB1dCIsIml0IiwiZG9jIiwidXBkYXRlZCIsIkF1dG9tZXJnZSIsImNoYW5nZSIsImQiLCJleHBlY3RlZCIsImV4cGVjdCIsInRvU3RyaWN0RXF1YWwiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7QUFFQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsVUFBVSxHQUFHLENBQ2pCLENBQ0UsYUFERixFQUVFLENBQUMsdUJBQVcsV0FBWCxFQUF3QixFQUF4QixDQUFELENBRkYsRUFHRSxDQUNFO0FBQ0VDLEVBQUFBLEtBQUssRUFBRSxFQURUO0FBRUVDLEVBQUFBLE1BQU0sRUFBRSxDQUZWO0FBR0VDLEVBQUFBLElBQUksRUFBRSxDQUFDLENBQUQsRUFBSSxDQUFKLENBSFI7QUFJRUMsRUFBQUEsSUFBSSxFQUFFLFFBSlI7QUFLRUMsRUFBQUEsSUFBSSxFQUFFO0FBTFIsQ0FERixFQVFFO0FBQ0VKLEVBQUFBLEtBQUssRUFBRSxFQURUO0FBRUVDLEVBQUFBLE1BQU0sRUFBRSxDQUZWO0FBR0VDLEVBQUFBLElBQUksRUFBRSxDQUFDLENBQUQsRUFBSSxDQUFKLENBSFI7QUFJRUMsRUFBQUEsSUFBSSxFQUFFLGNBSlI7QUFLRUMsRUFBQUEsSUFBSSxFQUFFO0FBTFIsQ0FSRixFQWVFO0FBQ0VKLEVBQUFBLEtBQUssRUFBRSxFQURUO0FBRUVDLEVBQUFBLE1BQU0sRUFBRSxFQUZWO0FBR0VDLEVBQUFBLElBQUksRUFBRSxDQUFDLENBQUQsRUFBSSxDQUFKLENBSFI7QUFJRUMsRUFBQUEsSUFBSSxFQUFFLEdBSlI7QUFLRUMsRUFBQUEsSUFBSSxFQUFFO0FBTFIsQ0FmRixDQUhGLEVBMEJFLENBQUMsdUJBQVcsV0FBWCxFQUF3QixxQkFBeEIsQ0FBRCxDQTFCRixDQURpQixFQTZCakIsQ0FDRSxhQURGLEVBRUUsQ0FBQyx1QkFBVyxXQUFYLEVBQXdCLHFCQUF4QixDQUFELENBRkYsRUFHRSxDQUNFO0FBQ0VILEVBQUFBLE1BQU0sRUFBRSxFQURWO0FBRUVDLEVBQUFBLElBQUksRUFBRSxDQUFDLENBQUQsRUFBSSxDQUFKLENBRlI7QUFHRUMsRUFBQUEsSUFBSSxFQUFFLFNBSFI7QUFJRUMsRUFBQUEsSUFBSSxFQUFFO0FBSlIsQ0FERixFQU9FO0FBQ0VILEVBQUFBLE1BQU0sRUFBRSxDQURWO0FBRUVDLEVBQUFBLElBQUksRUFBRSxDQUFDLENBQUQsRUFBSSxDQUFKLENBRlI7QUFHRUMsRUFBQUEsSUFBSSxFQUFFLFFBSFI7QUFJRUMsRUFBQUEsSUFBSSxFQUFFO0FBSlIsQ0FQRixDQUhGLEVBaUJFLENBQUMsdUJBQVcsV0FBWCxFQUF3QixRQUF4QixDQUFELENBakJGLENBN0JpQixFQWdEakIsQ0FDRSxhQURGLEVBRUUsSUFGRixFQUdFLENBQ0U7QUFDRUEsRUFBQUEsSUFBSSxFQUFFLGFBRFI7QUFFRUYsRUFBQUEsSUFBSSxFQUFFLENBQUMsQ0FBRCxDQUZSO0FBR0VHLEVBQUFBLElBQUksRUFBRTtBQUFFRCxJQUFBQSxJQUFJLEVBQUUsV0FBUjtBQUFxQkUsSUFBQUEsUUFBUSxFQUFFO0FBQS9CO0FBSFIsQ0FERixFQU1FO0FBQ0VGLEVBQUFBLElBQUksRUFBRSxhQURSO0FBRUVGLEVBQUFBLElBQUksRUFBRSxDQUFDLENBQUQsRUFBSSxDQUFKLENBRlI7QUFHRUcsRUFBQUEsSUFBSSxFQUFFO0FBQUVGLElBQUFBLElBQUksRUFBRTtBQUFSO0FBSFIsQ0FORixDQUhGLEVBZUUsQ0FBQyx3QkFBRCxFQUFlLHVCQUFXLFdBQVgsRUFBd0IscUJBQXhCLENBQWYsQ0FmRixDQWhEaUIsRUFpRWpCLENBQ0UsWUFERixFQUVFLENBQ0UsdUJBQVcsV0FBWCxFQUF3QixRQUF4QixDQURGLEVBRUUsdUJBQVcsV0FBWCxFQUF3QixlQUF4QixDQUZGLENBRkYsRUFNRSxDQUNFO0FBQ0VELEVBQUFBLElBQUksRUFBRSxDQUFDLENBQUQsQ0FEUjtBQUVFSyxFQUFBQSxRQUFRLEVBQUUsQ0FGWjtBQUdFQyxFQUFBQSxVQUFVLEVBQUU7QUFBRUosSUFBQUEsSUFBSSxFQUFFO0FBQVIsR0FIZDtBQUlFSyxFQUFBQSxNQUFNLEVBQUUsSUFKVjtBQUtFTCxFQUFBQSxJQUFJLEVBQUU7QUFMUixDQURGLEVBUUU7QUFDRUYsRUFBQUEsSUFBSSxFQUFFLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FEUjtBQUVFSyxFQUFBQSxRQUFRLEVBQUUsQ0FGWjtBQUdFQyxFQUFBQSxVQUFVLEVBQUUsRUFIZDtBQUlFQyxFQUFBQSxNQUFNLEVBQUUsSUFKVjtBQUtFTCxFQUFBQSxJQUFJLEVBQUU7QUFMUixDQVJGLENBTkYsRUFzQkUsQ0FBQyx1QkFBVyxXQUFYLEVBQXdCLHFCQUF4QixDQUFELENBdEJGLENBakVpQixFQXlGakIsQ0FDRSxXQURGLEVBRUUsQ0FDRSx1QkFBVyxXQUFYLEVBQXdCLE9BQXhCLENBREYsRUFFRSx1QkFBVyxXQUFYLEVBQXdCLFFBQXhCLENBRkYsRUFHRSx1QkFBVyxXQUFYLEVBQXdCLE9BQXhCLENBSEYsRUFJRSx1QkFBVyxXQUFYLEVBQXdCLFFBQXhCLENBSkYsQ0FGRixFQVFFLENBQ0U7QUFDRU0sRUFBQUEsT0FBTyxFQUFFLENBQUMsQ0FBRCxDQURYO0FBRUVSLEVBQUFBLElBQUksRUFBRSxDQUFDLENBQUQsQ0FGUjtBQUdFRSxFQUFBQSxJQUFJLEVBQUU7QUFIUixDQURGLEVBTUU7QUFDRU0sRUFBQUEsT0FBTyxFQUFFLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FEWDtBQUVFUixFQUFBQSxJQUFJLEVBQUUsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUZSO0FBR0VFLEVBQUFBLElBQUksRUFBRTtBQUhSLENBTkYsQ0FSRixFQW9CRSxDQUNFLHVCQUFXLFdBQVgsRUFBd0IsUUFBeEIsQ0FERixFQUVFLHVCQUFXLFdBQVgsRUFBd0IsT0FBeEIsQ0FGRixFQUdFO0FBQ0VBLEVBQUFBLElBQUksRUFBRSxXQURSO0FBRUVFLEVBQUFBLFFBQVEsRUFBRTtBQUZaLENBSEYsRUFPRTtBQUNFRixFQUFBQSxJQUFJLEVBQUUsV0FEUjtBQUVFRSxFQUFBQSxRQUFRLEVBQUUsQ0FBQyx1QkFBVyxPQUFYLENBQUQsRUFBc0IsdUJBQVcsUUFBWCxDQUF0QjtBQUZaLENBUEYsQ0FwQkYsQ0F6RmlCLEVBMEhqQixDQUNFLGFBREYsRUFFRSxDQUNFLHVCQUFXLFdBQVgsRUFBd0IsT0FBeEIsQ0FERixFQUVFLHVCQUFXLFdBQVgsRUFBd0IsUUFBeEIsQ0FGRixFQUdFLHVCQUFXLFdBQVgsRUFBd0IsT0FBeEIsQ0FIRixDQUZGLEVBT0UsQ0FDRTtBQUNFSixFQUFBQSxJQUFJLEVBQUUsQ0FBQyxDQUFELEVBQUksQ0FBSixDQURSO0FBRUVFLEVBQUFBLElBQUksRUFBRTtBQUZSLENBREYsRUFLRTtBQUNFRixFQUFBQSxJQUFJLEVBQUUsQ0FBQyxDQUFELENBRFI7QUFFRUUsRUFBQUEsSUFBSSxFQUFFO0FBRlIsQ0FMRixDQVBGLEVBaUJFLENBQ0U7QUFDRUEsRUFBQUEsSUFBSSxFQUFFLFdBRFI7QUFFRUUsRUFBQUEsUUFBUSxFQUFFO0FBRlosQ0FERixFQUtFLHVCQUFXLFdBQVgsRUFBd0IsT0FBeEIsQ0FMRixDQWpCRixDQTFIaUIsRUFtSmpCLENBQ0UsVUFERixFQUVFLENBQ0UsdUJBQVcsV0FBWCxFQUF3QixPQUF4QixFQUFpQztBQUFFSyxFQUFBQSxJQUFJLEVBQUU7QUFBUixDQUFqQyxDQURGLEVBRUUsdUJBQVcsV0FBWCxFQUF3QixRQUF4QixDQUZGLENBRkYsRUFNRSxDQUNFO0FBQ0VULEVBQUFBLElBQUksRUFBRSxDQUFDLENBQUQsQ0FEUjtBQUVFRSxFQUFBQSxJQUFJLEVBQUUsVUFGUjtBQUdFSSxFQUFBQSxVQUFVLEVBQUU7QUFDVkcsSUFBQUEsSUFBSSxFQUFFO0FBREksR0FIZDtBQU1FQyxFQUFBQSxhQUFhLEVBQUU7QUFDYkQsSUFBQUEsSUFBSSxFQUFFO0FBRE87QUFOakIsQ0FERixFQVdFO0FBQ0VULEVBQUFBLElBQUksRUFBRSxDQUFDLENBQUQsRUFBSSxDQUFKLENBRFI7QUFFRUUsRUFBQUEsSUFBSSxFQUFFLFVBRlI7QUFHRVEsRUFBQUEsYUFBYSxFQUFFO0FBQ2JDLElBQUFBLElBQUksRUFBRTtBQURPO0FBSGpCLENBWEYsQ0FORixFQXlCRSxDQUNFLHVCQUFXLFdBQVgsRUFBd0IsT0FBeEIsRUFBaUM7QUFBRUYsRUFBQUEsSUFBSSxFQUFFO0FBQVIsQ0FBakMsQ0FERixFQUVFO0FBQ0VQLEVBQUFBLElBQUksRUFBRSxXQURSO0FBRUVFLEVBQUFBLFFBQVEsRUFBRSxDQUNSO0FBQ0VPLElBQUFBLElBQUksRUFBRSxNQURSO0FBRUVWLElBQUFBLElBQUksRUFBRTtBQUZSLEdBRFE7QUFGWixDQUZGLENBekJGLENBbkppQixFQXlMakIsQ0FDRSxZQURGLEVBRUUsQ0FBQyx1QkFBVyxXQUFYLEVBQXdCLHFCQUF4QixDQUFELENBRkYsRUFHRSxDQUNFO0FBQ0VELEVBQUFBLElBQUksRUFBRSxDQUFDLENBQUQsRUFBSSxDQUFKLENBRFI7QUFFRUssRUFBQUEsUUFBUSxFQUFFLENBRlo7QUFHRUUsRUFBQUEsTUFBTSxFQUFFLElBSFY7QUFJRUwsRUFBQUEsSUFBSSxFQUFFO0FBSlIsQ0FERixFQU9FO0FBQ0VGLEVBQUFBLElBQUksRUFBRSxDQUFDLENBQUQsQ0FEUjtBQUVFSyxFQUFBQSxRQUFRLEVBQUUsQ0FGWjtBQUdFQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkosSUFBQUEsSUFBSSxFQUFFO0FBREksR0FIZDtBQU1FSyxFQUFBQSxNQUFNLEVBQUUsQ0FOVjtBQU9FTCxFQUFBQSxJQUFJLEVBQUU7QUFQUixDQVBGLENBSEYsRUFvQkUsQ0FDRSx1QkFBVyxXQUFYLEVBQXdCLFFBQXhCLENBREYsRUFFRSx1QkFBVyxXQUFYLEVBQXdCLGVBQXhCLENBRkYsQ0FwQkYsQ0F6TGlCLENBQW5CO0FBb05BVSxRQUFRLENBQUMsOENBQUQsRUFBaUQsWUFBTTtBQUM3RGYsRUFBQUEsVUFBVSxDQUFDZ0IsT0FBWCxDQUFtQixnQkFBcUM7QUFBQTtBQUFBLFFBQW5DQyxFQUFtQztBQUFBLFFBQS9CQyxLQUErQjtBQUFBLFFBQXhCQyxVQUF3QjtBQUFBLFFBQVpDLE1BQVk7O0FBQ3REQyxJQUFBQSxFQUFFLGlCQUFVSixFQUFWLGtCQUEyQixZQUFNO0FBQ2pDLFVBQU1LLEdBQUcsR0FBRyxzQkFBVUosS0FBVixDQUFaO0FBRUEsVUFBTUssT0FBTyxHQUFHQyxTQUFTLENBQUNDLE1BQVYsQ0FBaUJILEdBQWpCLEVBQXNCLFVBQUNJLENBQUQsRUFBWTtBQUNoRCw2QkFBY0EsQ0FBQyxDQUFDbkIsUUFBaEIsRUFBMEJZLFVBQTFCO0FBQ0QsT0FGZSxDQUFoQjtBQUlBLFVBQU1RLFFBQVEsR0FBRyxzQkFBVVAsTUFBVixDQUFqQjtBQUVBUSxNQUFBQSxNQUFNLENBQUMsaUJBQUtELFFBQUwsQ0FBRCxDQUFOLENBQXVCRSxhQUF2QixDQUFxQyxpQkFBS04sT0FBTCxDQUFyQztBQUNELEtBVkMsQ0FBRjtBQVdELEdBWkQ7QUFhRCxDQWRPLENBQVIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBBdXRvbWVyZ2UgZnJvbSAnYXV0b21lcmdlJ1xuXG5pbXBvcnQgeyBjcmVhdGVEb2MsIHRvSlMsIGNyZWF0ZU5vZGUsIGNyZWF0ZVRleHQgfSBmcm9tICcuLi91dGlscydcblxuaW1wb3J0IHsgYXBwbHlTbGF0ZU9wcyB9IGZyb20gJy4vJ1xuXG5jb25zdCB0cmFuc2Zvcm1zID0gW1xuICBbXG4gICAgJ2luc2VydF90ZXh0JyxcbiAgICBbY3JlYXRlTm9kZSgncGFyYWdyYXBoJywgJycpXSxcbiAgICBbXG4gICAgICB7XG4gICAgICAgIG1hcmtzOiBbXSxcbiAgICAgICAgb2Zmc2V0OiAwLFxuICAgICAgICBwYXRoOiBbMCwgMF0sXG4gICAgICAgIHRleHQ6ICdIZWxsbyAnLFxuICAgICAgICB0eXBlOiAnaW5zZXJ0X3RleHQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBtYXJrczogW10sXG4gICAgICAgIG9mZnNldDogNixcbiAgICAgICAgcGF0aDogWzAsIDBdLFxuICAgICAgICB0ZXh0OiAnY29sbGFib3JhdG9yJyxcbiAgICAgICAgdHlwZTogJ2luc2VydF90ZXh0J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbWFya3M6IFtdLFxuICAgICAgICBvZmZzZXQ6IDE4LFxuICAgICAgICBwYXRoOiBbMCwgMF0sXG4gICAgICAgIHRleHQ6ICchJyxcbiAgICAgICAgdHlwZTogJ2luc2VydF90ZXh0J1xuICAgICAgfVxuICAgIF0sXG4gICAgW2NyZWF0ZU5vZGUoJ3BhcmFncmFwaCcsICdIZWxsbyBjb2xsYWJvcmF0b3IhJyldXG4gIF0sXG4gIFtcbiAgICAncmVtb3ZlX3RleHQnLFxuICAgIFtjcmVhdGVOb2RlKCdwYXJhZ3JhcGgnLCAnSGVsbG8gY29sbGFib3JhdG9yIScpXSxcbiAgICBbXG4gICAgICB7XG4gICAgICAgIG9mZnNldDogMTEsXG4gICAgICAgIHBhdGg6IFswLCAwXSxcbiAgICAgICAgdGV4dDogJ2JvcmF0b3InLFxuICAgICAgICB0eXBlOiAncmVtb3ZlX3RleHQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvZmZzZXQ6IDUsXG4gICAgICAgIHBhdGg6IFswLCAwXSxcbiAgICAgICAgdGV4dDogJyBjb2xsYScsXG4gICAgICAgIHR5cGU6ICdyZW1vdmVfdGV4dCdcbiAgICAgIH1cbiAgICBdLFxuICAgIFtjcmVhdGVOb2RlKCdwYXJhZ3JhcGgnLCAnSGVsbG8hJyldXG4gIF0sXG4gIFtcbiAgICAnaW5zZXJ0X25vZGUnLFxuICAgIG51bGwsXG4gICAgW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnaW5zZXJ0X25vZGUnLFxuICAgICAgICBwYXRoOiBbMV0sXG4gICAgICAgIG5vZGU6IHsgdHlwZTogJ3BhcmFncmFwaCcsIGNoaWxkcmVuOiBbXSB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0eXBlOiAnaW5zZXJ0X25vZGUnLFxuICAgICAgICBwYXRoOiBbMSwgMF0sXG4gICAgICAgIG5vZGU6IHsgdGV4dDogJ0hlbGxvIGNvbGxhYm9yYXRvciEnIH1cbiAgICAgIH1cbiAgICBdLFxuICAgIFtjcmVhdGVOb2RlKCksIGNyZWF0ZU5vZGUoJ3BhcmFncmFwaCcsICdIZWxsbyBjb2xsYWJvcmF0b3IhJyldXG4gIF0sXG4gIFtcbiAgICAnbWVyZ2Vfbm9kZScsXG4gICAgW1xuICAgICAgY3JlYXRlTm9kZSgncGFyYWdyYXBoJywgJ0hlbGxvICcpLFxuICAgICAgY3JlYXRlTm9kZSgncGFyYWdyYXBoJywgJ2NvbGxhYm9yYXRvciEnKVxuICAgIF0sXG4gICAgW1xuICAgICAge1xuICAgICAgICBwYXRoOiBbMV0sXG4gICAgICAgIHBvc2l0aW9uOiAxLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7IHR5cGU6ICdwYXJhZ3JhcGgnIH0sXG4gICAgICAgIHRhcmdldDogbnVsbCxcbiAgICAgICAgdHlwZTogJ21lcmdlX25vZGUnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiBbMCwgMV0sXG4gICAgICAgIHBvc2l0aW9uOiA2LFxuICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcbiAgICAgICAgdGFyZ2V0OiBudWxsLFxuICAgICAgICB0eXBlOiAnbWVyZ2Vfbm9kZSdcbiAgICAgIH1cbiAgICBdLFxuICAgIFtjcmVhdGVOb2RlKCdwYXJhZ3JhcGgnLCAnSGVsbG8gY29sbGFib3JhdG9yIScpXVxuICBdLFxuICBbXG4gICAgJ21vdmVfbm9kZScsXG4gICAgW1xuICAgICAgY3JlYXRlTm9kZSgncGFyYWdyYXBoJywgJ2ZpcnN0JyksXG4gICAgICBjcmVhdGVOb2RlKCdwYXJhZ3JhcGgnLCAnc2Vjb25kJyksXG4gICAgICBjcmVhdGVOb2RlKCdwYXJhZ3JhcGgnLCAndGhpcmQnKSxcbiAgICAgIGNyZWF0ZU5vZGUoJ3BhcmFncmFwaCcsICdmb3VydGgnKVxuICAgIF0sXG4gICAgW1xuICAgICAge1xuICAgICAgICBuZXdQYXRoOiBbMF0sXG4gICAgICAgIHBhdGg6IFsxXSxcbiAgICAgICAgdHlwZTogJ21vdmVfbm9kZSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5ld1BhdGg6IFszLCAwXSxcbiAgICAgICAgcGF0aDogWzIsIDBdLFxuICAgICAgICB0eXBlOiAnbW92ZV9ub2RlJ1xuICAgICAgfVxuICAgIF0sXG4gICAgW1xuICAgICAgY3JlYXRlTm9kZSgncGFyYWdyYXBoJywgJ3NlY29uZCcpLFxuICAgICAgY3JlYXRlTm9kZSgncGFyYWdyYXBoJywgJ2ZpcnN0JyksXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdwYXJhZ3JhcGgnLFxuICAgICAgICBjaGlsZHJlbjogW11cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdwYXJhZ3JhcGgnLFxuICAgICAgICBjaGlsZHJlbjogW2NyZWF0ZVRleHQoJ3RoaXJkJyksIGNyZWF0ZVRleHQoJ2ZvdXJ0aCcpXVxuICAgICAgfVxuICAgIF1cbiAgXSxcbiAgW1xuICAgICdyZW1vdmVfbm9kZScsXG4gICAgW1xuICAgICAgY3JlYXRlTm9kZSgncGFyYWdyYXBoJywgJ2ZpcnN0JyksXG4gICAgICBjcmVhdGVOb2RlKCdwYXJhZ3JhcGgnLCAnc2Vjb25kJyksXG4gICAgICBjcmVhdGVOb2RlKCdwYXJhZ3JhcGgnLCAndGhpcmQnKVxuICAgIF0sXG4gICAgW1xuICAgICAge1xuICAgICAgICBwYXRoOiBbMSwgMF0sXG4gICAgICAgIHR5cGU6ICdyZW1vdmVfbm9kZSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFswXSxcbiAgICAgICAgdHlwZTogJ3JlbW92ZV9ub2RlJ1xuICAgICAgfVxuICAgIF0sXG4gICAgW1xuICAgICAge1xuICAgICAgICB0eXBlOiAncGFyYWdyYXBoJyxcbiAgICAgICAgY2hpbGRyZW46IFtdXG4gICAgICB9LFxuICAgICAgY3JlYXRlTm9kZSgncGFyYWdyYXBoJywgJ3RoaXJkJylcbiAgICBdXG4gIF0sXG4gIFtcbiAgICAnc2V0X25vZGUnLFxuICAgIFtcbiAgICAgIGNyZWF0ZU5vZGUoJ3BhcmFncmFwaCcsICdmaXJzdCcsIHsgdGVzdDogJzEyMzQnIH0pLFxuICAgICAgY3JlYXRlTm9kZSgncGFyYWdyYXBoJywgJ3NlY29uZCcpXG4gICAgXSxcbiAgICBbXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFswXSxcbiAgICAgICAgdHlwZTogJ3NldF9ub2RlJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHRlc3Q6ICcxMjM0J1xuICAgICAgICB9LFxuICAgICAgICBuZXdQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdGVzdDogJzQ1NjcnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFsxLCAwXSxcbiAgICAgICAgdHlwZTogJ3NldF9ub2RlJyxcbiAgICAgICAgbmV3UHJvcGVydGllczoge1xuICAgICAgICAgIGRhdGE6ICc0NTY3J1xuICAgICAgICB9XG4gICAgICB9XG4gICAgXSxcbiAgICBbXG4gICAgICBjcmVhdGVOb2RlKCdwYXJhZ3JhcGgnLCAnZmlyc3QnLCB7IHRlc3Q6ICc0NTY3JyB9KSxcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ3BhcmFncmFwaCcsXG4gICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGF0YTogJzQ1NjcnLFxuICAgICAgICAgICAgdGV4dDogJ3NlY29uZCdcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIF0sXG4gIFtcbiAgICAnc3BsaXRfbm9kZScsXG4gICAgW2NyZWF0ZU5vZGUoJ3BhcmFncmFwaCcsICdIZWxsbyBjb2xsYWJvcmF0b3IhJyldLFxuICAgIFtcbiAgICAgIHtcbiAgICAgICAgcGF0aDogWzAsIDBdLFxuICAgICAgICBwb3NpdGlvbjogNixcbiAgICAgICAgdGFyZ2V0OiBudWxsLFxuICAgICAgICB0eXBlOiAnc3BsaXRfbm9kZSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6IFswXSxcbiAgICAgICAgcG9zaXRpb246IDEsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB0eXBlOiAncGFyYWdyYXBoJ1xuICAgICAgICB9LFxuICAgICAgICB0YXJnZXQ6IDYsXG4gICAgICAgIHR5cGU6ICdzcGxpdF9ub2RlJ1xuICAgICAgfVxuICAgIF0sXG4gICAgW1xuICAgICAgY3JlYXRlTm9kZSgncGFyYWdyYXBoJywgJ0hlbGxvICcpLFxuICAgICAgY3JlYXRlTm9kZSgncGFyYWdyYXBoJywgJ2NvbGxhYm9yYXRvciEnKVxuICAgIF1cbiAgXVxuXVxuXG5kZXNjcmliZSgnYXBwbHkgc2xhdGUgb3BlcmF0aW9ucyB0byBBdXRvbWVyZ2UgZG9jdW1lbnQnLCAoKSA9PiB7XG4gIHRyYW5zZm9ybXMuZm9yRWFjaCgoW29wLCBpbnB1dCwgb3BlcmF0aW9ucywgb3V0cHV0XSkgPT4ge1xuICAgIGl0KGBhcHBseSAke29wfSBvcGVyYXRpb25zYCwgKCkgPT4ge1xuICAgICAgY29uc3QgZG9jID0gY3JlYXRlRG9jKGlucHV0KVxuXG4gICAgICBjb25zdCB1cGRhdGVkID0gQXV0b21lcmdlLmNoYW5nZShkb2MsIChkOiBhbnkpID0+IHtcbiAgICAgICAgYXBwbHlTbGF0ZU9wcyhkLmNoaWxkcmVuLCBvcGVyYXRpb25zIGFzIGFueSlcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGV4cGVjdGVkID0gY3JlYXRlRG9jKG91dHB1dClcblxuICAgICAgZXhwZWN0KHRvSlMoZXhwZWN0ZWQpKS50b1N0cmljdEVxdWFsKHRvSlModXBkYXRlZCkpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=