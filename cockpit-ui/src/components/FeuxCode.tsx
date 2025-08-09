// src/components/FeuxCode.tsx
import { useEffect, useState, useRef } from "react";
import { useWS } from "../WebSocketProvider";

export default function FeuxCode() {
  const wsData = useWS();
  const isOn = wsData?.voyant_code === 1 || wsData?.voyant_code === true;
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("feuxcode_position");
    return saved ? JSON.parse(saved) : { x: 600, y: 100 };
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
    localStorage.setItem("feuxcode_position", JSON.stringify(position));
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
            d="M41.0583 4.69865C40.5697 4.97597 39.9754 4.83071 39.6981 4.3289C39.4076 3.85351 39.5661 3.24606 40.0547 2.95555L43.2108 1.14641C43.6994 0.85589 44.2672 1.02756 44.5577 1.54257C44.8482 2.01796 44.6898 2.58579 44.2012 2.87631L41.0583 4.69865ZM9.07486 4.69865L5.93198 2.87631C5.43018 2.58579 5.28492 2.01796 5.57544 1.54257C5.85275 1.02756 6.43379 0.85589 6.92238 1.14641L10.0785 2.95555C10.5671 3.24606 10.7255 3.85351 10.435 4.3289C10.1445 4.83071 9.56346 4.97597 9.07486 4.69865ZM24.129 9.9808C24.129 13.6651 20.207 17.1513 16.2586 17.1513H15.9152C14.0401 17.1513 13.1685 16.4382 12.6799 14.5895C12.3762 13.2954 12.2045 11.8692 12.2045 9.9808C12.2045 8.09244 12.3762 6.65305 12.6799 5.37213C13.1685 3.51017 14.0401 2.81029 15.9152 2.81029H16.2586C20.207 2.81029 24.129 6.29651 24.129 9.9808ZM26.0042 9.9808C26.0042 6.29651 29.9129 2.81029 33.8614 2.81029H34.2179C36.0931 2.81029 36.9646 3.51017 37.4532 5.37213C37.7569 6.65305 37.9154 8.09244 37.9154 9.9808C37.9154 11.8692 37.7569 13.2954 37.4532 14.5895C36.9646 16.4382 36.0931 17.1513 34.2179 17.1513H33.8614C29.9129 17.1513 26.0042 13.6651 26.0042 9.9808ZM22.0954 9.9808C22.0954 7.22088 19.4147 4.83071 16.2586 4.83071H15.9152C15.1757 4.83071 14.8588 5.08161 14.6211 5.87393C14.3702 7.0228 14.225 8.26411 14.225 9.9808C14.225 11.6975 14.3702 12.9388 14.6211 14.1009C14.8588 14.8668 15.1757 15.1177 15.9152 15.1177H16.2586C19.4147 15.1177 22.0954 12.7407 22.0954 9.9808ZM28.0246 9.9808C28.0246 12.7407 30.7185 15.1177 33.8614 15.1177H34.2179C34.9574 15.1177 35.2743 14.8668 35.512 14.1009C35.7629 12.9388 35.9082 11.6975 35.9082 9.9808C35.9082 8.26411 35.7629 7.0228 35.512 5.87393C35.2743 5.08161 34.9574 4.83071 34.2179 4.83071H33.8614C30.7185 4.83071 28.0246 7.22088 28.0246 9.9808ZM9.47102 8.9772C10.0389 8.9772 10.4746 9.39977 10.4746 9.9676C10.4746 10.5354 10.0389 10.9712 9.47102 10.9712H5.83954C5.27171 10.9712 4.84914 10.5354 4.84914 9.9676C4.84914 9.39977 5.27171 8.9772 5.83954 8.9772H9.47102ZM40.6621 8.9772H44.2936C44.8614 8.9772 45.2708 9.39977 45.2708 9.9676C45.2708 10.5354 44.8614 10.9712 44.2936 10.9712H40.6621C40.0943 10.9712 39.6585 10.5354 39.6585 9.9676C39.6585 9.39977 40.0943 8.9772 40.6621 8.9772ZM9.07486 15.2497C9.56346 14.9724 10.1445 15.1177 10.435 15.6195C10.7255 16.0949 10.5671 16.7023 10.0785 16.9797L6.92238 18.802C6.43379 19.0925 5.85275 18.9208 5.57544 18.4058C5.28492 17.9304 5.43018 17.3494 5.93198 17.0721L9.07486 15.2497ZM41.0583 15.2497L44.2012 17.0721C44.6898 17.3494 44.8482 17.9304 44.5577 18.4058C44.2672 18.9208 43.6994 19.0925 43.2108 18.802L40.0547 16.9797C39.5661 16.7023 39.4076 16.0949 39.6981 15.6195C39.9754 15.1177 40.5697 14.9724 41.0583 15.2497Z"
            fill={isOn ? "lime" : "#FFFFFF"}
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
