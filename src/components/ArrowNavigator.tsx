import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { CustomLocation } from "../Map/Location";
import { useSearchContext } from "../context/SearchContext";

interface ArrowKeyNavigatorProps {
  filteredLocations: CustomLocation[];
}

function ArrowKeyNavigator({ filteredLocations }: ArrowKeyNavigatorProps) {
  const map = useMap(); // Get map instance
  const { setSelectedLocation, selectedLocation } = useSearchContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!map || filteredLocations.length === 0) return;
      if (!selectedLocation) return;
      let newIndex = currentIndex;

      // Determine the new index based on the key pressed
      switch (event.key) {
        case "ArrowUp":
        case "ArrowRight": // Optional: Handle both 'up' and 'right' similarly
          newIndex = (currentIndex + 1) % filteredLocations.length;
          break;
        case "ArrowDown":
        case "ArrowLeft": // Optional: Handle both 'down' and 'left' similarly
          newIndex =
            (currentIndex - 1 + filteredLocations.length) %
            filteredLocations.length;
          break;
        default:
          return; // Ignore other keys
      }

      // Update the current index and pan the map
      setCurrentIndex(newIndex);
      const newLocation = filteredLocations[newIndex];
      if (newLocation) {
        const newCenter = L.latLng(newLocation.latitude, newLocation.longitude);
        map.panTo(newCenter); // Move smoothly to the new center
      }

      setSelectedLocation(newLocation);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    map,
    filteredLocations,
    currentIndex,
    setSelectedLocation,
    selectedLocation,
  ]);

  return null;
}

export default ArrowKeyNavigator;
