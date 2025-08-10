"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

/**
 * InteractiveGridPattern is a component that renders a grid pattern with interactive squares.
 *
 * @param width - The width of each square.
 * @param height - The height of each square.
 * @param squares - The number of squares in the grid. The first element is the number of horizontal squares, and the second element is the number of vertical squares.
 * @param className - The class name of the grid.
 * @param squaresClassName - The class name of the squares.
 */
interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number]; // [horizontal, vertical]
  className?: string;
  squaresClassName?: string;
  allowInteractive?: boolean;
}

/**
 * The InteractiveGridPattern component.
 *
 * @see InteractiveGridPatternProps for the props interface.
 * @returns A React component.
 */
export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  className,
  squaresClassName,
  allowInteractive = true,
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares;
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Track cursor globally so the grid reacts even when it's behind content
  useEffect(() => {
    if (!allowInteractive) return;
    
    function handleMove(event: MouseEvent) {
      const svg = svgRef.current;
      if (!svg) return;
      
      const rect = svg.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;

      // If cursor is outside the svg bounds, clear highlight
      if (localX < 0 || localY < 0 || localX >= rect.width || localY >= rect.height) {
        setHoveredSquare(null);
        return;
      }

      const col = Math.floor(localX / width);
      const row = Math.floor(localY / height);
      const index = row * horizontal + col;
      setHoveredSquare(index);
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [allowInteractive, width, height, horizontal, vertical]);

  return (
    <svg
      ref={svgRef}
      width={width * horizontal}
      height={height * vertical}
      className={cn(
        "absolute inset-0 h-full w-full border border-gray-400/30 dark:border-gray-600/30",
        className,
      )}
      {...props}
    >
      {Array.from({ length: horizontal * vertical }).map((_, index) => {
        const x = (index % horizontal) * width;
        const y = Math.floor(index / horizontal) * height;
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            className={cn(
              "stroke-gray-400/30 dark:stroke-gray-500/30 transition-all duration-200 ease-in-out [&:not(:hover)]:duration-700",
              hoveredSquare === index && allowInteractive
                ? "fill-blue-500/60 dark:fill-purple-400/60"
                : "fill-transparent",
              squaresClassName,
            )}
            onMouseEnter={
              allowInteractive ? () => setHoveredSquare(index) : undefined
            }
            onMouseLeave={
              allowInteractive ? () => setHoveredSquare(null) : undefined
            }
          />
        );
      })}
    </svg>
  );
}
