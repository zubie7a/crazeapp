// Base Brush class - all brushes extend this
function Brush(params, points, pointer) {
  // The points that describe the brush at the current position
  this.posPoints = points || [];
  // The points that describe the brush at the previous position
  this.prePoints = [];
  // The parameters at the time this brush was created
  this.params = params;
  // Store center coordinates in params for alignment
  if (!this.params.centerX && params.centerX !== undefined) {
    this.params.centerX = params.centerX;
  }
  if (!this.params.centerY && params.centerY !== undefined) {
    this.params.centerY = params.centerY;
  }
  // The steps that the current stroke has taken
  this.steps = 0;
  // Center points
  this.preCenter = pointer ? pointer.copy() : null;
  this.posCenter = pointer ? pointer.copy() : null;
}

// Move the brush to a new location
Brush.prototype.move = function(pointer) {
  // Copy current position's points to previous position
  this.prePoints = this.copyPoints(this.posPoints);
  // Create points again at the new current position
  this.posPoints = this.getBrushPoints(pointer);
  
  if (this.posCenter) {
    this.preCenter = this.posCenter.copy();
    this.posCenter = pointer.copy();
  }
};

// This method should be overridden in all children classes
Brush.prototype.getBrushPoints = function(pointer) {
  throw new Error('getBrushPoints must be overridden');
};

// Copy points so you can mutate them freely
Brush.prototype.copyPoints = function(points) {
  return points.map(function(p) { return p.copy(); });
};

// Get current position points
Brush.prototype.getPosPoints = function() {
  return this.posPoints;
};

// Get previous position points
Brush.prototype.getPrePoints = function() {
  return this.prePoints;
};

// Get parameters
Brush.prototype.getParams = function() {
  return this.params;
};

// Move steps counter
Brush.prototype.moveSteps = function() {
  this.steps += 1;
  this.steps %= 360;
};

// Transform the brush (align, variable size, spinning)
Brush.prototype.transform = function() {
  this.moveSteps();
  this.transformAlign();
  this.transformVariable();
  this.transformSpinning();
};

// Align brush to grid
Brush.prototype.transformAlign = function() {
  if (!this.params.fitToGrid) {
    return;
  }
  
  // Align points using alignPoints method (can be overridden by brushes)
  this.posPoints = this.alignPoints(this.posPoints, this.posCenter);
  
  // If no previous points, copy current points
  if (this.prePoints.length === 0) {
    this.prePoints = this.copyPoints(this.posPoints);
  }
};

// Align points to grid (generic implementation, can be overridden)
Brush.prototype.alignPoints = function(points, genCenter) {
  if (!genCenter || points.length === 0) {
    return points;
  }
  
  var centroid = this.getCentroid(points);
  var center = new Point(this.params.centerX || 0, this.params.centerY || 0);
  
  var i = 0;
  
  // Variable size altering grid if brush size ends in 0 or 5
  if (this.params.variableSize) {
    if (this.params.brushSize % 5 === 0) {
      i = this.steps;
    }
  }
  
  // Determine grid size (usually brush size unless variable size is enabled)
  var factor = Math.sin((i * Math.PI) / 180.0);
  var gridSize = this.params.brushSize * (1.0 + (0.5 * factor));
  
  var aligned = this.alignGridPoint(center, centroid, gridSize, gridSize);
  
  // Calculate shift vector
  var cX = centroid.getX();
  var cY = centroid.getY();
  var aX = aligned.getX();
  var aY = aligned.getY();
  var vector = new Point(aX - cX, aY - cY);
  
  // Move points by vector
  return this.movePoints(points, vector);
};

// Get centroid (average point) of a set of points
Brush.prototype.getCentroid = function(points) {
  if (points.length === 0) {
    return new Point(0, 0);
  }
  
  var sumX = 0;
  var sumY = 0;
  for (var i = 0; i < points.length; i++) {
    sumX += points[i].getX();
    sumY += points[i].getY();
  }
  
  return new Point(sumX / points.length, sumY / points.length);
};

// Scale points around a center point
Brush.prototype.scalePoints = function(center, points, factor) {
  var result = [];
  for (var i = 0; i < points.length; i++) {
    var p = points[i];
    var x = p.getX();
    var y = p.getY();
    var cX = center.getX();
    var cY = center.getY();
    
    // Scale relative to center
    var nX = ((x - cX) * factor) + cX;
    var nY = ((y - cY) * factor) + cY;
    result.push(new Point(nX, nY));
  }
  return result;
};

// Transform variable size (oscillates between 0.5 and 1.5 times size)
Brush.prototype.transformVariable = function() {
  if (!this.params.variableSize) {
    return;
  }
  
  // Use sin to oscillate between 0.5 and 1.5 times the shape's size
  var angleRad = (this.steps * Math.PI) / 180.0;
  var factor = 1 + (0.5 * Math.sin(angleRad));
  
  var centroid = this.getCentroid(this.posPoints);
  this.posPoints = this.scalePoints(centroid, this.posPoints, factor);
};

// Transform spinning (rotates points around their centroid)
Brush.prototype.transformSpinning = function() {
  if (!this.params.rotatingShape) {
    return;
  }
  
  // Rotate points around their centroid by the steps angle
  var angleRad = (this.steps * Math.PI) / 180.0;
  var centroid = this.getCentroid(this.posPoints);
  this.posPoints = this.rotatePoints(centroid, this.posPoints, angleRad);
};

// Align a point to a grid (utility function)
Brush.prototype.alignGridPoint = function(center, point, w, h) {
  var cX = center.getX();
  var cY = center.getY();
  var pX = point.getX();
  var pY = point.getY();
  var dX = (pX - cX) + (w / 2.0);
  var dY = (pY - cY) + (h / 2.0);
  var roundX = Math.floor(dX / w) * w;
  var roundY = Math.floor(dY / h) * h;
  var nX = roundX + cX;
  var nY = roundY + cY;
  return new Point(nX, nY);
};

// Move points by a vector
Brush.prototype.movePoints = function(points, vector) {
  var result = [];
  for (var i = 0; i < points.length; i++) {
    var p = points[i];
    var nX = p.getX() + vector.getX();
    var nY = p.getY() + vector.getY();
    result.push(new Point(nX, nY));
  }
  return result;
};

// Mirror points vertically around a center
Brush.prototype.verticalMirrorPoints = function(center, points) {
  var result = [];
  for (var i = 0; i < points.length; i++) {
    var p = points[i];
    var cY = center.getY();
    var nY = (2 * cY) - p.getY();
    result.push(new Point(p.getX(), nY));
  }
  return result;
};

// Mirror points horizontally around a center
Brush.prototype.horizontalMirrorPoints = function(center, points) {
  var result = [];
  for (var i = 0; i < points.length; i++) {
    var p = points[i];
    var cX = center.getX();
    var nX = (2 * cX) - p.getX();
    result.push(new Point(nX, p.getY()));
  }
  return result;
};

// Check if a point is inside a triangle
Brush.prototype.insideTriangle = function(point, triangle) {
  if (triangle.length < 3) return false;
  
  var pX = point.getX();
  var pY = point.getY();
  var pAX = triangle[0].getX();
  var pAY = triangle[0].getY();
  var pBX = triangle[1].getX();
  var pBY = triangle[1].getY();
  var pCX = triangle[2].getX();
  var pCY = triangle[2].getY();
  
  // Cross product test
  var cp1 = (pBX - pAX) * (pY - pAY) - (pBY - pAY) * (pX - pAX);
  var cp2 = (pCX - pBX) * (pY - pBY) - (pCY - pBY) * (pX - pBX);
  var cp3 = (pAX - pCX) * (pY - pCY) - (pAY - pCY) * (pX - pCX);
  
  return (cp1 * cp2 >= 0) && (cp2 * cp3 >= 0) && (cp3 * cp1 >= 0);
};

// Connect previous and current points
Brush.prototype.connectPosPre = function(ctx, color) {
  if (!this.params.connectBorders) {
    return;
  }
  // Connection logic would go here
};

// Finish stroke (override in children if needed)
Brush.prototype.finishStroke = function(ctx) {
  // Override in children
};

// Draw the brush - main entry point (like iOS)
Brush.prototype.draw = function(ctx, engine) {
  // Get color
  var color = engine.getColor();
  
  // Apply transformations
  this.transform();
  
  // Do connections if required (this will also rotate/mirror connections)
  this.connectPosPre(ctx, color, engine);
  
  // Draw (and Fill) the brush with rotation
  this.rotateBrush(ctx, color, engine);
};

// Rotate and draw the brush points
Brush.prototype.rotateBrush = function(ctx, color, engine) {
  var params = this.params;
  var points = this.posPoints;
  var rotations = params.rotationAmount;
  var center = new Point(engine.centerX, engine.centerY);
  var angle = 2 * Math.PI / rotations;
  
  for (var i = 0; i < rotations; i++) {
    var rotAngle = angle * i;
    
    // Rotate points around center
    var rotatedPoints = this.rotatePoints(center, points, rotAngle);
    
    // Draw rotated path
    this.drawPath(rotatedPoints, rotAngle, false, ctx, color, engine);
    
    // Mirror for symmetry if enabled
    if (params.symmetry) {
      var mirroredPoints = this.mirrorPoints(center, rotatedPoints);
      this.drawPath(mirroredPoints, rotAngle, true, ctx, color, engine);
    }
  }
};

// Rotate points around a center
Brush.prototype.rotatePoints = function(center, points, angle) {
  var result = [];
  for (var i = 0; i < points.length; i++) {
    var p = points[i];
    var x = p.getX() - center.getX();
    var y = p.getY() - center.getY();
    var xNew = x * Math.cos(angle) - y * Math.sin(angle);
    var yNew = x * Math.sin(angle) + y * Math.cos(angle);
    result.push(new Point(xNew + center.getX(), yNew + center.getY()));
  }
  return result;
};

// Mirror points horizontally around center
Brush.prototype.mirrorPoints = function(center, points) {
  var result = [];
  for (var i = 0; i < points.length; i++) {
    var p = points[i];
    var mirroredX = 2 * center.getX() - p.getX();
    result.push(new Point(mirroredX, p.getY()));
  }
  return result;
};

// Get path from points (can be overridden by children)
Brush.prototype.getPath = function(points, rotAngle, symmetry) {
  return Brush.getPathStatic(points, rotAngle, symmetry);
};

// Static method to create path from points
Brush.getPathStatic = function(points, rotAngle, symmetry) {
  // For now, return points array - will be converted to drawing commands
  return points;
};

// Draw path from points
Brush.prototype.drawPath = function(points, rotAngle, symmetry, ctx, color, engine) {
  var path = this.getPath(points, rotAngle, symmetry);
  if (!path) return;
  
  // Handle special path types (circle, chain)
  if (path.type === 'circle') {
    var p1 = path.points[0];
    var p2 = path.points[1];
    var centerX = (p1.getX() + p2.getX()) / 2;
    var centerY = (p1.getY() + p2.getY()) / 2;
    var radius = this.params.brushSize / 2;
    engine.drawCircle(centerX, centerY, radius, this.params.fillShape);
    return;
  }
  
  if (path.type === 'chain') {
    var p1 = path.points[0];
    var p2 = path.points[1];
    var centerX = (p1.getX() + p2.getX()) / 2;
    var centerY = (p1.getY() + p2.getY()) / 2;
    var dx = p1.getX() - p2.getX();
    var dy = p1.getY() - p2.getY();
    var radius = Math.sqrt(dx * dx + dy * dy) / 2;
    engine.drawCircle(centerX, centerY, radius, this.params.fillShape);
    return;
  }
  
  // Regular path - array of points
  if (!Array.isArray(path) || path.length === 0) return;
  
  // For shapes (3+ points), draw as closed path
  if (path.length >= 3) {
    engine.drawShape(path, this.params.fillShape);
  } else {
    // Draw lines between consecutive points
    if (path.length >= 2) {
      for (var i = 0; i < path.length - 1; i++) {
        var p1 = path[i];
        var p2 = path[i + 1];
        engine.drawLine(p1.getX(), p1.getY(), p2.getX(), p2.getY(), false);
      }
    }
  }
};

// Connect previous and current points (like iOS - uses rotateBrush for connections)
Brush.prototype.connectPosPre = function(ctx, color, engine) {
  if (!this.params.connectBorders) {
    return;
  }
  
  var prePoints = this.prePoints;
  var posPoints = this.posPoints;
  
  if (prePoints.length === 0 || posPoints.length === 0) {
    return;
  }
  
  // Connect corresponding points - each connection goes through rotateBrush
  // so it gets rotated and mirrored like the main brush (like iOS)
  var minLen = Math.min(prePoints.length, posPoints.length);
  for (var i = 0; i < minLen; i++) {
    var preP = prePoints[i];
    var posP = posPoints[i];
    // Create a 2-point path for the connection line
    var connectionPoints = [preP, posP];
    // Draw this connection with rotation/mirroring (like iOS Drawing.rotateBrush)
    this.rotateBrushForPoints(connectionPoints, ctx, color, engine);
  }
};

// Helper to rotate/mirror and draw a set of points (used for connections)
Brush.prototype.rotateBrushForPoints = function(points, ctx, color, engine) {
  var params = this.params;
  var rotations = params.rotationAmount;
  var center = new Point(engine.centerX, engine.centerY);
  var angle = 2 * Math.PI / rotations;
  
  for (var i = 0; i < rotations; i++) {
    var rotAngle = angle * i;
    
    // Rotate points around center
    var rotatedPoints = this.rotatePoints(center, points, rotAngle);
    
    // Draw rotated connection line
    if (rotatedPoints.length >= 2) {
      var p1 = rotatedPoints[0];
      var p2 = rotatedPoints[1];
      engine.drawLine(p1.getX(), p1.getY(), p2.getX(), p2.getY(), false);
    }
    
    // Mirror for symmetry if enabled
    if (params.symmetry) {
      var mirroredPoints = this.mirrorPoints(center, rotatedPoints);
      if (mirroredPoints.length >= 2) {
        var p1 = mirroredPoints[0];
        var p2 = mirroredPoints[1];
        engine.drawLine(p1.getX(), p1.getY(), p2.getX(), p2.getY(), false);
      }
    }
  }
};

