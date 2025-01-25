import { Toaster } from "react-hot-toast";
import { SearchProvider } from "./context/SearchContext";
import Map from "./Map/Map";

function App() {
  return (
    <div>
      <SearchProvider>
        <Map />
        <Toaster position="top-center" reverseOrder={false} />
      </SearchProvider>
    </div>
  );
}

export default App;
