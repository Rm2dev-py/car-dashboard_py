// src/pages/TestConfig.tsx
import SliderRpm from "../components/SliderRpm";
import CarSimu from "../components/CarSimu";
import VitSimu from "../components/VitSimu";
import ToggleDragButton from "../components/ToggleDragButton";
import { LedIndicator } from "../components/LedIndicator";
import { ButtonToggle } from "../components/ButtonToggle";

export default function TestConfig() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white">
      <SliderRpm />
      <CarSimu />
      <VitSimu />

      {/* Panneau de test/config — identique pour que rien ne bouge */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center gap-10 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-screen-xl">
          <div className="flex flex-col gap-4">
            <ToggleDragButton />
            <LedIndicator label="Frein" variable="voyant_frein" />
            <LedIndicator label="Buzzer" variable="buzzer" />
            <ButtonToggle variable="mode" />
            <ButtonToggle variable="contact" />
            <ButtonToggle variable="frein" />
            <ButtonToggle variable="warning" />
            <ButtonToggle variable="cligno_g" />
            <ButtonToggle variable="cligno_d" />
            <ButtonToggle variable="feux_code" />
            <ButtonToggle variable="feux_route" />
            <ButtonToggle variable="antibrouillard" />
            <ButtonToggle variable="antibrouillardarr" />
            <ButtonToggle variable="ceinture" />
            <ButtonToggle variable="Oil" />
          </div>
        </div>
      </div>
    </div>
  );
}
