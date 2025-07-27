import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import SwiggyLocationSelector from '@/components/SwiggyLocationSelector';
import SwiggyCategories from '@/components/SwiggyCategories';
import SwiggyOffers from '@/components/SwiggyOffers';
import SwiggyVendors from '@/components/SwiggyVendors';
import { swiggyTheme } from '@/lib/swiggy-design-system';
import {
  Search,
  Star,
  Users,
  Award,
  TrendingUp,
  MapPin,
  Clock,
  Shield,
  Heart,
  ChevronRight,
  Percent,
  Zap,
  Download,
  PlayCircle
} from 'lucide-react';

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Udupi, Karnataka');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(selectedLocation)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Layout fullWidth>
      {/* Main Header Section (Swiggy Style) */}
      <section className="bg-white py-8 lg:py-12">
        <div className={swiggyTheme.layouts.container.xl}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div>
              {/* Tagline */}
              <div className="mb-6">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                  Discover local<br />
                  <span className="text-orange-500">experiences</span><br />
                  in coastal Karnataka
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                  Book authentic homestays, discover local restaurants, hire trusted drivers, and connect with talented creators.
                  Your complete guide to coastal Karnataka.
                </p>
              </div>

              {/* Search Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Location Selector */}
                  <SwiggyLocationSelector
                    selectedLocation={selectedLocation}
                    onLocationChange={setSelectedLocation}
                    className="lg:w-64"
                  />

                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search for homestays, restaurants, drivers, experiences..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-12 pr-4 py-4 text-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                    />
                  </div>

                  {/* Search Button */}
                  <Button 
                    onClick={handleSearch}
                    className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg text-lg"
                  >
                    Search
                  </Button>
                </div>

                {/* Popular Searches */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500">Popular:</span>
                  {[
                    'Beachside homestays',
                    'Udupi restaurants',
                    'Local drivers',
                    'Wedding photography'
                  ].map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(search)}
                      className="text-sm text-orange-600 hover:text-orange-800 font-medium hover:underline"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Vendors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">10k+</div>
                  <div className="text-sm text-gray-600">Orders</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">4.8★</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">25</div>
                  <div className="text-sm text-gray-600">Cities</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop"
                  alt="Coastal Karnataka Experience"
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <button className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <PlayCircle className="h-10 w-10 text-orange-500" />
                  </button>
                </div>
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ⚡ Live in Coastal Karnataka
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <SwiggyCategories 
        className="py-12 lg:py-16 bg-gray-50"
        maxItems={8}
      />

      {/* Popular Vendors Section */}
      <SwiggyVendors 
        title="Popular near you"
        subtitle="Top-rated services in your area"
        className="py-12 lg:py-16 bg-white"
        maxItems={8}
      />

      {/* Offers Section */}
      <SwiggyOffers 
        title="Deals for you"
        subtitle="Curated offers just for you"
        className="py-12 lg:py-16 bg-gray-50"
      />

      {/* Homestays Section */}
      <SwiggyVendors 
        title="Best homestays"
        subtitle="Authentic local stays"
        type="homestay"
        className="py-12 lg:py-16 bg-white"
        maxItems={6}
      />

      {/* Restaurants Section */}
      <SwiggyVendors
        title="Top restaurants & cafes"
        subtitle="Discover authentic local dining"
        type="restaurant"
        className="py-12 lg:py-16 bg-gray-50"
        maxItems={6}
      />

      {/* Trust & Safety Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className={swiggyTheme.layouts.container.xl}>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why CoastalConnect?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your trusted marketplace for authentic coastal Karnataka experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="h-12 w-12 text-green-500" />,
                title: 'Verified Services',
                description: 'All vendors are personally verified for quality and authenticity'
              },
              {
                icon: <Clock className="h-12 w-12 text-blue-500" />,
                title: 'Quick Delivery',
                description: 'Fast response times and efficient service delivery'
              },
              {
                icon: <Star className="h-12 w-12 text-yellow-500" />,
                title: 'Top Rated',
                description: 'Highly rated services with genuine customer reviews'
              },
              {
                icon: <Heart className="h-12 w-12 text-red-500" />,
                title: 'Local Community',
                description: 'Supporting local businesses and authentic experiences'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities We Serve */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className={swiggyTheme.layouts.container.xl}>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              We deliver in
            </h2>
            <p className="text-lg text-gray-600">
              Expanding across coastal Karnataka
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Udupi', status: 'live', count: '200+' },
              { name: 'Manipal', status: 'live', count: '150+' },
              { name: 'Malpe', status: 'live', count: '80+' },
              { name: 'Kaup', status: 'live', count: '45+' },
              { name: 'Kundapura', status: 'coming', count: 'Soon' },
              { name: 'Mangalore', status: 'coming', count: 'Soon' }
            ].map((city, index) => (
              <div 
                key={index}
                className={`
                  bg-white rounded-lg p-4 text-center border-2 transition-colors
                  ${city.status === 'live' 
                    ? 'border-green-200 hover:border-green-300' 
                    : 'border-gray-200'
                  }
                `}
              >
                <div className={`
                  w-3 h-3 rounded-full mx-auto mb-2
                  ${city.status === 'live' ? 'bg-green-500' : 'bg-gray-400'}
                `} />
                <h3 className="font-semibold text-gray-900 mb-1">{city.name}</h3>
                <p className={`
                  text-sm
                  ${city.status === 'live' ? 'text-green-600' : 'text-gray-500'}
                `}>
                  {city.count} {city.status === 'live' ? 'vendors' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className={swiggyTheme.layouts.container.xl}>
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Get the CoastalConnect app
            </h2>
            <p className="text-lg mb-8 text-orange-100">
              We will send you a link, open it on your phone to download the app
            </p>

            <div className="max-w-md mx-auto mb-8">
              <div className="flex gap-3">
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white focus:ring-white"
                />
                <Button className="bg-white text-orange-500 hover:bg-gray-100 font-semibold px-6">
                  Send Link
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center space-x-3 hover:bg-gray-800 transition-colors">
                <Download className="h-5 w-5" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </button>
              <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center space-x-3 hover:bg-gray-800 transition-colors">
                <Download className="h-5 w-5" />
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </button>
            </div>

            <p className="text-sm text-orange-100 mt-6">
              📱 Coming Soon - Native mobile apps for iOS and Android
            </p>
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="py-12 lg:py-16 bg-white">
        <div className={swiggyTheme.layouts.container.xl}>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Popular locations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the most sought-after destinations in coastal Karnataka
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Malpe Beach Area',
                description: 'Beach resorts, water sports, seafood',
                count: '45+ places',
                image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop',
                featured: true
              },
              {
                name: 'Udupi City Center',
                description: 'Temples, restaurants, shopping',
                count: '120+ places',
                image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&h=200&fit=crop',
                featured: true
              },
              {
                name: 'Manipal University Area',
                description: 'Student-friendly, cafes, hostels',
                count: '80+ places',
                image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop',
                featured: false
              },
              {
                name: 'Kaup Lighthouse',
                description: 'Scenic views, photography spots',
                count: '25+ places',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
                featured: false
              }
            ].map((location, index) => (
              <Link
                key={`location-${index}`}
                to={`/search?location=${encodeURIComponent(location.name)}`}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
                onClick={(e) => {
                  // Add click feedback
                  console.log(`Navigating to: ${location.name}`);
                }}
              >
                {/* Featured Badge */}
                {location.featured && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      🔥 Popular
                    </span>
                  </div>
                )}

                <div className="relative h-40 lg:h-48">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="font-bold text-sm bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                      {location.count}
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {location.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {location.description}
                  </p>

                  {/* Action indicator */}
                  <div className="mt-3 flex items-center text-orange-600 text-sm font-medium">
                    <span>Explore now</span>
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
          </div>

          {/* View All Locations Link */}
          <div className="text-center mt-8">
            <Link
              to="/search"
              className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <MapPin className="h-5 w-5 mr-2" />
              View All Locations
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
