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
  const zoomUpdateRef = useRef<number | null>(null);
  const colorUpdateRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const lastColorUpdateTimeRef = useRef<number>(0);
  const cachedImagePropsRef = useRef<{
    src: string;
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
  } | null>(null);
  const canvasRenderedRef = useRef<boolean>(false);

  // Throttling constants for smooth performance
  const ZOOM_UPDATE_INTERVAL = 16; // ~60fps max
  const COLOR_UPDATE_INTERVAL = 32; // ~30fps max for color updates

  // Pre-render canvas once for performance
  const renderCanvasOnce = useCallback(() => {
    if (!imageRef.current || !canvasRef.current || canvasRenderedRef.current)
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match image natural size
    canvas.width = imageRef.current.naturalWidth;
    canvas.height = imageRef.current.naturalHeight;

    // Draw image to canvas once
    ctx.drawImage(imageRef.current, 0, 0);

    canvasRenderedRef.current = true;
  }, [imageRef]);

  // Cache image properties for performance
  const getCachedImageProps = useCallback(() => {
    if (!imageRef.current) return null;

    const currentSrc = imageRef.current.src;
    const currentWidth = imageRef.current.offsetWidth;
    const currentHeight = imageRef.current.offsetHeight;

    // Return cached props if they match current image
    if (
      cachedImagePropsRef.current &&
      cachedImagePropsRef.current.src === currentSrc &&
      cachedImagePropsRef.current.width === currentWidth &&
      cachedImagePropsRef.current.height === currentHeight
    ) {
      return cachedImagePropsRef.current;
    }

    // Calculate and cache new props
    const scaleX = imageRef.current.naturalWidth / currentWidth;
    const scaleY = imageRef.current.naturalHeight / currentHeight;

    cachedImagePropsRef.current = {
      src: currentSrc,
      width: currentWidth,
      height: currentHeight,
      scaleX,
      scaleY,
    };

    return cachedImagePropsRef.current;
  }, [imageRef]);

  const getColorAtPosition = useCallback(
    (x: number, y: number): string => {
      if (!canvasRef.current || !canvasRenderedRef.current) return color;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return color;

      // Use cached scale values
      const imageProps = getCachedImageProps();
      if (!imageProps) return color;

      const pixelX = Math.floor(x * imageProps.scaleX);
      const pixelY = Math.floor(y * imageProps.scaleY);

      // Ensure coordinates are within canvas bounds
      if (
        pixelX < 0 ||
        pixelY < 0 ||
        pixelX >= canvas.width ||
        pixelY >= canvas.height
      ) {
        return color;
      }

      // Get pixel data from pre-rendered canvas
      const imageData = ctx.getImageData(pixelX, pixelY, 1, 1);
      const pixel = imageData.data;

      // Convert to hex
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];

      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    },
    [color, getCachedImageProps]
  );

  const updateColor = useCallback(
    (x: number, y: number, forceUpdate = false) => {
      const now = Date.now();

      // Skip update if too soon since last update (unless forced)
      if (
        !forceUpdate &&
        now - lastColorUpdateTimeRef.current < COLOR_UPDATE_INTERVAL
      ) {
        return;
      }

      // Cancel previous color update to throttle
      if (colorUpdateRef.current) {
        cancelAnimationFrame(colorUpdateRef.current);
      }

      colorUpdateRef.current = requestAnimationFrame(() => {
        const newColor = getColorAtPosition(x, y);
        setColor(newColor);
        onColorChange(id, newColor);
        lastColorUpdateTimeRef.current = now;
      });
    },
    [getColorAtPosition, id, onColorChange]
  );

  const updateZoomEffect = useCallback(
    (x: number, y: number) => {
      if (!imageRef.current || !zoomRef.current) return;

      const now = Date.now();

      // Skip update if too soon since last update
      if (now - lastUpdateTimeRef.current < ZOOM_UPDATE_INTERVAL) {
        return;
      }

      // Cancel previous animation frame to avoid stacking
      if (zoomUpdateRef.current) {
        cancelAnimationFrame(zoomUpdateRef.current);
      }

      // Use requestAnimationFrame for smooth, throttled updates
      zoomUpdateRef.current = requestAnimationFrame(() => {
        if (!imageRef.current || !zoomRef.current) return;

        const imageProps = getCachedImageProps();
        if (!imageProps) return;

        const zoomRadius = 75;
        const zoomElement = zoomRef.current;

        // Set up zoom background using original image for quality
        const currentBgImage = zoomElement.style.backgroundImage;
        const newBgImage = `url(${imageProps.src})`;
        if (currentBgImage !== newBgImage) {
          zoomElement.style.backgroundImage = newBgImage;
          zoomElement.style.backgroundRepeat = "no-repeat";
        }

        // Update zoom background size and position for zoom effect
        const zoomScale = 6; // Balanced zoom scale for good quality and performance
        const bgSize = `${imageProps.width * zoomScale}px ${
          imageProps.height * zoomScale
        }px`;
        zoomElement.style.backgroundSize = bgSize;

        // Update background position for zoom effect
        const bgPosX = -x * zoomScale + zoomRadius;
        const bgPosY = -y * zoomScale + zoomRadius;
        zoomElement.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;

        lastUpdateTimeRef.current = now;
      });
    },
    [imageRef, getCachedImageProps]
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

          // Use the current position from initialPosition (which includes custom positions)
          const properPosition = {
            x: initialPosition.x,
            y: initialPosition.y,
          };

          // If this is one of the first 4 swatches and no custom position, use percentage-based positioning
          if (
            id < positions.length &&
            initialPosition.x <= 100 &&
            initialPosition.y <= 100
          ) {
            properPosition.x = containerRect.width * positions[id].x;
            properPosition.y = containerRect.height * positions[id].y;
          }

          setPosition(properPosition);

          // Render canvas once when image is ready
          renderCanvasOnce();

          // Extract color from this position
          setTimeout(() => {
            updateColor(properPosition.x + 12, properPosition.y + 12, true); // Force initial update
          }, 50); // Small delay to ensure color extraction works

          setIsInitialized(true);
        }
      }, 50); // Small delay to ensure container dimensions are set
    }
  }, [
    imageLoaded,
    isInitialized,
    id,
    initialPosition,
    updateColor,
    renderCanvasOnce,
    imageRef,
    containerRef,
  ]);

  // Reset initialization when imageLoaded changes
  useEffect(() => {
    if (!imageLoaded) {
      setIsInitialized(false);
      // Clear cached props when image changes
      cachedImagePropsRef.current = null;
      // Reset canvas rendered flag
      canvasRenderedRef.current = false;
    }
  }, [imageLoaded]);

  // Cleanup animation frames on unmount
  useEffect(() => {
    return () => {
      if (zoomUpdateRef.current) {
        cancelAnimationFrame(zoomUpdateRef.current);
      }
      if (colorUpdateRef.current) {
        cancelAnimationFrame(colorUpdateRef.current);
      }
    };
  }, []);

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
        // Clean up animation frames
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        if (zoomUpdateRef.current) {
          cancelAnimationFrame(zoomUpdateRef.current);
          zoomUpdateRef.current = null;
        }
        if (colorUpdateRef.current) {
          cancelAnimationFrame(colorUpdateRef.current);
          colorUpdateRef.current = null;
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


  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const touch = e.touches[0];
      const startX = touch.clientX;
      const startY = touch.clientY;
      const startLeft = position.x;
      const startTop = position.y;

      // Initialize zoom effect for current position
      updateZoomEffect(position.x + 12, position.y + 12);

      // Notify parent of drag start
      onDragStart?.();

      let animationId: number | null = null;

      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault(); // Prevent scrolling while dragging
        if (!containerRect) return;

        // Cancel previous animation frame to throttle updates
        if (animationId) {
          cancelAnimationFrame(animationId);
        }

        animationId = requestAnimationFrame(() => {
          const touch = e.touches[0];
          const deltaX = touch.clientX - startX;
          const deltaY = touch.clientY - startY;

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

      const handleTouchEnd = () => {
        // Clean up animation frames
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        if (zoomUpdateRef.current) {
          cancelAnimationFrame(zoomUpdateRef.current);
          zoomUpdateRef.current = null;
        }
        if (colorUpdateRef.current) {
          cancelAnimationFrame(colorUpdateRef.current);
          colorUpdateRef.current = null;
        }

        setIsDragging(false);
        onDragEnd?.();
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
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
          className="absolute w-36 h-36 border-4 border-white rounded-full pointer-events-none z-20 overflow-hidden"
          style={{
            left: `${position.x - 60}px`, // Center the zoom picker on the swatch position
            top: `${position.y - 60}px`,
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          {/* Zoom background container */}
          <div
            ref={zoomRef}
            className="absolute inset-0"
            style={{
              willChange: "background-position", // Optimize for background-position changes
            }}
          />
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

          onTouchStart={handleTouchStart}

        />
      )}
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
