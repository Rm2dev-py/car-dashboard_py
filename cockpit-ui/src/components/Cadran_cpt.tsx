// src/components/VueGenerale.tsx
import React from "react";

type VueGeneraleProps = {
  /** Dimensions logiques (la scène globale sera scalée par ResponsiveStage) */
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Composant pur : aucun drag, aucun localStorage, aucun positionnement.
 * Le placement est fait par <Draggable id="vue_generale" ...> selon le layout JSON.
 */
export default function VueGenerale({
  width = 469.68,
  height = 331.38,
  className = "",
  style,
}: VueGeneraleProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 469.68 331.38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x="233.566" y="0.0836792" width="4.51389" height="22.5694" rx="2.25694" fill="#D9D9D9"/>
      <rect x="248.566" y="0.428345" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(3.6 248.566 0.428345)" fill="#2D5E8B"/>
      <rect x="263.19" y="1.69418" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(7.2 263.19 1.69418)" fill="#2D5E8B"/>
      <rect x="277.707" y="3.87613" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(10.8 277.707 3.87613)" fill="#2D5E8B"/>
      <rect x="292.096" y="6.9772" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(14.4 292.096 6.9772)" fill="#2D5E8B"/>
      <rect x="320.073" y="15.8249" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(21.6 320.073 15.8249)" fill="#2D5E8B"/>
      <rect x="333.591" y="21.5482" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(25.2 333.591 21.5482)" fill="#2D5E8B"/>
      <rect x="346.722" y="28.1092" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(28.8 346.722 28.1092)" fill="#2D5E8B"/>
      <rect x="359.416" y="35.4816" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(32.4 359.416 35.4816)" fill="#2D5E8B"/>
      <rect x="383.29" y="52.5413" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(39.6 383.29 52.5413)" fill="yellow"/>
      <rect x="394.378" y="62.1612" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(43.2 394.378 62.1612)" fill="yellow"/>
      <rect x="404.838" y="72.4588" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(46.8 404.838 72.4588)" fill="yellow"/>
      <rect x="414.632" y="83.3933" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(50.4 414.632 83.3933)" fill="yellow"/>
      <rect x="432.066" y="106.995" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(57.6 432.066 106.995)" fill="yellow"/>
      <rect x="439.638" y="119.571" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(61.2 439.638 119.571)" fill="yellow"/>
      <rect x="446.406" y="132.597" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(64.8 446.406 132.597)" fill="yellow"/>
      <rect x="452.341" y="146.023" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(68.4 452.341 146.023)" fill="yellow"/>
      <rect x="461.628" y="173.858" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(75.6 461.628 173.858)" fill="red"/>
      <rect x="464.943" y="188.157" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(79.2 464.943 188.157)" fill="red"/>
      <rect x="467.354" y="202.637" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(82.8 467.354 202.637)" fill="red"/>
      <rect x="468.85" y="217.239" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(86.4 468.85 217.239)" fill="red"/>
      <rect x="469.082" y="246.582" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(93.6 469.082 246.582)" fill="red"/>
      <rect x="467.816" y="261.205" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(97.2 467.816 261.205)" fill="red"/>
      <rect x="465.634" y="275.722" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(100.8 465.634 275.722)" fill="red"/>
      <rect x="462.546" y="290.076" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(104.4 462.546 290.076)" fill="red"/>
      <rect x="9.87894" y="293.63" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-104.4 9.87894 293.63)" fill="#2D5E8B"/>
      <rect x="6.56387" y="279.33" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-100.8 6.56387 279.33)" fill="#2D5E8B"/>
      <rect x="4.15286" y="264.85" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-97.2 4.15286 264.85)" fill="#2D5E8B"/>
      <rect x="2.6571" y="250.247" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-93.6 2.6571 250.247)" fill="#2D5E8B"/>
      <rect x="2.4252" y="220.906" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-86.4 2.4252 220.906)" fill="#2D5E8B"/>
      <rect x="3.69128" y="206.281" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-82.8 3.69128 206.281)" fill="#2D5E8B"/>
      <rect x="5.87302" y="191.764" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-79.2 5.87302 191.764)" fill="#2D5E8B"/>
      <rect x="8.96277" y="177.415" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-75.6 8.96277 177.415)" fill="#2D5E8B"/>
      <rect x="17.8086" y="149.437" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-68.4 17.8086 149.437)" fill="#2D5E8B"/>
      <rect x="23.5328" y="135.919" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-64.8 23.5328 135.919)" fill="#2D5E8B"/>
      <rect x="30.0929" y="122.788" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-61.2 30.0929 122.788)" fill="#2D5E8B"/>
      <rect x="37.4654" y="110.095" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-57.6 37.4654 110.095)" fill="#2D5E8B"/>
      <rect x="54.5259" y="86.2203" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-50.4 54.5259 86.2203)" fill="#2D5E8B"/>
      <rect x="64.1458" y="75.1335" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-46.8 64.1458 75.1335)" fill="#2D5E8B"/>
      <rect x="74.4426" y="64.6723" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-43.2 74.4426 64.6723)" fill="#2D5E8B"/>
      <rect x="85.377" y="54.8784" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-39.6 85.377 54.8784)" fill="#2D5E8B"/>
      <rect x="108.98" y="37.4439" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-32.4 108.98 37.4439)" fill="#2D5E8B"/>
      <rect x="121.556" y="29.8723" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-28.8 121.556 29.8723)" fill="#2D5E8B"/>
      <rect x="134.582" y="23.1057" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-25.2 134.582 23.1057)" fill="#2D5E8B"/>
      <rect x="148.007" y="17.1693" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-21.6 148.007 17.1693)" fill="#2D5E8B"/>
      <rect x="175.841" y="7.88208" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-14.4 175.841 7.88208)" fill="#2D5E8B"/>
      <rect x="190.141" y="4.56705" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-10.8 190.141 4.56705)" fill="#2D5E8B"/>
      <rect x="204.621" y="2.15683" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-7.2 204.621 2.15683)" fill="#2D5E8B"/>
      <rect x="219.223" y="0.660248" width="3.6854" height="12.5304" rx="1.8427" transform="rotate(-3.6 219.223 0.660248)" fill="#2D5E8B"/>
      <rect x="306.238" y="10.8796" width="4.51389" height="22.5694" rx="2.25694" transform="rotate(18 306.238 10.8796)" fill="#D9D9D9"/>
      <rect x="372.026" y="43.6088" width="4.51389" height="22.5694" rx="2.25694" transform="rotate(36 372.026 43.6088)" fill="yellow"/>
      <rect x="424.482" y="95.0655" width="4.51389" height="22.5694" rx="2.25694" transform="rotate(54 424.482 95.0655)" fill="yellow"/>
      <rect x="458.467" y="160.213" width="4.51389" height="22.5694" rx="2.25694" transform="rotate(72 458.467 160.213)" fill="red"/>
      <rect x="470.66" y="232.675" width="4.51389" height="22.5694" rx="2.25694" transform="rotate(90 470.66 232.675)" fill="red"/>
      <rect x="459.863" y="305.357" width="4.51389" height="22.5694" rx="2.25694" transform="rotate(108 459.863 305.357)" fill="red"/>
      <rect x="13.1677" y="309.651" width="4.51389" height="22.5694" rx="2.25694" transform="rotate(-108 13.1677 309.651)" fill="#D9D9D9"/>
      <rect x="0.974915" y="237.189" width="4.51389" height="22.5694" rx="2.25694" transform="rotate(-90 0.974915 237.189)" fill="#D9D9D9"/>
      <rect x="11.7728" y="164.506" width="4.51389" height="22.5694" rx="2.25694" transform="rotate(-72 11.7728 164.506)" fill="#D9D9D9"/>
      <rect x="44.501" y="98.7171" width="4.51389" height="22.5694" rx="2.25694" transform="rotate(-54 44.501 98.7171)" fill="#D9D9D9"/>
      <rect x="95.9567" y="46.2619" width="4.51389" height="22.5694" rx="2.25694" transform="rotate(-36 95.9567 46.2619)" fill="#D9D9D9"/>
      <rect x="161.105" y="12.2754" width="4.51389" height="22.5694" rx="2.25694" transform="rotate(-18 161.105 12.2754)" fill="#D9D9D9"/>
    </svg>
  );
}
