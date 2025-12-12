// PaletteGenerator - factory for creating palettes (matches iOS structure)
var PaletteGenerator = {
  buildPalette: function(paletteIndex, rgb) {
    rgb = rgb || [];
    
    switch (paletteIndex) {
      case 0: // ManualMix
        return ManualMix.buildPalette(rgb);
      case 1: // Rainbows
        return Rainbows.buildPalette();
      case 2: // Blaze (was FIRE)
        return Blaze.buildPalette();
      case 3: // Glacier (was ICE)
        return Glacier.buildPalette();
      case 4: // Ocean
        return Ocean.buildPalette();
      case 5: // Natural (was NATURE)
        return Natural.buildPalette();
      case 6: // Bluesky
        return Bluesky.buildPalette();
      case 7: // Grayscale
        return Grayscale.buildPalette();
      case 8: // Sepia
        return Sepia.buildPalette();
      case 9: // Mystical (was MYSTIC)
        return Mystical.buildPalette();
      case 10: // Tropical
        return Tropical.buildPalette();
      case 11: // Aurora
        return Aurora.buildPalette();
      case 12: // Neon
        return Neon.buildPalette();
      case 13: // Brazil
        return Brazil.buildPalette();
      case 14: // Mexico
        return Mexico.buildPalette();
      case 15: // Colombia
        return Colombia.buildPalette();
      case 16: // Germany
        return Germany.buildPalette();
      case 17: // Netherlands
        return Netherlands.buildPalette();
      case 18: // India
        return India.buildPalette();
      case 19: // Sunset
        return Sunset.buildPalette();
      case 20: // Beach
        return Beach.buildPalette();
      case 21: // Future
        return Future.buildPalette();
      case 22: // Sunny
        return Sunny.buildPalette();
      case 23: // Pastel
        return Pastel.buildPalette();
      case 24: // Intense
        return Intense.buildPalette();
      case 25: // Dash
        return Dash.buildPalette();
      case 26: // Runner
        return Runner.buildPalette();
      case 27: // Mint
        return Mint.buildPalette();
      case 28: // Viridis
        return Viridis.buildPalette();
      case 29: // Happy
        return Happy.buildPalette();
      case 30: // Comfy
        return Comfy.buildPalette();
      case 31: // Shiny
        return Shiny.buildPalette();
      case 32: // Cyber
        return Cyber.buildPalette();
      case 33: // Jupiter
        return Jupiter.buildPalette();
      case 34: // Blossom
        return Blossom.buildPalette();
      case 35: // Holiday
        return Holiday.buildPalette();
      case 36: // Sunrise
        return Sunrise.buildPalette();
      case 37: // Floral
        return Floral.buildPalette();
      case 38: // CMYK
        return CMYK.buildPalette();
      case 39: // Daydream
        return Daydream.buildPalette();
      case 40: // Cosmos
        return Cosmos.buildPalette();
      case 41: // Hyperspace
        return Hyperspace.buildPalette();
      case 42: // Golden
        return Golden.buildPalette();
      case 43: // Lime
        return Lime.buildPalette();
      default:
        return Rainbows.buildPalette();
    }
  }
};

