// Insignia brush
function Insignia(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Insignia.prototype = Object.create(Brush.prototype);
Insignia.prototype.constructor = Insignia;

Insignia.buildBrush = function(params, pointer) {
  var points = Insignia.getStaticBrushPoints(params, pointer);
  return new Insignia(params, points, pointer);
};

Insignia.prototype.getBrushPoints = function(pointer) {
  return Insignia.getStaticBrushPoints(this.params, pointer);
};

Insignia.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var d3 = Math.sqrt(3.0) * j;
  
  return [
    new Point(d1, d2),
    new Point(d1 + d3, d2 - j),
    new Point(d1 + d3, d2 + j),
    new Point(d1, d2 + i),
    new Point(d1 - d3, d2 + j),
    new Point(d1 - d3, d2 - j)
  ];
};

