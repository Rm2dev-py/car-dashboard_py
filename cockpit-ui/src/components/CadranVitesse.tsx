// src/components/CadranVitesse.tsx
import React, { useEffect, useState } from "react";
import { useWS } from "../WebSocketProvider";

type Props = {
  width?: number;                  // dimensions logiques (scalées par ResponsiveStage)
  height?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function CadranVitesse({
  width = 468.95,
  height = 468.95,
  className = "",
  style,
}: Props) {
  const wsData = useWS();

  // 0–3.3V -> 0–240 km/h
  const voltage = Number(wsData?.vitesse ?? 0);
  const speed = Math.max(0, Math.min(240, (voltage / 3.3) * 240));
  const vitesse = Math.round(speed);

  // Mapping vitesse -> angle
  const MIN_ANGLE = -107;
  const MAX_ANGLE = 107;
  const targetAngle = MIN_ANGLE + (speed / 240) * (MAX_ANGLE - MIN_ANGLE);

  // Adoucissement de l’aiguille
  const [angle, setAngle] = useState(targetAngle);
  useEffect(() => {
    let raf: number;
    let prev = performance.now();
    const MAX_SPEED = 600; // deg/sec
    const tick = (now: number) => {
      const dt = (now - prev) / 1000;
      prev = now;
      setAngle(a => {
        const diff = targetAngle - a;
        const maxStep = MAX_SPEED * dt;
        return Math.abs(diff) <= maxStep ? targetAngle : a + Math.sign(diff) * maxStep;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [targetAngle]);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 468.95 468.95"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* === Ton décor/gradutations === */}
              <rect x="233.099" y="0.0834351" width="3.41078" height="17.0539" rx="1.70539" fill="#D9D9D9" />
        <rect x="251.746" y="0.696136" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(4.5 251.746 0.696136)" fill="#FF0707" />
        <rect x="270.042" y="2.75198" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(9 270.042 2.75198)" fill="#FF0707" />
        <rect x="288.12" y="6.23624" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(13.5 288.12 6.23624)" fill="#FF0707" />
        <rect x="305.87" y="11.1285" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(18 305.87 11.1285)" fill="#FF0707" />
        <rect x="323.18" y="17.3977" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(22.5 323.18 17.3977)" fill="#FF0707" />
        <rect x="339.946" y="25.0067" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(27 339.946 25.0067)" fill="#FF0707" />
        <rect x="356.063" y="33.9077" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(31.5 356.063 33.9077)" fill="#FF0707" />
        <rect x="385.959" y="55.3575" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(40.5 385.959 55.3575)" fill="#FF0707" />
        <rect x="399.552" y="67.7746" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(45 399.552 67.7746)" fill="#FF0707" />
        <rect x="412.13" y="81.22" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(49.5 412.13 81.22)" fill="#FF0707" />
        <rect x="433.934" y="110.858" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(58.5 433.934 110.858)" fill="#FF0707" />
        <rect x="443.026" y="126.868" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(63 443.026 126.868)" fill="#FF0707" />
        <rect x="450.832" y="143.543" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(67.5 450.832 143.543)" fill="#FF0707" />
        <rect x="462.409" y="178.468" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(76.5 462.409 178.468)" fill="#FF0707" />
        <rect x="466.11" y="196.505" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(81 466.11 196.505)" fill="#FF0707" />
        <rect x="468.382" y="214.775" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(85.5 468.382 214.775)" fill="#FF0707" />
        <rect x="468.6" y="251.568" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(94.5 468.6 251.568)" fill="#FF0707" />
        <rect x="466.545" y="269.865" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(99 466.545 269.865)" fill="#FF0707" />
        <rect x="463.06" y="287.943" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(103.5 463.06 287.943)" fill="#FF0707" />
        <rect x="451.898" y="323.003" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(112.5 451.898 323.003)" fill="#FF0707" />
        <rect x="444.29" y="339.769" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(117 444.29 339.769)" fill="#FF0707" />
        <rect x="435.388" y="355.885" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(121.5 435.388 355.885)" fill="#FF0707" />
        <rect x="425.25" y="371.255" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(126 425.25 371.255)" fill="#FF0707" />
        <rect x="413.938" y="385.781" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(130.5 413.938 385.781)" fill="#FF0707" />
        <rect x="401.521" y="399.375" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(135 401.521 399.375)" fill="#FF0707" />
        <rect x="388.075" y="411.953" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(139.5 388.075 411.953)" fill="#FF0707" />
        <rect x="358.438" y="433.756" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(148.5 358.438 433.756)" fill="#FF0707" />
        <rect x="325.753" y="450.655" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(157.5 325.753 450.655)" fill="#FF0707" />
        <rect x="290.827" y="462.233" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(166.5 290.827 462.233)" fill="#FF0707" />
        <rect x="254.521" y="468.204" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(175.5 254.521 468.204)" fill="#FF0707" />
        <rect x="236.129" y="469.037" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(180 236.129 469.037)" fill="#FF0707" />
        <rect x="217.727" y="468.423" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-175.5 217.727 468.423)" fill="#FF0707" />
        <rect x="199.432" y="466.367" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-171 199.432 466.367)" fill="#FF0707" />
        <rect x="181.353" y="462.882" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-166.5 181.353 462.882)" fill="#FF0707" />
        <rect x="163.604" y="457.99" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-162 163.604 457.99)" fill="#FF0707" />
        <rect x="146.292" y="451.721" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-157.5 146.292 451.721)" fill="#FF0707" />
        <rect x="129.527" y="444.112" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-153 129.527 444.112)" fill="#FF0707" />
        <rect x="113.41" y="435.211" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-148.5 113.41 435.211)" fill="#FF0707" />
        <rect x="98.0415" y="425.073" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-144 98.0415 425.073)" fill="#FF0707" />
        <rect x="83.5143" y="413.761" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-139.5 83.5143 413.761)" fill="#FF0707" />
        <rect x="69.9202" y="401.344" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-135 69.9202 401.344)" fill="#FF0707" />
        <rect x="57.3435" y="387.899" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-130.5 57.3435 387.899)" fill="#FF0707" />
        <rect x="45.8602" y="373.508" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-126 45.8602 373.508)" fill="#FF0707" />
        <rect x="35.5392" y="358.26" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-121.5 35.5392 358.26)" fill="#FF0707" />
        <rect x="26.4484" y="342.25" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-117 26.4484 342.25)" fill="#FF0707" />
        <rect x="18.6403" y="325.576" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-112.5 18.6403 325.576)" fill="#FF0707" />
        <rect x="7.06274" y="290.651" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-103.5 7.06274 290.651)" fill="#FF0707" />
        <rect x="3.36438" y="272.615" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-99 3.36438 272.615)" fill="#FF0707" />
        <rect x="1.09167" y="254.345" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-94.5 1.09167 254.345)" fill="#FF0707" />
        <rect x="0.259644" y="235.952" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-90 0.259644 235.952)" fill="#FF0707" />
        <rect x="0.872803" y="217.551" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-85.5 0.872803 217.551)" fill="#FF0707" />
        <rect x="2.92761" y="199.254" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-81 2.92761 199.254)" fill="#FF0707" />
        <rect x="6.41296" y="181.175" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-76.5 6.41296 181.175)" fill="#FF0707" />
        <rect x="11.3053" y="163.426" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-72 11.3053 163.426)" fill="#FF0707" />
        <rect x="17.5753" y="146.116" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-67.5 17.5753 146.116)" fill="#FF0707" />
        <rect x="25.1837" y="129.35" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-63 25.1837 129.35)" fill="#FF0707" />
        <rect x="34.0846" y="113.232" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-58.5 34.0846 113.232)" fill="#FF0707" />
        <rect x="44.2222" y="97.8636" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-54 44.2222 97.8636)" fill="#FF0707" />
        <rect x="55.5343" y="83.3376" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-49.5 55.5343 83.3376)" fill="#FF0707" />
        <rect x="67.9513" y="69.7435" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-45 67.9513 69.7435)" fill="#FF0707" />
        <rect x="81.3969" y="57.1656" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-40.5 81.3969 57.1656)" fill="#FF0707" />
        <rect x="95.7883" y="45.6825" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-36 95.7883 45.6825)" fill="#FF0707" />
        <rect x="111.036" y="35.3624" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-31.5 111.036 35.3624)" fill="#FF0707" />
        <rect x="127.046" y="26.2716" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-27 127.046 26.2716)" fill="#FF0707" />
        <rect x="143.72" y="18.4645" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-22.5 143.72 18.4645)" fill="#FF0707" />
        <rect x="160.955" y="11.9886" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-18 160.955 11.9886)" fill="#FF0707" />
        <rect x="178.645" y="6.88589" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-13.5 178.645 6.88589)" fill="#FF0707" />
        <rect x="196.681" y="3.18668" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-9 196.681 3.18668)" fill="#FF0707" />
        <rect x="214.951" y="0.914978" width="2.78476" height="8.91123" rx="1.39238" transform="rotate(-4.5 214.951 0.914978)" fill="#FF0707" />
        <rect x="305.401" y="10.9944" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(18 305.401 10.9944)" fill="#D9D9D9" />
        <rect x="370.794" y="43.7152" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(36 370.794 43.7152)" fill="#D9D9D9" />
        <rect x="422.875" y="95.0409" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(54 422.875 95.0409)" fill="#D9D9D9" />
        <rect x="456.546" y="159.949" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(72 456.546 159.949)" fill="#D9D9D9" />
        <rect x="468.511" y="232.086" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(90 468.511 232.086)" fill="#D9D9D9" />
        <rect x="457.601" y="304.389" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(108 457.601 304.389)" fill="#D9D9D9" />
        <rect x="373.553" y="421.862" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(144 373.553 421.862)" fill="#D9D9D9" />
        <rect x="342.424" y="441.253" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(153 342.424 441.253)" fill="#D9D9D9" />
        <rect x="308.645" y="455.534" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(162 308.645 455.534)" fill="#D9D9D9" />
        <rect x="273.048" y="464.355" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(171 273.048 464.355)" fill="#D9D9D9" />
        <rect x="236.509" y="467.499" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(180 236.509 467.499)" fill="#D9D9D9" />
        <rect x="199.928" y="464.889" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(-171 199.928 464.889)" fill="#D9D9D9" />
        <rect x="164.205" y="456.588" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(-162 164.205 456.588)" fill="#D9D9D9" />
        <rect x="130.221" y="442.801" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(-153 130.221 442.801)" fill="#D9D9D9" />
        <rect x="98.8138" y="423.868" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(-144 98.8138 423.868)" fill="#D9D9D9" />
        <rect x="13.0613" y="307.633" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(-108 13.0613 307.633)" fill="#D9D9D9" />
        <rect x="1.09558" y="235.497" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(-90 1.09558 235.497)" fill="#D9D9D9" />
        <rect x="12.0076" y="163.194" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(-72 12.0076 163.194)" fill="#D9D9D9" />
        <rect x="44.7275" y="97.8008" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(-54 44.7275 97.8008)" fill="#D9D9D9" />
        <rect x="96.0541" y="45.7196" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(-36 96.0541 45.7196)" fill="#D9D9D9" />
        <rect x="160.961" y="14.0489" width="3.70852" height="18.5426" rx="1.85426" transform="rotate(-18 160.961 14.0489)" fill="#D9D9D9" />
      {/* …tes <rect> … (copie/colle ici ton bloc existant) … */}

      {/* Centre (moyeu) */}
      <circle cx="235" cy="235" r="15" fill="#FF0707" stroke="#500" strokeWidth="3" />

      {/* Valeur numérique */}
      <text x="235" y="310" textAnchor="middle" fontSize="32" fontFamily="system-ui" fontWeight="700" fill="#EEE">
        {vitesse}
      </text>
      <text x="235" y="280" textAnchor="middle" fontSize="20" fontFamily="system-ui" fill="#888">
        km/h
      </text>

      {/* Aiguille dynamique */}
      <g transform={`rotate(${angle} 235 235)`}>
        <line x1="235" y1="235" x2="235" y2="40" stroke="#FF0707" strokeWidth="4" strokeLinecap="round" />
        <line x1="235" y1="235" x2="235" y2="260" stroke="#FF0707" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}
