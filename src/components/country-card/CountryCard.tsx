import NotAvailableSvg from "../../assets/not-available.svg";

export default function CountryCard({
  name,
  flagUrl,
}: {
  name: string;
  flagUrl: string;
}) {
  return (
    <div className="flex flex-col justify-center gap-1 p-2 max-w-[200px]">
      {flagUrl ? (
        <img
          src={flagUrl}
          alt={`Flag of ${name}`}
          onError={(e) => {
            // Handle image load error, e.g., set a fallback image or log the error
            console.error(`Failed to load flag image for ${name}`);
            e.currentTarget.src = NotAvailableSvg; // Set fallback image
          }}
          className="w-60 h-30 object-cover shadow-lg rounded-md"
        />
      ) : (
        <img
          src={NotAvailableSvg}
          alt={`Flag not available for ${name}`}
          className="w-60 h-30 object-cover shadow-lg rounded-md"
        />
      )}
      <p className="font-bold truncate">{name}</p>
    </div>
  );
}
