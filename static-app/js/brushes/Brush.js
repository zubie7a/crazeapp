// Base Brush class - all brushes extend this
function Brush(params, points, pointer) {
  // The points that describe the brush at the current position
  this.posPoints = points || [];
  // The points that describe the brush at the previous position
  this.prePoints = [];
  // The parameters at the time this brush was created
  this.params = params;
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
  // Alignment logic would go here - simplified for now
  // Full implementation would use Maths utilities
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

