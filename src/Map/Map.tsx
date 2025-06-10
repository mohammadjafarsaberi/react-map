import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import { useSearchContext } from "../context/SearchContext";
import ArrowKeyNavigator from "../components/ArrowNavigator";
import FindYourLocation from "../components/FindYourLocation";
import DetectClick from "../components/DetectClick";
import SearchBar from "./Searchbar";
import Form from "./Form";
import ResetButton from "../components/ResetButton";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const Map: React.FC = () => {
  const { filteredLocations, setSelectedLocation, setPosition } =
    useSearchContext();
  const [zoom] = useState(6);
  const [center, setCenter] = useState<[number, number]>([
    34.5197775, 69.1797548,
  ]);

  const { mapRef } = useSearchContext();

  const handleMarkerClick = (lat: number, lng: number) => {
    // Find the location by latitude and longitude
    const existingLocation = filteredLocations.find(
      (loc) => loc.latitude === lat && loc.longitude === lng
    );

    // If the location exists, update selectedLocation
    if (existingLocation) {
      setSelectedLocation(existingLocation);
      setPosition(null);
    } else {
      setSelectedLocation(null);
    }

    // Update the map center and zoom
    setCenter([lat, lng]);
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 17);
    }
  };

  return (
    <MapContainer
      className=" h-screen relative"
      center={center}
      zoom={zoom}
      style={{ flex: 1 }}
      scrollWheelZoom={true}
      ref={mapRef}
      keyboard={true}
      doubleClickZoom={false}
      attributionControl={false}
    >
      <SearchBar />
      <Form />
      <ArrowKeyNavigator filteredLocations={filteredLocations} />
      <FindYourLocation />
      <ResetButton />
      <DetectClick />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MarkerClusterGroup>
        {filteredLocations.map((location) => (
          <Marker
            key={location.locationName}
            position={[location.latitude, location.longitude]}
            icon={markerIcon}
            eventHandlers={{
              click: () =>
                handleMarkerClick(location.latitude, location.longitude),
            }}
          >
            <Tooltip permanent>{location.locationName}</Tooltip>
          </Marker>
        ))}
      </MarkerClusterGroup>
      <a
        style={{ zIndex: 1000 }}
        href="https://github.com/mohammadjafarsaberi"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800 flex items-center"
        aria-label="Visit my GitHub profile"
        tabIndex={0}
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
          />
        </svg>
      </a>
    </MapContainer>
  );
};

export default Map;
