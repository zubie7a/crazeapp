// Arrowhead brush
function Arrowhead(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Arrowhead.prototype = Object.create(Brush.prototype);
Arrowhead.prototype.constructor = Arrowhead;

Arrowhead.buildBrush = function(params, pointer) {
  var points = Arrowhead.getStaticBrushPoints(params, pointer);
  return new Arrowhead(params, points, pointer);
};

Arrowhead.prototype.getBrushPoints = function(pointer) {
  return Arrowhead.getStaticBrushPoints(this.params, pointer);
};

Arrowhead.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var d3 = (i * 2) / Math.sqrt(3.0);
  
  return [
    new Point(d1, d2 - i),
    new Point(d1 - d3, d2 + i),
    new Point(d1, d2),
    new Point(d1 + d3, d2 + i)
  ];
};

