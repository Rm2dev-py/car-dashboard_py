// src/components/FeuxRoute.tsx
import { useEffect, useState, useRef } from "react";
import { useWS } from "../WebSocketProvider";

export default function FeuxRoute() {
  const wsData = useWS();
  const isOn = wsData?.voyant_pleinphare === 1 || wsData?.voyant_pleinphare === true;

  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("feuxroute_position");
    return saved ? JSON.parse(saved) : { x: 700, y: 100 };
  });

  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    offset.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging.current) return;
    const clientX = "touches" in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = "touches" in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    const grid = 5;
    const snappedX = Math.round((clientX - offset.current.x) / grid) * grid;
    const snappedY = Math.round((clientY - offset.current.y) / grid) * grid;
    setPosition({ x: snappedX, y: snappedY });
  };

  const handleEnd = () => {
    dragging.current = false;
  };

  useEffect(() => {
    localStorage.setItem("feuxroute_position", JSON.stringify(position));
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
        zIndex: 20,
        cursor: "grab",
        touchAction: "none",
      }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      <svg
        width="50"
        height="28"
        viewBox="0 0 50 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_1144_909)">
          <path
            d="M12.3231 10.9808C12.3231 8.63025 12.4948 6.34572 13.1551 4.02157C13.921 1.45973 15.3604 0.535353 18.3712 0.535353H19.0711C26.4133 0.535353 32.9235 5.34211 32.9235 10.9808C32.9235 16.6195 26.4133 21.4131 19.0711 21.4131H18.3712C15.3472 21.4131 13.9078 20.5019 13.1551 17.94C12.4948 15.6159 12.3231 13.3314 12.3231 10.9808ZM14.4492 10.9808C14.4492 13.5955 14.6605 15.4838 15.1887 17.359C15.6113 18.772 16.4564 19.3002 18.3712 19.3002H19.0711C25.1984 19.3002 30.8107 15.4046 30.8107 10.9808C30.8107 6.557 25.1984 2.63501 19.0711 2.63501H18.3712C16.4828 2.63501 15.6245 3.16322 15.1887 4.60261C14.6605 6.47777 14.4492 8.35294 14.4492 10.9808ZM0.253418 3.98196C0.253418 3.41412 0.728812 2.95194 1.29664 2.95194H11.1611C10.963 3.48015 10.8309 4.00837 10.6196 5.02518H1.29664C0.728812 5.02518 0.253418 4.56299 0.253418 3.98196ZM0.253418 8.64345C0.253418 8.07562 0.728812 7.60023 1.29664 7.60023H10.2367C10.1707 8.28691 10.1178 8.97359 10.0914 9.68668L1.29664 9.67347C0.742017 9.67347 0.253418 9.21128 0.253418 8.64345ZM0.253418 13.305C0.253418 12.7503 0.728812 12.2617 1.29664 12.2617H10.0914C10.1178 12.9616 10.1707 13.6483 10.2367 14.335H1.29664C0.728812 14.335 0.253418 13.8728 0.253418 13.305ZM0.253418 17.9664C0.253418 17.4118 0.728812 16.9232 1.29664 16.9232H10.6196C10.7385 17.5439 10.9762 18.4947 11.1479 18.9965H1.29664C0.728812 18.9965 0.253418 18.5343 0.253418 17.9664Z"
            fill={isOn ? "blue" : "#FFFFFF"}
          />
        </g>
        <defs>
          <filter id="filter0_d_1144_909" x="0.849121" y="0.855896" width="48.4217" height="26.2366" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1144_909" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1144_909" result="shape" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
