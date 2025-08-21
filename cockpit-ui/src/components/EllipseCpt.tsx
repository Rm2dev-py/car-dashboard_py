// src/components/EllipseCpt.tsx
import React from "react";

/**
 * Composant pur et statique : aucun drag, aucun localStorage, aucun listener global.
 * Le positionnement se fait via <Draggable id="ellipse_cpt" ...> d'après ton layout JSON.
 */
export default function EllipseCpt({
  width = 560,
  height = 560,
  className = "",
  style,
}: {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 560 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      preserveAspectRatio="xMidYMid meet"
    >
      <g filter="url(#filter0_d_1144_1095)">
        <g clipPath="url(#paint0_angular_1144_1095_clip_path)" data-figma-skip-parse="true">
          <g transform="matrix(-0.064126 -0.192378 0.192378 -0.064126 280.104 280.264)">
            <foreignObject x="-1270.61" y="-1270.61" width="2541.21" height="2541.21">
              <div
                style={{
                  background:
                    "conic-gradient(from 90deg,rgba(12, 12, 12, 0.26) 0deg,rgba(150, 205, 244, 0) 269.885deg,rgba(0, 147, 255, 0.37) 360deg)",
                  height: "100%",
                  width: "100%",
                  opacity: 0.5,
                }}
              />
            </foreignObject>
          </g>
        </g>
        <circle cx="280.104" cy="280.264" r="202.697" shapeRendering="crispEdges" fill="#0000FF" fillOpacity="0.2" />
        <circle cx="280.104" cy="280.264" r="202.197" stroke="black" shapeRendering="crispEdges" />
      </g>
      <defs>
        <filter
          id="filter0_d_1144_1095"
          x="0.751099"
          y="0.91098"
          width="558.707"
          height="558.707"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
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
  );
}
