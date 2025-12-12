// Saw brush
function Saw(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Saw.prototype = Object.create(Brush.prototype);
Saw.prototype.constructor = Saw;

Saw.buildBrush = function(params, pointer) {
  var points = Saw.getStaticBrushPoints(params, pointer);
  return new Saw(params, points, pointer);
};

Saw.prototype.getBrushPoints = function(pointer) {
  return Saw.getStaticBrushPoints(this.params, pointer);
};

Saw.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var i = brushSize / 2;
  var l = brushSize / 16;
  
  var p1 = new Point(d1, d2 - i + 3*l);
  var p2 = new Point(d1 - l, d2 - i);
  var base = [p1, p2];
  
  // Rotate this 45 degrees, 8 times
  var angle = (45.0 * Math.PI) / 180.0;
  var result = [];
  var tempBrush = new Brush(params, [], pointer);
  for (var j = 0; j < 8; j++) {
    var subPoints = tempBrush.rotatePoints(pointer, base, j * angle);
    result = result.concat(subPoints);
  }
  
  return result;
};

