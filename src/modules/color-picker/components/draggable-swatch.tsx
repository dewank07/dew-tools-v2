"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface DraggableSwatchProps {
  id: number;
  initialColor: string;
  initialPosition: { x: number; y: number };
  onColorChange: (id: number, color: string) => void;
  imageRef: React.RefObject<HTMLImageElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  imageLoaded: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export default function DraggableSwatch({
  id,
  initialColor,
  initialPosition,
  onColorChange,
  imageRef,
  containerRef,
  imageLoaded,
  onDragStart,
  onDragEnd,
}: DraggableSwatchProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [color, setColor] = useState(initialColor);
  const [isInitialized, setIsInitialized] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  const getColorAtPosition = useCallback(
    (x: number, y: number): string => {
      if (!imageRef.current || !canvasRef.current) return color;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return color;

      // Set canvas dimensions to match image natural size
      canvas.width = imageRef.current.naturalWidth;
      canvas.height = imageRef.current.naturalHeight;

      // Draw image to canvas
      ctx.drawImage(imageRef.current, 0, 0);

      // Calculate actual pixel position
      const scaleX =
        imageRef.current.naturalWidth / imageRef.current.offsetWidth;
      const scaleY =
        imageRef.current.naturalHeight / imageRef.current.offsetHeight;

      const pixelX = Math.floor(x * scaleX);
      const pixelY = Math.floor(y * scaleY);

      // Get pixel data
      const imageData = ctx.getImageData(pixelX, pixelY, 1, 1);
      const pixel = imageData.data;

      // Convert to hex
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];

      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    },
    [imageRef, color]
  );

  const updateColor = useCallback(
    (x: number, y: number) => {
      const newColor = getColorAtPosition(x, y);
      setColor(newColor);
      onColorChange(id, newColor);
    },
    [getColorAtPosition, id, onColorChange]
  );

  const updateZoomEffect = useCallback(
    (x: number, y: number) => {
      if (!imageRef.current || !zoomRef.current) return;

      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        if (!imageRef.current || !zoomRef.current) return;

        const zoomScale = 8;
        const zoomRadius = 75;

        // Create zoom effect by setting background
        const zoomElement = zoomRef.current;
        zoomElement.style.backgroundImage = `url(${imageRef.current.src})`;
        zoomElement.style.backgroundSize = `${
          imageRef.current.offsetWidth * zoomScale
        }px ${imageRef.current.offsetHeight * zoomScale}px`;
        zoomElement.style.backgroundPosition = `${
          -x * zoomScale + zoomRadius
        }px ${-y * zoomScale + zoomRadius}px`;
        zoomElement.style.backgroundRepeat = "no-repeat";
      });
    },
    [imageRef]
  );

  // Initialize swatch position and color when image loads
  useEffect(() => {
    if (
      imageLoaded &&
      !isInitialized &&
      imageRef.current &&
      containerRef.current
    ) {
      // Give a small delay to ensure the container has proper dimensions
      setTimeout(() => {
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        if (containerRect.width > 0 && containerRect.height > 0) {
          // Calculate proper percentage-based position
          const positions = [
            { x: 0.2, y: 0.2 },
            { x: 0.8, y: 0.2 },
            { x: 0.2, y: 0.8 },
            { x: 0.8, y: 0.8 },
          ];

          const properPosition = {
            x: containerRect.width * positions[id].x,
            y: containerRect.height * positions[id].y,
          };

          setPosition(properPosition);

          // Extract color from this position
          setTimeout(() => {
            updateColor(properPosition.x + 12, properPosition.y + 12);
          }, 50); // Small delay to ensure color extraction works

          setIsInitialized(true);
        }
      }, 50); // Small delay to ensure container dimensions are set
    }
  }, [imageLoaded, isInitialized, id, updateColor]);

  // Reset initialization when imageLoaded changes
  useEffect(() => {
    if (!imageLoaded) {
      setIsInitialized(false);
    }
  }, [imageLoaded]);

  // Remove this useEffect to prevent infinite loops
  // The zoom effect will be initialized in handleMouseDown instead

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const startX = e.clientX;
      const startY = e.clientY;
      const startLeft = position.x;
      const startTop = position.y;

      // Initialize zoom effect for current position
      updateZoomEffect(position.x + 12, position.y + 12);

      // Notify parent of drag start
      onDragStart?.();

      let animationId: number | null = null;

      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRect) return;

        // Cancel previous animation frame to throttle updates
        if (animationId) {
          cancelAnimationFrame(animationId);
        }

        animationId = requestAnimationFrame(() => {
          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;

          let newLeft = startLeft + deltaX;
          let newTop = startTop + deltaY;

          // Keep swatch within image bounds (24px is swatch size)
          newLeft = Math.max(0, Math.min(newLeft, containerRect.width - 24));
          newTop = Math.max(0, Math.min(newTop, containerRect.height - 24));

          const newPosition = { x: newLeft, y: newTop };
          setPosition(newPosition);

          // Update color at new position (center of swatch)
          updateColor(newLeft + 12, newTop + 12);

          // Update zoom effect
          updateZoomEffect(newLeft + 12, newTop + 12);
        });
      };

      const handleMouseUp = () => {
        // Clean up animation frame
        if (animationId) {
          cancelAnimationFrame(animationId);
        }

        setIsDragging(false);
        onDragEnd?.();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [
      position,
      containerRef,
      updateColor,
      updateZoomEffect,
      onDragStart,
      onDragEnd,
    ]
  );

  return (
    <>
      {isDragging ? (
        // Zoom picker mode when dragging
        <div
          ref={zoomRef}
          className="absolute w-36 h-36 border-4 border-white rounded-full pointer-events-none z-20 overflow-hidden"
          style={{
            left: `${position.x - 60}px`, // Center the zoom picker on the swatch position
            top: `${position.y - 60}px`,
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
      ) : (
        // Normal swatch mode when not dragging
        <div
          className="absolute w-6 h-6 border-4 border-white rounded-full cursor-grab shadow-lg z-10 transition-transform duration-200 hover:scale-125"
          style={{
            backgroundColor: color,
            left: `${position.x}px`,
            top: `${position.y}px`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
          onMouseDown={handleMouseDown}
        />
      )}
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
