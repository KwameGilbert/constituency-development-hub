type EventFiltersProps = {
  filters: string[];
  activeFilter: string;
  onSelect?: (filter: string) => void;
};

function EventFilters({ filters, activeFilter, onSelect }: EventFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => {
        const isActive = filter === activeFilter;
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onSelect?.(filter)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
              isActive
                ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-600"
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}

export default EventFilters;
