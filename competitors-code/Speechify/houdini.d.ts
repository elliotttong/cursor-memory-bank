/**
 * Calculate brightness value by RGB or HEX color.
 * @param color (String) The color value in RGB or HEX (for example: #000000 || #000 || rgb(0,0,0) || rgba(0,0,0,0))
 * @returns (Number) The brightness value (dark) 0 ... 255 (light)
 */
export function brightnessByColor(color: any): number;
export function paint(
  ctx: any,
  {
    elemColor,
    elemMatrix,
    wordPositions,
    wordClipPositions,
    sentencePositions,
    sentenceColor,
    wordColor,
  }: {
    elemColor: any;
    elemMatrix: any;
    wordPositions: any;
    wordClipPositions: any;
    sentencePositions: any;
    sentenceColor: any;
    wordColor: any;
  },
): void;
