"use client"
import { useEditor } from "@/hooks/use-editor"
import React, { useRef } from "react"

export default function ThreeWindow() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const editor = useEditor(canvasRef)

    return <canvas className="absolute w-screen h-screen top-0 left-0 z-[1]" ref={canvasRef} />
}
