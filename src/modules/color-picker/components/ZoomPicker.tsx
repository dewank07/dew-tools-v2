"use client";

import { useEffect, useRef } from "react";

interface ZoomPickerProps {
  isVisible: boolean;
  position: { x: number; y: number };
  imageRef: React.RefObject<HTMLImageElement | null>;
  zoomCenter: { x: number; y: number };
}

export default function ZoomPicker({
  isVisible,
  position,
  imageRef,
  zoomCenter,
}: ZoomPickerProps) {
  const zoomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !imageRef.current || !zoomRef.current) return;

    const zoomScale = 8;
    const zoomRadius = 75;

    // Create zoom effect by setting background
    zoomRef.current.style.backgroundImage = `url(${imageRef.current.src})`;
    zoomRef.current.style.backgroundSize = `${
      imageRef.current.offsetWidth * zoomScale
    }px ${imageRef.current.offsetHeight * zoomScale}px`;
    zoomRef.current.style.backgroundPosition = `${
      -zoomCenter.x * zoomScale + zoomRadius
    }px ${-zoomCenter.y * zoomScale + zoomRadius}px`;
    zoomRef.current.style.backgroundRepeat = "no-repeat";
  }, [isVisible, imageRef, zoomCenter]);

  if (!isVisible) return null;

  return (
    <div
      ref={zoomRef}
      className="absolute w-36 h-36 border-4 border-white rounded-full pointer-events-none z-20 overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
      }}
    >
      {/* Crosshair */}
      <div
        className="absolute border-2 border-white rounded-sm"
        style={{
          top: "50%",
          left: "50%",
          width: "20px",
          height: "20px",
          marginLeft: "-10px",
          marginTop: "-10px",
          boxShadow: "0 0 4px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
}
