// src/App.tsx
import { LedIndicator } from "./components/LedIndicator";
import { ButtonToggle } from "./components/ButtonToggle";
import { WebSocketProvider } from "./WebSocketProvider";
import { BackgroundSVG } from "./components/backgroundSVG";
import Cligno_G_D from "./components/Cligno_G_D";
import Cligno_D from "./components/Cligno_D";
import FeuxCode from "./components/FeuxCode";
import FeuxRoute from "./components/FeuxRoute";
import FreinPark from "./components/FreinPark";
import VueGenerale from "./components/Cadran_cpt.tsx";
import GradCpt from "./components/GradCpt.tsx";
import EllipseCpt from "./components/EllipseCpt.tsx";
import TextLabel from "./components/TextLabel";
import SliderRpm from "./components/SliderRpm";
import RpmDyn from "./components/RpmDyn";
import FeuxAntibrouillard from "./components/FeuxAntibrouillard";
import FeuxAntibrouillardArriere from "./components/FeuxAntibrouillardArriere";
import VoyantCeinture from "./components/Ceinture";
import { DragProvider } from "./DragContext";
import ToggleDragButton from "./components/ToggleDragButton.tsx";
import CadranVitesse from "./components/CadranVitesse.tsx";
import GradVit from "./components/GradVit.tsx";
import GaugeCarbu from "./components/GaugeCarbu";
import CarSimu from "./components/CarSimu";
import VitSimu from "./components/VitSimu.tsx";
import IconPetrole from "./components/IconPetrole.tsx";




export default function App() {
  return (
    <WebSocketProvider>
     <DragProvider> {/* ⬅️ Ajout ici */}
      <div className="relative w-screen h-screen overflow-hidden bg-black text-white">
        <BackgroundSVG />
        <Cligno_G_D />
        <Cligno_D />
        <FeuxCode />
        <FeuxRoute />
        <FreinPark />
        <VueGenerale />
        <GradCpt />
        <EllipseCpt />
        <TextLabel />
        <SliderRpm />
        <RpmDyn />
        <FeuxAntibrouillard />
        <FeuxAntibrouillardArriere />
        <VoyantCeinture />
        <CadranVitesse />
        <GradVit />
        <GaugeCarbu />
        <CarSimu />
        <VitSimu />
        <IconPetrole />


        <div className="relative z-10 h-full w-full flex flex-col items-center justify-center gap-10 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-screen-xl">
            <div className="flex flex-col gap-4">
              <ToggleDragButton/>
              <LedIndicator label="Frein" variable="voyant_frein" />
              <LedIndicator label="Buzzer" variable="buzzer" />
              <ButtonToggle variable="mode" />
              <ButtonToggle variable="contact" />
              <ButtonToggle variable="frein" />
              <ButtonToggle variable="warning" />
              <ButtonToggle variable="cligno_g" /> {/* ✅ simulation gauche */}
              <ButtonToggle variable="cligno_d" /> {/* ✅ simulation droite */}
              <ButtonToggle variable="feux_code" /> {/* ✅ simulation feux de code */}
              <ButtonToggle variable="feux_route" /> {/* ✅ simulation feux de route */}
              <ButtonToggle variable="antibrouillard" /> {/* ✅ simulation feux antibrouillard */}
              <ButtonToggle variable="antibrouillardarr" /> {/* ✅ simulation feux antibrouillard arriere */}
              <ButtonToggle variable="ceinture" /> {/* ✅ simulation Ceinture */}
            </div>
          </div>
        </div>
      </div>
     </DragProvider>
    </WebSocketProvider>
  );
}
