// Outwards brush
function Outwards(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Outwards.prototype = Object.create(Brush.prototype);
Outwards.prototype.constructor = Outwards;

Outwards.buildBrush = function(params, pointer) {
  var points = Outwards.getStaticBrushPoints(params, pointer);
  return new Outwards(params, points, pointer);
};

Outwards.prototype.getBrushPoints = function(pointer) {
  return Outwards.getStaticBrushPoints(this.params, pointer);
};

Outwards.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var k = brushSize / 8;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  var p1 = new Point(d1, d2 - i);
  var p2 = new Point(d1 + k, d2 - k);
  var p3 = new Point(d1, d2 - j);
  var p4 = new Point(d1 - k, d2 - k);
  
  var baseExternal = [p4, p1, p2];
  var baseInternal = [p4, p3, p2];
  
  var angle90 = (90.0 * Math.PI) / 180.0;
  var result = [];
  var tempBrush = new Brush(params, [], pointer);
  
  for (var m = 0; m < 4; m++) {
    var subPoints = tempBrush.rotatePoints(pointer, baseExternal, m * angle90);
    result = result.concat(subPoints);
  }
  
  for (var m = 0; m < 4; m++) {
    var subPoints = tempBrush.rotatePoints(pointer, baseInternal, m * angle90);
    result = result.concat(subPoints);
  }
  
  return result;
};

