// FindYourLocation.tsx
import React, { useState } from "react";
import { useMapEvents, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useSearchContext } from "../context/SearchContext";
import toast from "react-hot-toast";

const FindYourLocation: React.FC = () => {
  // const [position, setPosition] = useState<LatLng | null>(null);
  const [locateActive, setLocateActive] = useState(false);
  const {
    position,
    setPosition,
    setSelectedLocation,
    setLatitude,
    setLongitude,
  } = useSearchContext();
  const markerIcon = L.divIcon({
    className: "pulsing-dot",
    iconSize: [20, 20],
    iconAnchor: [10, 10], // Anchor the icon at the center
  });
  const map = useMapEvents({
    click() {
      if (locateActive) {
        map.locate();
        setLocateActive(false); // Reset after initiating location find
      }
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 16);
    },
    locationerror() {
      toast.error("Cannot find your location");
    },
  });

  const handleLocate = (e: React.MouseEvent<HTMLButtonElement>) => {
    L.DomEvent.stopPropagation(e.nativeEvent);
    if (position) {
      // If a position already exists, clear it
      setPosition(null);
      map.stop();
    } else {
      // If no position exists, locate the user
      map.locate();
      setLatitude(null);
      setLongitude(null);
    }

    setSelectedLocation(null);
  };

  return (
    <>
      <button
        title="Location"
        onClick={handleLocate}
        style={{ zIndex: 999 }}
        className="p-1 bg-[#fff] text-black m-2 absolute w-7 top-20 left-1 shadow-sm rounded-sm flex justify-center items-center hover:bg-[#f6f6f6]
          "
        ref={(el) => {
          if (el) {
            // Prevent map events on this button
            L.DomEvent.disableClickPropagation(el);
            L.DomEvent.disableScrollPropagation(el);
          }
        }}
      >
        {position ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            viewBox="0 0 100 100"
          >
            <path
              fill="currentColor"
              d="M43 0v13.166C27.944 16.03 16.03 27.944 13.166 43H0v14h13.166C16.03 72.056 27.944 83.97 43 86.834V100h14V86.834C72.056 83.97 83.97 72.056 86.834 57H100V43H86.834C83.97 27.944 72.056 16.03 57 13.166V0zm7 22.5A27.425 27.425 0 0 1 77.5 50A27.425 27.425 0 0 1 50 77.5A27.425 27.425 0 0 1 22.5 50A27.425 27.425 0 0 1 50 22.5"
              color="currentColor"
            />
            <circle
              cx="50"
              cy="50"
              r="15"
              fill="currentColor"
              color="currentColor"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            viewBox="0 0 100 100"
          >
            <path
              fill="currentColor"
              d="M43 0v13.166C27.944 16.03 16.03 27.944 13.166 43H0v14h13.166C16.03 72.056 27.944 83.97 43 86.834V100h14V86.834C72.056 83.97 83.97 72.056 86.834 57H100V43H86.834C83.97 27.944 72.056 16.03 57 13.166V0zm7 22.5A27.425 27.425 0 0 1 77.5 50A27.425 27.425 0 0 1 50 77.5A27.425 27.425 0 0 1 22.5 50A27.425 27.425 0 0 1 50 22.5"
              color="currentColor"
            />
          </svg>
        )}
      </button>

      {position && (
        <Marker position={position} icon={markerIcon}>
          <Popup>
            <div className="text-center">
              <strong>You Are Here!</strong>
              <p>
                Geolocation: [{position.lat},{position.lng}]
              </p>
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
};

export default FindYourLocation;
