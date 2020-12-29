"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var Automerge = _interopRequireWildcard(require("automerge"));

var _index = require("./index");

var _utils = require("../utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

describe('convert operations to slatejs model', function () {
  it('convert insert operations', function () {
    var doc1 = (0, _utils.createDoc)();
    var doc2 = (0, _utils.cloneDoc)(doc1);
    var change = Automerge.change(doc1, function (d) {
      d.children.push((0, _utils.createNode)('paragraph', 'hello!'));
      d.children[1].children[0].text = 'hello!';
    });
    var operations = Automerge.diff(doc2, change);
    var slateOps = (0, _index.toSlateOp)(operations, change);
    var expectedOps = [{
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
        text: 'hello!'
      }
    }];
    expect(slateOps).toStrictEqual(expectedOps);
  });
  it('convert remove operations', function () {
    var doc1 = Automerge.change((0, _utils.createDoc)(), function (d) {
      d.children.push((0, _utils.createNode)('paragraph', 'hello!'));
      d.children.push((0, _utils.createNode)('paragraph', 'hello twice!'));
      d.children[1].children[0].text = 'hello!';
    });
    var doc2 = (0, _utils.cloneDoc)(doc1);
    var change = Automerge.change(doc1, function (d) {
      delete d.children[1];
      delete d.children[0].children[0];
    });
    var operations = Automerge.diff(doc2, change);
    var slateOps = (0, _index.toSlateOp)(operations, change);
    var expectedOps = [{
      type: 'remove_node',
      path: [1],
      node: (0, _utils.createNode)('paragraph', 'hello twice!')
    }, {
      type: 'remove_node',
      path: [0, 0],
      node: {
        children: []
      }
    }];
    expect(slateOps).toStrictEqual(expectedOps);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L2NvbnZlcnQuc3BlYy50cyJdLCJuYW1lcyI6WyJkZXNjcmliZSIsIml0IiwiZG9jMSIsImRvYzIiLCJjaGFuZ2UiLCJBdXRvbWVyZ2UiLCJkIiwiY2hpbGRyZW4iLCJwdXNoIiwidGV4dCIsIm9wZXJhdGlvbnMiLCJkaWZmIiwic2xhdGVPcHMiLCJleHBlY3RlZE9wcyIsInR5cGUiLCJwYXRoIiwibm9kZSIsImV4cGVjdCIsInRvU3RyaWN0RXF1YWwiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUFBLFFBQVEsQ0FBQyxxQ0FBRCxFQUF3QyxZQUFNO0FBQ3BEQyxFQUFBQSxFQUFFLENBQUMsMkJBQUQsRUFBOEIsWUFBTTtBQUNwQyxRQUFNQyxJQUFJLEdBQUcsdUJBQWI7QUFDQSxRQUFNQyxJQUFJLEdBQUcscUJBQVNELElBQVQsQ0FBYjtBQUVBLFFBQU1FLE1BQU0sR0FBR0MsU0FBUyxDQUFDRCxNQUFWLENBQWlCRixJQUFqQixFQUF1QixVQUFBSSxDQUFDLEVBQUk7QUFDekNBLE1BQUFBLENBQUMsQ0FBQ0MsUUFBRixDQUFXQyxJQUFYLENBQWdCLHVCQUFXLFdBQVgsRUFBd0IsUUFBeEIsQ0FBaEI7QUFDQUYsTUFBQUEsQ0FBQyxDQUFDQyxRQUFGLENBQVcsQ0FBWCxFQUFjQSxRQUFkLENBQXVCLENBQXZCLEVBQTBCRSxJQUExQixHQUFpQyxRQUFqQztBQUNELEtBSGMsQ0FBZjtBQUtBLFFBQU1DLFVBQVUsR0FBR0wsU0FBUyxDQUFDTSxJQUFWLENBQWVSLElBQWYsRUFBcUJDLE1BQXJCLENBQW5CO0FBRUEsUUFBTVEsUUFBUSxHQUFHLHNCQUFVRixVQUFWLEVBQXNCTixNQUF0QixDQUFqQjtBQUVBLFFBQU1TLFdBQVcsR0FBRyxDQUNsQjtBQUNFQyxNQUFBQSxJQUFJLEVBQUUsYUFEUjtBQUVFQyxNQUFBQSxJQUFJLEVBQUUsQ0FBQyxDQUFELENBRlI7QUFHRUMsTUFBQUEsSUFBSSxFQUFFO0FBQUVGLFFBQUFBLElBQUksRUFBRSxXQUFSO0FBQXFCUCxRQUFBQSxRQUFRLEVBQUU7QUFBL0I7QUFIUixLQURrQixFQU1sQjtBQUNFTyxNQUFBQSxJQUFJLEVBQUUsYUFEUjtBQUVFQyxNQUFBQSxJQUFJLEVBQUUsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUZSO0FBR0VDLE1BQUFBLElBQUksRUFBRTtBQUFFUCxRQUFBQSxJQUFJLEVBQUU7QUFBUjtBQUhSLEtBTmtCLENBQXBCO0FBYUFRLElBQUFBLE1BQU0sQ0FBQ0wsUUFBRCxDQUFOLENBQWlCTSxhQUFqQixDQUErQkwsV0FBL0I7QUFDRCxHQTNCQyxDQUFGO0FBNkJBWixFQUFBQSxFQUFFLENBQUMsMkJBQUQsRUFBOEIsWUFBTTtBQUNwQyxRQUFNQyxJQUFJLEdBQUdHLFNBQVMsQ0FBQ0QsTUFBVixDQUFpQix1QkFBakIsRUFBOEIsVUFBQUUsQ0FBQyxFQUFJO0FBQzlDQSxNQUFBQSxDQUFDLENBQUNDLFFBQUYsQ0FBV0MsSUFBWCxDQUFnQix1QkFBVyxXQUFYLEVBQXdCLFFBQXhCLENBQWhCO0FBQ0FGLE1BQUFBLENBQUMsQ0FBQ0MsUUFBRixDQUFXQyxJQUFYLENBQWdCLHVCQUFXLFdBQVgsRUFBd0IsY0FBeEIsQ0FBaEI7QUFDQUYsTUFBQUEsQ0FBQyxDQUFDQyxRQUFGLENBQVcsQ0FBWCxFQUFjQSxRQUFkLENBQXVCLENBQXZCLEVBQTBCRSxJQUExQixHQUFpQyxRQUFqQztBQUNELEtBSlksQ0FBYjtBQU1BLFFBQU1OLElBQUksR0FBRyxxQkFBU0QsSUFBVCxDQUFiO0FBRUEsUUFBTUUsTUFBTSxHQUFHQyxTQUFTLENBQUNELE1BQVYsQ0FBaUJGLElBQWpCLEVBQXVCLFVBQUFJLENBQUMsRUFBSTtBQUN6QyxhQUFPQSxDQUFDLENBQUNDLFFBQUYsQ0FBVyxDQUFYLENBQVA7QUFDQSxhQUFPRCxDQUFDLENBQUNDLFFBQUYsQ0FBVyxDQUFYLEVBQWNBLFFBQWQsQ0FBdUIsQ0FBdkIsQ0FBUDtBQUNELEtBSGMsQ0FBZjtBQUtBLFFBQU1HLFVBQVUsR0FBR0wsU0FBUyxDQUFDTSxJQUFWLENBQWVSLElBQWYsRUFBcUJDLE1BQXJCLENBQW5CO0FBRUEsUUFBTVEsUUFBUSxHQUFHLHNCQUFVRixVQUFWLEVBQXNCTixNQUF0QixDQUFqQjtBQUVBLFFBQU1TLFdBQVcsR0FBRyxDQUNsQjtBQUNFQyxNQUFBQSxJQUFJLEVBQUUsYUFEUjtBQUVFQyxNQUFBQSxJQUFJLEVBQUUsQ0FBQyxDQUFELENBRlI7QUFHRUMsTUFBQUEsSUFBSSxFQUFFLHVCQUFXLFdBQVgsRUFBd0IsY0FBeEI7QUFIUixLQURrQixFQU1sQjtBQUNFRixNQUFBQSxJQUFJLEVBQUUsYUFEUjtBQUVFQyxNQUFBQSxJQUFJLEVBQUUsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUZSO0FBR0VDLE1BQUFBLElBQUksRUFBRTtBQUNKVCxRQUFBQSxRQUFRLEVBQUU7QUFETjtBQUhSLEtBTmtCLENBQXBCO0FBZUFVLElBQUFBLE1BQU0sQ0FBQ0wsUUFBRCxDQUFOLENBQWlCTSxhQUFqQixDQUErQkwsV0FBL0I7QUFDRCxHQWxDQyxDQUFGO0FBbUNELENBakVPLENBQVIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBBdXRvbWVyZ2UgZnJvbSAnYXV0b21lcmdlJ1xuaW1wb3J0IHsgdG9TbGF0ZU9wIH0gZnJvbSAnLi9pbmRleCdcbmltcG9ydCB7IGNyZWF0ZURvYywgY2xvbmVEb2MsIGNyZWF0ZU5vZGUgfSBmcm9tICcuLi91dGlscydcblxuZGVzY3JpYmUoJ2NvbnZlcnQgb3BlcmF0aW9ucyB0byBzbGF0ZWpzIG1vZGVsJywgKCkgPT4ge1xuICBpdCgnY29udmVydCBpbnNlcnQgb3BlcmF0aW9ucycsICgpID0+IHtcbiAgICBjb25zdCBkb2MxID0gY3JlYXRlRG9jKClcbiAgICBjb25zdCBkb2MyID0gY2xvbmVEb2MoZG9jMSlcblxuICAgIGNvbnN0IGNoYW5nZSA9IEF1dG9tZXJnZS5jaGFuZ2UoZG9jMSwgZCA9PiB7XG4gICAgICBkLmNoaWxkcmVuLnB1c2goY3JlYXRlTm9kZSgncGFyYWdyYXBoJywgJ2hlbGxvIScpKVxuICAgICAgZC5jaGlsZHJlblsxXS5jaGlsZHJlblswXS50ZXh0ID0gJ2hlbGxvISdcbiAgICB9KVxuXG4gICAgY29uc3Qgb3BlcmF0aW9ucyA9IEF1dG9tZXJnZS5kaWZmKGRvYzIsIGNoYW5nZSlcblxuICAgIGNvbnN0IHNsYXRlT3BzID0gdG9TbGF0ZU9wKG9wZXJhdGlvbnMsIGNoYW5nZSlcblxuICAgIGNvbnN0IGV4cGVjdGVkT3BzID0gW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnaW5zZXJ0X25vZGUnLFxuICAgICAgICBwYXRoOiBbMV0sXG4gICAgICAgIG5vZGU6IHsgdHlwZTogJ3BhcmFncmFwaCcsIGNoaWxkcmVuOiBbXSB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0eXBlOiAnaW5zZXJ0X25vZGUnLFxuICAgICAgICBwYXRoOiBbMSwgMF0sXG4gICAgICAgIG5vZGU6IHsgdGV4dDogJ2hlbGxvIScgfVxuICAgICAgfVxuICAgIF1cblxuICAgIGV4cGVjdChzbGF0ZU9wcykudG9TdHJpY3RFcXVhbChleHBlY3RlZE9wcylcbiAgfSlcblxuICBpdCgnY29udmVydCByZW1vdmUgb3BlcmF0aW9ucycsICgpID0+IHtcbiAgICBjb25zdCBkb2MxID0gQXV0b21lcmdlLmNoYW5nZShjcmVhdGVEb2MoKSwgZCA9PiB7XG4gICAgICBkLmNoaWxkcmVuLnB1c2goY3JlYXRlTm9kZSgncGFyYWdyYXBoJywgJ2hlbGxvIScpKVxuICAgICAgZC5jaGlsZHJlbi5wdXNoKGNyZWF0ZU5vZGUoJ3BhcmFncmFwaCcsICdoZWxsbyB0d2ljZSEnKSlcbiAgICAgIGQuY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF0udGV4dCA9ICdoZWxsbyEnXG4gICAgfSlcblxuICAgIGNvbnN0IGRvYzIgPSBjbG9uZURvYyhkb2MxKVxuXG4gICAgY29uc3QgY2hhbmdlID0gQXV0b21lcmdlLmNoYW5nZShkb2MxLCBkID0+IHtcbiAgICAgIGRlbGV0ZSBkLmNoaWxkcmVuWzFdXG4gICAgICBkZWxldGUgZC5jaGlsZHJlblswXS5jaGlsZHJlblswXVxuICAgIH0pXG5cbiAgICBjb25zdCBvcGVyYXRpb25zID0gQXV0b21lcmdlLmRpZmYoZG9jMiwgY2hhbmdlKVxuXG4gICAgY29uc3Qgc2xhdGVPcHMgPSB0b1NsYXRlT3Aob3BlcmF0aW9ucywgY2hhbmdlKVxuXG4gICAgY29uc3QgZXhwZWN0ZWRPcHMgPSBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdyZW1vdmVfbm9kZScsXG4gICAgICAgIHBhdGg6IFsxXSxcbiAgICAgICAgbm9kZTogY3JlYXRlTm9kZSgncGFyYWdyYXBoJywgJ2hlbGxvIHR3aWNlIScpXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0eXBlOiAncmVtb3ZlX25vZGUnLFxuICAgICAgICBwYXRoOiBbMCwgMF0sXG4gICAgICAgIG5vZGU6IHtcbiAgICAgICAgICBjaGlsZHJlbjogW11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cblxuICAgIGV4cGVjdChzbGF0ZU9wcykudG9TdHJpY3RFcXVhbChleHBlY3RlZE9wcylcbiAgfSlcbn0pXG4iXX0=