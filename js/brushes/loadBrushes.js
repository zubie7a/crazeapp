// Auto-loader for all brush shape files
// This script automatically loads all brush files in the shapes folder
(function() {
  'use strict';
  
  var brushFiles = [
    'RegularLine',
    'LinesFromStart',
    'VerticalLines',
    'HorizontalLines',
    'GreatCross',
    'Triangles',
    'Squares',
    'Circles',
    'Chain',
    'Tangent',
    'Lines',
    'Radiant',
    'Diamond',
    'Hexagon',
    'Snowflake',
    'Flower',
    'Moon',
    'Insignia',
    'FourStar',
    'SixStar',
    'EightStar',
    'Lightning',
    'Hourglass',
    'Pinwheel',
    'Tiles',
    'Saw',
    'Seal',
    'Present',
    'Arrowhead',
    'Force',
    'Window',
    'XXXXXXX',
    'ZZZZZZZ',
    'Comet',
    'Rectangle',
    'Parallelogram',
    'FiveStar',
    'Pentagon',
    'Fairy',
    'Heart',
    'Wave',
    'Peak',
    'Trapeze',
    'Inwards',
    'Outwards',
    'FourSides'
  ];
  
  // Write script tags synchronously using document.write
  for (var i = 0; i < brushFiles.length; i++) {
    document.write('<script src="js/brushes/shapes/' + brushFiles[i] + '.js"></script>');
  }
})();
