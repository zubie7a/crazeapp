// Hexagon brush
function Hexagon(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Hexagon.prototype = Object.create(Brush.prototype);
Hexagon.prototype.constructor = Hexagon;

Hexagon.buildBrush = function(params, pointer) {
  var points = Hexagon.getStaticBrushPoints(params, pointer);
  return new Hexagon(params, points, pointer);
};

Hexagon.prototype.getBrushPoints = function(pointer) {
  return Hexagon.getStaticBrushPoints(this.params, pointer);
};

Hexagon.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var d3 = Math.sqrt(3.0) * j;
  
  return [
    new Point(d1, d2 - i),
    new Point(d1 + d3, d2 - j),
    new Point(d1 + d3, d2 + j),
    new Point(d1, d2 + i),
    new Point(d1 - d3, d2 + j),
    new Point(d1 - d3, d2 - j)
  ];
};

// Override alignPoints for custom hexagon grid alignment
Hexagon.prototype.alignPoints = function(points, genCenter) {
  if (!genCenter || points.length === 0) {
    return points;
  }
  
  // The center of rotations/symmetry
  var center = new Point(this.params.centerX || 0, this.params.centerY || 0);
  // The size of the box to fit, special for the hexagon
  var brushSize = this.params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d3 = Math.sqrt(3.0) * j;
  
  var h = i * 3;
  var w = d3 * 2;
  
  // Fit position to center of shape
  var fitCenter = this.alignGridPoint(center, genCenter, w, h);
  
  var hexPoints = Hexagon.getStaticBrushPoints(this.params, fitCenter);
  
  // Now check if the position is inside the fitted hexagon
  var posInside1 = this.insideTriangle(genCenter, [hexPoints[0], hexPoints[1], hexPoints[2]]);
  var posInside2 = this.insideTriangle(genCenter, [hexPoints[0], hexPoints[2], hexPoints[3]]);
  var posInside3 = this.insideTriangle(genCenter, [hexPoints[0], hexPoints[3], hexPoints[4]]);
  var posInside4 = this.insideTriangle(genCenter, [hexPoints[0], hexPoints[4], hexPoints[5]]);
  var posInsideHex = (posInside1 || posInside2 || posInside3 || posInside4);
  
  if (!posInsideHex) {
    // If not inside, then shift shape to a neighboring position of the fitted shape
    var fitX = fitCenter.getX();
    var fitY = fitCenter.getY();
    var shiftVector = new Point(0, 0);
    var found = false;
    
    // 1. Check if inside top-left
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
    
    // 2. Check if inside top-right
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
    
    // 3. Check if inside bottom-right
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
    
    // 4. Check if inside bottom-left
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

