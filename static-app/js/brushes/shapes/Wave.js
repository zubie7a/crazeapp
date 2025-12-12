// Wave brush - uses arcs (simplified for now)
function Wave(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Wave.prototype = Object.create(Brush.prototype);
Wave.prototype.constructor = Wave;

Wave.buildBrush = function(params, pointer) {
  var points = Wave.getStaticBrushPoints(params, pointer);
  return new Wave(params, points, pointer);
};

Wave.prototype.getBrushPoints = function(pointer) {
  return Wave.getStaticBrushPoints(this.params, pointer);
};

Wave.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1 - i, d2 - j),
    new Point(d1 + i, d2 - j),
    new Point(d1 + i, d2 + j),
    new Point(d1 - i, d2 + j)
  ];
};

// Override getPath to draw wave with arcs
Wave.prototype.getPath = function(points, rotAngle, symmetry) {
  if (points.length < 4) return points;
  
  var mirror = symmetry ? -1.0 : 1.0;
  var center = this.getCentroid(points);
  
  var middleTop = this.getCentroid([points[0], points[1]]);
  var c1 = this.getCentroid([points[3], middleTop]);
  var c2 = this.rotatePoint(middleTop, c1, Math.PI);
  var c3 = this.rotatePoint(center, c1, Math.PI);
  var c4 = this.rotatePoint(center, c2, Math.PI);
  
  var radius = this.distance(c1, points[0]);
  
  var radians4th = 2 * Math.PI / 4.0;
  var radians8th = 2 * Math.PI / 8.0;
  var offset = 0.0;
  
  // Account for spinning
  if (this.params.rotatingShape) {
    offset -= (mirror * (this.steps * Math.PI / 180.0));
  }
  
  // Account for rotation angle
  offset -= (mirror * rotAngle);
  
  var fixSector4ths = function(sector, sym) {
    if (!sym) return sector;
    if (sector === 3) return 4;
    if (sector === 4) return 3;
    if (sector === 1) return 2;
    if (sector === 2) return 1;
    return sector;
  };
  
  var sectorStart1 = fixSector4ths(3, symmetry);
  var sectorEnd1 = fixSector4ths(4, symmetry);
  var sectorStart2 = fixSector4ths(2, symmetry);
  var sectorEnd2 = fixSector4ths(1, symmetry);
  
  // Build arcs in reverse order (for web Canvas compatibility)
  var arcs = [
    {
      center: c4,
      radius: radius,
      startAngle: (sectorStart1 * radians4th) - radians8th - offset,
      endAngle: (sectorEnd1 * radians4th) - radians8th - offset,
      clockwise: !symmetry
    },
    {
      center: c3,
      radius: radius,
      startAngle: (sectorStart2 * radians4th) - radians8th - offset,
      endAngle: (sectorEnd2 * radians4th) - radians8th - offset,
      clockwise: symmetry
    },
    {
      center: c2,
      radius: radius,
      startAngle: (sectorEnd2 * radians4th) - radians8th - offset,
      endAngle: (sectorStart2 * radians4th) - radians8th - offset,
      clockwise: !symmetry
    },
    {
      center: c1,
      radius: radius,
      startAngle: (sectorEnd1 * radians4th) - radians8th - offset,
      endAngle: (sectorStart1 * radians4th) - radians8th - offset,
      clockwise: symmetry
    }
  ];
  
  return {
    type: 'arcs',
    arcs: arcs,
    lines: [points[2], points[0]],
    close: true
  };
};

