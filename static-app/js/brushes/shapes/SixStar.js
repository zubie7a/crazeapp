// SixStar brush
function SixStar(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

SixStar.prototype = Object.create(Brush.prototype);
SixStar.prototype.constructor = SixStar;

SixStar.buildBrush = function(params, pointer) {
  var points = SixStar.getStaticBrushPoints(params, pointer);
  return new SixStar(params, points, pointer);
};

SixStar.prototype.getBrushPoints = function(pointer) {
  return SixStar.getStaticBrushPoints(this.params, pointer);
};

SixStar.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var d3 = Math.sqrt(3.0) * j;
  
  var result = [
    new Point(d1, d2 - i),
    new Point(d1 + d3, d2 - j),
    new Point(d1 + d3, d2 + j),
    new Point(d1, d2 + i),
    new Point(d1 - d3, d2 + j),
    new Point(d1 - d3, d2 - j)
  ];
  
  var finalResult = [];
  var tempBrush = new Brush(params, [], pointer);
  for (var k = 0; k < result.length; k++) {
    var p0 = pointer;
    var p1 = result[k];
    var p2 = result[(k + 1) % result.length];
    var centroid = tempBrush.getCentroid([p0, p1, p2]);
    finalResult.push(p1);
    finalResult.push(centroid);
  }
  
  return finalResult;
};

