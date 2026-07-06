import { useEffect, useState } from "react";
import globeImg from "./assets/globe.svg";
import SearchBar from "./components/search-bar/SearchBar";
import CountryCard from "./components/country-card/CountryCard";
import Pagination from "./components/pagination/Pagination";
import type { IGetCountriesResponse } from "./types/countries";
import { useSearchParams } from "react-router";

function App() {
  if (!import.meta.env.VITE_REST_COUNTRIES_API_KEY) {
    console.error(
      "API key is missing. Please set VITE_REST_COUNTRIES_API_KEY in your .env file.",
    );
  }

  const [searchData, setSearchData] = useState<
    IGetCountriesResponse["data"]["objects"]
  >([]);
  const [searchMetaData, setSearchMetaData] = useState<
    IGetCountriesResponse["data"]["meta"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") || "1");
  const [query, setQuery] = useState(searchParams.get("name") || "");
  const [searchedQuery, setSearchedQuery] = useState(query);

  const sectionStyle = "flex flex-col items-center justify-center w-full";

  const handleSearch = () => {
    setSearchedQuery(query); // Update the searchedQuery state with the current query
    setSearchParams(new URLSearchParams({ name: query, page: "1" })); // Update the search params in the URL
    setPage("1"); // Reset to the first page
  };

  useEffect(() => {
    const fetchData = async () => {
      if (searchedQuery !== "") {
        try {
          setIsLoading(true);
          console.log(
            "Fetching data for query:",
            searchedQuery,
            "and page:",
            page,
          );
          const response = await fetch(
            `https://api.restcountries.com/countries/v5?q=${searchedQuery}&response_fields=currencies,names.common,names.official,flag.url_svg,cars.driving_side&limit=10&offset=${(parseInt(page) - 1) * 10}`,
            {
              headers: {
                Authorization:
                  "Bearer " + import.meta.env.VITE_REST_COUNTRIES_API_KEY,
              },
            },
          );
          const data: IGetCountriesResponse = await response.json();
          // If the user navigates to a page that doesn't exist (e.g., page 5 when there are only 3 pages), reset to the first page
          if (data.data.objects.length === 0 && parseInt(page) > 1) {
            setPage("1");
            setSearchParams(
              new URLSearchParams({ name: searchedQuery, page: "1" }),
            );
            return;
          }
          setSearchData(data.data.objects || []);
          setSearchMetaData(data.data.meta || null);
        } catch (error) {
          console.error("Error fetching countries:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [page, searchedQuery, setSearchParams]);

  return (
    <div className={sectionStyle + " p-20"}>
      <section className={sectionStyle}>
        <img src={globeImg} alt="World Globe" className="max-w-xl" />
        <h1 className="text-2xl font-bold">Look up the World's Countries</h1>
        <SearchBar
          handleSearch={handleSearch}
          setSearchData={setSearchData}
          setQuery={setQuery}
          query={query}
          isLoading={isLoading}
        />
      </section>
      <section className={sectionStyle + " gap-2"}>
        {searchData.length === 0 ? null : (
          <div className="flex flex-row items-center justify-center gap-5">
            <p className="text-xl">
              Showing Page {page} of{" "}
              {Math.ceil((searchMetaData?.total ?? 0) / 10) || 1}
            </p>
            <p className="text-xl">
              Total Countries: {searchMetaData?.total || 0}
            </p>
          </div>
        )}
        {searchData.map(
          (
            country: IGetCountriesResponse["data"]["objects"][0],
            index: number,
          ) => (
            <CountryCard
              key={index}
              name={country.names.common}
              flagUrl={country.flag.url_svg}
            />
          ),
        )}
        {searchData.length === 0 && searchedQuery !== "" && !isLoading && (
          <p className="text-xl truncate max-w-md">
            No countries found for "{searchedQuery}"
          </p>
        )}
      </section>
      <section className={sectionStyle + " gap-2"}>
        <Pagination
          page={page}
          setPage={setPage}
          totalPage={searchMetaData?.total || 0}
          loading={isLoading}
          setSearchParams={setSearchParams}
        />
      </section>
    </div>
  );
}

export default App;
