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

    if (value !== undefined) {
      node[key] = value;
    } else {
      delete node[key];
    }
  }

  return doc;
};

var _default = setNode;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHBseS9ub2RlL3NldE5vZGUudHMiXSwibmFtZXMiOlsic2V0Tm9kZSIsImRvYyIsIm9wIiwibm9kZSIsInBhdGgiLCJuZXdQcm9wZXJ0aWVzIiwia2V5IiwidmFsdWUiLCJ1bmRlZmluZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFHQTs7QUFFQSxJQUFNQSxPQUFPLEdBQUcsU0FBVkEsT0FBVSxDQUFDQyxHQUFELEVBQWlCQyxFQUFqQixFQUFxRDtBQUNuRSxNQUFNQyxJQUFJLEdBQUcscUJBQVVGLEdBQVYsRUFBZUMsRUFBRSxDQUFDRSxJQUFsQixDQUFiO0FBRG1FLE1BRzNEQyxhQUgyRCxHQUd6Q0gsRUFIeUMsQ0FHM0RHLGFBSDJEOztBQUtuRSxPQUFLLElBQUlDLEdBQVQsSUFBZ0JELGFBQWhCLEVBQStCO0FBQzdCLFFBQU1FLEtBQUssR0FBR0YsYUFBYSxDQUFDQyxHQUFELENBQTNCOztBQUNBLFFBQUlDLEtBQUssS0FBS0MsU0FBZCxFQUF5QjtBQUN2QkwsTUFBQUEsSUFBSSxDQUFDRyxHQUFELENBQUosR0FBWUMsS0FBWjtBQUNELEtBRkQsTUFFTztBQUNMLGFBQU9KLElBQUksQ0FBQ0csR0FBRCxDQUFYO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPTCxHQUFQO0FBQ0QsQ0FmRDs7ZUFpQmVELE8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTZXROb2RlT3BlcmF0aW9uIH0gZnJvbSAnc2xhdGUnXG5cbmltcG9ydCB7IFN5bmNWYWx1ZSB9IGZyb20gJy4uLy4uL21vZGVsJ1xuaW1wb3J0IHsgZ2V0VGFyZ2V0IH0gZnJvbSAnLi4vLi4vcGF0aCdcblxuY29uc3Qgc2V0Tm9kZSA9IChkb2M6IFN5bmNWYWx1ZSwgb3A6IFNldE5vZGVPcGVyYXRpb24pOiBTeW5jVmFsdWUgPT4ge1xuICBjb25zdCBub2RlID0gZ2V0VGFyZ2V0KGRvYywgb3AucGF0aClcblxuICBjb25zdCB7IG5ld1Byb3BlcnRpZXMgfSA9IG9wXG5cbiAgZm9yIChsZXQga2V5IGluIG5ld1Byb3BlcnRpZXMpIHtcbiAgICBjb25zdCB2YWx1ZSA9IG5ld1Byb3BlcnRpZXNba2V5XVxuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBub2RlW2tleV0gPSB2YWx1ZVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgbm9kZVtrZXldXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRvY1xufVxuXG5leHBvcnQgZGVmYXVsdCBzZXROb2RlXG4iXX0=