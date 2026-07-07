import type { Currency, DrivingSide } from "../../types/countries";
import NotAvailableSvg from "../../assets/not-available.svg";

export default function CountryDetailCard({
  officialName,
  flagUrl,
  currencies,
  drivingSide,
}: {
  officialName: string;
  flagUrl: string;
  currencies: Currency[];
  drivingSide: DrivingSide;
}) {
  return (
    <div className="flex flex-col gap-2 p-4 max-w-sm border-black border-2 rounded-md">
      {flagUrl ? (
        <img
          src={flagUrl}
          alt={`Flag of ${officialName}`}
          onError={(e) => {
            console.error(`Failed to load flag image for ${officialName}`);
            e.currentTarget.src = NotAvailableSvg;
          }}
          className="w-60 h-30 object-cover shadow-lg rounded-md"
        />
      ) : (
        <img
          src={NotAvailableSvg}
          alt={`Flag not available for ${officialName}`}
          className="w-60 h-30 object-cover shadow-lg rounded-md"
        />
      )}
      <h2 className="font-bold text-xl">{officialName}</h2>
      <div>
        <p className="font-semibold">Currency</p>
        {currencies.length === 0 ? (
          <p>N/A</p>
        ) : (
          currencies.map((currency) => (
            <p key={currency.code}>
              {currency.name} ({currency.symbol})
            </p>
          ))
        )}
      </div>
      <p>
        <span className="font-semibold">Drives on the:</span> {drivingSide}
      </p>
    </div>
  );
}
