// src/components/oil.tsx
import React from "react";
import { useWS } from "../WebSocketProvider";

type Props = {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  onColor?: string;   // couleur quand le voyant est ON
  offColor?: string;  // couleur quand le voyant est OFF
  title?: string;     // accessibilité
};

export default function Oil({
  width = 27,
  height = 13,
  className = "",
  style,
  onColor = "orange",
  offColor = "#FFFFFF",  // pour modifier la transparence mettre "none"
  title = "Voyant huile",
}: Props) {
  const wsData = useWS();
  const isOn = wsData?.voyant_oil === 1 || wsData?.voyant_oil === true;
  const fill = isOn ? onColor : offColor;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 27 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{title}</title>
      <path
        d="M1.2703 5.46942C0.0682252 3.6699 1.42866 1.76962 3.32174 2.49662L6.48888 3.71309C6.67603 3.6771 6.87758 3.66271 7.10072 3.66271H8.89303V2.28068H7.45342C7.07192 2.28068 6.74801 1.96397 6.74801 1.58247C6.74801 1.20097 7.07192 0.88426 7.45342 0.88426H11.7794C12.1609 0.88426 12.4849 1.20097 12.4849 1.58247C12.4849 1.96397 12.1609 2.28068 11.7794 2.28068H10.3398V3.66271H12.017C12.528 3.66271 12.9023 3.76348 13.255 4.09459L14.3563 5.1599L22.9292 2.87092C23.4403 2.73416 23.721 2.80614 24.0089 3.05807L25.1246 4.037C25.9236 4.74241 24.8943 5.79333 24.0953 5.10951L23.1668 4.31053L20.5755 5.00154L15.7528 11.1775C15.2273 11.8541 14.4571 12.1492 13.3054 12.1492H7.10072C6.10019 12.1492 5.45956 11.8325 4.99169 11.1271L1.2703 5.46942ZM2.29242 4.53367L4.71097 8.21187V6.01647C4.71097 5.46222 4.81894 5.00874 5.03488 4.66323L2.84667 3.81387C2.34281 3.62672 2.0045 4.08019 2.29242 4.53367ZM24.6568 12.6243C23.7138 12.6243 22.9364 11.8829 22.9364 10.9399C22.9364 10.4001 23.2027 9.88902 23.4619 9.40675L24.5056 7.49207C24.5488 7.42009 24.5848 7.3769 24.6568 7.3769C24.7287 7.3769 24.7863 7.42009 24.8223 7.48487L25.8588 9.40675C26.118 9.88902 26.3843 10.4001 26.3843 10.9399C26.3843 11.8829 25.6069 12.6243 24.6568 12.6243Z"
        fill={fill}
      />
    </svg>
  );
}
