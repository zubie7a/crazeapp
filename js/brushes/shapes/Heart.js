// Heart brush - uses arcs (simplified for now)
function Heart(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Heart.prototype = Object.create(Brush.prototype);
Heart.prototype.constructor = Heart;

Heart.buildBrush = function(params, pointer) {
  var points = Heart.getStaticBrushPoints(params, pointer);
  return new Heart(params, points, pointer);
};

Heart.prototype.getBrushPoints = function(pointer) {
  return Heart.getStaticBrushPoints(this.params, pointer);
};

Heart.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var k = brushSize / 8;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1, d2 - j),
    new Point(d1 + i, d2 - j),
    new Point(d1, d2 + i - k),
    new Point(d1 - i, d2 - j)
  ];
};

// Override getPath to draw heart with arcs
Heart.prototype.getPath = function(points, rotAngle, symmetry) {
  if (points.length < 4) return points;
  
  var mirror = symmetry ? -1.0 : 1.0;
  var brushSize = this.distance(points[3], points[1]);
  
  var radiusSmall = brushSize / 4;
  
  // Top-left curve center
  var centerA = this.getCentroid([points[3], points[0]]);
  // Top-right curve center
  var centerB = this.getCentroid([points[0], points[1]]);
  
  var centerC = this.scalePoint(points[0], points[3], 0.5);
  centerC = this.rotatePoint(points[0], centerC, Math.PI / 2);
  var diff1 = this.pointDifference(points[0], centerC);
  diff1 = new Point(mirror * -1 * diff1.getX(), mirror * -1 * diff1.getY());
  centerC = new Point(points[3].getX() + diff1.getX(), points[3].getY() + diff1.getY());
  
  var centerD = this.scalePoint(points[0], points[1], 0.5);
  centerD = this.rotatePoint(points[0], centerD, Math.PI / 2);
  var diff2 = this.pointDifference(points[0], centerD);
  diff2 = new Point(mirror * diff2.getX(), mirror * diff2.getY());
  centerD = new Point(points[1].getX() + diff2.getX(), points[1].getY() + diff2.getY());
  
  var radiusLarge = this.distance(centerC, points[1]);
  
  var radians4th = 2 * Math.PI / 4.0;
  var offset = 0.0;
  
  // Account for spinning
  if (this.params.rotatingShape) {
    offset -= (mirror * (this.steps * Math.PI / 180.0));
  }
  
  // Account for rotation angle
  offset -= (mirror * rotAngle);
  
  var fixSector4ths = function(sector, sym) {
    if (!sym) return sector;
    if (sector === 2) return 4;
    if (sector === 4) return 2;
    return sector;
  };
  
  var fixAngle = function(angle, sym) {
    if (sym) return Math.PI - angle;
    return angle;
  };
  
  var sectorStart1 = fixSector4ths(2, symmetry);
  var sectorEnd1 = fixSector4ths(4, symmetry);
  
  var angleStart1 = fixAngle((90 - 29.475 - 46.219) * Math.PI / 180.0, symmetry);
  var angleEnd1 = fixAngle((90 - 29.475) * Math.PI / 180.0, symmetry);
  
  var angleStart2 = fixAngle((90.0 + 29.475) * Math.PI / 180.0, symmetry);
  var angleEnd2 = fixAngle((90.0 + 29.475 + 46.219) * Math.PI / 180.0, symmetry);
  
  // Build arcs in reverse order (for web Canvas compatibility)
  var arcs = [
    {
      center: centerD,
      radius: radiusLarge,
      startAngle: angleEnd2 - offset,
      endAngle: angleStart2 - offset,
      clockwise: symmetry
    },
    {
      center: centerC,
      radius: radiusLarge,
      startAngle: angleEnd1 - offset,
      endAngle: angleStart1 - offset,
      clockwise: symmetry
    },
    {
      center: centerB,
      radius: radiusSmall,
      startAngle: (sectorEnd1 * radians4th) - offset,
      endAngle: (sectorStart1 * radians4th) - offset,
      clockwise: symmetry
    },
    {
      center: centerA,
      radius: radiusSmall,
      startAngle: (sectorEnd1 * radians4th) - offset,
      endAngle: (sectorStart1 * radians4th) - offset,
      clockwise: symmetry
    }
  ];
  
  return {
    type: 'arcs',
    arcs: arcs,
    close: true
  };
};

// Override alignPoints for custom heart grid alignment
Heart.prototype.alignPoints = function(points, genCenter) {
  if (!genCenter || points.length === 0) {
    return points;
  }
  
  var center = new Point(this.params.centerX || 0, this.params.centerY || 0);
  var brushSize = this.params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 2;
  
  var h = i * 2;
  var w = j * 2;
  
  var fitPosCenter = this.alignGridPoint(center, genCenter, w, h);
  var posHeartPoints = Heart.getStaticBrushPoints(this.params, fitPosCenter);
  
  return posHeartPoints;
};

