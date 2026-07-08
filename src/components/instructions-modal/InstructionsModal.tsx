import { useEffect, useRef } from "react";

export default function InstructionsModal({
  isOpen,
  onClose,
  triggerRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();
    const trigger = triggerRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="instructions-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-md border-black border-2 p-5 max-w-sm w-full mx-5"
      >
        <div className="flex flex-row items-center justify-between gap-2 mb-3">
          <h2 id="instructions-title" className="text-xl font-bold">
            How to use this site
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="w-8 h-8 shrink-0 rounded-full border-black border-2 font-bold hover:bg-blue-400 hover:text-white"
          >
            &times;
          </button>
        </div>
        <ol className="list-decimal list-inside space-y-2">
          <li>Type at least 2 letters of a country name.</li>
          <li>Pick a country from the dropdown results (scroll for more).</li>
          <li>
            View the country's official name, flag, currency, and driving side
            below.
          </li>
        </ol>
      </div>
    </div>
  );
}
