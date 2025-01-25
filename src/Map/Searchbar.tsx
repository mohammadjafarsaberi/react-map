import { useForm } from "react-hook-form";
import { useSearchContext } from "../context/SearchContext";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function SearchBar() {
  const {
    locations,
    setFilteredLocations,
    mapRef,
    setSelectedCategory,
    setLatitudeInput,
    setLongitudeInput,
    latitudeInput,
    longitudeInput,
    selectedCategory,
  } = useSearchContext();
  const { reset } = useForm<FormData>();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setDropdownOpen(false);
    setSearchInput("");
    setLatitudeInput("");
    setLongitudeInput("");
  };

  // Memoized category options
  const categoryOptions = useMemo(() => {
    return {
      locationName: Array.from(
        new Set(locations.map((loc) => loc.locationName))
      ),
      LatAndLong: Array.from(
        new Set(locations.map((loc) => `${loc.latitude},${loc.longitude}`))
      ),
      latitude: Array.from(
        new Set(locations.map((loc) => String(loc.latitude)))
      ),
      longitude: Array.from(
        new Set(locations.map((loc) => String(loc.longitude)))
      ),
    };
  }, [locations]);
  // belong to detectLocation functionality

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedCategory === "LatAndLong") {
      const latitude = latitudeInput.trim();
      const longitude = longitudeInput.trim();

      if (!latitude || !longitude) {
        toast.error("Please provide both latitude and longitude.");
        return;
      }

      const filteredLocations = locations.filter((location) => {
        const locationLat = location.latitude;
        const locationLng = location.longitude;
        return (
          locationLat === Number(latitude) && locationLng === Number(longitude)
        );
      });

      if (filteredLocations.length === 0) {
        toast.error("No matching locations found.");
        return;
      }

      setFilteredLocations(filteredLocations);

      // Fly to the first matched location on the map while searching by latitude and longitude
      const { latitude: lat, longitude: lng } = filteredLocations[0];
      console.log(lat, lng);
      if (mapRef?.current) {
        mapRef.current.flyTo([lat, lng], 14);
      }
    } else {
      const criteria = searchInput.trim().toLowerCase();

      if (!criteria) {
        toast.error(`Please enter a search value for ${selectedCategory}.`);
        return;
      }

      const filteredLocations = locations.filter((location) =>
        String(location[selectedCategory]).toLowerCase().includes(criteria)
      );

      if (filteredLocations.length === 0) {
        toast.error("No matching locations found. Try again.");
        return;
      }

      setFilteredLocations(filteredLocations);
      reset();
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput.trim()) {
        const filtered = categoryOptions[selectedCategory].filter((option) =>
          option.toLowerCase().includes(searchInput.trim().toLowerCase())
        );
        setFilteredOptions(filtered);
      } else {
        setFilteredOptions([]); // Clear if input is empty
      }
    }, 300); // Set to 300ms for quicker updates

    // Cleanup function to clear the timeout when input changes or component unmounts
    return () => clearTimeout(timeoutId);
  }, [searchInput, selectedCategory, categoryOptions, setFilteredOptions]);

  const handleOptionSelect = (option: string) => {
    const sanitizedInput = String(option).trim();

    setSearchInput(sanitizedInput);

    const matchingLocation = locations.find(
      (location) =>
        String(location[selectedCategory]).toLowerCase() ===
        sanitizedInput.toLowerCase()
    );

    if (matchingLocation) {
      setFilteredLocations([matchingLocation]);

      const { latitude: lat, longitude: lng } = matchingLocation;
      if (mapRef.current) {
        mapRef.current.flyTo([lat, lng], 17);
      }
    }

    // Clear dropdown options
    setFilteredOptions([]);
    setSearchInput("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return (
    <div
      id="searchbar"
      className="flex relative mt-3 ml-14 w-96 rtl:mr-3  "
      style={{ zIndex: 1000 }}
    >
      <button
        id="dropdown-button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200"
        type="button"
      >
        {capitalizeFirstLetter(selectedCategory)}
        <svg
          className="w-2.5 h-2.5 ms-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {dropdownOpen && (
        <div
          id="dropdown"
          ref={dropdownRef}
          className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 mt-1"
        >
          <ul className="py-2 text-sm text-gray-700 bg-gray-100">
            {Object.keys(categoryOptions).map((category) => (
              <li key={category}>
                <button
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className="inline-flex w-full px-4 py-2  hover:bg-gray-200"
                >
                  {capitalizeFirstLetter(category)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="relative w-full">
        {selectedCategory === "LatAndLong" ? (
          <div>
            <input
              type="text"
              value={latitudeInput}
              onChange={(e) => setLatitudeInput(e.target.value)}
              className="block p-2 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-sm border outline-none  border-gray-300"
              placeholder="Latitude"
            />
            <input
              type="text"
              value={longitudeInput}
              onChange={(e) => setLongitudeInput(e.target.value)}
              className="block p-2 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-sm border outline-none  border-gray-300"
              placeholder="Longitude"
            />
          </div>
        ) : (
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border outline-none  border-gray-300"
            placeholder={`Search by ${capitalizeFirstLetter(selectedCategory)}`}
          />
        )}

        {filteredOptions.length > 0 && (
          <ul className="absolute w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-y-auto z-10 rounded-md shadow-lg">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOptionSelect(option)}
                className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-gray-700"
              >
                {option}
              </li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          onClick={handleSearchSubmit}
          className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-black bg-gray-100 rounded-e-lg border  hover:bg-gray-200"
        >
          Search
        </button>
      </div>
    </div>
  );
}
