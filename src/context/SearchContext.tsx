import React, { createContext, useContext, useRef, useState } from "react";
import toast from "react-hot-toast";
import { CustomLocation, initialLocations } from "../Map/Location";
import { LatLng } from "leaflet";
type SearchContextProps = {
  locations: CustomLocation[];
  setLocations: React.Dispatch<React.SetStateAction<CustomLocation[]>>;
  filteredLocations: CustomLocation[];
  setFilteredLocations: React.Dispatch<React.SetStateAction<CustomLocation[]>>;
  handleSearch: (criteria: Partial<CustomLocation>) => void;
  resetSearch: () => void;
  mapRef: React.RefObject<L.Map | null>;
  selectedLocation: CustomLocation | null;
  setSelectedLocation: (location: CustomLocation | null) => void;
  latitude: number | null;
  longitude: number | null;
  setLatitude: React.Dispatch<React.SetStateAction<number | null>>;
  setLongitude: React.Dispatch<React.SetStateAction<number | null>>;
  position: LatLng | null;
  setPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  latitudeInput: string;
  setLatitudeInput: React.Dispatch<React.SetStateAction<string>>;
  longitudeInput: string;
  setLongitudeInput: React.Dispatch<React.SetStateAction<string>>;
};

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locations, setLocations] =
    useState<CustomLocation[]>(initialLocations); // initial data
  const [filteredLocations, setFilteredLocations] =
    useState<CustomLocation[]>(initialLocations);
  const mapRef = useRef<L.Map | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<CustomLocation | null>(null);

  // Relate to detectClick event
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [position, setPosition] = useState<LatLng | null>(null);

  const [selectedCategory, setSelectedCategory] =
    useState<string>("locationName");
  const [latitudeInput, setLatitudeInput] = useState<string>("");
  const [longitudeInput, setLongitudeInput] = useState<string>("");

  const handleSearch = (criteria: Partial<CustomLocation>) => {
    const filtered = locations.filter((location) => {
      return (
        (!criteria.locationName ||
          location.locationName.includes(criteria.locationName)) &&
        (!criteria.latitude || location.latitude === criteria.latitude) &&
        (!criteria.longitude || location.longitude === criteria.longitude)
      );
    });

    if (filtered.length === 0) {
      toast.error("No matching locations found. Try again.");
      setFilteredLocations([]);
    } else {
      setFilteredLocations(filtered);
    }
  };

  const resetSearch = () => {
    setFilteredLocations(locations);
    if (mapRef.current) {
      mapRef.current.flyTo([34.5197775, 69.1797548], 6); // Replace with desired coordinates
    }
  };

  return (
    <SearchContext.Provider
      value={{
        locations,
        setLocations,
        filteredLocations,
        setFilteredLocations,
        handleSearch,
        resetSearch,
        mapRef,
        selectedLocation,
        setSelectedLocation,
        latitude,
        longitude,
        setLatitude,
        setLongitude,
        position,
        setPosition,
        selectedCategory,
        setSelectedCategory,
        latitudeInput,
        setLatitudeInput,
        longitudeInput,
        setLongitudeInput,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};
