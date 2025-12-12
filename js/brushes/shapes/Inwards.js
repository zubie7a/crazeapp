// Inwards brush
function Inwards(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Inwards.prototype = Object.create(Brush.prototype);
Inwards.prototype.constructor = Inwards;

Inwards.buildBrush = function(params, pointer) {
  var points = Inwards.getStaticBrushPoints(params, pointer);
  return new Inwards(params, points, pointer);
};

Inwards.prototype.getBrushPoints = function(pointer) {
  return Inwards.getStaticBrushPoints(this.params, pointer);
};

Inwards.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var j = brushSize / 4;
  var k = brushSize / 8;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  // Center
  var p1 = new Point(d1, d2);
  var p2 = new Point(d1 - k, d2 - j - k);
  var p3 = new Point(d1, d2 - j);
  var p4 = new Point(d1 + k, d2 - j - k);
  
  var base = [p1, p2, p3, p4];
  
  var angle90 = (90.0 * Math.PI) / 180.0;
  var result = [];
  var tempBrush = new Brush(params, [], pointer);
  for (var i = 0; i < 4; i++) {
    var subPoints = tempBrush.rotatePoints(pointer, base, i * angle90);
    result = result.concat(subPoints);
  }
  
  return result;
};

