import React, { useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const baseMaps = [
  {
    layerUrl: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    icon: "../../public/Capture1.png",
    name: "Light Map",
    caption: "Map 1",
  },
  {
    layerUrl:
      "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    icon: "../../public/Capture2.png",
    name: "Dark Map",
    caption: "Map 2",
  },
  {
    layerUrl:
      " https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png",
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    icon: "../../public/Capture3.png",
    name: "Satellite Map",
    caption: "Map 3",
  },
];

const BaseMapSwitcher: React.FC = () => {
  const map = useMap();
  const [activeMap, setActiveMap] = useState<string>(baseMaps[0].name);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const switchBaseLayer = (
    layerUrl: string,
    attribution: string,
    name: string
  ) => {
    if (name === activeMap) return; // Prevent switching if already active
    map.eachLayer((layer) => {
      if ((layer as any)._url) {
        map.removeLayer(layer);
      }
    });
    L.tileLayer(layerUrl, { attribution }).addTo(map);
    setActiveMap(name);
  };

  return (
    <div
      id="baseMapSwitcher"
      style={{ zIndex: 999 }}
      className="absolute top-4 right-4 shadow-md rounded"
    >
      <div
        className="relative flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered ? (
          <div className="flex ">
            {baseMaps.map((baseMap, index) => (
              <div
                key={index}
                className="relative cursor-pointer p-[5px] mx-1 text-center  bg-white rounded "
                onClick={() =>
                  switchBaseLayer(
                    baseMap.layerUrl,
                    baseMap.attribution,
                    baseMap.name
                  )
                }
              >
                <div className="relative">
                  {/* Map image */}
                  <img
                    src={baseMap.icon}
                    alt={baseMap.name}
                    className={`w-16 h-16 rounded object-cover`}
                  />

                  {/* Tickmark for selected map */}
                  {activeMap === baseMap.name && (
                    <div className="absolute top-1 right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✔</span>
                    </div>
                  )}

                  {/* Caption overlay */}
                  <div className="absolute bottom-0 w-full bg-white bg-opacity-50 text-black text-xs py-1 rounded-b">
                    {baseMap.caption}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative cursor-pointer p-[5px] bg-white rounded">
            <div className="relative">
              {/* Active map image */}
              <img
                src={baseMaps.find((map) => map.name === activeMap)?.icon}
                alt={activeMap}
                className="w-16 h-16 rounded object-cover"
              />

              {/* Tickmark for active map */}
              <div className="absolute top-1 right-1 bg-green-600 rounded-full w-4 h-4 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✔</span>
              </div>

              {/* Caption overlay */}
              <div className="absolute bottom-0 w-full bg-white bg-opacity-50 text-black text-center text-xs py-1 rounded-b">
                {baseMaps.find((map) => map.name === activeMap)?.caption}
                {/* Active map caption */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseMapSwitcher;
