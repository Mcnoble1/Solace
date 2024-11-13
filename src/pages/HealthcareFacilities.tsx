import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import FacilityList from '../components/healthcare-facilities/FacilityList';
import SearchFilters from '../components/healthcare-facilities/SearchFilters';
import { MapIcon, ListBulletIcon } from '@heroicons/react/24/outline';

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

const facilityTypes = {
  hospital: 'Hospitals',
  pharmacy: 'Pharmacies',
  doctor: 'Doctor Clinics',
  physiotherapist: 'Physiotherapists',
  dentist: 'Dentists',
};

export default function HealthcareFacilities() {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedType, setSelectedType] = useState<keyof typeof facilityTypes>('hospital');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places'],
        });

        const google = await loader.load();
        
        if (!mapRef.current) return;

        const map = new google.maps.Map(mapRef.current, {
          center: userLocation,
          zoom: 14,
        });

        googleMapRef.current = map;

        // Add user location marker
        new google.maps.Marker({
          position: userLocation,
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4F46E5',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff',
          },
          title: 'Your Location',
        });

        // Search for nearby facilities
        searchNearbyFacilities();
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setError('Error loading the map. Please try again later.');
      }
    };

    initMap();
  }, [userLocation]);

  useEffect(() => {
    if (userLocation) {
      searchNearbyFacilities();
    }
  }, [selectedType, userLocation]);

  const searchNearbyFacilities = async () => {
    if (!googleMapRef.current || !userLocation) return;

    setIsLoading(true);
    setError(null);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    try {
      const service = new google.maps.places.PlacesService(googleMapRef.current);
      
      const request = {
        location: userLocation,
        radius: 5000, // 5km radius
        type: selectedType,
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const placesData = results.map(place => ({
            id: place.place_id!,
            name: place.name!,
            vicinity: place.vicinity!,
            rating: place.rating,
            types: place.types!,
            geometry: {
              location: {
                lat: place.geometry!.location!.lat(),
                lng: place.geometry!.location!.lng(),
              },
            },
            opening_hours: place.opening_hours,
          }));

          setPlaces(placesData);
          addMarkers(placesData);
        } else {
          setError('No facilities found nearby.');
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error searching facilities:', error);
      setError('Error searching for facilities. Please try again.');
      setIsLoading(false);
    }
  };

  const addMarkers = (places: Place[]) => {
    if (!googleMapRef.current) return;

    places.forEach((place, index) => {
      const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: googleMapRef.current,
        title: place.name,
        label: {
          text: (index + 1).toString(),
          color: 'white',
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold">${place.name}</h3>
            <p class="text-sm">${place.vicinity}</p>
            ${place.rating ? `<p class="text-sm">Rating: ${place.rating} ⭐</p>` : ''}
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(googleMapRef.current, marker);
      });

      markersRef.current.push(marker);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Healthcare Facilities Nearby</h1>
        <p className="mt-2 text-gray-600">Find hospitals, clinics, and pharmacies in your area</p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <SearchFilters
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          facilityTypes={facilityTypes}
        />

        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-md ${
              viewMode === 'map'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <MapIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${
              viewMode === 'list'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <ListBulletIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {viewMode === 'map' ? (
        <div
          ref={mapRef}
          className="w-full h-[600px] rounded-lg shadow-md"
        />
      ) : (
        <FacilityList
          places={places}
          isLoading={isLoading}
          onPlaceClick={(place) => {
            setViewMode('map');
            googleMapRef.current?.panTo(place.geometry.location);
            googleMapRef.current?.setZoom(16);
          }}
        />
      )}
    </div>
  );
}