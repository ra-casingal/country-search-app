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

  const sectionStyle = "flex flex-col items-center justify-center w-full gap-5";

  return (
    <div className={sectionStyle + " sm:p-10"}>
      <section className={sectionStyle + " p-5"}>
        <img src={globeImg} alt="World Globe" className="max-w-xl" />
        <h1 className="text-xl sm:text-2xl font-bold">
          Look up the World's Countries
        </h1>
        <SearchBarDropdown onSelect={setSelectedCountry} />
      </section>
      <section className={sectionStyle}>
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
