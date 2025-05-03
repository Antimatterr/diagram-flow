// src/state/CanvasStateProvider.tsx
import { useReducer, ReactNode, useEffect } from "react";
import { CanvasStateContext } from "./canvasStateContext";
import { canvasReducer } from "./canvasReducer";
import { CanvasState } from "../types/canvasTypes"; // Import the state type

// Define the initial state for the reducer
const INITIAL_STATE: CanvasState = {
  shapes: [],
  selectedShapeIds: [],
  activeTool: "select",
  canvasWidth: 800,
  canvasHeight: 600,
  zoomLevel: 1,
  panOffset: { x: 0, y: 0 },
  history: [],
  historyIndex: -1,
  currentStrokeColor: "#ffffff",
  currentStrokeWidth: 2,
  currentStrokeStyle: "solid",
};

// Define the props for the provider component
interface CanvasStateProviderProps {
  children: ReactNode; // The components wrapped by the provider
}
export function CanvasStateProvider({ children }: CanvasStateProviderProps) {
  const [state, dispatch] = useReducer(
    canvasReducer,
    INITIAL_STATE,
    (initialState) => {
      // Initialize with history
      const initialStateWithHistory = {
        ...initialState,
        history: [{ ...initialState, history: [], historyIndex: -1 }], // Add initial state to history (without history array itself)
        historyIndex: 0,
      };

      // Optional: Load state from localStorage
      const savedState = localStorage.getItem("diagramFlow");
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          // Create a clean state object without history
          const cleanParsedState = { ...parsedState };

          // Start new history with this loaded state
          return {
            ...cleanParsedState,
            history: [{ ...cleanParsedState, history: [], historyIndex: -1 }],
            historyIndex: 0,
          };
        } catch (e) {
          console.error("Failed to load state from localStorage", e);
          return initialStateWithHistory;
        }
      }
      return initialStateWithHistory;
    }
  );

  // Save state to localStorage
  useEffect(() => {
    // Create a version of state without history to save
    const stateToSave = {
      shapes: state.shapes,
      selectedShapeIds: state.selectedShapeIds,
      activeTool: state.activeTool,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      zoomLevel: state.zoomLevel,
      panOffset: state.panOffset,
      currentStrokeColor: state.currentStrokeColor,
      currentStrokeWidth: state.currentStrokeWidth,
      currentStrokeStyle: state.currentStrokeStyle,
    };
    localStorage.setItem("diagramFlow", JSON.stringify(stateToSave));
  }, [
    state.shapes,
    state.selectedShapeIds,
    state.canvasWidth,
    state.canvasHeight,
    state.zoomLevel,
    state.panOffset,
    state.activeTool,
    state.currentStrokeColor,
    state.currentStrokeWidth,
    state.currentStrokeStyle,
  ]);

  return (
    <CanvasStateContext.Provider value={{ state, dispatch }}>
      {children}
    </CanvasStateContext.Provider>
  );
}
