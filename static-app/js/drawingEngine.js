// Drawing Engine - Ported from original CraZe app
// No modules - plain JavaScript that works with file:// URLs

// Brush types
var BRUSHES = {
  REGULAR_LINE: 1,
  LINES_FROM_START: 2,
  VERTICAL_LINES: 3,
  HORIZONTAL_LINES: 4,
  GREAT_CROSS: 5,
  TRIANGLES: 6,
  SQUARES: 7,
  CIRCLES: 8,
  CHAIN: 9,
  TANGENT: 10,
};

// Palette types
var PALETTES = {
  MANUAL: 1,
  RAINBOW: 2,
  FIRE: 3,
  ICE: 4,
  NATURE: 5,
  MYSTIC: 6,
  BOREALIS: 7,
  GRAYSCALE: 8,
  FOXES: 9,
};

// Palette generators
function generateRainbowPalette() {
  var rr = 255, gg = 0, bb = 0;
  var colArray = [];
  for (var i = 0; i < 1536; ++i) {
    if (rr === 255 && gg !== 255 && bb === 0) gg++;
    if (rr !== 0 && gg === 255 && bb === 0) rr--;
    if (rr === 0 && gg === 255 && bb !== 255) bb++;
    if (rr === 0 && gg !== 0 && bb === 255) gg--;
    if (rr !== 255 && gg === 0 && bb === 255) rr++;
    if (rr === 255 && gg === 0 && bb !== 0) bb--;
    colArray.push({ r: rr, g: gg, b: bb });
  }
  return colArray;
}

function generateFirePalette() {
  var rr = 255, gg = 0, bb = 0;
  var colArray = [];
  for (var i = 0; i < 512; ++i) {
    if (i < 255) gg++;
    if (i >= 255) gg--;
    colArray.push({ r: rr, g: gg, b: bb });
  }
  return colArray;
}

function generateIcePalette() {
  var rr = 0, gg = 0, bb = 255;
  var colArray = [];
  for (var i = 0; i < 1024; ++i) {
    if (i < 255) gg++;
    else if (i < 512) rr++;
    else if (i < 768) rr--;
    else if (i < 1024) gg--;
    colArray.push({ r: rr, g: gg, b: bb });
  }
  return colArray;
}

function generateNaturePalette() {
  var rr = 0, gg = 255, bb = 128;
  var colArray = [];
  for (var i = 0; i < 256; ++i) {
    if (i < 64) gg--;
    else if (i < 128) gg++;
    else if (i < 192) gg--;
    else gg++;
    if (i < 128) { rr++; bb--; }
    if (i >= 128) { rr--; bb++; }
    colArray.push({ r: rr, g: gg, b: bb });
  }
  return colArray;
}

function generateMysticPalette() {
  var rr = 128, gg = 0, bb = 255;
  var colArray = [];
  for (var i = 0; i < 768; ++i) {
    if (i < 128) rr++;
    else if (i < 384) gg++;
    else if (i < 640) gg--;
    else if (i < 768) rr--;
    colArray.push({ r: rr, g: gg, b: bb });
  }
  return colArray;
}

function generateBorealisPalette() {
  var rr = 0, gg = 255, bb = 0;
  var colArray = [];
  for (var i = 0; i < 1024; ++i) {
    if (i < 255) bb++;
    else if (i < 512) { gg--; rr++; }
    else if (i < 768) { gg++; rr--; }
    else bb--;
    colArray.push({ r: rr, g: gg, b: bb });
  }
  return colArray;
}

function generateGrayscalePalette() {
  var rr = 255, gg = 255, bb = 255;
  var colArray = [];
  for (var i = 0; i < 512; ++i) {
    if (i < 255) { rr--; gg--; bb--; }
    if (i >= 255) { rr++; gg++; bb++; }
    colArray.push({ r: rr, g: gg, b: bb });
  }
  return colArray;
}

function generateFoxesPalette() {
  var rr = 127, gg = 0, bb = 255;
  var colArray = [];
  for (var i = 0; i < 1280; ++i) {
    if (i < 128) rr++;
    else if (i < 640) {
      if (rr === 255 && gg === 0 && bb !== 0) bb--;
      if (rr === 255 && gg !== 255 && bb === 0) gg++;
    } else if (i < 1152) {
      if (rr === 255 && gg === 0 && bb !== 255) bb++;
      if (rr === 255 && gg !== 0 && bb === 0) gg--;
    } else rr--;
    colArray.push({ r: rr, g: gg, b: bb });
  }
  return colArray;
}

function getPaletteGenerator(paletteType) {
  switch (paletteType) {
    case PALETTES.RAINBOW: return generateRainbowPalette;
    case PALETTES.FIRE: return generateFirePalette;
    case PALETTES.ICE: return generateIcePalette;
    case PALETTES.NATURE: return generateNaturePalette;
    case PALETTES.MYSTIC: return generateMysticPalette;
    case PALETTES.BOREALIS: return generateBorealisPalette;
    case PALETTES.GRAYSCALE: return generateGrayscalePalette;
    case PALETTES.FOXES: return generateFoxesPalette;
    default: return null;
  }
}

// Point class
function Point(px, py) {
  this._x = px;
  this._y = py;
}
Point.prototype.x = function() { return this._x; };
Point.prototype.y = function() { return this._y; };

// Bresenham Line Algorithm
function bresenhamLine(xa, ya, xb, yb) {
  var x1 = xa, x2 = xb, y1 = ya, y2 = yb;
  var result = [];
  var m;
  var dy = y2 - y1;
  var dx = x2 - x1;

  if (x1 === x2) {
    m = 2142;
  } else {
    m = dy / dx;
  }

  var dir = m < 0 ? -1 : 1;
  var absDy = Math.abs(dy);
  var absDx = Math.abs(dx);

  if (Math.abs(m) > 1) {
    var temp = absDx;
    absDx = absDy;
    absDy = temp;
    temp = x1; x1 = y1; y1 = temp;
    temp = x2; x2 = y2; y2 = temp;
  }

  if (x2 < x1) {
    var temp = x2; x2 = x1; x1 = temp;
    temp = y2; y2 = y1; y1 = temp;
  }

  var d = 2 * absDy - absDx;
  var incE = 2 * absDy;
  var incNE = 2 * absDy - 2 * absDx;

  while (absDx > 0) {
    if (d <= 0) {
      d += incE;
    } else {
      d += incNE;
      y1 += dir;
    }
    if (Math.abs(m) > 1) {
      result.push(new Point(y1, x1));
    } else {
      result.push(new Point(x1, y1));
    }
    absDx--;
    x1++;
  }
  return result;
}

// Bresenham Circle Algorithm
function bresenhamCircle(xa, ya, xb, yb) {
  var x1 = xa, x2 = xb, y1 = ya, y2 = yb;
  var dx = x2 - x1;
  var dy = y2 - y1;
  var rad = Math.sqrt(dx * dx + dy * dy);
  var x = 0;
  var y = Math.floor(Math.round(rad));
  var o1 = [], o2 = [], o3 = [], o4 = [];
  var o5 = [], o6 = [], o7 = [], o8 = [];
  var d = 3 - 2 * rad;

  while (x <= y) {
    o1.push(new Point(x + x2, y + y2));
    o2.push(new Point(y + x2, x + y2));
    o3.push(new Point(y + x2, -x + y2));
    o4.push(new Point(x + x2, -y + y2));
    o5.push(new Point(-x + x2, -y + y2));
    o6.push(new Point(-y + x2, -x + y2));
    o7.push(new Point(-y + x2, x + y2));
    o8.push(new Point(-x + x2, y + y2));
    if (d < 0) {
      d += 4 * x + 6;
    } else {
      d += 4 * (x - y) + 10;
      y--;
    }
    x++;
  }

  var result = [];
  for (var i = 0; i < o1.length; ++i) result.push(o1[i]);
  for (var i = o2.length - 1; i >= 0; --i) result.push(o2[i]);
  for (var i = 0; i < o3.length; ++i) result.push(o3[i]);
  for (var i = o4.length - 1; i >= 0; --i) result.push(o4[i]);
  for (var i = 0; i < o5.length; ++i) result.push(o5[i]);
  for (var i = o6.length - 1; i >= 0; --i) result.push(o6[i]);
  for (var i = 0; i < o7.length; ++i) result.push(o7[i]);
  for (var i = o8.length - 1; i >= 0; --i) result.push(o8[i]);
  return result;
}

// Drawing Engine Class
function DrawingEngine(canvas) {
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');

  // Default settings
  this.settings = {
    brush: BRUSHES.REGULAR_LINE,
    brushSize: 50,
    thickness: 2,
    rotationAmount: 6,
    palette: PALETTES.RAINBOW,
    r: 255,
    g: 0,
    b: 0,
    alpha: 100,
    symmetry: true,
    variableSize: false,
    rotatingShape: false,
    connectBorders: false,
    fillShape: false,
    fadingImage: true,
    fitToGrid: false,
    perspectiveSize: false,
  };

  // Drawing state
  this.drawing = false;
  this.x1 = 0; this.y1 = 0;
  this.x2 = 0; this.y2 = 0;
  this.aX = 0; this.aY = 0;

  // Rotation state
  this.brushRotD = 0;
  this.dir = true;
  this.currentBrushSize = this.settings.brushSize;

  // Shape storage
  this.posX = [];
  this.posY = [];
  this.preX = [];
  this.preY = [];

  // Palette state
  this.colArray = [];
  this.place = 0;
  this.fadeCount = 0;
  this.triDir = 1;

  // Center
  this.centerX = canvas.width / 2;
  this.centerY = canvas.height / 2;

  // Undo/redo stacks
  this.undoStack = [];
  this.redoStack = [];

  // Initialize
  this.initializePalette();
  this.ctx.lineWidth = this.settings.thickness;
}

DrawingEngine.prototype.initializePalette = function() {
  var generator = getPaletteGenerator(this.settings.palette);
  if (generator) {
    this.colArray = generator();
    this.place = 0;
  }
};

DrawingEngine.prototype.updateSetting = function(key, value) {
  var paletteChanged = key === 'palette' && this.settings.palette !== value;
  this.settings[key] = value;

  if (paletteChanged) {
    this.initializePalette();
  }
  if (key === 'thickness') {
    this.ctx.lineWidth = value;
  }
};

DrawingEngine.prototype.setCenter = function(x, y) {
  this.centerX = x;
  this.centerY = y;
};

DrawingEngine.prototype.resetCenter = function() {
  this.centerX = this.canvas.width / 2;
  this.centerY = this.canvas.height / 2;
};

DrawingEngine.prototype.getColor = function() {
  var settings = this.settings;
  if (settings.palette === PALETTES.MANUAL) {
    return 'rgba(' + settings.r + ',' + settings.g + ',' + settings.b + ',' + (settings.alpha / 100) + ')';
  }
  if (this.colArray.length > 0) {
    var col = this.colArray[this.place];
    return 'rgba(' + col.r + ',' + col.g + ',' + col.b + ',' + (settings.alpha / 100) + ')';
  }
  return 'rgba(' + settings.r + ',' + settings.g + ',' + settings.b + ',' + (settings.alpha / 100) + ')';
};

DrawingEngine.prototype.shiftColor = function() {
  if (this.settings.palette > 1 && this.colArray.length > 0) {
    this.place = (this.place + 5) % this.colArray.length;
  }
};

DrawingEngine.prototype.varySize = function() {
  var settings = this.settings;
  if (settings.variableSize) {
    var maxSize = settings.brushSize * 1.5;
    var minSize = settings.brushSize * 0.5;
    if (this.currentBrushSize < maxSize && this.dir) {
      this.currentBrushSize++;
    } else if (this.dir) {
      this.dir = false;
    }
    if (this.currentBrushSize > minSize && !this.dir) {
      this.currentBrushSize--;
    } else if (!this.dir) {
      this.dir = true;
    }
  }
  if (settings.perspectiveSize) {
    this.currentBrushSize = settings.brushSize;
    var dx = this.x1 - this.centerX;
    var dy = this.y1 - this.centerY;
    var dist = Math.sqrt(dx * dx + dy * dy) / 200;
    this.currentBrushSize *= dist;
  }
};

DrawingEngine.prototype.varyRotation = function() {
  if (this.settings.rotatingShape) {
    this.brushRotD = (this.brushRotD + 1) % 359;
  }
};

DrawingEngine.prototype.fadeDrawing = function() {
  if (this.settings.brush === BRUSHES.REGULAR_LINE && this.settings.fillShape) return;
  this.fadeCount++;
  if (this.fadeCount > 30 && this.settings.fadingImage) {
    var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      data[i] *= 0.9;
      data[i + 1] *= 0.9;
      data[i + 2] *= 0.9;
    }
    this.ctx.putImageData(imageData, 0, 0);
    this.fadeCount = 0;
  }
};

DrawingEngine.prototype.modifier = function() {
  this.shiftColor();
  this.varySize();
  this.varyRotation();
  this.fadeDrawing();
};

DrawingEngine.prototype.drawLine = function(xi, yi, xf, yf, fill) {
  this.ctx.strokeStyle = this.getColor();
  this.ctx.shadowColor = this.getColor();
  this.ctx.shadowBlur = fill ? 0 : 0;
  this.ctx.beginPath();
  this.ctx.moveTo(xi, yi);
  this.ctx.lineTo(xf, yf);
  this.ctx.stroke();
  this.ctx.closePath();
};

DrawingEngine.prototype.drawCircle = function(x, y, radius, fill) {
  this.ctx.strokeStyle = this.getColor();
  this.ctx.shadowColor = this.getColor();
  this.ctx.shadowBlur = fill ? 0 : 2;
  this.ctx.beginPath();
  this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  this.ctx.closePath();
  if (fill) {
    var fillbak = this.ctx.fillStyle;
    this.ctx.fillStyle = this.ctx.strokeStyle;
    this.ctx.fill();
    this.ctx.fillStyle = fillbak;
  } else {
    this.ctx.stroke();
  }
};

DrawingEngine.prototype.store = function(mx2, my2, mx1, my1) {
  this.posX.push(mx1);
  this.posY.push(my1);
  this.posX.push(mx2);
  this.posY.push(my2);
};

DrawingEngine.prototype.rotateLine = function() {
  var settings = this.settings;
  var rotable = [BRUSHES.VERTICAL_LINES, BRUSHES.HORIZONTAL_LINES, BRUSHES.GREAT_CROSS,
    BRUSHES.TRIANGLES, BRUSHES.SQUARES, BRUSHES.CIRCLES, BRUSHES.CHAIN].indexOf(settings.brush) !== -1;

  if (settings.rotatingShape && rotable) {
    var brushRotR = this.brushRotD * Math.PI / 180;
    var x1rot = this.x1 - this.aX;
    var y1rot = this.y1 - this.aY;
    var y2rot = this.y2 - this.aY;
    var x2rot = this.x2 - this.aX;

    var x1new = x1rot * Math.cos(brushRotR) - y1rot * Math.sin(brushRotR);
    var y1new = x1rot * Math.sin(brushRotR) + y1rot * Math.cos(brushRotR);
    var x2new = x2rot * Math.cos(brushRotR) - y2rot * Math.sin(brushRotR);
    var y2new = x2rot * Math.sin(brushRotR) + y2rot * Math.cos(brushRotR);

    this.x1 = x1new + this.aX;
    this.y1 = y1new + this.aY;
    this.x2 = x2new + this.aX;
    this.y2 = y2new + this.aY;
  }
};

DrawingEngine.prototype.drawr = function(xi, yi, xf, yf) {
  var settings = this.settings;

  if (settings.brush !== BRUSHES.CIRCLES && settings.brush !== BRUSHES.CHAIN) {
    this.drawLine(xi, yi, xf, yf, settings.fillShape);
    if (settings.symmetry) {
      this.drawLine(2 * this.centerX - xf, yf, 2 * this.centerX - xi, yi, settings.fillShape);
    }
  }

  if (settings.brush === BRUSHES.CIRCLES || settings.brush === BRUSHES.CHAIN) {
    var xx = (xi + xf) / 2;
    var yy = (yi + yf) / 2;
    var radius;
    if (settings.brush === BRUSHES.CIRCLES) {
      radius = this.currentBrushSize / 2;
    } else {
      var dx = xi - xf;
      var dy = yi - yf;
      radius = Math.sqrt(dx * dx + dy * dy) / 2;
    }
    this.drawCircle(xx, yy, radius, settings.fillShape);
    if (settings.symmetry) {
      this.drawCircle(2 * this.centerX - xx, yy, radius, settings.fillShape);
    }
  }
};

DrawingEngine.prototype.liner = function() {
  var settings = this.settings;
  var angle = 2 * Math.PI / settings.rotationAmount;

  var x1rot = this.x1 - this.centerX;
  var y1rot = this.y1 - this.centerY;
  var x2rot = this.x2 - this.centerX;
  var y2rot = this.y2 - this.centerY;

  this.rotateLine();

  for (var i = 0; i < settings.rotationAmount; ++i) {
    var x1new = x1rot * Math.cos(angle) - y1rot * Math.sin(angle);
    var y1new = x1rot * Math.sin(angle) + y1rot * Math.cos(angle);
    var x2new = x2rot * Math.cos(angle) - y2rot * Math.sin(angle);
    var y2new = x2rot * Math.sin(angle) + y2rot * Math.cos(angle);

    x1rot = x1new;
    y1rot = y1new;
    x2rot = x2new;
    y2rot = y2new;

    this.drawr(x2new + this.centerX, y2new + this.centerY, x1new + this.centerX, y1new + this.centerY);

    if (settings.connectBorders || settings.fillShape) {
      if (settings.brush === BRUSHES.REGULAR_LINE) {
        this.store(x1new + this.centerX, y1new + this.centerY, x2new + this.centerX, y2new + this.centerY);
      } else {
        this.store(x2new + this.centerX, y2new + this.centerY, x1new + this.centerX, y1new + this.centerY);
      }
    }
  }
};

DrawingEngine.prototype.connecter = function() {
  if (this.settings.connectBorders) {
    for (var i = 0; i < this.preX.length; ++i) {
      this.drawr(this.preX[i], this.preY[i], this.posX[i], this.posY[i]);
    }
  }
  this.preX = this.posX.slice();
  this.preY = this.posY.slice();
  this.posX = [];
  this.posY = [];
};

DrawingEngine.prototype.filler = function(fillnum) {
  var settings = this.settings;
  if (!settings.fillShape) return;

  var filX = this.posX.slice();
  var filY = this.posY.slice();

  var fillbak = this.ctx.fillStyle;
  this.ctx.fillStyle = this.ctx.strokeStyle;

  for (var j = 0; j < settings.rotationAmount; j++) {
    this.ctx.beginPath();
    var f = 0;
    for (var i = j * 2; f < fillnum; i += settings.rotationAmount * 2) {
      this.ctx.lineTo(filX[i], filY[i]);
      this.ctx.lineTo(filX[i + 1], filY[i + 1]);
      f++;
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  if (settings.symmetry) {
    for (var j = 0; j < settings.rotationAmount; j++) {
      this.ctx.beginPath();
      var f = 0;
      for (var i = j * 2; f < fillnum; i += settings.rotationAmount * 2) {
        this.ctx.lineTo(2 * this.centerX - filX[i], filY[i]);
        this.ctx.lineTo(2 * this.centerX - filX[i + 1], filY[i + 1]);
        f++;
      }
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    }
  }

  this.ctx.fillStyle = fillbak;
};

DrawingEngine.prototype.setSeed = function(h1, w1, h2, w2) {
  this.y1 = this.aY + h1 * this.currentBrushSize / 2;
  this.x1 = this.aX + w1 * this.currentBrushSize / 2;
  this.y2 = this.aY + h2 * this.currentBrushSize / 2;
  this.x2 = this.aX + w2 * this.currentBrushSize / 2;
};

DrawingEngine.prototype.fitToGrid = function() {
  if (!this.settings.fitToGrid) return;

  var settings = this.settings;
  var cY = this.canvas.height / 2;
  var cX = this.canvas.width / 2;
  var height = settings.brushSize;
  var base = height;

  if (settings.brush === BRUSHES.TRIANGLES) {
    base = height * Math.sqrt(4.0 / 3.0);
  }

  var dY = this.aY - cY;
  var dX = this.aX - cX;

  this.aY = Math.floor(dY / height) * height + cY;
  this.aX = Math.floor(dX / base) * base + cX;

  if (this.aY + height / 2 < this.aY + dY % height) {
    this.aY += height;
  }
  if (this.aX + base / 2 < this.aX + dX % base) {
    this.aX += base;
  }

  var heightMultiple = Math.abs((this.aY - cY) / height);
  if (settings.brush === BRUSHES.TRIANGLES && !settings.rotatingShape) {
    this.triDir = heightMultiple % 2 === 0 ? 1 : -1;
  } else {
    this.triDir = 1;
  }
};

DrawingEngine.prototype.parallels = function(dir, dist) {
  var sign = dir ? 1 : -1;
  var pt = { x: this.x1, y: this.y1 };
  var sl = 0;

  if (this.y1 === this.y2) sl = 100000;
  else if (this.x1 === this.x2) sl = -100000;
  else sl = (this.y1 - this.y2) / (this.x1 - this.x2);

  var point = this.alongLine(dist, sl, pt, sign, true);
  var p1 = this.alongLine(this.currentBrushSize, sl, point, 1, false);
  var p2 = this.alongLine(this.currentBrushSize, sl, point, -1, false);

  this.x1 = p1.x; this.y1 = p1.y;
  this.x2 = p2.x; this.y2 = p2.y;
};

DrawingEngine.prototype.alongLine = function(distance, slope, point, sign, part) {
  var p = { x: null, y: null };
  if (100000 !== Math.abs(slope)) {
    var s = part ? 1 / slope : slope;
    p.x = point.x - (sign * distance) / Math.sqrt(1 + s * s);
    p.y = s * (p.x - point.x) + point.y;
  } else {
    if (part) {
      if (slope > 0) { p.x = point.x; p.y = point.y + sign * distance; }
      else { p.y = point.y; p.x = point.x + sign * distance; }
    } else {
      if (slope > 0) { p.y = point.y; p.x = point.x + sign * distance; }
      else { p.x = point.x; p.y = point.y + sign * distance; }
    }
  }
  return p;
};

// Undo/Redo
DrawingEngine.prototype.pushUndo = function() {
  var undoCnv = document.createElement('canvas');
  undoCnv.width = this.canvas.width;
  undoCnv.height = this.canvas.height;
  var ctx = undoCnv.getContext('2d');
  ctx.drawImage(this.canvas, 0, 0);
  this.undoStack.push(undoCnv);
  if (this.undoStack.length > 10) {
    this.undoStack.shift();
  }
};

DrawingEngine.prototype.clearRedo = function() {
  this.redoStack = [];
};

DrawingEngine.prototype.undo = function() {
  if (this.undoStack.length === 0) return false;
  var redoCnv = document.createElement('canvas');
  redoCnv.width = this.canvas.width;
  redoCnv.height = this.canvas.height;
  var redoCtx = redoCnv.getContext('2d');
  redoCtx.drawImage(this.canvas, 0, 0);
  this.redoStack.push(redoCnv);

  var undoCnv = this.undoStack.pop();
  this.ctx.drawImage(undoCnv, 0, 0);
  return true;
};

DrawingEngine.prototype.redo = function() {
  if (this.redoStack.length === 0) return false;
  this.pushUndo();
  var redoCnv = this.redoStack.pop();
  this.ctx.drawImage(redoCnv, 0, 0);
  return true;
};

// Mouse handlers
DrawingEngine.prototype.onMouseDown = function(x, y) {
  this.pushUndo();
  this.clearRedo();

  this.x2 = this.x1 = x;
  this.y2 = this.y1 = y;

  this.currentBrushSize = this.settings.brushSize;
  this.brushRotD = 0;
  this.dir = true;
  this.drawing = true;

  this.posX = [];
  this.posY = [];
  this.preX = [];
  this.preY = [];

  this.onMouseMove(x, y);
};

DrawingEngine.prototype.onMouseUp = function() {
  var settings = this.settings;
  if (settings.brush === BRUSHES.REGULAR_LINE && settings.fillShape) {
    var len = this.posX.length / 2;
    this.filler(len);
    this.posX = [];
    this.posY = [];
  }
  this.drawing = false;
};

DrawingEngine.prototype.onMouseMove = function(x, y) {
  if (!this.drawing) return;

  this.aX = this.x1 = x;
  this.aY = this.y1 = y;

  this.modifier();

  var settings = this.settings;
  var t = Math.sqrt(4.0 / 3.0);

  switch (settings.brush) {
    case BRUSHES.REGULAR_LINE:
      this.liner();
      this.setSeed(0, 0, 0, 0);
      break;

    case BRUSHES.LINES_FROM_START:
      this.fitToGrid();
      this.liner();
      this.connecter();
      if (settings.fitToGrid) this.setSeed(0, 0, 0, 0);
      break;

    case BRUSHES.VERTICAL_LINES:
      this.fitToGrid();
      this.setSeed(1, 0, -1, 0);
      this.liner();
      this.connecter();
      break;

    case BRUSHES.HORIZONTAL_LINES:
      this.fitToGrid();
      this.setSeed(0, 1, 0, -1);
      this.liner();
      this.connecter();
      break;

    case BRUSHES.GREAT_CROSS:
      this.fitToGrid();
      this.setSeed(0, 1, 0, -1);
      this.liner();
      this.setSeed(1, 0, -1, 0);
      this.liner();
      this.connecter();
      break;

    case BRUSHES.TRIANGLES:
      this.fitToGrid();
      this.setSeed(-1 * this.triDir, 0, 1 * this.triDir, -t * this.triDir);
      this.liner();
      this.setSeed(1 * this.triDir, -t * this.triDir, 1 * this.triDir, t * this.triDir);
      this.liner();
      this.setSeed(1 * this.triDir, t * this.triDir, -1 * this.triDir, 0);
      this.liner();
      this.filler(3);
      this.connecter();
      break;

    case BRUSHES.SQUARES:
      this.fitToGrid();
      this.setSeed(-1, -1, -1, 1);
      this.liner();
      this.setSeed(-1, 1, 1, 1);
      this.liner();
      this.setSeed(1, 1, 1, -1);
      this.liner();
      this.setSeed(1, -1, -1, -1);
      this.liner();
      this.filler(4);
      this.connecter();
      break;

    case BRUSHES.CIRCLES:
      this.fitToGrid();
      this.setSeed(0, 1, 0, -1);
      this.liner();
      this.setSeed(1, 0, -1, 0);
      this.liner();
      this.connecter();
      break;

    case BRUSHES.CHAIN:
      this.liner();
      this.setSeed(0, 0, 0, 0);
      break;

    case BRUSHES.TANGENT:
      var _x1 = this.x1, _y1 = this.y1, _x2 = this.x2, _y2 = this.y2;
      this.parallels(true, 0);
      this.liner();
      this.x1 = _x1; this.y1 = _y1; this.x2 = _x2; this.y2 = _y2;
      this.setSeed(0, 0, 0, 0);
      break;
  }
};

DrawingEngine.prototype.clearCanvas = function() {
  this.ctx.globalAlpha = 1.0;
  this.ctx.fillStyle = '#000000';
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  this.undoStack = [];
  this.redoStack = [];
};

DrawingEngine.prototype.resizeCanvas = function(width, height) {
  this.canvas.width = width;
  this.canvas.height = height;
  this.clearCanvas();
  this.resetCenter();
};

// CraZe Mode Controller
function CrazeModeController(engine) {
  this.engine = engine;
  this.active = false;
  this.intervalId = null;
  this.point = { x: 0, y: 0 };
  this.stage = true;
}

CrazeModeController.prototype.start = function() {
  if (this.active) {
    this.stop();
    return false;
  }

  this.active = true;
  this.point.x = this.engine.canvas.width / 2;
  this.point.y = this.engine.canvas.height / 2;
  this.engine.onMouseDown(this.point.x, this.point.y);

  var self = this;
  this.intervalId = setInterval(function() { self.move(); }, 1);
  return true;
};

CrazeModeController.prototype.stop = function() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
  this.active = false;
  this.engine.onMouseUp();
};

CrazeModeController.prototype.move = function() {
  var fade = this.engine.settings.fadingImage;
  var dis = fade ? 20 : 11;
  if (!this.stage) dis *= 3;

  var dx = Math.floor(Math.random() * dis);
  var dy = Math.floor(Math.random() * dis);
  dx *= Math.random() * 2 > 1 ? 1 : -1;
  dy *= Math.random() * 2 > 1 ? 1 : -1;

  var width = this.engine.canvas.width;
  var height = this.engine.canvas.height;

  if (this.point.x + dx >= width || this.point.x + dx <= 0) dx *= -1;
  if (this.point.y + dy >= height || this.point.y + dy <= 0) dy *= -1;

  var x1 = this.point.x;
  var y1 = this.point.y;

  var points = this.stage
    ? bresenhamCircle(x1, y1, x1 + dx, y1 + dy)
    : bresenhamLine(x1, y1, x1 + dx, y1 + dy);

  if (points.length === 0) return;

  var index = 0;
  var minn = 1000000;

  if (this.stage) {
    var start = dx > 0 ? 0 : points.length - 1;
    var end = points.length / 2;
    var inc = dx > 0 ? 1 : -1;

    for (var i = start; dx > 0 ? i < end : i >= end; i += inc) {
      var n = points[i];
      var ddx = n.x() - x1;
      var ddy = n.y() - y1;
      var rad = Math.sqrt(ddx * ddx + ddy * ddy);
      if (rad < minn) {
        index = i;
        minn = rad;
      }
    }
  } else {
    index = x1 < x1 + dx ? 0 : points.length - 1;
  }

  var step = 3;
  var self = this;
  if (x1 < x1 + dx) {
    for (var i = index; i < points.length; i += step) {
      var p = points[i];
      if (p.x() > width || p.y() > height || p.x() < 0 || p.y() < 0) break;
      this.point.x = p.x();
      this.point.y = p.y();
      this.engine.onMouseMove(this.point.x, this.point.y);
      if (this.stage && i + 5 >= points.length) i = 0;
      if (this.stage && Math.floor(Math.random() * 20 + 1) === 1) break;
    }
  } else {
    for (var i = index; i >= 0; i -= step) {
      var p = points[i];
      if (p.x() > width || p.y() > height || p.x() < 0 || p.y() < 0) break;
      this.point.x = p.x();
      this.point.y = p.y();
      this.engine.onMouseMove(this.point.x, this.point.y);
      if (this.stage && i - 5 < 0) i = points.length - 1;
      if (this.stage && Math.floor(Math.random() * 20 + 1) === 1) break;
    }
  }

  this.stage = !this.stage;
};
