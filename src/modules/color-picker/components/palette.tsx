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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const paletteIconRef = useRef<HTMLDivElement>(null);
  const updateTimeoutRef = useRef<number | null>(null);

  // Entry animation on mount - simulates cards being dropped
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 150 + 200); // Staggered animation with initial delay

    return () => clearTimeout(timer);
  }, [index]);

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

  // No need for complex positioning calculations anymore

  // Simple click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node) &&
        paletteIconRef.current &&
        !paletteIconRef.current.contains(event.target as Node)
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
    setIsDeleting(true);

    // Wait for animation to complete before actually deleting
    setTimeout(() => {
      if (onDelete) {
        onDelete(index);
      }
    }, 300); // Match the CSS transition duration
  };

  const openColorPicker = useCallback(() => {
    setTempColor(`#${hex}`); // Sync with current hex when opening
    setShowColorPicker(true);
  }, [hex]);

  return (
    <div
      className={`relative w-full min-h-28 p-3 rounded-md shadow-lg hover:shadow-xl cursor-pointer ${
        // Only apply transform when color picker is not open
        !showColorPicker ? "transform" : ""
      } ${
        isVisible && !showColorPicker
          ? "translate-y-0 opacity-100 scale-100 rotate-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          : !showColorPicker
          ? "translate-y-[-20px] opacity-0 scale-95 rotate-1 transition-all duration-500"
          : "opacity-100" // Just show normally when color picker is open
      } ${
        isDeleting
          ? "transform translate-x-full opacity-0 scale-75 rotate-12 transition-all duration-300 ease-in"
          : ""
      } ${
        !isDeleting && isVisible && !showColorPicker
          ? "hover:scale-[1.02] hover:transition-all hover:duration-200"
          : ""
      }`}
      style={{ backgroundColor: `#${hex}` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-end gap-2">
        <div ref={paletteIconRef} className="relative">
          <PaletteIcon
            className="size-4 cursor-pointer hover:scale-110 transition-all duration-200 hover:drop-shadow-sm"
            style={{ color: textColor }}
            onClick={openColorPicker}
          />

          {/* Simple popover */}
          {showColorPicker && (
            <div
              ref={colorPickerRef}
              className="absolute z-50 top-0 right-full mr-2"
            >
              <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Color Picker
                  </h3>
                  <button
                    onClick={closeColorPicker}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="size-3 text-gray-400" />
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
        </div>
        <Trash
          className="size-4 cursor-pointer hover:scale-110 transition-all duration-200 hover:drop-shadow-sm"
          style={{ color: textColor }}
          onClick={handleDelete}
        />
      </div>

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
