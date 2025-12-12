// Drawing Engine - Ported from original CraZe app
// No modules - plain JavaScript that works with file:// URLs

// Brush types - matching iOS indices (0-42)
var BRUSHES = {
  LINES: 0,
  RADIANT: 1,
  VERTICAL_LINES: 2,
  HORIZONTAL_LINES: 3,
  GREAT_CROSS: 4,
  TRIANGLES: 5,
  SQUARES: 6,
  DIAMOND: 7,
  HEXAGON: 8,
  SNOWFLAKE: 9,
  FLOWER: 10,
  MOON: 11,
  CIRCLES: 12,
  CHAIN: 13,
  INSIGNIA: 14,
  FOUR_STAR: 15,
  SIX_STAR: 16,
  EIGHT_STAR: 17,
  LIGHTNING: 18,
  TANGENT: 19,
  HOURGLASS: 20,
  PINWHEEL: 21,
  TILES: 22,
  SAW: 23,
  SEAL: 24,
  PRESENT: 25,
  ARROWHEAD: 26,
  FORCE: 27,
  WINDOW: 28,
  XXXXXXX: 29,
  ZZZZZZZ: 30,
  COMET: 31,
  RECTANGLE: 32,
  PARALLELOGRAM: 33,
  FIVE_STAR: 34,
  PENTAGON: 35,
  FAIRY: 36,
  HEART: 37,
  WAVE: 38,
  PEAK: 39,
  TRAPEZE: 40,
  INWARDS: 41,
  OUTWARDS: 42,
  // Legacy names for compatibility
  REGULAR_LINE: 0,
  LINES_FROM_START: 1,
};

// Palette types - matching iOS indices
var PALETTES = {
  MANUAL: 0,
  RAINBOW: 1,
  BLAZE: 2,      // was FIRE
  GLACIER: 3,    // was ICE
  OCEAN: 4,
  NATURAL: 5,    // was NATURE
  BLUESKY: 6,
  GRAYSCALE: 7,
  SEPIA: 8,
  MYSTICAL: 9,   // was MYSTIC
  TROPICAL: 10,
  AURORA: 11,
  NEON: 12,
  BRAZIL: 13,
  MEXICO: 14,
  COLOMBIA: 15,
  GERMANY: 16,
  NETHERLANDS: 17,
  INDIA: 18,
  SUNSET: 19,
  BEACH: 20,
  FUTURE: 21,
  SUNNY: 22,
  PASTEL: 23,
  INTENSE: 24,
  DASH: 25,
  RUNNER: 26,
  MINT: 27,
  VIRIDIS: 28,
  HAPPY: 29,
  COMFY: 30,
  SHINY: 31,
  CYBER: 32,
  JUPITER: 33,
  BLOSSOM: 34,
  HOLIDAY: 35,
  SUNRISE: 36,
  FLORAL: 37,
  CMYK: 38,
  DAYDREAM: 39,
  COSMOS: 40,
  HYPERSPACE: 41,
  GOLDEN: 42,
  LIME: 43,
};

// Drawing Engine Class
function DrawingEngine(canvas) {
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');

  // Default settings (from Parameters module)
  this.settings = Parameters.getDefaults();

  // Drawing state
  this.drawing = false;
  this.x1 = 0; this.y1 = 0;
  this.x2 = 0; this.y2 = 0;
  this.aX = 0; this.aY = 0;
  
  // Current brush instance
  this.currentBrush = null;

  // Rotation state (kept for perspectiveSize calculation)
  this.currentBrushSize = this.settings.brushSize;

  // Shape storage (only used by filler() for LINES brush with fillShape)
  this.posX = [];
  this.posY = [];
  this.preX = [];
  this.preY = [];

  // Palette state
  this.currentPalette = null;
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

DrawingEngine.prototype.getColor = function() {
  var settings = this.settings;
  var alpha = settings.alpha / 100;
  
  if (settings.palette === PALETTES.MANUAL) {
    return 'rgba(' + settings.r + ',' + settings.g + ',' + settings.b + ',' + alpha + ')';
  }
  
  if (this.currentPalette && this.currentPalette.colors.length > 0) {
    // Get color without shifting (shifting happens in shiftColor())
    var RGB = this.currentPalette.colors[this.currentPalette.colorIndex];
    return 'rgba(' + RGB[0] + ',' + RGB[1] + ',' + RGB[2] + ',' + alpha + ')';
  }
  
  return 'rgba(' + settings.r + ',' + settings.g + ',' + settings.b + ',' + alpha + ')';
};

DrawingEngine.prototype.initializePalette = function() {
  var settings = this.settings;
  var rgb = settings.palette === PALETTES.MANUAL ? [settings.r / 255, settings.g / 255, settings.b / 255] : [];
  this.currentPalette = PaletteGenerator.buildPalette(settings.palette, rgb);
};

DrawingEngine.prototype.updateSetting = function(key, value) {
  var paletteChanged = key === 'palette' && this.settings.palette !== value;
  var manualColorChanged = key === 'r' || key === 'g' || key === 'b';
  
  this.settings[key] = value;

  if (paletteChanged || (manualColorChanged && this.settings.palette === PALETTES.MANUAL)) {
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

DrawingEngine.prototype.shiftColor = function() {
  // Shift color once per drawing operation
  if (this.settings.palette !== PALETTES.MANUAL && this.currentPalette && this.currentPalette.colors.length > 0) {
    this.currentPalette.shiftIndex();
  }
};

// Note: variableSize and rotatingShape are now handled by brushes internally
// This function only handles perspectiveSize (not yet implemented in brushes)
DrawingEngine.prototype.varySize = function() {
  // PerspectiveSize is not yet handled by brushes, so we keep this for now
  // TODO: Move perspectiveSize logic to Brush class
  if (this.settings.perspectiveSize) {
    this.currentBrushSize = this.settings.brushSize;
    var dx = this.x1 - this.centerX;
    var dy = this.y1 - this.centerY;
    var dist = Math.sqrt(dx * dx + dy * dy) / 200;
    this.currentBrushSize *= dist;
  }
};

DrawingEngine.prototype.fadeDrawing = function() {
  if (this.settings.brush === BRUSHES.LINES && this.settings.fillShape) return;
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
  this.varySize(); // Only handles perspectiveSize now
  // varyRotation removed - brushes handle rotatingShape internally
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

DrawingEngine.prototype.drawShape = function(points, fill) {
  if (points.length < 3) return;
  
  this.ctx.strokeStyle = this.getColor();
  this.ctx.shadowColor = this.getColor();
  this.ctx.shadowBlur = fill ? 0 : 0;
  this.ctx.beginPath();
  
  var firstPoint = points[0];
  this.ctx.moveTo(firstPoint.getX(), firstPoint.getY());
  
  for (var i = 1; i < points.length; i++) {
    var p = points[i];
    this.ctx.lineTo(p.getX(), p.getY());
  }
  
  this.ctx.closePath();
  
  if (fill) {
    var fillbak = this.ctx.fillStyle;
    this.ctx.fillStyle = this.ctx.strokeStyle;
    this.ctx.fill();
    this.ctx.fillStyle = fillbak;
  }
  this.ctx.stroke();
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
  this.drawing = true;

  this.posX = [];
  this.posY = [];
  this.preX = [];
  this.preY = [];

  // Create brush instance
  var pointer = new Point(x, y);
  // Add center coordinates to settings for brushes
  this.settings.centerX = this.centerX;
  this.settings.centerY = this.centerY;
  this.currentBrush = BrushGenerator.buildBrush(this.settings, pointer);

  this.onMouseMove(x, y);
};

DrawingEngine.prototype.onMouseUp = function() {
  // Finish stroke on brush if needed (handles filling for Lines brush)
  if (this.currentBrush && this.currentBrush.finishStroke) {
    this.currentBrush.finishStroke(this.ctx, this);
  }
  
  this.drawing = false;
  this.currentBrush = null;
  
  // Clear point storage arrays
  this.posX = [];
  this.posY = [];
  this.preX = [];
  this.preY = [];
};

DrawingEngine.prototype.onMouseMove = function(x, y) {
  if (!this.drawing) return;

  this.aX = this.x1 = x;
  this.aY = this.y1 = y;

  this.modifier();

  // Use brush system - just call draw() like iOS
  if (this.currentBrush) {
    var pointer = new Point(x, y);
    // Update center coordinates in brush params
    this.currentBrush.params.centerX = this.centerX;
    this.currentBrush.params.centerY = this.centerY;
    this.currentBrush.move(pointer);
    
    // Draw the brush (handles all rotation, symmetry, fit to grid, etc.)
    this.currentBrush.draw(this.ctx, this);
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
      ? CrazeMode.bresenhamCircle(x1, y1, x1 + dx, y1 + dy)
      : CrazeMode.bresenhamLine(x1, y1, x1 + dx, y1 + dy);

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
