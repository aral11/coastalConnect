import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Navigation, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { swiggyTheme } from '@/lib/swiggy-design-system';

interface Location {
  id: string;
  name: string;
  area?: string;
  district: string;
  state: string;
  coordinates?: [number, number];
}

interface SwiggyLocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  className?: string;
}

interface LocationError {
  message: string;
  type: 'permission' | 'unavailable' | 'timeout' | 'unknown';
}

const POPULAR_LOCATIONS: Location[] = [
  {
    id: 'udupi-main',
    name: 'Udupi',
    area: 'City Center',
    district: 'Udupi',
    state: 'Karnataka',
    coordinates: [13.3409, 74.7421]
  },
  {
    id: 'manipal',
    name: 'Manipal',
    area: 'University Town',
    district: 'Udupi',
    state: 'Karnataka',
    coordinates: [13.3525, 74.7885]
  },
  {
    id: 'malpe',
    name: 'Malpe',
    area: 'Beach Area',
    district: 'Udupi',
    state: 'Karnataka',
    coordinates: [13.3509, 74.7024]
  },
  {
    id: 'kaup',
    name: 'Kaup',
    area: 'Coastal Town',
    district: 'Udupi',
    state: 'Karnataka',
    coordinates: [13.2167, 74.7500]
  },
  {
    id: 'kundapura',
    name: 'Kundapura',
    area: 'Town Center',
    district: 'Udupi',
    state: 'Karnataka',
    coordinates: [13.6274, 74.6913]
  },
  {
    id: 'mangalore',
    name: 'Mangalore',
    area: 'Coming Soon',
    district: 'Dakshina Kannada',
    state: 'Karnataka',
    coordinates: [12.9141, 74.8560]
  }
];

export default function SwiggyLocationSelector({
  selectedLocation,
  onLocationChange,
  className = ''
}: SwiggyLocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationError, setLocationError] = useState<LocationError | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter locations based on search
  const filteredLocations = POPULAR_LOCATIONS.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: Location) => {
    onLocationChange(`${location.name}, ${location.state}`);
    setIsOpen(false);
    setSearchQuery('');
  };

  const getLocationErrorMessage = (error: GeolocationPositionError): LocationError => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return {
          message: "Location access denied. Please enable location services and try again.",
          type: 'permission'
        };
      case error.POSITION_UNAVAILABLE:
        return {
          message: "Location information is unavailable. Please select manually.",
          type: 'unavailable'
        };
      case error.TIMEOUT:
        return {
          message: "Location request timed out. Please try again or select manually.",
          type: 'timeout'
        };
      default:
        return {
          message: "Unable to detect location. Please select manually.",
          type: 'unknown'
        };
    }
  };

  const detectLocation = async () => {
    setIsDetecting(true);
    setLocationError(null);

    if (!('geolocation' in navigator)) {
      setLocationError({
        message: "Geolocation is not supported by this browser.",
        type: 'unavailable'
      });
      setIsDetecting(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Check if location is near Udupi area (basic proximity check)
          const isNearUdupi = latitude > 13.0 && latitude < 14.0 &&
                             longitude > 74.0 && longitude < 75.0;

          if (isNearUdupi) {
            onLocationChange('Udupi, Karnataka');
          } else {
            // Default to first available location
            onLocationChange('Udupi, Karnataka');
          }

          setIsDetecting(false);
          setLocationError(null);
        } catch (err) {
          console.error('Error processing location:', err);
          setLocationError({
            message: "Error processing location data.",
            type: 'unknown'
          });
          setIsDetecting(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        const locationError = getLocationErrorMessage(error);
        setLocationError(locationError);
        setIsDetecting(false);
      },
      options
    );
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Location Button */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 h-auto px-3 py-2 text-left
          hover:bg-gray-50 border border-gray-200 rounded-lg
          ${swiggyTheme.animations.transition.normal}
        `}
      >
        <MapPin className="h-5 w-5 text-orange-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate">
            {selectedLocation.split(',')[0]}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {selectedLocation.split(',').slice(1).join(',').trim()}
          </div>
        </div>
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
          {/* Search Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for area, street name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Current Location Button */}
          <div className="p-4 border-b border-gray-100">
            <Button
              onClick={detectLocation}
              disabled={isDetecting}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-dashed border-orange-300"
              variant="ghost"
            >
              <div className="p-2 bg-orange-50 rounded-lg">
                <Navigation className={`h-4 w-4 text-orange-500 ${isDetecting ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <div className="font-medium text-orange-600">
                  {isDetecting ? 'Detecting...' : 'Use current location'}
                </div>
                <div className="text-xs text-gray-500">
                  Enable location access for better experience
                </div>
              </div>
            </Button>
          </div>

          {/* Locations List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredLocations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <div className="text-sm">No locations found</div>
                <div className="text-xs text-gray-400">Try a different search term</div>
              </div>
            ) : (
              <div className="py-2">
                {filteredLocations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 text-left
                      hover:bg-gray-50 transition-colors
                      ${location.area === 'Coming Soon' ? 'opacity-60 cursor-not-allowed' : ''}
                    `}
                    disabled={location.area === 'Coming Soon'}
                  >
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 flex items-center">
                        {location.name}
                        {location.area === 'Coming Soon' && (
                          <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {location.area && location.area !== 'Coming Soon' && `${location.area}, `}
                        {location.district}, {location.state}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="text-xs text-gray-500 text-center">
              🌍 More cities coming soon! <br />
              Currently serving coastal Karnataka
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
