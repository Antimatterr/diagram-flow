export type ShapeType =
  | "rectangle"
  | "square"
  | "circle"
  | "line"
  | "freehand"
  | "triangle";

export type StrokeStyle = "solid" | "dotted" | "dashed";

export type ToolType =
  | "select"
  | "rectangle"
  | "square"
  | "circle"
  | "triangle"
  | "line"
  | "freehand"
  | "erase";

export interface BaseShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  color: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
}

export interface RectangleShape extends BaseShape {
  type: "rectangle";
  width: number;
  height: number;
}

export interface SquareShape extends BaseShape {
  type: "square";
  size: number;
}

export interface CircleShape extends BaseShape {
  type: "circle";
  radius: number;
}

export interface TriangleShape extends BaseShape {
  type: "triangle";
  points: [
    { x: number; y: number },
    { x: number; y: number },
    { x: number; y: number }
  ];
}

export interface LineShape extends BaseShape {
  type: "line";
  endX: number;
  endY: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface FreehandShape extends BaseShape {
  type: "freehand";
  points: Point[];
  isComplete: boolean; // to check between active and finished stroke
}

export type Shape =
  | RectangleShape
  | SquareShape
  | CircleShape
  | TriangleShape
  | LineShape
  | FreehandShape;

export interface CanvasState {
  shapes: Shape[];
  selectedShapeIds: string[];
  activeTool: ToolType;
  canvasWidth: number;
  canvasHeight: number;
  zoomLevel: number;
  panOffset: Point;
  history: CanvasStateSnapshot[];
  historyIndex: number;
  currentStrokeColor: string;
  currentStrokeWidth: number;
  currentStrokeStyle: StrokeStyle;
}

export type CanvasStateSnapshot = Omit<CanvasState, "history" | "historyIndex">;

// ---- Action Types ----

export type CanvasAction =
  | { type: "ADD_SHAPE"; payload: Shape }
  | { type: "UPDATE_SHAPE"; payload: { id: string; updates: Partial<Shape> } }
  | { type: "DELETE_SHAPES"; payload: string[] } // Renamed to better reflect multiple deletions
  | { type: "SET_ACTIVE_TOOL"; payload: ToolType }
  | { type: "SET_SELECTION"; payload: string[] }
  | { type: "CLEAR_SELECTION" }
  | {
      type: "UPDATE_SHAPE_PROPERTY";
      payload: { id: string; property: keyof Shape; value: any };
    }
  | {
      type: "UPDATE_CURRENT_STYLE";
      payload: Partial<{
        color: string;
        strokeWidth: number;
        strokeStyle: StrokeStyle;
      }>;
    }
  | { type: "SET_ZOOM"; payload: number }
  | { type: "SET_PAN_OFFSET"; payload: { x: number; y: number } }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET_CANVAS" }
  | { type: "SET_CANVAS_SIZE"; payload: { width: number; height: number } };
