// src/components/registry.ts
import type { ComponentType, } from "react";

// Voyants & icônes
import FeuxCode from "./FeuxCode";
import Cligno_D from "./Cligno_D";
import Cligno_G_D from "./Cligno_G_D";
import FeuxRoute from "./FeuxRoute";
import FreinPark from "./FreinPark";
import FeuxAntibrouillard from "./FeuxAntibrouillard";
import FeuxAntibrouillardArriere from "./FeuxAntibrouillardArriere";
import VoyantCeinture from "./Ceinture";
import IconPetrole from "./IconPetrole";
import Oil from "./Oil";
import GaugeCarbu from "./GaugeCarbu";

// Cadrans / gauges / décor
import CadranVitesse from "./CadranVitesse";
import GradVit from "./GradVit";
import GradCpt from "./GradCpt";
import EllipseCpt from "./EllipseCpt";
import TextLabel from "./TextLabel";
import RpmDyn from "./RpmDyn";
import VueGenerale from "./Cadran_cpt";


// Fond (export nommé dans backgroundSVG.tsx)
import BackgroundSVG from "./backgroundSVG";

export type Registry = Record<string, React.ComponentType<any>>;

// ⚠️ Si certains imports ci-dessus n’existent pas encore dans ton repo,
// commente-les TEMPORAIREMENT pour laisser compiler, ou crée des stubs.

export const COMPONENTS: Record<string, ComponentType<any>> = {
  // Fond
  BackgroundSVG,

  // Voyants & icônes
  FeuxCode,
  Cligno_D,
  Cligno_G_D,
  FeuxRoute,
  FreinPark,
  FeuxAntibrouillard,
  FeuxAntibrouillardArriere,
  VoyantCeinture,
  IconPetrole,
  Oil,
  GaugeCarbu,

  // Cadrans / gauges / décor
  CadranVitesse,
  GradVit,
  GradCpt,
  EllipseCpt,
  TextLabel,
  RpmDyn,
  VueGenerale
};
