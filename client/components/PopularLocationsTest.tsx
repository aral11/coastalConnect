import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';

// Test component to verify Popular locations functionality
export default function PopularLocationsTest() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const testLocations = [
    {
      name: 'Test Location 1',
      description: 'Testing responsiveness',
      count: '10+ places',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop'
    },
    {
      name: 'Test Location 2', 
      description: 'Testing clicks',
      count: '20+ places',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&h=200&fit=crop'
    }
  ];

  const handleTestClick = (locationName: string) => {
    setClickCount(prev => prev + 1);
    console.log(`✅ Popular location clicked: ${locationName} (Total clicks: ${clickCount + 1})`);
    alert(`Location "${locationName}" is responsive! Click count: ${clickCount + 1}`);
  };

  if (!isLoaded) {
    return <div className="p-4 text-center">Loading test...</div>;
  }

  return (
    <div className="p-8 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Popular Locations Responsiveness Test</h2>
      <p className="mb-6 text-gray-600">Click the cards below to test responsiveness:</p>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {testLocations.map((location, index) => (
          <div
            key={index}
            onClick={() => handleTestClick(location.name)}
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
          >
            <div className="relative h-32">
              <img
                src={location.image}
                alt={location.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-3 text-white">
                <div className="font-semibold text-sm bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  {location.count}
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                {location.name}
              </h3>
              <p className="text-sm text-gray-600">
                {location.description}
              </p>
              <div className="mt-2 flex items-center text-orange-600 text-sm font-medium">
                <span>Click to test</span>
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
          <span className="font-medium">Total Clicks: {clickCount}</span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/search"
          className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <MapPin className="h-5 w-5 mr-2" />
          Test Search Navigation
        </Link>
      </div>
    </div>
  );
}
