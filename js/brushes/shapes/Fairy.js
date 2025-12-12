// Fairy brush
function Fairy(params, points, pointer) {
  Brush.call(this, params, points, pointer);
}

Fairy.prototype = Object.create(Brush.prototype);
Fairy.prototype.constructor = Fairy;

Fairy.buildBrush = function(params, pointer) {
  var points = Fairy.getStaticBrushPoints(params, pointer);
  return new Fairy(params, points, pointer);
};

Fairy.prototype.getBrushPoints = function(pointer) {
  return Fairy.getStaticBrushPoints(this.params, pointer);
};

Fairy.getStaticBrushPoints = function(params, pointer) {
  var brushSize = params.brushSize;
  var i = brushSize / 2;
  var j = brushSize / 4;
  var k = brushSize / 8;
  var l = brushSize / 16;
  var d1 = pointer.getX();
  var d2 = pointer.getY();
  
  // Top-right wing
  var p1 = new Point(d1 + i, d2 - i);
  var p2 = new Point(d1 + i - k, d2 - k);
  var p3 = new Point(d1, d2);
  var points1 = [p1, p2, p3];
  
  // Bottom-right wing
  var p4 = new Point(d1 + k + l, d2 + l);
  var p5 = new Point(d1 + j, d2 + j);
  var p6 = new Point(d1 + l, d2 + k + l);
  var p7 = new Point(d1, d2);
  var points2 = [p4, p5, p6, p7];
  
  // Bottom-left wing
  var p8 = new Point(d1 - l, d2 + k + l);
  var p9 = new Point(d1 - j, d2 + j);
  var p10 = new Point(d1 - k - l, d2 + l);
  var p11 = new Point(d1, d2);
  var points3 = [p8, p9, p10, p11];
  
  // Top-left wing
  var p12 = new Point(d1 - i + k, d2 - k);
  var p13 = new Point(d1 - i, d2 - i);
  var p14 = new Point(d1, d2);
  var points4 = [p12, p13, p14];
  
  return points1.concat(points2).concat(points3).concat(points4);
};

// Override alignPoints for custom fairy grid alignment
Fairy.prototype.alignPoints = function(points, genCenter) {
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
  var vPosFactor = (fitPosCenter.getX() - center.getX()) / w;
  var posFairyUp = Math.floor(Math.abs(vPosFactor)) % 2 === 0;
  
  var posFairyPoints = Fairy.getStaticBrushPoints(this.params, fitPosCenter);
  if (!posFairyUp) {
    posFairyPoints = this.verticalMirrorPoints(fitPosCenter, posFairyPoints);
  }
  
  return posFairyPoints;
};

