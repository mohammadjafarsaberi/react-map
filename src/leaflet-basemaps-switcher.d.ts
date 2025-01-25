// src/types/leaflet-switch-basemap.d.ts
declare module "leaflet-switch-basemap" {
  import * as L from "leaflet";
  export interface BasemapOptions {
    layer: L.Layer;
    icon: string;
    name: string;
  }
  export class BasemapsSwitcher extends L.Control {
    constructor(basemaps: BasemapOptions[], options?: L.ControlOptions);
  }
}
