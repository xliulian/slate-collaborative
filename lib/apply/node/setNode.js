"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = require("../../path");

var setNode = function setNode(doc, op) {
  var node = (0, _path.getTarget)(doc, op.path);
  var newProperties = op.newProperties;

  for (var key in newProperties) {
    var value = newProperties[key];

    if (value != null) {
      node[key] = value;
    } else {
      delete node[key];
    }
  }

  return doc;
};

var _default = setNode;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHBseS9ub2RlL3NldE5vZGUudHMiXSwibmFtZXMiOlsic2V0Tm9kZSIsImRvYyIsIm9wIiwibm9kZSIsInBhdGgiLCJuZXdQcm9wZXJ0aWVzIiwia2V5IiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFHQTs7QUFFQSxJQUFNQSxPQUFPLEdBQUcsU0FBVkEsT0FBVSxDQUFDQyxHQUFELEVBQWlCQyxFQUFqQixFQUFxRDtBQUNuRSxNQUFNQyxJQUFJLEdBQUcscUJBQVVGLEdBQVYsRUFBZUMsRUFBRSxDQUFDRSxJQUFsQixDQUFiO0FBRG1FLE1BRzNEQyxhQUgyRCxHQUd6Q0gsRUFIeUMsQ0FHM0RHLGFBSDJEOztBQUtuRSxPQUFLLElBQUlDLEdBQVQsSUFBZ0JELGFBQWhCLEVBQStCO0FBQzdCLFFBQU1FLEtBQUssR0FBR0YsYUFBYSxDQUFDQyxHQUFELENBQTNCOztBQUNBLFFBQUlDLEtBQUssSUFBSSxJQUFiLEVBQW1CO0FBQ2pCSixNQUFBQSxJQUFJLENBQUNHLEdBQUQsQ0FBSixHQUFZQyxLQUFaO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBT0osSUFBSSxDQUFDRyxHQUFELENBQVg7QUFDRDtBQUNGOztBQUVELFNBQU9MLEdBQVA7QUFDRCxDQWZEOztlQWlCZUQsTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNldE5vZGVPcGVyYXRpb24gfSBmcm9tICdzbGF0ZSdcblxuaW1wb3J0IHsgU3luY1ZhbHVlIH0gZnJvbSAnLi4vLi4vbW9kZWwnXG5pbXBvcnQgeyBnZXRUYXJnZXQgfSBmcm9tICcuLi8uLi9wYXRoJ1xuXG5jb25zdCBzZXROb2RlID0gKGRvYzogU3luY1ZhbHVlLCBvcDogU2V0Tm9kZU9wZXJhdGlvbik6IFN5bmNWYWx1ZSA9PiB7XG4gIGNvbnN0IG5vZGUgPSBnZXRUYXJnZXQoZG9jLCBvcC5wYXRoKVxuXG4gIGNvbnN0IHsgbmV3UHJvcGVydGllcyB9ID0gb3BcblxuICBmb3IgKGxldCBrZXkgaW4gbmV3UHJvcGVydGllcykge1xuICAgIGNvbnN0IHZhbHVlID0gbmV3UHJvcGVydGllc1trZXldXG4gICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgIG5vZGVba2V5XSA9IHZhbHVlXG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBub2RlW2tleV1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZG9jXG59XG5cbmV4cG9ydCBkZWZhdWx0IHNldE5vZGVcbiJdfQ==