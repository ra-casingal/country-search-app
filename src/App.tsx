import { useState } from "react";
import globeImg from "./assets/globe.svg";
import SearchBarDropdown from "./components/search-bar-dropdown/SearchBarDropdown";
import CountryDetailCard from "./components/country-detail-card/CountryDetailCard";
import type { IGetCountriesResponse } from "./types/countries";

type Country = IGetCountriesResponse["data"]["objects"][number];

function App() {
  if (!import.meta.env.VITE_REST_COUNTRIES_API_KEY) {
    console.error(
      "API key is missing. Please set VITE_REST_COUNTRIES_API_KEY in your .env file.",
    );
  }

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const sectionStyle = "flex flex-col items-center justify-center w-full";

  return (
    <div className={sectionStyle + " p-20"}>
      <section className={sectionStyle}>
        <img src={globeImg} alt="World Globe" className="max-w-xl" />
        <h1 className="text-2xl font-bold">Look up the World's Countries</h1>
        <SearchBarDropdown onSelect={setSelectedCountry} />
      </section>
      <section className={sectionStyle + " gap-2 p-5"}>
        {selectedCountry && (
          <CountryDetailCard
            officialName={selectedCountry.names.official}
            flagUrl={selectedCountry.flag.url_svg}
            currencies={selectedCountry.currencies}
            drivingSide={selectedCountry.cars.driving_side}
          />
        )}
      </section>
    </div>
  );
}

export default App;
