import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, X, MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function FloatingSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Udupi, Karnataka');
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on homepage to avoid duplication
  useEffect(() => {
    setIsVisible(location.pathname !== '/');
  }, [location.pathname]);

  // Hide floating button when search overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const params = new URLSearchParams({
        q: searchQuery,
        location: selectedLocation
      });
      navigate(`/search?${params.toString()}`);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const popularSearches = [
    'Beachside homestays',
    'Udupi cuisine',
    'Local drivers',
    'Photography services',
    'Malpe beach',
    'Traditional restaurants'
  ];

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-24 lg:bottom-8 right-6 z-40 lg:hidden',
          'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
          'text-white p-4 rounded-full shadow-lg hover:shadow-xl',
          'transition-all duration-200 transform hover:scale-110 active:scale-95',
          'group'
        )}
        aria-label="Quick search"
      >
        <Search className="h-6 w-6" />
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Quick Search
        </div>
      </button>

      {/* Search Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Search Panel */}
          <div className="absolute inset-x-0 top-0 bg-white rounded-b-3xl shadow-2xl">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">What are you looking for?</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Location Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                  <select 
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  >
                    <option value="Udupi, Karnataka">📍 Udupi, Karnataka</option>
                    <option value="Manipal, Karnataka">📍 Manipal, Karnataka</option>
                    <option value="Malpe, Karnataka">📍 Malpe, Karnataka</option>
                    <option value="Kaup, Karnataka">📍 Kaup, Karnataka</option>
                  </select>
                </div>
              </div>

              {/* Search Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Homestays, restaurants, drivers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg"
                    autoFocus
                  />
                </div>
              </div>

              {/* Popular Searches */}
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-700 mb-3">Popular Searches</div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(search)}
                      className="text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-full transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={!searchQuery.trim()}
              >
                <Search className="h-5 w-5 mr-2" />
                Search coastalConnect
              </Button>

              {/* Quick Access Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => navigate('/homestays')}
                  className="flex items-center justify-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <span className="text-2xl">🏠</span>
                  <span className="text-sm font-medium text-gray-700">Homestays</span>
                </button>
                <button
                  onClick={() => navigate('/eateries')}
                  className="flex items-center justify-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <span className="text-2xl">🍽️</span>
                  <span className="text-sm font-medium text-gray-700">Eateries</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
