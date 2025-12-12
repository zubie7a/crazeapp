// Force brush - triangle with inner paths
function Force(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Force.prototype = Object.create(Brush.prototype);
Force.prototype.constructor = Force;

Force.buildBrush = function(params, pointer) {
  var points = Force.getStaticBrushPoints(params, pointer);
  return new Force(params, points, pointer);
};

Force.prototype.getBrushPoints = function(pointer) {
  return Force.getStaticBrushPoints(this.params, pointer);
};

Force.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var d3 = (i * 2) / Math.sqrt(3.0);
  
  return [
    new Point(d1, d2 - i),
    new Point(d1 + d3, d2 + i),
    new Point(d1 - d3, d2 + i)
  ];
};

// Override alignPoints for custom force grid alignment (same as triangle)
Force.prototype.alignPoints = function(points, genCenter) {
  if (!genCenter || points.length === 0) {
    return points;
  }
  
  var center = new Point(this.params.centerX || 0, this.params.centerY || 0);
  var h = this.params.brushSize;
  var w = Math.sqrt(4.0 / 3.0) * h;
  
  var fitPosCenter = this.alignGridPoint(center, genCenter, w, h);
  var hPosFactor = (fitPosCenter.getY() - center.getY()) / h;
  var posTriangleUp = (Math.floor(Math.abs(hPosFactor)) % 2 === 0);
  
  var posTriPoints = Force.getStaticBrushPoints(this.params, fitPosCenter);
  if (!posTriangleUp) {
    posTriPoints = this.verticalMirrorPoints(fitPosCenter, posTriPoints);
  }
  
  var posInside = this.insideTriangle(genCenter, posTriPoints);
  
  if (!posInside) {
    var shiftVector = new Point(0, 0);
    if (genCenter.getX() < fitPosCenter.getX()) {
      shiftVector = new Point(-(w / 2), 0);
    } else {
      shiftVector = new Point((w / 2), 0);
    }
    posTriPoints = this.movePoints(posTriPoints, shiftVector);
    posTriPoints = this.verticalMirrorPoints(fitPosCenter, posTriPoints);
  }
  
  return posTriPoints;
};

// Override getPath to draw inner triangle paths
Force.prototype.getPath = function(points, rotAngle, symmetry) {
  if (points.length < 3) return points;
  
  var pA = points[0];
  var pB = points[1];
  var pC = points[2];
  
  var pAB = this.getCentroid([pA, pB]);
  var pBC = this.getCentroid([pB, pC]);
  var pCA = this.getCentroid([pC, pA]);
  
  // Return path with inner triangle connections
  return [pC, pCA, pA, pAB, pCA, pBC, pAB, pB, pBC, pC];
};

