interface Place {
  id: string;
  name: string;
  vicinity: string;
  rating?: number;
  types: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  opening_hours?: {
    open_now: boolean;
  };
}

interface FacilityListProps {
  places: Place[];
  isLoading: boolean;
  onPlaceClick: (place: Place) => void;
}

export default function FacilityList({
  places,
  isLoading,
  onPlaceClick,
}: FacilityListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-100 p-6 rounded-lg"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No facilities found in this area.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {places.map((place, index) => (
        <button
          key={place.id}
          onClick={() => onPlaceClick(place)}
          className="w-full text-left bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-semibold">
              {index + 1}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {place.name}
              </h3>
              <p className="text-gray-600">{place.vicinity}</p>
              <div className="mt-2 flex items-center space-x-4">
                {place.rating && (
                  <span className="text-sm text-gray-600">
                    Rating: {place.rating} ⭐
                  </span>
                )}
                {place.opening_hours && (
                  <span className={`text-sm ${
                    place.opening_hours.open_now
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {place.opening_hours.open_now ? 'Open' : 'Closed'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}