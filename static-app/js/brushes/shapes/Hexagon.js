// Hexagon brush
function Hexagon(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Hexagon.prototype = Object.create(Brush.prototype);
Hexagon.prototype.constructor = Hexagon;

Hexagon.buildBrush = function(params, pointer) {
  var points = Hexagon.getStaticBrushPoints(params, pointer);
  return new Hexagon(params, points, pointer);
};

Hexagon.prototype.getBrushPoints = function(pointer) {
  return Hexagon.getStaticBrushPoints(this.params, pointer);
};

Hexagon.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var d3 = Math.sqrt(3.0) * j;
  
  return [
    new Point(d1, d2 - i),
    new Point(d1 + d3, d2 - j),
    new Point(d1 + d3, d2 + j),
    new Point(d1, d2 + i),
    new Point(d1 - d3, d2 + j),
    new Point(d1 - d3, d2 - j)
  ];
};

