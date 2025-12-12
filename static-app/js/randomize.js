// Randomization system - ports iOS randomiZeParameters functionality
var Randomizer = {
  // Randomize parameters (ports iOS randomiZeParameters)
  randomizeParameters: function(engine) {
    if (!engine) return;
    
    // Backup settings that should be preserved (like iOS)
    var rotations = engine.settings.rotationAmount;
    var symmetry = engine.settings.symmetry;
    var fading = engine.settings.fadingImage;
    var fitToGrid = engine.settings.fitToGrid;
    var centerX = engine.centerX;
    var centerY = engine.centerY;
    
    // Reset to defaults (like iOS resetParameters)
    engine.settings = {
      brush: BRUSHES.LINES,
      brushSize: 50,
      thickness: 2,
      rotationAmount: rotations, // Restore preserved
      palette: PALETTES.RAINBOW,
      r: 255,
      g: 0,
      b: 0,
      alpha: 100,
      symmetry: symmetry, // Restore preserved
      variableSize: false,
      rotatingShape: false,
      connectBorders: false,
      fillShape: false,
      fadingImage: fading, // Restore preserved
      fitToGrid: fitToGrid, // Restore preserved
      perspectiveSize: false,
    };
    
    // Restore center
    engine.centerX = centerX;
    engine.centerY = centerY;
    
    // Randomize the palette (0-43)
    var randomPalette = Math.floor(Math.random() * 44);
    engine.settings.palette = randomPalette;
    engine.initializePalette();
    
    // Choose random preset (0-57, with 57+ being truly random)
    var randSettings = Math.floor(Math.random() * 58);
    
    // Apply preset combination
    switch (randSettings) {
      case 0:
        // Vertical, Filling, Transparent
        engine.settings.brush = BRUSHES.VERTICAL_LINES;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 21;
        break;
      case 1:
        // Tangent, Filling, Transparent
        engine.settings.brush = BRUSHES.TANGENT;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 21;
        break;
      case 2:
        // Tangent, Shining
        engine.settings.brush = BRUSHES.TANGENT;
        // Note: Shining not implemented in web yet
        engine.settings.brushSize = 21;
        break;
      case 3:
        // Triangle, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.TRIANGLES;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 21;
        break;
      case 4:
        // Square, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.SQUARES;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 21;
        break;
      case 5:
        // Cross, Spinning, Variable, Connect, Shining
        engine.settings.brush = BRUSHES.GREAT_CROSS;
        engine.settings.rotatingShape = true;
        engine.settings.variableSize = true;
        engine.settings.connectBorders = true;
        engine.settings.brushSize = 21;
        break;
      case 6:
        // Vertical, Align, Spinning, Variable, Filling, Transparent
        engine.settings.brush = BRUSHES.VERTICAL_LINES;
        engine.settings.fitToGrid = true;
        engine.settings.rotatingShape = true;
        engine.settings.variableSize = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 21;
        break;
      case 7:
        // Circle, Variable, Connect, Shining (iOS uses index 10 = FLOWER, comment may be outdated)
        engine.settings.brush = BRUSHES.FLOWER;
        engine.settings.brushSize = 21;
        engine.settings.variableSize = true;
        engine.settings.connectBorders = true;
        break;
      case 8:
        // Small Circle, Filling, Align, Transparent
        engine.settings.brush = BRUSHES.CIRCLES;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 5;
        break;
      case 9:
        // Small Square, Filling, Align, Transparent
        engine.settings.brush = BRUSHES.SQUARES;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 5;
        break;
      case 10:
        // Small Triangle, Filling, Align, Transparent
        engine.settings.brush = BRUSHES.TRIANGLES;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 5;
        break;
      case 11:
        // Chain, Connect, Shining
        engine.settings.brush = BRUSHES.CHAIN;
        engine.settings.connectBorders = true;
        break;
      case 12:
        // Chain, Filling, Transparent
        engine.settings.brush = BRUSHES.CHAIN;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        break;
      case 13:
        // Radiant, Connect
        engine.settings.brush = BRUSHES.RADIANT;
        engine.settings.connectBorders = true;
        break;
      case 14:
        // Radiant, Connect, Filling, Transparent
        engine.settings.brush = BRUSHES.RADIANT;
        engine.settings.connectBorders = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        break;
      case 15:
        // Cross, Variable, Connect, Filling, Transparent
        engine.settings.brush = BRUSHES.GREAT_CROSS;
        engine.settings.variableSize = true;
        engine.settings.connectBorders = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 21;
        break;
      case 16:
        // Vertical, Variable, Filling, Transparent
        engine.settings.brush = BRUSHES.VERTICAL_LINES;
        engine.settings.variableSize = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 21;
        break;
      case 17:
        // Vertical, Variable, Spinning, Filling, Transparent
        engine.settings.brush = BRUSHES.VERTICAL_LINES;
        engine.settings.variableSize = true;
        engine.settings.rotatingShape = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 21;
        break;
      case 18:
        // Vertical, Variable, Spinning, Shining
        engine.settings.brush = BRUSHES.VERTICAL_LINES;
        engine.settings.variableSize = true;
        engine.settings.rotatingShape = true;
        engine.settings.brushSize = 21;
        break;
      case 19:
        // Small Diamond, Filling, Align, Transparent
        engine.settings.brush = BRUSHES.DIAMOND;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 5;
        break;
      case 20:
        // Hexagon, Align, Filling
        engine.settings.brush = BRUSHES.HEXAGON;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 21;
        break;
      case 21:
        // Snowflakes, Align, Filling
        engine.settings.brush = BRUSHES.SNOWFLAKE;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 21;
        break;
      case 22:
        // Diamond, Align, Filling
        engine.settings.brush = BRUSHES.DIAMOND;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 21;
        break;
      case 23:
        // SixStar, Align, Filling
        engine.settings.brush = BRUSHES.SIX_STAR;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 21;
        break;
      case 24:
        // Cross, Align, Variable, Connect, Shining
        engine.settings.brush = BRUSHES.GREAT_CROSS;
        engine.settings.fitToGrid = true;
        engine.settings.variableSize = true;
        engine.settings.connectBorders = true;
        engine.settings.brushSize = 25;
        break;
      case 25:
        // Circle, Align, Variable, Connect, Shining
        engine.settings.brush = BRUSHES.CIRCLES;
        engine.settings.fitToGrid = true;
        engine.settings.variableSize = true;
        engine.settings.connectBorders = true;
        engine.settings.brushSize = 25;
        break;
      case 26:
        // Insignia, Align, Variable, Connect, Shining
        engine.settings.brush = BRUSHES.INSIGNIA;
        engine.settings.fitToGrid = true;
        engine.settings.variableSize = true;
        engine.settings.connectBorders = true;
        engine.settings.brushSize = 25;
        break;
      case 27:
        // Tiles, Align, Variable, Connect, Shining
        engine.settings.brush = BRUSHES.TILES;
        engine.settings.fitToGrid = true;
        engine.settings.variableSize = true;
        engine.settings.connectBorders = true;
        engine.settings.brushSize = 25;
        break;
      case 28:
        // FourStar, Align, Variable, Connect, Shining
        engine.settings.brush = BRUSHES.FOUR_STAR;
        engine.settings.fitToGrid = true;
        engine.settings.variableSize = true;
        engine.settings.connectBorders = true;
        engine.settings.brushSize = 25;
        break;
      case 29:
        // XXXXXXX, Align, Variable, Connect, Shining
        engine.settings.brush = BRUSHES.XXXXXXX;
        engine.settings.fitToGrid = true;
        engine.settings.variableSize = true;
        engine.settings.connectBorders = true;
        engine.settings.brushSize = 25;
        break;
      case 30:
        // Radiant, Align, Connect
        engine.settings.brush = BRUSHES.RADIANT;
        engine.settings.fitToGrid = true;
        engine.settings.connectBorders = true;
        break;
      case 31:
        // Lines, Align, Connect
        engine.settings.brush = BRUSHES.LINES;
        engine.settings.fitToGrid = true;
        engine.settings.connectBorders = true;
        break;
      case 32:
        // Lines, Connect
        engine.settings.brush = BRUSHES.LINES;
        engine.settings.connectBorders = true;
        break;
      case 33:
        // Flower, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.FLOWER;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 21;
        break;
      case 34:
        // Moon, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.MOON;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 21;
        break;
      case 35:
        // Window, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.WINDOW;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 21;
        break;
      case 36:
        // Force, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.FORCE;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 21;
        break;
      case 37:
        // Comet, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.COMET;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 21;
        break;
      case 38:
        // Small Hexagon, Align, Filling
        engine.settings.brush = BRUSHES.HEXAGON;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 5;
        break;
      case 39:
        // Small Snowflakes, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.SNOWFLAKE;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 5;
        break;
      case 40:
        // Diamond, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.DIAMOND;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 5;
        break;
      case 41:
        // Small SixStar, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.SIX_STAR;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.alpha = 50;
        engine.settings.brushSize = 5;
        break;
      case 42:
        // Small Cross, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.GREAT_CROSS;
        engine.settings.fitToGrid = true;
        engine.settings.connectBorders = true;
        engine.settings.brushSize = 5;
        break;
      case 43:
        // Rectangle, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.RECTANGLE;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.variableSize = true;
        engine.settings.alpha = 50;
        break;
      case 44:
        // Parallelogram, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.PARALLELOGRAM;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.variableSize = true;
        engine.settings.alpha = 50;
        break;
      case 45:
        // FiveStar, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.FIVE_STAR;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.variableSize = true;
        engine.settings.alpha = 50;
        break;
      case 46:
        // Pentagon, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.PENTAGON;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.variableSize = true;
        engine.settings.alpha = 50;
        break;
      case 47:
        // Fairy, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.FAIRY;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.variableSize = true;
        engine.settings.alpha = 50;
        break;
      case 48:
        // Heart, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.HEART;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.variableSize = true;
        engine.settings.alpha = 50;
        break;
      case 49:
        // Wave, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.WAVE;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.variableSize = true;
        engine.settings.alpha = 50;
        break;
      case 50:
        // Peak, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.PEAK;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.variableSize = true;
        engine.settings.alpha = 50;
        break;
      case 51:
        // Trapeze, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.TRAPEZE;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.variableSize = true;
        engine.settings.alpha = 50;
        break;
      case 52:
        // Inwards, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.INWARDS;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.variableSize = true;
        engine.settings.alpha = 50;
        break;
      case 53:
        // Outwards, Align, Filling, Transparent
        engine.settings.brush = BRUSHES.OUTWARDS;
        engine.settings.fitToGrid = true;
        engine.settings.fillShape = true;
        engine.settings.variableSize = true;
        engine.settings.alpha = 50;
        break;
      default:
        // Truly random (cases 54-57)
        engine.settings.brush = Math.floor(Math.random() * 43);
        engine.settings.brushSize = Math.floor(Math.random() * (84 - 21)) + 21;
        engine.settings.fitToGrid = Math.random() < 0.5;
        engine.settings.rotatingShape = Math.random() < 0.5;
        engine.settings.variableSize = Math.random() < 0.5;
        engine.settings.fillShape = Math.random() < 0.5;
        engine.settings.connectBorders = Math.random() < 0.5;
        engine.settings.alpha = Math.floor(Math.random() * 51) + 50; // 50-100
        break;
    }
    
    // Update thickness if needed
    if (engine.settings.thickness) {
      engine.ctx.lineWidth = engine.settings.thickness;
    }
  },
  
  // Sync UI elements with engine settings (called after randomization)
  syncUI: function(engine, elements) {
    if (!engine || !elements) return;
    
    var settings = engine.settings;
    
    // Update selects
    if (elements.brushSelect) {
      elements.brushSelect.value = settings.brush;
    }
    if (elements.paletteSelect) {
      elements.paletteSelect.value = settings.palette;
      elements.colorPicker.style.display = settings.palette === PALETTES.MANUAL ? 'block' : 'none';
    }
    
    // Update sliders
    if (elements.alphaSlider) {
      elements.alphaSlider.value = settings.alpha;
      if (elements.alphaValue) elements.alphaValue.textContent = settings.alpha;
    }
    if (elements.sizeSlider) {
      elements.sizeSlider.value = settings.brushSize;
      if (elements.sizeValue) elements.sizeValue.textContent = settings.brushSize;
    }
    if (elements.rotSlider) {
      elements.rotSlider.value = settings.rotationAmount;
      if (elements.rotValue) elements.rotValue.textContent = settings.rotationAmount;
    }
    if (elements.thickSlider) {
      elements.thickSlider.value = settings.thickness;
      if (elements.thickValue) elements.thickValue.textContent = settings.thickness;
    }
    
    // Update toggles
    if (elements.symmetryToggle) elements.symmetryToggle.checked = settings.symmetry;
    if (elements.variableToggle) elements.variableToggle.checked = settings.variableSize;
    if (elements.rotatingToggle) elements.rotatingToggle.checked = settings.rotatingShape;
    if (elements.connectToggle) elements.connectToggle.checked = settings.connectBorders;
    if (elements.fillToggle) elements.fillToggle.checked = settings.fillShape;
    if (elements.fadeToggle) elements.fadeToggle.checked = settings.fadingImage;
    if (elements.gridToggle) elements.gridToggle.checked = settings.fitToGrid;
    if (elements.perspectiveToggle) elements.perspectiveToggle.checked = settings.perspectiveSize;
    
    // Update color picker if manual
    if (settings.palette === PALETTES.MANUAL && elements.colorInput) {
      var hex = '#' + 
        ('0' + settings.r.toString(16)).slice(-2) +
        ('0' + settings.g.toString(16)).slice(-2) +
        ('0' + settings.b.toString(16)).slice(-2);
      elements.colorInput.value = hex;
      if (elements.colorText) elements.colorText.value = hex;
    }
  }
};

