// Triangles brush - equilateral triangle
function Triangles(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Triangles.prototype = Object.create(Brush.prototype);
Triangles.prototype.constructor = Triangles;

Triangles.buildBrush = function(params, pointer) {
  var points = Triangles.getStaticBrushPoints(params, pointer);
  return new Triangles(params, points, pointer);
};

Triangles.prototype.getBrushPoints = function(pointer) {
  return Triangles.getStaticBrushPoints(this.params, pointer);
};

Triangles.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var d3 = (i * 2) / Math.sqrt(3.0);
  
  return [
    new Point(d1, d2 - i),
    new Point(d1 - d3, d2 + i),
    new Point(d1 + d3, d2 + i)
  ];
};

