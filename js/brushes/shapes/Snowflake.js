// Snowflake brush
function Snowflake(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Snowflake.prototype = Object.create(Brush.prototype);
Snowflake.prototype.constructor = Snowflake;

Snowflake.buildBrush = function(params, pointer) {
  var points = Snowflake.getStaticBrushPoints(params, pointer);
  return new Snowflake(params, points, pointer);
};

Snowflake.prototype.getBrushPoints = function(pointer) {
  return Snowflake.getStaticBrushPoints(this.params, pointer);
};

Snowflake.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var i = brushSize / 2;
  var j = brushSize / 8;
  
  var top = new Point(d1, d2 - i);
  var tempBrush = new Brush(params, [], pointer);
  var middle = tempBrush.getCentroid([pointer, top]);
  var left = new Point(middle.getX() - j, middle.getY());
  var right = new Point(middle.getX() + j, middle.getY());
  var base = [pointer, left, top, right];
  
  // Rotate this 60 degrees, 6 times
  var angle = (60.0 * Math.PI) / 180.0;
  var result = [];
  for (var k = 0; k < 6; k++) {
    var subPoints = tempBrush.rotatePoints(pointer, base, k * angle);
    result = result.concat(subPoints);
  }
  
  // Add scaled version
  var baseHalf = tempBrush.scalePoints(pointer, tempBrush.scalePoints(pointer, base, 0.75), 0.6666);
  for (var k = 0; k < 6; k++) {
    var subPointsHalf = tempBrush.rotatePoints(pointer, baseHalf, k * angle);
    result = result.concat(subPointsHalf);
  }
  
  return result;
};

// Override alignPoints for custom snowflake grid alignment (same as hexagon)
Snowflake.prototype.alignPoints = function(points, genCenter) {
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
  var hexPoints = Snowflake.getStaticBrushPoints(this.params, fitCenter);
  
  // Check if inside hexagon (simplified - check first 4 triangles)
  var posInside1 = this.insideTriangle(genCenter, [hexPoints[0], hexPoints[1], hexPoints[2]]);
  var posInside2 = this.insideTriangle(genCenter, [hexPoints[0], hexPoints[2], hexPoints[3]]);
  var posInside3 = this.insideTriangle(genCenter, [hexPoints[0], hexPoints[3], hexPoints[4]]);
  var posInside4 = this.insideTriangle(genCenter, [hexPoints[0], hexPoints[4], hexPoints[5]]);
  var posInsideHex = (posInside1 || posInside2 || posInside3 || posInside4);
  
  if (!posInsideHex) {
    var fitX = fitCenter.getX();
    var fitY = fitCenter.getY();
    var shiftVector = new Point(0, 0);
    var found = false;
    
    // Check neighboring positions (simplified - just check top-left)
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

