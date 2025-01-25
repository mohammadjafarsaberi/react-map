import { useMapEvent } from "react-leaflet";
import { useSearchContext } from "../context/SearchContext";

const DetectLocation = () => {
  const { setLatitude, setLongitude, setSelectedLocation } = useSearchContext();

  const map = useMapEvent("dblclick", (e) => {
    const target = e.originalEvent.target as HTMLElement | null; // Cast to ensure correct type
    if (!target) return; // If no target, exit early

    const isButtonClick = target.closest('button[title="Location"]');
    const isSearchbar = target.closest("#searchbar");
    const isForm = target.closest("#searchForm");
    const isBaseSwitchButton = target.closest("#baseMapSwitcher");
    if (isButtonClick || isSearchbar || isForm || isBaseSwitchButton) {
      return;
    }

    map.setView(e.latlng, map.getZoom());
    setLatitude(e.latlng.lat);
    setLongitude(e.latlng.lng);
    setSelectedLocation(null);
  });

  return null;
};

export default DetectLocation;
