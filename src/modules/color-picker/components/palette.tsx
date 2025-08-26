import { Copy, Palette as PaletteIcon, Check, Trash, X } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ColorPicker,
  ColorPickerSelection,
  ColorPickerHue,
  ColorPickerFormat,
  ColorPickerOutput,
} from "@/components/ui/shadcn-io/color-picker";

interface PaletteProps {
  hex: string;
  index: number;
  onColorChange?: (index: number, newColor: string) => void;
  onDelete?: (index: number) => void;
}

export default function Palette({
  hex,
  index,
  onColorChange,
  onDelete,
}: PaletteProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempColor, setTempColor] = useState(`#${hex}`);
  const [colorPickerPosition, setColorPickerPosition] = useState({
    top: 0,
    left: 0,
  });
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const paletteIconRef = useRef<HTMLDivElement>(null);
  const updateTimeoutRef = useRef<number | null>(null);

  // Update tempColor when hex prop changes (only if not currently showing color picker)
  useEffect(() => {
    if (!showColorPicker) {
      setTempColor(`#${hex}`);
    }
  }, [hex, showColorPicker]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        cancelAnimationFrame(updateTimeoutRef.current);
      }
    };
  }, []);

  const closeColorPicker = useCallback(() => {
    setShowColorPicker(false);
  }, []);

  // Handle click outside to close color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        closeColorPicker();
      }
    };

    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker, closeColorPicker]);

  const getTextColor = (hexColor: string): string => {
    // Remove # if present
    const cleanHex = hexColor.replace("#", "");

    // Convert to RGB
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);

    // Calculate luminance using WCAG formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for light backgrounds, white for dark
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  const textColor = getTextColor(hex);

  const handleCopy = () => {
    navigator.clipboard.writeText(`#${hex}`);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  const instantColorUpdate = useCallback(
    (newColor: string) => {
      if (updateTimeoutRef.current) {
        cancelAnimationFrame(updateTimeoutRef.current);
      }

      // Use requestAnimationFrame for smooth, instant updates
      updateTimeoutRef.current = requestAnimationFrame(() => {
        if (onColorChange) {
          onColorChange(index, newColor);
        }
      }) as any;
    },
    [index, onColorChange]
  );

  const handleColorPickerChange = useCallback(
    (newColor: string) => {
      setTempColor(newColor);
      instantColorUpdate(newColor);
    },
    [instantColorUpdate]
  );

  const handleColorPickerRGBAChange = useCallback(
    (rgba: any) => {
      if (Array.isArray(rgba) && rgba.length >= 3) {
        // Convert RGBA array to hex
        const [r, g, b] = rgba;
        const hex = `#${Math.round(r)
          .toString(16)
          .padStart(2, "0")}${Math.round(g)
          .toString(16)
          .padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
        handleColorPickerChange(hex);
      }
    },
    [handleColorPickerChange]
  );

  const handleTextInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = e.target.value;
      setTempColor(newColor);

      // Only update if it's a valid hex color
      if (/^#[0-9A-F]{6}$/i.test(newColor)) {
        instantColorUpdate(newColor);
      }
    },
    [instantColorUpdate]
  );

  const handleDelete = () => {
    if (onDelete) {
      onDelete(index);
    }
  };

  // Calculate optimal position for color picker
  const getColorPickerPosition = useCallback(() => {
    if (!paletteIconRef.current) return { top: 0, left: 0 };

    const iconRect = paletteIconRef.current.getBoundingClientRect();
    const colorPickerWidth = 250;
    const colorPickerHeight = 400;
    const padding = 12;

    // Calculate initial position (below and to the left of icon)
    let top = iconRect.bottom + padding;
    let left = iconRect.left - colorPickerWidth + iconRect.width;

    // Adjust for viewport boundaries
    if (top + colorPickerHeight > window.innerHeight) {
      top = iconRect.top - colorPickerHeight - padding;
    }
    if (left + colorPickerWidth > window.innerWidth) {
      left = window.innerWidth - colorPickerWidth - padding;
    }
    if (left < padding) {
      left = padding;
    }
    if (top < padding) {
      top = iconRect.bottom + padding;
    }

    return { top, left };
  }, []);

  const openColorPicker = useCallback(() => {
    setTempColor(`#${hex}`); // Sync with current hex when opening
    // Calculate position before showing
    const position = getColorPickerPosition();
    setColorPickerPosition(position);
    setShowColorPicker(true);
  }, [hex, getColorPickerPosition]);

  return (
    <div
      className="w-full h-28 p-3 rounded-md"
      style={{ backgroundColor: `#${hex}` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-end gap-2">
        <div ref={paletteIconRef}>
          <PaletteIcon
            className="size-4 cursor-pointer hover:scale-110 transition-all duration-200 hover:drop-shadow-sm"
            style={{ color: textColor }}
            onClick={openColorPicker}
          />
        </div>
        <Trash
          className="size-4 cursor-pointer hover:scale-110 transition-all duration-200 hover:drop-shadow-sm"
          style={{ color: textColor }}
          onClick={handleDelete}
        />
      </div>

      {/* Color Picker Popover */}
      {showColorPicker && (
        <div
          ref={colorPickerRef}
          className="fixed z-50"
          style={colorPickerPosition}
        >
          <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-800">
                Color Picker
              </h3>
              <button
                onClick={closeColorPicker}
                className="p-1 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
              >
                <X className="size-3 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <ColorPicker
              value={tempColor}
              onChange={handleColorPickerRGBAChange}
              className="w-[200px]"
            >
              <div className="space-y-3">
                <ColorPickerSelection className="h-[120px] w-full" />
                <ColorPickerHue className="w-full" />
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg border-2 border-gray-200 flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: tempColor }}
                  />
                  <ColorPickerFormat className="flex-1" />
                  <ColorPickerOutput />
                </div>
              </div>
            </ColorPicker>
          </div>
        </div>
      )}
      <div className="flex flex-col items-start group">
        <div className="text-sm font-medium" style={{ color: textColor }}>
          Hex
        </div>
        <div className="uppercase flex items-center gap-2 hover:cursor-pointer">
          <div className="text-sm font-mono" style={{ color: textColor }}>
            #{hex}
          </div>
          {isCopied ? (
            <Check className="size-3" style={{ color: textColor }} />
          ) : (
            <Copy
              className={`size-3 cursor-pointer transition-all duration-200 hover:scale-110 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              style={{ color: textColor }}
              onClick={handleCopy}
            />
          )}
        </div>
      </div>
    </div>
  );
}
