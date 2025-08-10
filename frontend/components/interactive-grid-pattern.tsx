"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

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

interface TrailSquare {
  index: number;
  timestamp: number;
  opacity: number;
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
  const [trailSquares, setTrailSquares] = useState<TrailSquare[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const lastHoveredRef = useRef<number | null>(null);
  const { theme } = useTheme();

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
      
      // Only update if we moved to a new square
      if (index !== lastHoveredRef.current) {
        setHoveredSquare(index);
        lastHoveredRef.current = index;
        
        // Add to trail if it's a new square
        const now = Date.now();
        setTrailSquares(prev => {
          // Remove the current square from trail if it exists
          const filtered = prev.filter(square => square.index !== index);
          // Add current square to trail
          const newTrail = [
            ...filtered,
            { index, timestamp: now, opacity: 1 }
          ];
          // Keep only last 12 squares and remove old ones
          return newTrail
            .filter(square => now - square.timestamp < 1500)
            .slice(-12);
        });
      }
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [allowInteractive, width, height, horizontal, vertical]);

  // Fade out trail squares over time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTrailSquares(prev => 
        prev
          .map(square => ({
            ...square,
            opacity: Math.max(0, 1 - (now - square.timestamp) / 1500)
          }))
          .filter(square => square.opacity > 0.05)
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

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
        
        // Check if this square is in the trail
        const trailSquare = trailSquares.find(square => square.index === index);
        const isHovered = hoveredSquare === index;
        const isInTrail = !!trailSquare && !isHovered;
        
        // Calculate style based on state
        let style: React.CSSProperties = {};
        let fillClass = "fill-transparent";
        
        if (isHovered && allowInteractive) {
          style.fill = '#3b82f6'; // Blue
          style.fillOpacity = 0.6;
        } else if (isInTrail && allowInteractive) {
          style.fill = '#3b82f6'; // Blue
          style.fillOpacity = trailSquare.opacity * 0.4; // Fade effect
        }
        
        // Dark mode colors
        const isDark = theme === 'dark';
        if (isDark) {
          if (isHovered && allowInteractive) {
            style.fill = '#60a5fa'; // Light blue for dark mode
          } else if (isInTrail && allowInteractive) {
            style.fill = '#60a5fa'; // Light blue for dark mode
          }
        }
        
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            className={cn(
              "stroke-gray-400/30 dark:stroke-gray-500/30 transition-all duration-200 ease-in-out",
              fillClass,
              squaresClassName,
            )}
            style={{
              ...style,
              transition: 'fill-opacity 0.2s ease-in-out, fill 0.2s ease-in-out'
            }}
          />
        );
      })}
    </svg>
  );
}
