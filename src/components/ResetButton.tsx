import { useSearchContext } from "../context/SearchContext";

export default function ResetButton() {
  const {
    handleSearch,
    mapRef,
    setSelectedLocation,
    selectedCategory,
    setLatitude,
    setLongitude,
  } = useSearchContext();

  const resetSearch = () => {
    setSelectedLocation(null);
    setLatitude(null);
    setLongitude(null);
    handleSearch({ [selectedCategory]: "" });
    if (mapRef && mapRef.current) {
      mapRef.current.flyTo([34.5197775, 69.1797548], 6);
    }
  };
  return (
    <button
      id="resetZoom"
      title="Recenter Map"
      style={{ zIndex: 999 }}
      onClick={resetSearch}
      className="p-1 bg-[#fff] text-black m-2 absolute w-7 top-32 left-1 shadow-sm rounded-sm flex justify-center items-center hover:bg-[#f6f6f6]
          "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-black"
        viewBox="0 0 24 24"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path d="m21 21l-6-6M3.268 12.043A7.02 7.02 0 0 0 9.902 17a7.01 7.01 0 0 0 7.043-6.131a7 7 0 0 0-5.314-7.672A7.02 7.02 0 0 0 3.39 7.6" />
          <path d="M3 4v4h4" />
        </g>
      </svg>
    </button>
  );
}
