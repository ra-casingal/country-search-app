import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import type { IGetCountriesResponse } from "../../types/countries";
import MagnifyingGlassSvg from "../../assets/magnifying-glass.svg";

type Country = IGetCountriesResponse["data"]["objects"][number];
type Meta = IGetCountriesResponse["data"]["meta"];

const PAGE_LIMIT = 10;
const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 3000;
const SCROLL_THRESHOLD_PX = 20;

const skeletonRows = (
  <ul className="p-3 space-y-5 animate-pulse">
    <li className="w-full h-4 bg-gray-500 rounded-full"></li>
    <li className="w-full h-4 bg-gray-500 rounded-full"></li>
    <li className="w-full h-4 bg-gray-500 rounded-full"></li>
  </ul>
);

export default function SearchBarDropdown({
  onSelect,
}: {
  onSelect: (country: Country) => void;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("name") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [committedQuery, setCommittedQuery] = useState<string | null>(() =>
    initialQuery.length >= MIN_QUERY_LENGTH ? initialQuery : null,
  );
  const [results, setResults] = useState<Country[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState(
    () => initialQuery.length >= MIN_QUERY_LENGTH,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inputBoxStyle = "p-2.5 rounded-3xl";

  const fetchCountries = useCallback(
    async (searchQuery: string, offset: number, append: boolean) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setError(null);
      }

      try {
        const response = await fetch(
          `https://api.restcountries.com/countries/v5/names.common?q=${searchQuery}&response_fields=currencies,names.common,names.official,flag.url_svg,cars.driving_side,codes.alpha_3&limit=${PAGE_LIMIT}&offset=${offset}`,
          {
            headers: {
              Authorization:
                "Bearer " + import.meta.env.VITE_REST_COUNTRIES_API_KEY,
            },
            signal: controller.signal,
          },
        );
        const data: IGetCountriesResponse = await response.json();
        setResults((prev) =>
          append
            ? [...prev, ...(data.data.objects || [])]
            : data.data.objects || [],
        );
        setMeta(data.data.meta || null);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Error fetching countries:", err);
        setError("Couldn't load results. Please try again.");
      } finally {
        if (append) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  const commitSearch = useCallback(
    (searchQuery: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      setActiveMenu(true);
      setCommittedQuery(searchQuery);
      setSearchParams(searchQuery ? { name: searchQuery } : {});
      fetchCountries(searchQuery, 0, false);
    },
    [fetchCountries, setSearchParams],
  );

  // Auto-load the query already present in the URL (e.g. shared link, refresh) once on mount.
  useEffect(() => {
    if (initialQuery.length >= MIN_QUERY_LENGTH) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time data fetch on mount
      fetchCountries(initialQuery, 0, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (value.length < MIN_QUERY_LENGTH) {
      abortControllerRef.current?.abort();
      setResults([]);
      setMeta(null);
      setError(null);
      setIsLoading(false);
      setActiveMenu(false);
      setCommittedQuery(null);
      return;
    }

    setActiveMenu(true);

    if (value === committedQuery) {
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      commitSearch(value);
    }, DEBOUNCE_MS);
  };

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveMenu(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (
      distanceFromBottom < SCROLL_THRESHOLD_PX &&
      meta?.more &&
      !isLoading &&
      !isLoadingMore
    ) {
      fetchCountries(committedQuery ?? query, results.length, true);
    }
  };

  const handleSelect = (country: Country) => {
    setActiveMenu(false);
    onSelect(country);
  };

  const isPending =
    query.length >= MIN_QUERY_LENGTH && query !== committedQuery;
  const showSkeleton = isPending || isLoading;
  const showError = !showSkeleton && !!error;
  const showNoResults =
    !showSkeleton && !error && committedQuery !== null && results.length === 0;
  const showResults = !showSkeleton && !error && results.length > 0;

  return (
    <div
      ref={containerRef}
      className="bg-white w-full max-w-64.25 h-16 rounded-full p-2 grid items-center justify-center relative"
    >
      <div
        className={`p-1 w-full max-w-xs flex flex-row gap-1 justify-between border-black border-2 ${activeMenu ? "rounded-t-3xl " : "rounded-3xl"}`}
      >
        <input
          type="search"
          placeholder="Search countries"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => {
            if (query.length >= MIN_QUERY_LENGTH) setActiveMenu(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.length >= MIN_QUERY_LENGTH) {
              commitSearch(query);
            }
          }}
          className={inputBoxStyle + " outline-none flex-1 min-w-0"}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className={inputBoxStyle + " w-10 h-10"}
        >
          <img src={MagnifyingGlassSvg} alt="" />
        </button>
      </div>
      {activeMenu && (
        <div
          onScroll={handleScroll}
          className="w-full bg-white left-0 min-h-40 rounded-br-2xl rounded-bl-2xl border-black border-2 flex flex-col gap-1 max-h-40 overflow-y-auto"
        >
          {showError && <p className="p-3 text-sm text-red-600">{error}</p>}
          {showNoResults && (
            <p className="p-3 text-sm truncate">
              No countries found for "{committedQuery}"
            </p>
          )}
          {showResults && (
            <>
              {results.map((country, index) => (
                <button
                  key={`${country.names.common}-${index}`}
                  className="p-2 text-left hover:bg-blue-400 hover:text-white transition-colors duration-300 active:bg-blue-400 active:text-white"
                  onClick={() => handleSelect(country)}
                >
                  <p className="text-justify line-clamp-1 wrap-break-word overflow-hidden text-ellipsis">
                    {country.names.common}
                  </p>
                </button>
              ))}
              {isLoadingMore && skeletonRows}
            </>
          )}
          {showSkeleton && skeletonRows}
        </div>
      )}
    </div>
  );
}
