import { useEffect } from "react";
import { useSearchContext } from "../context/SearchContext";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FormData {
  locationName: string;
  latitude: number;
  longitude: number;
  altitude: number | null;
}

export default function Form() {
  const { register, reset, setValue, handleSubmit } = useForm<FormData>();
  const {
    locations,
    setLocations,
    setFilteredLocations,
    selectedLocation,
    setSelectedLocation,
    latitude,
    longitude,
    setLatitude,
    setLongitude,
  } = useSearchContext();

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setValue("latitude", latitude);
      setValue("longitude", longitude);
    }
  }, [latitude, longitude, setValue]);

  // till here
  useEffect(() => {
    if (selectedLocation) {
      setValue("locationName", selectedLocation.locationName);
      setValue("latitude", selectedLocation.latitude);
      setValue("longitude", selectedLocation.longitude);
      setValue("altitude", selectedLocation.altitude);
    } else if (latitude !== null && longitude !== null) {
      // Clear specific fields except latitude and longitude

      setValue("locationName", ""); // Clear featureDescription
      setValue("altitude", null); // Clear altitude
      setValue("latitude", latitude); // Retain latitude
      setValue("longitude", longitude); // Retain longitude
    } else {
      reset(); // Reset all if no lat/long and no selected location
    }
  }, [selectedLocation, setValue, reset, latitude, longitude]);

  const handleDelete = () => {
    if (selectedLocation) {
      const updatedLocations = locations.filter(
        (location) => location.locationName !== selectedLocation.locationName
      );
      setLocations(updatedLocations);
      setFilteredLocations(updatedLocations);
      setSelectedLocation(null);
      reset();
      toast.success(`${selectedLocation.locationName} has been deleted`);
      console.log("Location deleted:", selectedLocation);
    }
  };
  const onSubmit = (data: FormData) => {
    const processedData = {
      ...data,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      altitude: Number(data.altitude),
    };

    if (selectedLocation) {
      const updatedLocations = locations.map((location) =>
        location.locationName === selectedLocation.locationName
          ? { ...location, ...processedData }
          : location
      );
      setLocations(updatedLocations);
      setFilteredLocations(updatedLocations);
      // these 2 state belongs to detectClick
      setLatitude(null);
      setLongitude(null);
      console.log("Location updated:", processedData);
    } else {
      const newLocation = { ...processedData };
      const updatedLocations = [...locations, newLocation];
      setLocations(updatedLocations);
      setFilteredLocations(updatedLocations);
      toast.success(`Location add: ${newLocation.locationName}`);
      console.log("Location added:", newLocation);
    }
    reset();
    setSelectedLocation(null);
  };
  function handleCancel() {
    setSelectedLocation(null);
    // these 2 state belongs to detectClick
    setLatitude(null);
    setLongitude(null);
    reset();
  }

  return (
    <>
      {(latitude !== null || longitude !== null || selectedLocation) && (
        <form
          id="searchForm"
          style={{ zIndex: 999 }}
          onSubmit={handleSubmit(onSubmit)}
          className="relative max-w-md ml-14 mt-3 p-4 bg-[#d4d4d8] shadow-md  col-span-3 rounded-md w-full "
        >
          <button
            className="absolute top-0 rtl:left-0 ltr:right-0 p-1 rounded-3xl bg-lightModeElement dark:bg-darkModeElement text-lightModeColor dark:text-darkModeColor hover:bg-opacity-90 transition"
            onClick={handleCancel}
            type="button"
            style={{ zIndex: 999 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M6.225 6.225a.75.75 0 011.06 0L12 10.94l4.715-4.715a.75.75 0 011.06 1.06L13.06 12l4.715 4.715a.75.75 0 01-1.06 1.06L12 13.06l-4.715 4.715a.75.75 0 01-1.06-1.06L10.94 12 6.225 7.285a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-semibold">
                Location Name
              </label>
              <input
                type="text"
                {...register("locationName", {
                  required: "Feature locationName is required",
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-semibold">
                Latitude
              </label>
              <input
                type="text"
                {...register("latitude", { required: "Latitude is required" })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-semibold">
                Longitude
              </label>
              <input
                type="text"
                {...register("longitude", {
                  required: "Longitude is required",
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-semibold">
                Altitude
              </label>
              <input
                type="text"
                {...register("altitude", { required: "Altitude is required" })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={() => reset()}
              className="py-1.5 px-3 bg-gray-500 text-white text-sm rounded-md shadow-sm"
            >
              Clear
            </button>
            {selectedLocation && (
              <button
                type="button"
                onClick={handleDelete}
                className="py-1.5 px-3 bg-red-600 text-white text-sm rounded-md shadow-sm"
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              className="py-1.5 px-3 bg-blue-600 text-white text-sm rounded-md shadow-sm"
            >
              {selectedLocation ? "Update" : "Add"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
