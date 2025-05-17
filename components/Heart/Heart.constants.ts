import { SPACING } from "@/constants/Token";
import { rect, Skia } from "@shopify/react-native-skia";

export const heart = Skia.Path.MakeFromSVGString(
  "M 32 60 C -29.2 19.6 13.2 -12 31.2 4.4 C 31.6 4.8 31.6 5.2 32 5.2 A 12.4 12.4 90 0 1 32.8 4.4 C 50.8 -12 93.2 19.6 32 60 Z"
)!;

export const CANVAS_WIDTH = 300;
export const CANVAS_HEIGHT = 300;

const PADDING = SPACING.xxxl;

export const CENTER_DIMENSIONS = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };

export const HEART_DIMENSIONS = heart.computeTightBounds();
export const HEART_CONTAINER_DIMENSIONS = rect(
  PADDING,
  PADDING,
  CANVAS_WIDTH - 2 * PADDING,
  CANVAS_HEIGHT - PADDING * 2
);

export const MAX_BPM = 170;
export const MIN_BPM = 55;
