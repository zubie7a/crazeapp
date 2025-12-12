// Auto-loader for all palette range files
// This script automatically loads all palette files in the ranges folder
(function() {
  'use strict';
  
  var paletteFiles = [
    'ManualMix',
    'Rainbows',
    'Blaze',
    'Glacier',
    'Ocean',
    'Natural',
    'Bluesky',
    'Grayscale',
    'Sepia',
    'Mystical',
    'Tropical',
    'Aurora',
    'Neon',
    'Brazil',
    'Mexico',
    'Colombia',
    'Germany',
    'Netherlands',
    'India',
    'Sunset',
    'Beach',
    'Future',
    'Sunny',
    'Pastel',
    'Intense',
    'Dash',
    'Runner',
    'Mint',
    'Viridis',
    'Happy',
    'Comfy',
    'Shiny',
    'Cyber',
    'Jupiter',
    'Blossom',
    'Holiday',
    'Sunrise',
    'Floral',
    'CMYK',
    'Daydream',
    'Cosmos',
    'Hyperspace',
    'Golden',
    'Lime'
  ];
  
  // Write script tags synchronously using document.write
  for (var i = 0; i < paletteFiles.length; i++) {
    document.write('<script src="js/palettes/ranges/' + paletteFiles[i] + '.js"></script>');
  }
})();

