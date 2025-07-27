import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import SwiggyCategories from '@/components/SwiggyCategories';
import { swiggyTheme } from '@/lib/swiggy-design-system';
import {
  Search,
  MapPin,
  Filter,
  Grid,
  List,
  Star,
  Users,
  TrendingUp,
  Home,
  UtensilsCrossed,
  Car,
  Camera,
  Calendar,
  Sparkles,
  ShoppingBag,
  Music,
  Waves,
  Coffee,
  Mountain
} from 'lucide-react';

interface ServiceStats {
  category: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  description: string;
  link: string;
}

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const serviceStats: ServiceStats[] = [
    {
      category: 'homestays',
      name: 'Hotels & Homestays',
      icon: <Home className="h-8 w-8" />,
      count: 85,
      color: 'text-blue-600',
      description: 'Cozy accommodations from heritage homes to luxury resorts',
      link: '/homestays'
    },
    {
      category: 'restaurants',
      name: 'Restaurants & Cafes',
      icon: <UtensilsCrossed className="h-8 w-8" />,
      count: 120,
      color: 'text-orange-600',
      description: 'Authentic Udupi cuisine and coastal delicacies',
      link: '/eateries'
    },
    {
      category: 'transport',
      name: 'Local Transport',
      icon: <Car className="h-8 w-8" />,
      count: 45,
      color: 'text-green-600',
      description: 'Trusted drivers for sightseeing and airport transfers',
      link: '/drivers'
    },
    {
      category: 'photography',
      name: 'Photography & Content',
      icon: <Camera className="h-8 w-8" />,
      count: 32,
      color: 'text-purple-600',
      description: 'Professional photographers and content creators',
      link: '/creators'
    },
    {
      category: 'events',
      name: 'Events & Experiences',
      icon: <Calendar className="h-8 w-8" />,
      count: 28,
      color: 'text-cyan-600',
      description: 'Cultural events, festivals, and unique experiences',
      link: '/events'
    },
    {
      category: 'wellness',
      name: 'Beauty & Wellness',
      icon: <Sparkles className="h-8 w-8" />,
      count: 18,
      color: 'text-pink-600',
      description: 'Spa treatments, salons, and wellness centers',
      link: '/beauty-wellness'
    },
    {
      category: 'beaches',
      name: 'Beaches & Coast',
      icon: <Waves className="h-8 w-8" />,
      count: 12,
      color: 'text-teal-600',
      description: 'Beach activities, water sports, and coastal tours',
      link: '/beaches'
    },
    {
      category: 'shopping',
      name: 'Shopping & Markets',
      icon: <ShoppingBag className="h-8 w-8" />,
      count: 25,
      color: 'text-violet-600',
      description: 'Local markets, handicrafts, and shopping destinations',
      link: '/shopping'
    },
    {
      category: 'nightlife',
      name: 'Nightlife & Entertainment',
      icon: <Music className="h-8 w-8" />,
      count: 15,
      color: 'text-indigo-600',
      description: 'Bars, clubs, and entertainment venues',
      link: '/nightlife'
    },
    {
      category: 'cafes',
      name: 'Cafes & Coffee',
      icon: <Coffee className="h-8 w-8" />,
      count: 35,
      color: 'text-amber-600',
      description: 'Cozy cafes, coffee shops, and study spots',
      link: '/cafes'
    },
    {
      category: 'temples',
      name: 'Temples & Heritage',
      icon: <Mountain className="h-8 w-8" />,
      count: 22,
      color: 'text-orange-700',
      description: 'Sacred temples, heritage sites, and cultural landmarks',
      link: '/temples'
    }
  ];

  const filteredServices = serviceStats.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || service.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalVendors = serviceStats.reduce((sum, service) => sum + service.count, 0);

  const filters = [
    { id: 'all', label: 'All Categories', count: totalVendors },
    { id: 'homestays', label: 'Stays', count: 85 },
    { id: 'restaurants', label: 'Food', count: 120 },
    { id: 'transport', label: 'Transport', count: 45 },
    { id: 'photography', label: 'Content', count: 32 },
    { id: 'events', label: 'Events', count: 28 }
  ];

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-12 lg:py-16">
        <div className={swiggyTheme.layouts.container.xl}>
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Explore <span className="text-orange-500">Everything</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover all services, experiences, and vendors across coastal Karnataka. 
              From heritage homestays to beachside cafes, find exactly what you're looking for.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search categories, services, or experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === filter.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {filteredServices.length} of {serviceStats.length} categories
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${
                      viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${
                      viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{totalVendors}+</div>
              <div className="text-sm text-gray-600">Total Vendors</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-gray-900">11</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-gray-900">4.8★</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 lg:py-16 bg-white">
        <div className={swiggyTheme.layouts.container.xl}>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Link
                  key={service.category}
                  to={service.link}
                  className="group"
                >
                  <Card className="h-full bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden group-hover:scale-[1.02]">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 bg-gray-50 rounded-xl ${service.color} group-hover:scale-110 transition-transform duration-200`}>
                          {service.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                              {service.name}
                            </h3>
                            <Badge className="bg-orange-100 text-orange-800 text-xs">
                              {service.count} vendors
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                            {service.description}
                          </p>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{service.count} vendors</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3" />
                              <span>4.5+ rated</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="h-3 w-3" />
                              <span>Popular</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredServices.map((service) => (
                <Link
                  key={service.category}
                  to={service.link}
                  className="group"
                >
                  <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-6">
                        <div className={`p-4 bg-gray-50 rounded-xl ${service.color}`}>
                          {service.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                              {service.name}
                            </h3>
                            <Badge className="bg-orange-100 text-orange-800">
                              {service.count} vendors
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">
                            {service.description}
                          </p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{service.count} verified vendors</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4" />
                              <span>4.5+ average rating</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>Popular in your area</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-orange-500">
                          <MapPin className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* All Categories Section */}
      <SwiggyCategories 
        title="Browse by Category"
        subtitle="Quick access to all service categories"
        showAll={true}
        className="py-12 lg:py-16 bg-gray-50"
      />

      {/* CTA Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className={swiggyTheme.layouts.container.xl}>
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-lg mb-8 text-orange-100">
              Contact our local experts for personalized recommendations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="bg-white text-orange-500 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg">
                  Contact Support
                </Button>
              </Link>
              <Link to="/vendor-register">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-500 font-semibold px-8 py-3 rounded-lg">
                  List Your Business
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
