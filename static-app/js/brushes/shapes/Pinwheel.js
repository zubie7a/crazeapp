// Pinwheel brush
function Pinwheel(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Pinwheel.prototype = Object.create(Brush.prototype);
Pinwheel.prototype.constructor = Pinwheel;

Pinwheel.buildBrush = function(params, pointer) {
  var points = Pinwheel.getStaticBrushPoints(params, pointer);
  return new Pinwheel(params, points, pointer);
};

Pinwheel.prototype.getBrushPoints = function(pointer) {
  return Pinwheel.getStaticBrushPoints(this.params, pointer);
};

Pinwheel.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var i = brushSize / 2;
  var j = brushSize / 4;
  var k = brushSize / 8;
  var l = brushSize / 16;
  
  var top = new Point(d1, d2 - i);
  var middle = new Point(d1 + k, d2 - j + l);
  var base = [pointer, top, middle];
  
  // Rotate this 45 degrees, 8 times
  var angle = (45.0 * Math.PI) / 180.0;
  var result = [];
  var tempBrush = new Brush(params, [], pointer);
  for (var m = 0; m < 8; m++) {
    var subPoints = tempBrush.rotatePoints(pointer, base, m * angle);
    result = result.concat(subPoints);
  }
  
  return result;
};

