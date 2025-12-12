// Flower brush - uses arcs (simplified for now, will use regular path)
function Flower(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Flower.prototype = Object.create(Brush.prototype);
Flower.prototype.constructor = Flower;

Flower.buildBrush = function(params, pointer) {
  var points = Flower.getStaticBrushPoints(params, pointer);
  return new Flower(params, points, pointer);
};

Flower.prototype.getBrushPoints = function(pointer) {
  return Flower.getStaticBrushPoints(this.params, pointer);
};

Flower.getStaticBrushPoints = function(params, pointer) {
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

