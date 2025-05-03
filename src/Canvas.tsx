// src/components/Canvas.tsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useCanvasState } from "./state/canvasStateContext";

// Define proper types for our shapes
type Point = {
  x: number;
  y: number;
};

// Base Shape interface that all shapes must implement
interface Shape {
  type: string;
  id: string;
  x: number;
  y: number;
  isComplete: boolean;
  color: string;
  strokeWidth: number;
  strokeStyle: string;
}

// Specific FreehandShape type
interface FreehandShape extends Shape {
  type: "freehand";
  points: Point[];
}

// Helper function to get pointer position relative to canvas
const getCanvasCoords = (
  event: React.PointerEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement
): Point => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};

const Canvas: React.FC = () => {
  const { state, dispatch } = useCanvasState();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Local drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);

  // Handle window resize with proper cleanup
  useEffect(() => {
    const handleResize = () => {
      dispatch({
        type: "SET_CANVAS_SIZE",
        payload: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
    };

    // Set initial size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  // Draw all shapes on the canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, state.canvasWidth, state.canvasHeight);

    ctx.save();

    // Draw completed shapes
    state.shapes.forEach((shape) => {
      if (shape.type === "freehand") {
        const freehandShape = shape as FreehandShape;
        if (freehandShape.points && freehandShape.points.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = shape.color;
          ctx.lineWidth = shape.strokeWidth;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          ctx.moveTo(freehandShape.points[0].x, freehandShape.points[0].y);
          freehandShape.points
            .slice(1)
            .forEach((point) => ctx.lineTo(point.x, point.y));
          ctx.stroke();
        }
      }
    });

    // Draw the current stroke being drawn
    if (isDrawing && currentPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = state.currentStrokeColor;
      ctx.lineWidth = state.currentStrokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
      currentPoints.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.stroke();
    }

    ctx.restore();
  }, [
    state.shapes,
    state.canvasWidth,
    state.canvasHeight,
    state.currentStrokeColor,
    state.currentStrokeWidth,
    isDrawing,
    currentPoints,
  ]);

  // Run drawing effect when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Event handlers with proper memoization
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return;

      e.preventDefault();
      setIsDrawing(true);

      const point = getCanvasCoords(e, canvasRef.current);
      setCurrentPoints([point]);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !canvasRef.current) return;

      e.preventDefault();

      const point = getCanvasCoords(e, canvasRef.current);
      setCurrentPoints((prev) => [...prev, point]);
    },
    [isDrawing]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;

      e.preventDefault();
      setIsDrawing(false);

      // Only add shape if we have more than one point
      if (currentPoints.length > 1) {
        // Calculate bounding position for the shape (x,y)
        const firstPoint = currentPoints[0];

        dispatch({
          type: "ADD_SHAPE",
          payload: {
            type: "freehand",
            id: "temp", // Will be replaced by reducer
            points: [...currentPoints],
            x: firstPoint.x, // Use first point's x as the shape's x position
            y: firstPoint.y, // Use first point's y as the shape's y position
            isComplete: true,
            color: state.currentStrokeColor,
            strokeWidth: state.currentStrokeWidth,
            strokeStyle: state.currentStrokeStyle,
          },
        });
      }

      setCurrentPoints([]);
    },
    [
      isDrawing,
      currentPoints,
      dispatch,
      state.currentStrokeColor,
      state.currentStrokeWidth,
      state.currentStrokeStyle,
    ]
  );

  return (
    <canvas
      ref={canvasRef}
      width={state.canvasWidth}
      height={state.canvasHeight}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp} // Treat pointer leave as pointer up
      style={{ touchAction: "none" }} // Prevent default touch actions
    />
  );
};

export default Canvas;
