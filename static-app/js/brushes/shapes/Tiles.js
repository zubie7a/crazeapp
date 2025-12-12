// Tiles brush
function Tiles(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Tiles.prototype = Object.create(Brush.prototype);
Tiles.prototype.constructor = Tiles;

Tiles.buildBrush = function(params, pointer) {
  var points = Tiles.getStaticBrushPoints(params, pointer);
  return new Tiles(params, points, pointer);
};

Tiles.prototype.getBrushPoints = function(pointer) {
  return Tiles.getStaticBrushPoints(this.params, pointer);
};

Tiles.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var i = brushSize / 2;
  var k = brushSize / 8;
  
  var _u = new Point(d1, d2 - i);
  var _r = new Point(d1 + k, d2 - i + k);
  var _d = new Point(d1, d2 - i + 2*k);
  var _l = new Point(d1 - k, d2 - i + k);
  var base = [_d, _l, _u, _r, _d];
  
  // Rotate this 90 degrees, 4 times
  var angle = (90.0 * Math.PI) / 180.0;
  var result = [];
  var tempBrush = new Brush(params, [], pointer);
  for (var j = 0; j < 4; j++) {
    var subPoints = tempBrush.rotatePoints(pointer, base, j * angle);
    result = result.concat(subPoints);
  }
  
  return result;
};

