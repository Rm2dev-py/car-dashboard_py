// src/pages/Cockpit.tsx
import { BackgroundSVG } from "../components/backgroundSVG";
import Cligno_G_D from "../components/Cligno_G_D";
import Cligno_D from "../components/Cligno_D";
import FeuxCode from "../components/FeuxCode";
import FeuxRoute from "../components/FeuxRoute";
import FreinPark from "../components/FreinPark";
import VueGenerale from "../components/Cadran_cpt";
import GradCpt from "../components/GradCpt";
import EllipseCpt from "../components/EllipseCpt";
import TextLabel from "../components/TextLabel";
import RpmDyn from "../components/RpmDyn";
import FeuxAntibrouillard from "../components/FeuxAntibrouillard";
import FeuxAntibrouillardArriere from "../components/FeuxAntibrouillardArriere";
import VoyantCeinture from "../components/Ceinture";
import CadranVitesse from "../components/CadranVitesse";
import GradVit from "../components/GradVit";
import GaugeCarbu from "../components/GaugeCarbu";
import IconPetrole from "../components/IconPetrole";


export default function Cockpit() {
  return (
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
      <RpmDyn />
      <FeuxAntibrouillard />
      <FeuxAntibrouillardArriere />
      <VoyantCeinture />
      <CadranVitesse />
      <GradVit />
      <GaugeCarbu />
      <IconPetrole />
      
    </div>
  );
}
