import { useRef, useState } from "react";
import globeImg from "./assets/globe.svg";
import SearchBarDropdown from "./components/search-bar-dropdown/SearchBarDropdown";
import CountryDetailCard from "./components/country-detail-card/CountryDetailCard";
import InstructionsModal from "./components/instructions-modal/InstructionsModal";
import type { IGetCountriesResponse } from "./types/countries";

type Country = IGetCountriesResponse["data"]["objects"][number];

function App() {
  if (!import.meta.env.VITE_REST_COUNTRIES_API_KEY) {
    console.error(
      "API key is missing. Please set VITE_REST_COUNTRIES_API_KEY in your .env file.",
    );
  }

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const helpButtonRef = useRef<HTMLButtonElement>(null);

  const sectionStyle = "flex flex-col items-center justify-center w-full gap-5";

  return (
    <div className={`${sectionStyle} sm:p-10`}>
      <section className={`${sectionStyle} p-5`}>
        <img src={globeImg} alt="World Globe" className="max-w-xl" />
        <div className="flex flex-row items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold">
            Look up the World's Countries
          </h1>
          <button
            ref={helpButtonRef}
            type="button"
            aria-label="How to use this site"
            onClick={() => setIsInstructionsOpen(true)}
            className="w-8 h-8 shrink-0 rounded-full border-black border-2 font-bold hover:bg-blue-400 hover:text-white"
          >
            ?
          </button>
        </div>
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
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        triggerRef={helpButtonRef}
      />
    </div>
  );
}

export default App;
