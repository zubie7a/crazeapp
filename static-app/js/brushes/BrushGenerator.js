// BrushGenerator - factory for creating brushes (matching iOS indices)
var BrushGenerator = {
  buildBrush: function(params, pointer) {
    var brushIndex = params.brush;
    
    switch (brushIndex) {
      case 0: return Lines.buildBrush(params, pointer);
      case 1: return Radiant.buildBrush(params, pointer);
      case 2: return VerticalLines.buildBrush(params, pointer);
      case 3: return HorizontalLines.buildBrush(params, pointer);
      case 4: return GreatCross.buildBrush(params, pointer);
      case 5: return Triangles.buildBrush(params, pointer);
      case 6: return Squares.buildBrush(params, pointer);
      case 7: return Diamond.buildBrush(params, pointer);
      case 8: return Hexagon.buildBrush(params, pointer);
      case 9: return Snowflake.buildBrush(params, pointer);
      case 10: return Flower.buildBrush(params, pointer);
      case 11: return Moon.buildBrush(params, pointer);
      case 12: return Circles.buildBrush(params, pointer);
      case 13: return Chain.buildBrush(params, pointer);
      case 14: return Insignia.buildBrush(params, pointer);
      case 15: return FourStar.buildBrush(params, pointer);
      case 16: return SixStar.buildBrush(params, pointer);
      case 17: return EightStar.buildBrush(params, pointer);
      case 18: return Lightning.buildBrush(params, pointer);
      case 19: return Tangent.buildBrush(params, pointer);
      case 20: return Hourglass.buildBrush(params, pointer);
      case 21: return Pinwheel.buildBrush(params, pointer);
      case 22: return Tiles.buildBrush(params, pointer);
      case 23: return Saw.buildBrush(params, pointer);
      case 24: return Seal.buildBrush(params, pointer);
      case 25: return Present.buildBrush(params, pointer);
      case 26: return Arrowhead.buildBrush(params, pointer);
      case 27: return Force.buildBrush(params, pointer);
      case 28: return Window.buildBrush(params, pointer);
      case 29: return XXXXXXX.buildBrush(params, pointer);
      case 30: return ZZZZZZZ.buildBrush(params, pointer);
      case 31: return Comet.buildBrush(params, pointer);
      case 32: return Rectangle.buildBrush(params, pointer);
      case 33: return Parallelogram.buildBrush(params, pointer);
      case 34: return FiveStar.buildBrush(params, pointer);
      case 35: return Pentagon.buildBrush(params, pointer);
      case 36: return Fairy.buildBrush(params, pointer);
      case 37: return Heart.buildBrush(params, pointer);
      case 38: return Wave.buildBrush(params, pointer);
      case 39: return Peak.buildBrush(params, pointer);
      case 40: return Trapeze.buildBrush(params, pointer);
      case 41: return Inwards.buildBrush(params, pointer);
      case 42: return Outwards.buildBrush(params, pointer);
      default: return Lines.buildBrush(params, pointer);
    }
  }
};
