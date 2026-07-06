import type { IGetCountriesResponse } from "../../types/countries";
import BouncingCirclesSvgIcon from "../../utils/get-converted-bouncing-circle-svg/get-converted-bouncing-circle-svg";

export default function SearchBar({
  handleSearch,
  setSearchData,
  setQuery,
  query,
  isLoading,
}: {
  handleSearch: () => void;
  setSearchData: React.Dispatch<
    React.SetStateAction<IGetCountriesResponse["data"]["objects"]>
  >;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  query: string;
  isLoading: boolean;
}) {
  const inputBoxStyle = "p-2.5 rounded-md border-black border-2";

  return (
    <div className="p-5 max-w-xs flex flex-row gap-1">
      <input
        type="search"
        placeholder="Search a country..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={inputBoxStyle}
        onReset={() => {
          setQuery("");
          setSearchData([]);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        disabled={isLoading} // Disable input while loading
      />
      <button
        className={
          inputBoxStyle +
          " hover:bg-blue-700 hover:text-white transition-colors duration-300"
        }
        onClick={handleSearch}
        disabled={isLoading}
      >
        {isLoading ? <BouncingCirclesSvgIcon /> : "Search"}
      </button>
    </div>
  );
}
