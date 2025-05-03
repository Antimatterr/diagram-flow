import { RefObject, useRef } from "react"

interface FreeHandDrawProps {
  canvasRef?: RefObject<HTMLCanvasElement | null>;
  ctxRef?: RefObject<CanvasRenderingContext2D | null>;
}

export const useFreeHandDraw = ({ canvasRef: externalCanvasRef, ctxRef: externalCtxRef }: FreeHandDrawProps = {}) => {
    // Use provided refs or create new ones
    const internalCanvasRef = useRef<HTMLCanvasElement>(null)
    const canvasRef = externalCanvasRef || internalCanvasRef
    const isDrawing = useRef(false)
    const lastX = useRef(0)
    const lastY = useRef(0)
    
    const startDrawing = (e: MouseEvent) => {
        isDrawing.current = true
        lastX.current = e.clientX
        lastY.current = e.clientY
    }
    
    const draw = (e: MouseEvent) => {
        if (!isDrawing.current) return
    
        const ctx = externalCtxRef?.current || canvasRef.current?.getContext('2d')
        if (!ctx) return
    
        ctx.beginPath()
        ctx.moveTo(lastX.current, lastY.current)
        ctx.lineTo(e.clientX, e.clientY)
        ctx.strokeStyle = 'white'
        ctx.stroke()
    
        lastX.current = e.clientX
        lastY.current = e.clientY
    }
    
    const stopDrawing = () => {
        isDrawing.current = false
    }
    
    return { canvasRef, startDrawing, draw, stopDrawing }
}