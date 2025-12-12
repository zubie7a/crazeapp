// Insignia brush
function Insignia(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Insignia.prototype = Object.create(Brush.prototype);
Insignia.prototype.constructor = Insignia;

Insignia.buildBrush = function(params, pointer) {
  var points = Insignia.getStaticBrushPoints(params, pointer);
  return new Insignia(params, points, pointer);
};

Insignia.prototype.getBrushPoints = function(pointer) {
  return Insignia.getStaticBrushPoints(this.params, pointer);
};

Insignia.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  var d3 = Math.sqrt(3.0) * j;
  
  return [
    new Point(d1, d2),
    new Point(d1 + d3, d2 - j),
    new Point(d1 + d3, d2 + j),
    new Point(d1, d2 + i),
    new Point(d1 - d3, d2 + j),
    new Point(d1 - d3, d2 - j)
  ];
};

// Override alignPoints for custom insignia grid alignment
Insignia.prototype.alignPoints = function(points, genCenter) {
  if (!genCenter || points.length === 0) {
    return points;
  }
  
  var center = new Point(this.params.centerX || 0, this.params.centerY || 0);
  var brushSize = this.params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var d3 = Math.sqrt(3.0) * j;
  
  var h = i;
  var w = d3 * 2;
  
  var fitCenter = this.alignGridPoint(center, genCenter, w, h);
  var insigniaPoints = Insignia.getStaticBrushPoints(this.params, fitCenter);
  
  var fitX = fitCenter.getX();
  var fitY = fitCenter.getY();
  var shiftVector = new Point(0, 0);
  var found = false;
  
  // 1. Check if inside top-left
  if (!found) {
    var p1 = new Point(fitX - d3, fitY - j);
    var p2 = new Point(fitX, fitY - j);
    var p3 = new Point(fitX, fitY);
    var inside = this.insideTriangle(genCenter, [p1, p2, p3]);
    if (inside) {
      shiftVector = new Point(0, -j);
      found = true;
    }
  }
  
  // 2. Check if inside top-right
  if (!found) {
    var p1 = new Point(fitX, fitY - j);
    var p2 = new Point(fitX + d3, fitY - j);
    var p3 = new Point(fitX, fitY);
    var inside = this.insideTriangle(genCenter, [p1, p2, p3]);
    if (inside) {
      shiftVector = new Point(0, -j);
      found = true;
    }
  }
  
  if (!found) {
    shiftVector = new Point(0, j);
  }
  
  if (Math.floor(fitCenter.getX() / w) % 2 === 0) {
    insigniaPoints = this.rotatePoints(fitCenter, insigniaPoints, Math.PI);
  }
  insigniaPoints = this.movePoints(insigniaPoints, shiftVector);
  
  return insigniaPoints;
};

