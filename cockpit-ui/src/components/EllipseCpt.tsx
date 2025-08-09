// src/components/EllipseCpt.tsx
// 🎯 Composant statique pour afficher une ellipse décorative déplaçable

import { useEffect, useRef, useState } from "react";
import { useDragMode } from "../DragContext";

export default function EllipseCpt() {
    
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("ellipse_cpt_position");
    return saved ? JSON.parse(saved) : { x: 200, y: 200 };
  });
  const { dragEnabled } = useDragMode();

  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const grid = 5;

  const ref = useRef<HTMLDivElement>(null);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const snappedX = Math.round(clientX / grid) * grid;
    const snappedY = Math.round(clientY / grid) * grid;

    offset.current = {
      x: clientX - snappedX,
      y: clientY - snappedY,
    };

    setPosition({ x: snappedX, y: snappedY });
    dragging.current = true;
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging.current) return;
    const clientX = "touches" in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = "touches" in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

    const snappedX = Math.round((clientX - offset.current.x) / grid) * grid;
    const snappedY = Math.round((clientY - offset.current.y) / grid) * grid;
    setPosition({ x: snappedX, y: snappedY });
  };

  const handleEnd = () => {
    dragging.current = false;
  };

  useEffect(() => {
    localStorage.setItem("ellipse_cpt_position", JSON.stringify(position));
  }, [position]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleEnd);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        zIndex: 30,
        cursor: "grab",
        touchAction: "none",
      }}
       onMouseDown={dragEnabled ? handleStart : undefined}
       onTouchStart={dragEnabled ? handleStart : undefined}
    >
      <svg
        width="460"
        height="560"
        viewBox="0 0 560 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_1144_1095)">
          <g clipPath="url(#paint0_angular_1144_1095_clip_path)" data-figma-skip-parse="true">
            <g transform="matrix(-0.064126 -0.192378 0.192378 -0.064126 280.104 280.264)">
              <foreignObject x="-1270.61" y="-1270.61" width="2541.21" height="2541.21">
                <div 
                 style={{background:"conic-gradient(from 90deg,rgba(12, 12, 12, 0.26) 0deg,rgba(150, 205, 244, 0) 269.885deg,rgba(0, 147, 255, 0.37) 360deg)",height:"100%",width:"100%",opacity:0.5}}></div>
              </foreignObject>
            </g>
          </g>
          <circle cx="280.104" cy="280.264" r="202.697" shapeRendering="crispEdges" fill="#0000FF" fillOpacity="0.2" />
          <circle cx="280.104" cy="280.264" r="202.197" stroke="black" shapeRendering="crispEdges" />
        </g>
        <defs>
          <filter id="filter0_d_1144_1095" x="0.751099" y="0.91098" width="558.707" height="558.707" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset />
            <feGaussianBlur stdDeviation="38.3282" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1144_1095" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1144_1095" result="shape" />
          </filter>
          <clipPath id="paint0_angular_1144_1095_clip_path">
            <circle cx="280.104" cy="280.264" r="202.697" shapeRendering="crispEdges" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
