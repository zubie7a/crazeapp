// FiveStar brush
function FiveStar(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

FiveStar.prototype = Object.create(Brush.prototype);
FiveStar.prototype.constructor = FiveStar;

FiveStar.buildBrush = function(params, pointer) {
  var points = FiveStar.getStaticBrushPoints(params, pointer);
  return new FiveStar(params, points, pointer);
};

FiveStar.prototype.getBrushPoints = function(pointer) {
  return FiveStar.getStaticBrushPoints(this.params, pointer);
};

FiveStar.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var k = brushSize / 8;
  var l = brushSize / 16;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  var angle36 = (36.0 * Math.PI) / 180.0;
  // Top of the star will be at the middle-top
  var top = new Point(d1, d2 - i);
  var middle = new Point(d1, d2 - k - l);
  var tempBrush = new Brush(params, [], pointer);
  // Rotate middle point to get inner vertex
  var innerVertexPoints = tempBrush.rotatePoints(pointer, [middle], angle36);
  var innerVertex = innerVertexPoints[0];
  var base = [top, innerVertex];
  
  var angle72 = (72.0 * Math.PI) / 180.0;
  var result = [];
  for (var j = 0; j < 5; j++) {
    var subPoints = tempBrush.rotatePoints(pointer, base, j * angle72);
    result = result.concat(subPoints);
  }
  
  return result;
};

