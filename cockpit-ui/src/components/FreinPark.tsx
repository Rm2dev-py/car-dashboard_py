
import { useEffect, useState, useRef } from "react";
import { useWS } from "../WebSocketProvider";

export default function FeuxRoute() {
  const wsData = useWS();
  const isOn = wsData?.voyant_frein === 1 || wsData?.voyant_frein === true;

  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("freinPark_position");
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
    localStorage.setItem("freinPark_position", JSON.stringify(position));
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
            d="M18.9674 25.1958C12.2195 25.1958 6.75246 19.7155 6.75246 12.9808C6.75246 6.23286 12.2195 0.765832 18.9674 0.765832C25.7022 0.765832 31.1824 6.23286 31.1824 12.9808C31.1824 19.7155 25.7022 25.1958 18.9674 25.1958ZM36.9796 12.9808C36.9796 16.9556 35.6986 20.6135 33.5066 23.5979C33.084 24.1658 32.3841 24.2186 31.8559 23.7828C31.3673 23.3734 31.3145 22.7264 31.6974 22.1982C33.599 19.6099 34.7082 16.4142 34.7082 12.9808C34.7082 9.5342 33.599 6.3385 31.6974 3.75025C31.3145 3.23524 31.3541 2.58817 31.8559 2.1656C32.3841 1.72982 33.084 1.79585 33.4933 2.36368C35.6986 5.33489 36.9796 9.00599 36.9796 12.9808ZM0.942097 12.9808C0.942097 9.00599 2.23622 5.33489 4.42832 2.36368C4.83768 1.79585 5.55077 1.72982 6.07899 2.1656C6.56759 2.58817 6.62041 3.23524 6.23745 3.75025C4.33588 6.3385 3.22663 9.5342 3.22663 12.9808C3.22663 16.4142 4.33588 19.6099 6.23745 22.1982C6.6072 22.7264 6.56759 23.3734 6.07899 23.7828C5.55077 24.2186 4.83768 24.1658 4.42832 23.5979C2.23622 20.6135 0.942097 16.9556 0.942097 12.9808ZM18.9674 22.9245C24.4609 22.9245 28.9111 18.4742 28.9111 12.9808C28.9111 7.48737 24.4609 3.03716 18.9674 3.03716C13.474 3.03716 9.02379 7.48737 9.02379 12.9808C9.02379 18.4742 13.474 22.9245 18.9674 22.9245ZM18.9674 15.1729C18.3072 15.1729 17.9506 14.8164 17.9374 14.1561L17.7657 7.72507C17.7525 7.05159 18.2411 6.5762 18.9542 6.5762C19.6409 6.5762 20.1559 7.0648 20.1427 7.73827L19.9578 14.1429C19.9446 14.8164 19.5881 15.1729 18.9674 15.1729ZM18.9674 19.2666C18.2147 19.2666 17.5809 18.6723 17.5809 17.946C17.5809 17.2065 18.2015 16.6255 18.9674 16.6255C19.7201 16.6255 20.3408 17.1933 20.3408 17.946C20.3408 18.6855 19.7069 19.2666 18.9674 19.2666Z"
            fill={isOn ? "red" : "#FFFFFF"}
          />
        </g>
        <defs>
          <filter id="filter0_d_1144_909" x="0.849121" y="0.855896" width="48.4217" height="26.2366" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
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