// src/components/BackgroundSVG.tsx
import { useStage } from "../lib/DragSystem";

/**
 * Fond cockpit.
 * - S'étire exactement sur la surface de la stage (baseWidth x baseHeight)
 * - L’alignement/centrage est géré par ResponsiveStage (pas d’absolu/transform ici)
 * - Aucune interaction (pointer-events: none)
 */
export default function BackgroundSVG() {
  const { baseWidth, baseHeight } = useStage();

  return (
    <div
      style={{
        width: baseWidth,
        height: baseHeight,
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 1850 650"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
      >
        {/* Ombre portée sur le fond */}
        <g filter="url(#filter0_d_1144_882)">
          <path
            d="M474.126 51.6048C452.167 24.8451 380.354 10.5266 208.415 100.512C-46.8423 234.101 -20.7205 613.305 334.991 602.786C493.359 598.103 610.536 568.794 688.887 544.343C764.948 520.607 840.995 522.923 916.498 548.375C986.32 571.912 1090.51 598.358 1240.25 602.786C1595.96 613.305 1622.08 234.101 1366.83 100.512C1194.89 10.5266 1123.08 24.8451 1101.12 51.6048C1094.65 59.487 1086.26 67.3772 1076.06 67.3772H499.177C488.981 67.3772 480.594 59.487 474.126 51.6048Z"
            fill="#181818"
          />
          <path
            d="M474.126 51.6048C452.167 24.8451 380.354 10.5266 208.415 100.512C-46.8423 234.101 -20.7205 613.305 334.991 602.786C493.359 598.103 610.536 568.794 688.887 544.343C764.948 520.607 840.995 522.923 916.498 548.375C986.32 571.912 1090.51 598.358 1240.25 602.786C1595.96 613.305 1622.08 234.101 1366.83 100.512C1194.89 10.5266 1123.08 24.8451 1101.12 51.6048C1094.65 59.487 1086.26 67.3772 1076.06 67.3772H499.177C488.981 67.3772 480.594 59.487 474.126 51.6048Z"
            stroke="url(#paint0_linear_1144_882)"
            strokeWidth="3.78625"
          />
        </g>

        <defs>
          <filter
            id="filter0_d_1144_882"
            x="0.325611"
            y="0.717756"
            width="1574.59"
            height="649.07"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="8.11338" />
            <feGaussianBlur stdDeviation="18.3903" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.44 0"
            />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1144_882" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1144_882" result="shape" />
          </filter>

          <linearGradient
            id="paint0_linear_1144_882"
            x1="787.621"
            y1="69.1396"
            x2="787.595"
            y2="642.756"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#333333" />
            <stop offset="0.195145" stopColor="#181818" />
            <stop offset="0.861522" stopColor="#1E1E1E" />
            <stop offset="1" stopColor="#287033" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
9