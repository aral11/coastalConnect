import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import LocalCreatorsGrid from '@/components/LocalCreatorsGrid';
import ComprehensiveServices from '@/components/ComprehensiveServices';
import CommunityFeatures from '@/components/CommunityFeatures';
import PlatformStats from '@/components/PlatformStats';
import { designSystem, layouts, swiggyTheme } from '@/lib/design-system';
import {
  MapPin,
  Car,
  Home,
  Star,
  Users,
  Shield,
  Clock,
  Phone,
  Mail,
  ChevronRight,
  UtensilsCrossed,
  Store,
  Camera,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Award,
  Heart,
  Search,
  Navigation,
  ChefHat,
  Bed,
  UserCheck,
  Sparkles,
  ShoppingBag,
  Globe,
  Calendar
} from 'lucide-react';

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  offer?: string;
}

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Udupi, Karnataka');
  const [services, setServices] = useState<ServiceCategory[]>([]);

  useEffect(() => {
    // Load service categories from API or database
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();

      if (data.success && data.data) {
        // Map API data to component format with icons
        const serviceData: ServiceCategory[] = data.data.map((service: any) => ({
          id: service.id,
          title: service.title,
          description: service.description,
          icon: getServiceIcon(service.icon),
          link: service.link,
          color: service.color,
          offer: service.offer
        }));
        setServices(serviceData);
      }
    } catch (error) {
      console.error('Error loading services:', error);
      // Fallback to default services if API fails
      const fallbackServices: ServiceCategory[] = [
        {
          id: 'homestays',
          title: 'HOMESTAYS',
          description: 'AUTHENTIC LOCAL STAYS',
          icon: <Bed className="h-12 w-12" />,
          link: '/homestays',
          color: 'from-blue-500 to-blue-600',
          offer: 'UPTO 40% OFF'
        },
        {
          id: 'eateries',
          title: 'EATERIES',
          description: 'LOCAL CUISINE & DINING',
          icon: <ChefHat className="h-12 w-12" />,
          link: '/eateries',
          color: 'from-green-500 to-green-600',
          offer: 'UPTO 50% OFF'
        },
        {
          id: 'drivers',
          title: 'TRANSPORT',
          description: 'LOCAL DRIVERS & RIDES',
          icon: <Car className="h-12 w-12" />,
          link: '/drivers',
          color: 'from-purple-500 to-purple-600',
          offer: 'UPTO 30% OFF'
        },
        {
          id: 'creators',
          title: 'CREATORS',
          description: 'LOCAL CONTENT & GUIDES',
          icon: <Camera className="h-12 w-12" />,
          link: '/creators',
          color: 'from-pink-500 to-pink-600',
          offer: 'EXPLORE NOW'
        }
      ];
      setServices(fallbackServices);
    }
  };

  const getServiceIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Bed': <Bed className="h-12 w-12" />,
      'ChefHat': <ChefHat className="h-12 w-12" />,
      'Car': <Car className="h-12 w-12" />,
      'Camera': <Camera className="h-12 w-12" />,
      'Calendar': <Calendar className="h-12 w-12" />,
      'Store': <Store className="h-12 w-12" />
    };
    return iconMap[iconName] || <Store className="h-12 w-12" />;
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Implement search functionality
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
      {/* Hero Section - Swiggy Style */}
      <section className="relative bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 text-white overflow-hidden min-h-[80vh]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-40 right-20 w-48 h-48 bg-yellow-300 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-red-300 rounded-full blur-lg"></div>
        </div>

        <div className={`${layouts.container} relative z-10`}>
          <div className="py-16 lg:py-24">
            {/* Status Badge */}
            <div className="flex items-center justify-center mb-8">
              <Badge className="bg-white/20 text-white border-white/30 text-sm font-medium px-6 py-3 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                Live in Udupi & Manipal • Mangalore Coming Soon
              </Badge>
            </div>

            {/* Main Heading */}
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Discover Coast Karnataka.
                <br />
                <span className="text-yellow-200">coastalConnect it!</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-orange-100 max-w-4xl mx-auto leading-relaxed mb-8">
                Your one-stop platform for authentic coastal experiences. Find homestays, local eateries, trusted drivers, and talented creators.
              </p>
            </div>

            {/* Search Section - Swiggy Style */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Location Selector */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" />
                      <select 
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full lg:w-64 pl-12 pr-8 py-4 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-gray-900 bg-gray-50 appearance-none"
                      >
                        <option value="Udupi, Karnataka">Udupi, Karnataka</option>
                        <option value="Manipal, Karnataka">Manipal, Karnataka</option>
                        <option value="Malpe, Karnataka">Malpe, Karnataka</option>
                        <option value="Kaup, Karnataka">Kaup, Karnataka</option>
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 rotate-90" />
                    </div>
                  </div>

                  {/* Search Input */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search for homestays, restaurants, drivers or more..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-gray-900 text-lg"
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <Button 
                    onClick={handleSearch}
                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Dynamic Platform Stats */}
            <div className="mt-16">
              <PlatformStats className="mb-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories - Swiggy Style Cards */}
      <section className="bg-gray-50 py-16">
        <div className={layouts.container}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover authentic coastal experiences through our trusted network of local providers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Link key={service.id} to={service.link} className="group">
                <Card className="h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden group-hover:scale-[1.02]">
                  <CardContent className="p-0">
                    <div className={`bg-gradient-to-br ${service.color} p-6 text-white relative overflow-hidden`}>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          {service.icon}
                          <ArrowRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                        
                        <h3 className="text-lg font-bold mb-1">{service.title}</h3>
                        <p className="text-sm opacity-90 mb-3">{service.description}</p>
                        
                        {service.offer && (
                          <Badge className="bg-white/20 text-white border-white/30 text-xs font-medium px-3 py-1">
                            {service.offer}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8"></div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={`${layouts.section} bg-white`}>
        <div className={layouts.container}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why coastalConnect?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the best of coastal Karnataka with our trusted platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="h-12 w-12 text-orange-500" />,
                title: 'Verified Services',
                description: 'All vendors undergo strict verification for your safety and quality assurance'
              },
              {
                icon: <Star className="h-12 w-12 text-orange-500" />,
                title: 'Authentic Reviews',
                description: 'Real reviews from verified customers help you make informed decisions'
              },
              {
                icon: <Clock className="h-12 w-12 text-orange-500" />,
                title: '24/7 Support',
                description: 'Round-the-clock customer support for all your travel and booking needs'
              },
              {
                icon: <Heart className="h-12 w-12 text-orange-500" />,
                title: 'Local Experience',
                description: 'Discover hidden gems and authentic local experiences with insider knowledge'
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 p-8">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-orange-50 rounded-2xl">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Services Section */}
      <ComprehensiveServices />

      {/* Community Features Section */}
      <CommunityFeatures />

      {/* Local Creators Grid */}
      <LocalCreatorsGrid />

      {/* Partner with Us Section */}
      <section className="bg-gradient-to-r from-orange-400 to-red-500 text-white py-16">
        <div className={layouts.container}>
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Partner with coastalConnect</h2>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-12">
              Join our growing network of verified partners and reach thousands of travelers exploring coastal Karnataka
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: <Store className="h-8 w-8" />,
                  title: 'List Your Business',
                  description: 'Showcase your homestay, restaurant, or service to travelers'
                },
                {
                  icon: <UserCheck className="h-8 w-8" />,
                  title: 'Get Verified',
                  description: 'Build trust with our verification badge and quality assurance'
                },
                {
                  icon: <TrendingUp className="h-8 w-8" />,
                  title: 'Grow Revenue',
                  description: 'Increase bookings and revenue with our marketing support'
                }
              ].map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center p-4 bg-white/20 rounded-2xl mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-orange-100">{benefit.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/vendor-register">
                <Button className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl">
                  <Store className="mr-2 h-5 w-5" />
                  Register as Partner
                </Button>
              </Link>
              <Link to="/organizer-register">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 font-semibold px-8 py-4 rounded-xl">
                  <Users className="mr-2 h-5 w-5" />
                  Event Organizer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
