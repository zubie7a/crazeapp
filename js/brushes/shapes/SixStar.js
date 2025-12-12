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

// Override alignPoints for custom six star grid alignment (same as hexagon)
SixStar.prototype.alignPoints = function(points, genCenter) {
  if (!genCenter || points.length === 0) {
    return points;
  }
  
  var center = new Point(this.params.centerX || 0, this.params.centerY || 0);
  var brushSize = this.params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d3 = Math.sqrt(3.0) * j;
  
  var h = i * 3;
  var w = d3 * 2;
  
  var fitCenter = this.alignGridPoint(center, genCenter, w, h);
  var hexPoints = SixStar.getStaticBrushPoints(this.params, fitCenter);
  
  // Check if inside (use first 6 points for triangle checks)
  var basePoints = [];
  for (var i = 0; i < 6; i++) {
    basePoints.push(hexPoints[i * 2]);
  }
  
  var posInside1 = this.insideTriangle(genCenter, [basePoints[0], basePoints[1], basePoints[2]]);
  var posInside2 = this.insideTriangle(genCenter, [basePoints[0], basePoints[2], basePoints[3]]);
  var posInside3 = this.insideTriangle(genCenter, [basePoints[0], basePoints[3], basePoints[4]]);
  var posInside4 = this.insideTriangle(genCenter, [basePoints[0], basePoints[4], basePoints[5]]);
  var posInsideHex = (posInside1 || posInside2 || posInside3 || posInside4);
  
  if (!posInsideHex) {
    var fitX = fitCenter.getX();
    var fitY = fitCenter.getY();
    var shiftVector = new Point(0, 0);
    var found = false;
    
    if (!found) {
      var p1 = new Point(fitX - d3, fitY - (j * 3));
      var p2 = new Point(fitX, fitY - (j * 3));
      var p3 = new Point(fitX, fitY - i);
      var p4 = new Point(fitX - d3, fitY - j);
      var inside1 = this.insideTriangle(genCenter, [p1, p2, p3]);
      var inside2 = this.insideTriangle(genCenter, [p1, p3, p4]);
      if (inside1 || inside2) {
        shiftVector = new Point(-d3, -(j * 3));
        found = true;
      }
    }
    
    if (!found) {
      var p1 = new Point(fitX, fitY - (j * 3));
      var p2 = new Point(fitX + d3, fitY - (j * 3));
      var p3 = new Point(fitX + d3, fitY - j);
      var p4 = new Point(fitX, fitY - i);
      var inside1 = this.insideTriangle(genCenter, [p1, p2, p3]);
      var inside2 = this.insideTriangle(genCenter, [p1, p3, p4]);
      if (inside1 || inside2) {
        shiftVector = new Point(d3, -(j * 3));
        found = true;
      }
    }
    
    if (!found) {
      var p1 = new Point(fitX, fitY + i);
      var p2 = new Point(fitX + d3, fitY + j);
      var p3 = new Point(fitX + d3, fitY + (j * 3));
      var p4 = new Point(fitX, fitY + (j * 3));
      var inside1 = this.insideTriangle(genCenter, [p1, p2, p3]);
      var inside2 = this.insideTriangle(genCenter, [p1, p3, p4]);
      if (inside1 || inside2) {
        shiftVector = new Point(d3, (j * 3));
        found = true;
      }
    }
    
    if (!found) {
      var p1 = new Point(fitX - d3, fitY + j);
      var p2 = new Point(fitX, fitY + i);
      var p3 = new Point(fitX, fitY + (j * 3));
      var p4 = new Point(fitX - d3, fitY + (j * 3));
      var inside1 = this.insideTriangle(genCenter, [p1, p2, p3]);
      var inside2 = this.insideTriangle(genCenter, [p1, p3, p4]);
      if (inside1 || inside2) {
        shiftVector = new Point(-d3, (j * 3));
        found = true;
      }
    }
    
    hexPoints = this.movePoints(hexPoints, shiftVector);
  }
  
  return hexPoints;
};

