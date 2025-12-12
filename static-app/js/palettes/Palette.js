// Base Palette class - matches iOS Palette structure
function Palette() {
  // An index to know where in the array are we while shifting
  this.colorIndex = 0;
  
  // An array that will contain arrays/triples of [R,G,B] colors
  this.colors = [];
  
  // Default value of positions to shift in color array
  this.shiftPositions = 5;
}

// Shift the current position, while wrapping around if reaching limit
Palette.prototype.shiftIndex = function() {
  this.colorIndex = (this.colorIndex + this.shiftPositions) % this.colors.length;
};

// Get color with alpha
Palette.prototype.getColor = function(alpha) {
  if (this.colors.length === 0) {
    return { r: 255, g: 255, b: 255, a: alpha };
  }
  
  var RGB = this.colors[this.colorIndex];
  var color = {
    r: RGB[0],
    g: RGB[1],
    b: RGB[2],
    a: alpha
  };
  
  this.shiftIndex();
  return color;
};

// RGB to HSL conversion
Palette.prototype.rgbToHSL = function(r, g, b) {
  var rf = r / 255.0;
  var gf = g / 255.0;
  var bf = b / 255.0;
  
  var maxVal = Math.max(rf, gf, bf);
  var minVal = Math.min(rf, gf, bf);
  var delta = maxVal - minVal;
  
  var h = 0.0;
  var s = 0.0;
  var l = (maxVal + minVal) / 2.0;
  
  if (delta !== 0) {
    s = l > 0.5 ? delta / (2.0 - maxVal - minVal) : delta / (maxVal + minVal);
    
    if (maxVal === rf) {
      h = ((gf - bf) / delta + (gf < bf ? 6.0 : 0.0)) / 6.0;
    } else if (maxVal === gf) {
      h = ((bf - rf) / delta + 2.0) / 6.0;
    } else {
      h = ((rf - gf) / delta + 4.0) / 6.0;
    }
  }
  
  return { h: h, s: s, l: l };
};

// HSL to RGB conversion
Palette.prototype.hslToRGB = function(h, s, l) {
  var hue2rgb = function(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  var r = l, g = l, b = l;
  
  if (s !== 0) {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

// RGB to XYZ color space
Palette.prototype.rgbToXYZ = function(r, g, b) {
  var toLinear = function(v) {
    return (v > 0.04045) ? Math.pow((v + 0.055) / 1.055, 2.4) : (v / 12.92);
  };
  
  var rf = toLinear(r / 255.0);
  var gf = toLinear(g / 255.0);
  var bf = toLinear(b / 255.0);
  
  var x = (rf * 0.4124564 + gf * 0.3575761 + bf * 0.1804375) * 100.0;
  var y = (rf * 0.2126729 + gf * 0.7151522 + bf * 0.0721750) * 100.0;
  var z = (rf * 0.0193339 + gf * 0.1191920 + bf * 0.9503041) * 100.0;
  
  return { x: x, y: y, z: z };
};

// Convert XYZ to LAB
Palette.prototype.xyzToLAB = function(x, y, z) {
  var refX = 95.047;
  var refY = 100.000;
  var refZ = 108.883;
  
  var toLAB = function(v) {
    return (v > 0.008856) ? Math.pow(v, 1.0 / 3.0) : (7.787 * v + 16.0 / 116.0);
  };
  
  var xr = toLAB(x / refX);
  var yr = toLAB(y / refY);
  var zr = toLAB(z / refZ);
  
  var l = (116.0 * yr) - 16.0;
  var a = 500.0 * (xr - yr);
  var b = 200.0 * (yr - zr);
  
  return { l: l, a: a, b: b };
};

// Convert LAB to XYZ
Palette.prototype.labToXYZ = function(l, a, b) {
  var refX = 95.047;
  var refY = 100.000;
  var refZ = 108.883;
  
  var toXYZ = function(v) {
    return (v > 0.206893) ? (v * v * v) : ((v - 16.0 / 116.0) / 7.787);
  };
  
  var yr = (l + 16.0) / 116.0;
  var xr = yr + a / 500.0;
  var zr = yr - b / 200.0;
  
  var x = toXYZ(xr) * refX;
  var y = toXYZ(yr) * refY;
  var z = toXYZ(zr) * refZ;
  
  return { x: x, y: y, z: z };
};

// Convert XYZ to RGB
Palette.prototype.xyzToRGB = function(x, y, z) {
  var r = 3.2404542 * x / 100.0 - 1.5371385 * y / 100.0 - 0.4985314 * z / 100.0;
  var g = -0.9692660 * x / 100.0 + 1.8760108 * y / 100.0 + 0.0415560 * z / 100.0;
  var b = 0.0556434 * x / 100.0 - 0.2040259 * y / 100.0 + 1.0572252 * z / 100.0;
  
  var toSRGB = function(v) {
    var corrected = (v > 0.0031308) ? (1.055 * Math.pow(v, 1 / 2.4) - 0.055) : (v * 12.92);
    return Math.max(0, Math.min(255, Math.round(corrected * 255.0)));
  };
  
  return [toSRGB(r), toSRGB(g), toSRGB(b)];
};

// LAB interpolation for smooth gradients
Palette.prototype.colors3DLAB = function(start, end, steps) {
  var xyz1 = this.rgbToXYZ(start[0], start[1], start[2]);
  var lab1 = this.xyzToLAB(xyz1.x, xyz1.y, xyz1.z);
  
  var xyz2 = this.rgbToXYZ(end[0], end[1], end[2]);
  var lab2 = this.xyzToLAB(xyz2.x, xyz2.y, xyz2.z);
  
  var resultColors = [];
  
  for (var i = 0; i < steps; i++) {
    var t = i / (steps - 1);
    
    var l = lab1.l + t * (lab2.l - lab1.l);
    var a = lab1.a + t * (lab2.a - lab1.a);
    var b = lab1.b + t * (lab2.b - lab1.b);
    
    var xyz = this.labToXYZ(l, a, b);
    resultColors.push(this.xyzToRGB(xyz.x, xyz.y, xyz.z));
  }
  
  return resultColors;
};

// HSL interpolation
Palette.prototype.colors3DHSL = function(start, end, steps) {
  var hsl1 = this.rgbToHSL(start[0], start[1], start[2]);
  var hsl2 = this.rgbToHSL(end[0], end[1], end[2]);
  
  var resultColors = [];
  
  for (var i = 0; i < steps; i++) {
    var t = i / (steps - 1);
    
    var h = hsl1.h + t * (hsl2.h - hsl1.h);
    var s = hsl1.s + t * (hsl2.s - hsl1.s);
    var l = hsl1.l + t * (hsl2.l - hsl1.l);
    
    resultColors.push(this.hslToRGB(h, s, l));
  }
  
  return resultColors;
};

