import {
  CanvasAction,
  CanvasState,
  CanvasStateSnapshot,
  Shape,
} from "../types/canvasTypes";

import { v4 as uuid } from "uuid";

export const INITIAL_STATE: CanvasState = {
  shapes: [],
  selectedShapeIds: [],
  activeTool: "select",
  canvasHeight: 800,
  canvasWidth: 800,
  zoomLevel: 1,
  panOffset: { x: 0, y: 0 },
  history: [],
  historyIndex: -1,
  currentStrokeColor: "#ffffff",
  currentStrokeStyle: "solid",
  currentStrokeWidth: 2,
};

// Helper function to create a snapshot of the state for history
// We use JSON.parse(JSON.stringify()) for a simple deep clone.
// For very complex state, consider a more robust deep cloning method or Immer
const createStateSnapshot = (state: CanvasState): CanvasStateSnapshot => {
  const { history, historyIndex, ...snapshot } = state;
  return JSON.parse(JSON.stringify(snapshot));
};

//helper function to add the current state to history stack
const addStateToHistory = (currentState: CanvasState) => {
  const historyCopy = currentState.history.slice(
    0,
    currentState.historyIndex + 1
  );
  historyCopy.push(createStateSnapshot(currentState));
  let nextIndex = historyCopy.length - 1;

  const MAX_HISTORY_SIZE = 100;
  if (historyCopy.length > MAX_HISTORY_SIZE) {
    historyCopy.shift();
    nextIndex--;
  }

  return {
    ...currentState,
    history: historyCopy,
    historyIndex: nextIndex,
  };
};

export const canvasReducer = (
  state: CanvasState,
  action: CanvasAction
): CanvasState => {
  let nextState = { ...state };

  switch (action.type) {
    case "ADD_SHAPE":
      const newShapeWithId: Shape = { ...action.payload, id: uuid() };
      nextState.shapes = [...state.shapes, newShapeWithId];
      nextState.selectedShapeIds = [newShapeWithId.id];
      return addStateToHistory(nextState);
    case "UPDATE_SHAPE":
      //find shape by id and merge them
      nextState.shapes = state.shapes.map((shape) =>
        shape.id === action.payload.id
          ? { ...shape, ...(action.payload.updates as any) }
          : shape
      );
      return addStateToHistory(nextState);
    case "DELETE_SHAPES":
      nextState.shapes = state.shapes.filter(
        (shape) => !action.payload.includes(shape.id)
      );
      nextState.selectedShapeIds = state.selectedShapeIds.filter(
        (id) => !action.payload.includes(id)
      );
      return addStateToHistory(nextState);
    case "SET_ACTIVE_TOOL":
      nextState.activeTool = action.payload;
      nextState.selectedShapeIds = [];
      return nextState;
    case "SET_SELECTION":
      nextState.selectedShapeIds = action.payload;
      return nextState;
    case "UPDATE_CURRENT_STYLE":
      return {
        ...state,
        currentStrokeColor: action.payload.color ?? state.currentStrokeColor,
        currentStrokeWidth:
          action.payload.strokeWidth ?? state.currentStrokeWidth,
        currentStrokeStyle:
          action.payload.strokeStyle ?? state.currentStrokeStyle,
      };
    case "UNDO":
      if (state.historyIndex > 0) {
        const prevIndex = state.historyIndex - 1;
        const restoredStateData = state.history[prevIndex];
        return {
          ...state,
          ...restoredStateData,
          historyIndex: prevIndex,
        };
      }
      return state;
    case "REDO":
      if (state.historyIndex < state.history.length - 1) {
        const nextIndex = state.historyIndex + 1;
        const restoredStateData = state.history[nextIndex];
        return {
          ...state,
          ...restoredStateData,
          historyIndex: nextIndex,
        };
      }
      return state;
    case "SET_ZOOM":
      return {
        ...state,
        zoomLevel: action.payload,
      };
    case "SET_PAN_OFFSET":
      return {
        ...state,
        panOffset: action.payload,
      };
    case "SET_CANVAS_SIZE":
      return {
        ...state,
        canvasHeight: action.payload.height,
        canvasWidth: action.payload.width,
      };
    case "RESET_CANVAS":
      return INITIAL_STATE;
    default:
      return state;
  }
};
