interface SearchFiltersProps {
  selectedType: string;
  onTypeChange: (type: any) => void;
  facilityTypes: Record<string, string>;
}

export default function SearchFilters({
  selectedType,
  onTypeChange,
  facilityTypes,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(facilityTypes).map(([type, label]) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            selectedType === type
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}