// Diamond brush
function Diamond(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Diamond.prototype = Object.create(Brush.prototype);
Diamond.prototype.constructor = Diamond;

Diamond.buildBrush = function(params, pointer) {
  var points = Diamond.getStaticBrushPoints(params, pointer);
  return new Diamond(params, points, pointer);
};

Diamond.prototype.getBrushPoints = function(pointer) {
  return Diamond.getStaticBrushPoints(this.params, pointer);
};

Diamond.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1, d2 - i),
    new Point(d1 + j, d2),
    new Point(d1, d2 + i),
    new Point(d1 - j, d2)
  ];
};

// Override alignPoints for custom diamond grid alignment
Diamond.prototype.alignPoints = function(points, genCenter) {
  if (!genCenter || points.length === 0) {
    return points;
  }
  
  // The center of rotations/symmetry
  var center = new Point(this.params.centerX || 0, this.params.centerY || 0);
  // The size of the box to fit, special for the diamond
  var brushSize = this.params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  
  var h = i * 2;
  var w = j * 2;
  
  // Fit position to center of shape
  var fitCenter = this.alignGridPoint(center, genCenter, w, h);
  
  // Points of the Diamond shape
  var diamondPoints = Diamond.getStaticBrushPoints(this.params, fitCenter);
  
  var fitX = fitCenter.getX();
  var fitY = fitCenter.getY();
  
  var shiftVector = new Point(0, 0);
  var found = false;
  
  // Now check if the position is inside the fitted Diamond
  var posInside1 = this.insideTriangle(genCenter, [diamondPoints[0], diamondPoints[1], diamondPoints[2]]);
  var posInside2 = this.insideTriangle(genCenter, [diamondPoints[0], diamondPoints[2], diamondPoints[3]]);
  var posInside = (posInside1 || posInside2);
  
  if (!posInside) {
    // 1. Check if inside top-left
    if (!found) {
      var p1 = new Point(fitX - j, fitY - i);
      var p2 = new Point(fitX, fitY - i);
      var p3 = new Point(fitX - j, fitY);
      var inside = this.insideTriangle(genCenter, [p1, p2, p3]);
      if (inside) {
        shiftVector = new Point(-j, -i);
        found = true;
      }
    }
    
    // 2. Check if inside top-right
    if (!found) {
      var p1 = new Point(fitX + j, fitY - i);
      var p2 = new Point(fitX, fitY - i);
      var p3 = new Point(fitX + j, fitY);
      var inside = this.insideTriangle(genCenter, [p1, p2, p3]);
      if (inside) {
        shiftVector = new Point(j, -i);
        found = true;
      }
    }
    
    // 3. Check if inside bottom-right
    if (!found) {
      var p1 = new Point(fitX + j, fitY + i);
      var p2 = new Point(fitX, fitY + i);
      var p3 = new Point(fitX + j, fitY);
      var inside = this.insideTriangle(genCenter, [p1, p2, p3]);
      if (inside) {
        shiftVector = new Point(j, i);
        found = true;
      }
    }
    
    // 4. Check if inside bottom-left
    if (!found) {
      var p1 = new Point(fitX - j, fitY + i);
      var p2 = new Point(fitX, fitY + i);
      var p3 = new Point(fitX - j, fitY);
      var inside = this.insideTriangle(genCenter, [p1, p2, p3]);
      if (inside) {
        shiftVector = new Point(-j, i);
        found = true;
      }
    }
  }
  
  diamondPoints = this.movePoints(diamondPoints, shiftVector);
  return diamondPoints;
};

