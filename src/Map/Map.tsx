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
import BaseMapSwitcher from "../components/BaseMapSwitcher";
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
      <BaseMapSwitcher />
      <DetectClick />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MarkerClusterGroup>
        {filteredLocations.map((location) => (
          <Marker
            key={location.description}
            position={[location.latitude, location.longitude]}
            icon={markerIcon}
            eventHandlers={{
              click: () =>
                handleMarkerClick(location.latitude, location.longitude),
            }}
          >
            <Tooltip permanent>{location.description}</Tooltip>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default Map;
