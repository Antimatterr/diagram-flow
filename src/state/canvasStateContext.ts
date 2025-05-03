import { createContext, Dispatch, useContext } from "react";
import { CanvasAction, CanvasState } from "../types/canvasTypes";

interface CanvasContextType {
  state: CanvasState;
  dispatch: Dispatch<CanvasAction>;
}

export const CanvasStateContext = createContext<CanvasContextType | undefined>(
  undefined
);

export function useCanvasState() {
  const context = useContext(CanvasStateContext);
  if (context === undefined) {
    throw new Error(
      "usecanvastate must be used within the ccanvasstateprovider"
    );
  }
  return context;
}
