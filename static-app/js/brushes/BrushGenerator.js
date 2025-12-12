// BrushGenerator - factory for creating brushes
var BrushGenerator = {
  buildBrush: function(params, pointer) {
    var brushIndex = params.brush;
    
    switch (brushIndex) {
      case 1: // REGULAR_LINE
        return RegularLine.buildBrush(params, pointer);
      case 2: // LINES_FROM_START
        return LinesFromStart.buildBrush(params, pointer);
      case 3: // VERTICAL_LINES
        return VerticalLines.buildBrush(params, pointer);
      case 4: // HORIZONTAL_LINES
        return HorizontalLines.buildBrush(params, pointer);
      case 5: // GREAT_CROSS
        return GreatCross.buildBrush(params, pointer);
      case 6: // TRIANGLES
        return Triangles.buildBrush(params, pointer);
      case 7: // SQUARES
        return Squares.buildBrush(params, pointer);
      case 8: // CIRCLES
        return Circles.buildBrush(params, pointer);
      case 9: // CHAIN
        return Chain.buildBrush(params, pointer);
      case 10: // TANGENT
        return Tangent.buildBrush(params, pointer);
      default:
        return RegularLine.buildBrush(params, pointer);
    }
  }
};

