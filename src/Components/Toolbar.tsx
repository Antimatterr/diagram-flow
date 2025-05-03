import React from "react";
import { ToolType } from "../types/canvasTypes";
import "../css/toolbar.css";
import { PiSelection } from "react-icons/pi";
import { BsTriangle, BsCircle, BsSquare, BsEraser } from "react-icons/bs";
import { HiOutlinePencil } from "react-icons/hi2";
import { useCanvasState } from "../state/canvasStateContext";
import { TbLine } from "react-icons/tb";

enum Actions {
  SELECT = "select",
  RECTANGLE = "rectangle",
  CIRCLE = "circle",
  TRIANGLE = "triangle",
  LINE = "line",
  FREEHAND = "freehand",
  ERASE = "erase",
}

interface ToolbarProps {
  toolType?: ToolType;
}
export const Toolbar: React.FC<ToolbarProps> = () => {
  const { state, dispatch } = useCanvasState();

  const handleCanvasActions = (action: Actions) => {
    console.log("selected", action);
    dispatch({ type: "SET_ACTIVE_TOOL", payload: action });
  };

  return (
    <div className="toolbar">
      <div
        className={`canvas-actions ${
          state.activeTool === Actions.SELECT ? "action-selected " : ""
        }`}
        onClick={() => handleCanvasActions(Actions.SELECT)}
      >
        <PiSelection size={20} />
      </div>
      <div
        className={`canvas-actions ${
          state.activeTool === Actions.CIRCLE ? "action-selected " : ""
        }`}
        onClick={() => handleCanvasActions(Actions.CIRCLE)}
      >
        <BsCircle size={20} />
      </div>
      <div
        className={`canvas-actions ${
          state.activeTool === Actions.RECTANGLE ? "action-selected " : ""
        }`}
        onClick={() => handleCanvasActions(Actions.RECTANGLE)}
      >
        <BsSquare size={20} />
      </div>
      <div
        className={`canvas-actions ${
          state.activeTool === Actions.TRIANGLE ? "action-selected " : ""
        }`}
        onClick={() => handleCanvasActions(Actions.TRIANGLE)}
      >
        <BsTriangle size={20} />
      </div>
      <div
        className={`canvas-actions ${
          state.activeTool === Actions.FREEHAND ? "action-selected " : ""
        }`}
        onClick={() => handleCanvasActions(Actions.FREEHAND)}
      >
        <HiOutlinePencil size={20} />
      </div>
      <div
        className={`canvas-actions ${
          state.activeTool === Actions.LINE ? "action-selected " : ""
        }`}
        onClick={() => handleCanvasActions(Actions.LINE)}
      >
        <TbLine size={20} />
      </div>
      <div
        className={`canvas-actions ${
          state.activeTool === Actions.ERASE ? "action-selected " : ""
        }`}
        onClick={() => handleCanvasActions(Actions.ERASE)}
      >
        <BsEraser size={20} />
      </div>
    </div>
  );
};
