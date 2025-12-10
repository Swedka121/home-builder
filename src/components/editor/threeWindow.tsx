/** @format */

"use client";
import { useEditor } from "@/hooks/use-editor";
import { useWorldStore } from "@/store/worldStore";
import React, { useEffect, useRef } from "react";

export default function ThreeWindow({ worldId }: { worldId: string }) {
  const worldStore = useWorldStore();
  useEffect(() => {
    worldStore.load();
  }, []);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const editor = useEditor(canvasRef, worldId);

  return (
    <canvas
      className="absolute w-screen h-screen top-0 left-0 z-[1]"
      ref={canvasRef}
    />
  );
}
