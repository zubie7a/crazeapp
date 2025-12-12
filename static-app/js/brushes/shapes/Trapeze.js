// Trapeze brush
function Trapeze(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Trapeze.prototype = Object.create(Brush.prototype);
Trapeze.prototype.constructor = Trapeze;

Trapeze.buildBrush = function(params, pointer) {
  var points = Trapeze.getStaticBrushPoints(params, pointer);
  return new Trapeze(params, points, pointer);
};

Trapeze.prototype.getBrushPoints = function(pointer) {
  return Trapeze.getStaticBrushPoints(this.params, pointer);
};

Trapeze.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1 - j, d2 - i),
    new Point(d1 + j, d2 - i),
    new Point(d1 + i, d2 + i),
    new Point(d1 - i, d2 + i)
  ];
};

