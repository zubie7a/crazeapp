// Moon brush - uses arcs (simplified for now)
function Moon(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Moon.prototype = Object.create(Brush.prototype);
Moon.prototype.constructor = Moon;

Moon.buildBrush = function(params, pointer) {
  var points = Moon.getStaticBrushPoints(params, pointer);
  return new Moon(params, points, pointer);
};

Moon.prototype.getBrushPoints = function(pointer) {
  return Moon.getStaticBrushPoints(this.params, pointer);
};

Moon.getStaticBrushPoints = function(params, pointer) {
  // Same points as vertical brush
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  return [
    new Point(d1, d2 - i),
    new Point(d1, d2 + i)
  ];
};

// Override getPath to draw moon shape with arcs
Moon.prototype.getPath = function(points, rotAngle, symmetry) {
  if (points.length < 2) return points;
  
  var mirror = symmetry ? -1.0 : 1.0;
  var radius = this.distanceFromPoints(points) / 2;
  
  var centerA = this.getCentroid(points);
  var centerB = this.scalePoint(centerA, points[0], 5/16 * mirror);
  centerB = this.rotatePoint(centerA, centerB, 2 * Math.PI / 4);
  
  var radians6th = 2 * Math.PI / 6.0;
  var radians24th = 2 * Math.PI / 24.0;
  var offset = 2 * Math.PI / 12.0;
  
  // Account for spinning
  if (this.params.rotatingShape) {
    offset -= (mirror * (this.steps * Math.PI / 180.0));
  }
  
  // Account for rotation angle
  offset -= (mirror * rotAngle);
  
  var fixSector = function(sector, sym) {
    if (!sym) return sector;
    if (sector === 3) return 1;
    if (sector === 1 || sector === 7) return 3;
    if (sector === 4) return 6;
    if (sector === 6) return 4;
    return sector;
  };
  
  var sectorA = fixSector(1, symmetry);
  var sectorB = fixSector(6, symmetry);
  
  // Build arcs in reverse order (for web Canvas compatibility)
  var arcs = [
    {
      center: centerB,
      radius: 3 * radius / 4.0,
      startAngle: (sectorA * radians6th) - offset + (mirror * radians24th),
      endAngle: (sectorB * radians6th) - offset - (mirror * radians24th),
      clockwise: !symmetry
    },
    {
      center: centerA,
      radius: radius,
      startAngle: (sectorB * radians6th) - offset,
      endAngle: (sectorA * radians6th) - offset,
      clockwise: symmetry
    }
  ];
  
  return {
    type: 'arcs',
    arcs: arcs
  };
};

