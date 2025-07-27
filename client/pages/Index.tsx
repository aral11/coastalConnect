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
  Calendar,
  Waves,
  Play,
  Quote,
  StarIcon,
  MapPinIcon,
  Filter,
  SlidersHorizontal
} from 'lucide-react';

interface ServiceCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  gradient: string;
  offer?: string;
  trending?: boolean;
}

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
  service: string;
}

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Udupi, Karnataka');
  const [searchType, setSearchType] = useState('all');
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    loadServices();
    loadTestimonials();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();

      if (data.success && data.data) {
        const serviceData: ServiceCategory[] = data.data.map((service: any) => ({
          id: service.id,
          title: service.title,
          subtitle: service.subtitle || 'Discover authentic experiences',
          description: service.description,
          icon: getServiceIcon(service.icon),
          link: service.link,
          gradient: service.gradient || 'from-blue-500 to-blue-600',
          offer: service.offer,
          trending: service.trending || false
        }));
        setServices(serviceData);
      }
    } catch (error) {
      console.error('Error loading services:', error);
      // Premium fallback services with better styling
      const fallbackServices: ServiceCategory[] = [
        {
          id: 'homestays',
          title: 'Cozy Homestays',
          subtitle: 'Authentic Local Stays',
          description: 'Experience coastal living in verified local homes with traditional hospitality',
          icon: <Bed className="h-8 w-8" />,
          link: '/homestays',
          gradient: 'from-emerald-400 via-teal-500 to-blue-600',
          offer: 'Up to 40% off',
          trending: true
        },
        {
          id: 'eateries',
          title: 'Local Eateries',
          subtitle: 'Coastal Cuisine Paradise',
          description: 'Savor authentic Udupi cuisine and fresh seafood at handpicked restaurants',
          icon: <ChefHat className="h-8 w-8" />,
          link: '/eateries',
          gradient: 'from-orange-400 via-red-500 to-pink-600',
          offer: 'Up to 50% off',
          trending: true
        },
        {
          id: 'transport',
          title: 'Local Transport',
          subtitle: 'Trusted Drivers',
          description: 'Safe and reliable rides with verified local drivers who know every corner',
          icon: <Car className="h-8 w-8" />,
          link: '/drivers',
          gradient: 'from-purple-400 via-pink-500 to-red-500',
          offer: 'Book Now'
        },
        {
          id: 'creators',
          title: 'Local Creators',
          subtitle: 'Content & Photography',
          description: 'Connect with talented photographers and content creators for memories',
          icon: <Camera className="h-8 w-8" />,
          link: '/creators',
          gradient: 'from-violet-400 via-purple-500 to-indigo-600',
          offer: 'Explore'
        },
        {
          id: 'events',
          title: 'Cultural Events',
          subtitle: 'Festivals & Activities',
          description: 'Join vibrant local festivals, Kambala races, and cultural celebrations',
          icon: <Calendar className="h-8 w-8" />,
          link: '/events',
          gradient: 'from-yellow-400 via-orange-500 to-red-500',
          offer: 'Book Tickets'
        },
        {
          id: 'services',
          title: 'Other Services',
          subtitle: 'Everything Else',
          description: 'Beauty, wellness, shopping, nightlife, and more coastal experiences',
          icon: <Sparkles className="h-8 w-8" />,
          link: '/services',
          gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
          offer: 'Discover'
        }
      ];
      setServices(fallbackServices);
    }
  };

  const loadTestimonials = () => {
    const mockTestimonials: Testimonial[] = [
      {
        id: 1,
        name: 'Priya Sharma',
        location: 'Bangalore',
        rating: 5,
        text: 'Amazing homestay experience! The family was so welcoming and the authentic Udupi breakfast was incredible. Will definitely book again!',
        avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&size=80&background=f56565&color=fff',
        service: 'Homestay'
      },
      {
        id: 2,
        name: 'Arjun Menon',
        location: 'Mumbai',
        rating: 5,
        text: 'The local driver was fantastic! Showed us hidden beaches and the best seafood spots. Much better than any travel guide.',
        avatar: 'https://ui-avatars.com/api/?name=Arjun+Menon&size=80&background=4299e1&color=fff',
        service: 'Transport'
      },
      {
        id: 3,
        name: 'Sneha Patel',
        location: 'Pune',
        rating: 5,
        text: 'The photographer captured our family vacation perfectly! Professional service at very reasonable rates.',
        avatar: 'https://ui-avatars.com/api/?name=Sneha+Patel&size=80&background=9f7aea&color=fff',
        service: 'Photography'
      }
    ];
    setTestimonials(mockTestimonials);
  };

  const getServiceIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Bed': <Bed className="h-8 w-8" />,
      'ChefHat': <ChefHat className="h-8 w-8" />,
      'Car': <Car className="h-8 w-8" />,
      'Camera': <Camera className="h-8 w-8" />,
      'Calendar': <Calendar className="h-8 w-8" />,
      'Sparkles': <Sparkles className="h-8 w-8" />
    };
    return iconMap[iconName] || <Store className="h-8 w-8" />;
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      let destination = '/search';

      if (searchType !== 'all') {
        const typeMap: { [key: string]: string } = {
          'stays': '/homestays',
          'food': '/eateries',
          'transport': '/drivers',
          'creators': '/creators',
          'events': '/events'
        };
        destination = typeMap[searchType] || '/search';
      } else {
        // Smart routing based on search query
        if (query.includes('homestay') || query.includes('stay') || query.includes('accommodation')) {
          destination = '/homestays';
        } else if (query.includes('restaurant') || query.includes('food') || query.includes('eat')) {
          destination = '/eateries';
        } else if (query.includes('driver') || query.includes('taxi') || query.includes('transport')) {
          destination = '/drivers';
        } else if (query.includes('creator') || query.includes('photographer') || query.includes('content')) {
          destination = '/creators';
        } else if (query.includes('event') || query.includes('festival') || query.includes('activity')) {
          destination = '/events';
        }
      }

      window.location.href = `${destination}?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(selectedLocation)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Layout fullWidth>
      {/* Premium Hero Section with Coastal Background */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Coastal image overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format")'
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-cyan-800/60 to-teal-700/80" />
          
          {/* Animated waves */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-24 text-white/10" viewBox="0 0 1200 120" fill="currentColor">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"/>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"/>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"/>
            </svg>
          </div>
        </div>

        <div className={`${layouts.container} relative z-10 flex items-center min-h-screen py-20`}>
          <div className="w-full max-w-6xl mx-auto">
            {/* Status Badge */}
            <div className="flex items-center justify-center mb-8">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-sm font-medium px-6 py-3 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                Live in Udupi • Manipal • Malpe
              </Badge>
            </div>

            {/* Main Heading */}
            <div className="text-center mb-16">
              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight text-white">
                Experience
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Coastal Karnataka
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
                Discover authentic homestays, savor local cuisine, explore with trusted guides,
                <br className="hidden md:block" />
                and create unforgettable memories along the pristine coast.
              </p>

              {/* Quick Stats */}
              <div className="flex justify-center space-x-8 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-blue-200 text-sm">Verified Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">10k+</div>
                  <div className="text-blue-200 text-sm">Happy Travelers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">4.8★</div>
                  <div className="text-blue-200 text-sm">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Premium Search Section */}
            <div className="max-w-5xl mx-auto mb-16">
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
                {/* Search Type Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {[
                    { id: 'all', label: 'All', icon: <Globe className="h-4 w-4" /> },
                    { id: 'stays', label: 'Stays', icon: <Bed className="h-4 w-4" /> },
                    { id: 'food', label: 'Food', icon: <ChefHat className="h-4 w-4" /> },
                    { id: 'transport', label: 'Rides', icon: <Car className="h-4 w-4" /> },
                    { id: 'creators', label: 'Creators', icon: <Camera className="h-4 w-4" /> },
                    { id: 'events', label: 'Events', icon: <Calendar className="h-4 w-4" /> }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSearchType(type.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                        searchType === type.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type.icon}
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Location Selector */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                      <select 
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full lg:w-64 pl-12 pr-8 py-5 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 bg-white appearance-none font-medium"
                      >
                        <option value="Udupi, Karnataka">���� Udupi, Karnataka</option>
                        <option value="Manipal, Karnataka">📍 Manipal, Karnataka</option>
                        <option value="Malpe, Karnataka">📍 Malpe, Karnataka</option>
                        <option value="Kaup, Karnataka">📍 Kaup, Karnataka</option>
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
                        placeholder={`Search for ${searchType === 'all' ? 'anything' : searchType}... e.g., "beachside homestay", "Udupi cuisine"`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-12 pr-4 py-5 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 text-lg font-medium"
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <Button 
                    onClick={handleSearch}
                    className="px-8 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </div>

                {/* Popular Searches */}
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-500 mr-2">Popular:</span>
                  {[
                    'Beachside homestays',
                    'Udupi restaurants',
                    'Malpe beach rides',
                    'Photography services'
                  ].map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(search)}
                      className="text-sm text-blue-600 hover:text-blue-800 mx-2 underline"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories - Premium Cards */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className={layouts.container}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Coastal Karnataka</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From authentic homestays to local delicacies, we've got everything you need for the perfect coastal getaway
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link key={service.id} to={service.link} className="group">
                <Card className="h-full bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden group-hover:scale-[1.02] group-hover:-translate-y-2">
                  <CardContent className="p-0">
                    <div className={`bg-gradient-to-br ${service.gradient} p-8 text-white relative overflow-hidden`}>
                      {/* Trending Badge */}
                      {service.trending && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-white/20 text-white border-white/30 text-xs font-medium px-3 py-1">
                            🔥 Trending
                          </Badge>
                        </div>
                      )}

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                            {service.icon}
                          </div>
                          <ArrowRight className="h-6 w-6 transform group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                        <p className="text-lg opacity-90 mb-1">{service.subtitle}</p>
                        <p className="text-sm opacity-75 mb-4 leading-relaxed">{service.description}</p>
                        
                        {service.offer && (
                          <Badge className="bg-white/25 text-white border-white/30 text-sm font-medium px-4 py-2">
                            {service.offer}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Enhanced Background decoration */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
                      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full"></div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20">
        <div className={layouts.container}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Travelers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from real travelers who discovered the magic of coastal Karnataka
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 p-8">
                <CardContent className="p-0">
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <Quote className="h-8 w-8 text-blue-500" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>

                  {/* User Info */}
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.location}</div>
                      <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">
                        {testimonial.service}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className={layouts.container}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why coastalConnect?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just a booking platform - we're your gateway to authentic coastal experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="h-12 w-12 text-blue-500" />,
                title: 'Verified & Trusted',
                description: 'Every partner is personally verified for safety, quality, and authentic local experience'
              },
              {
                icon: <Heart className="h-12 w-12 text-red-500" />,
                title: 'Local Community',
                description: 'Support local families and businesses while experiencing genuine coastal hospitality'
              },
              {
                icon: <Star className="h-12 w-12 text-yellow-500" />,
                title: 'Authentic Reviews',
                description: 'Real reviews from verified travelers help you make the best choices for your trip'
              },
              {
                icon: <Clock className="h-12 w-12 text-green-500" />,
                title: '24/7 Support',
                description: 'Round-the-clock assistance from our local team who know the coast inside out'
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 p-8 group hover:-translate-y-2">
                <CardContent className="p-0">
                  <div className="mb-6 flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
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

      {/* Partner CTA Section - Updated for consumer focus */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className={layouts.container}>
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Join the coastalConnect Family</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
              Whether you're a traveler seeking authentic experiences or a local business ready to welcome guests
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* For Travelers */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-8 rounded-3xl">
                <CardContent className="p-0">
                  <Users className="h-12 w-12 mb-4 mx-auto" />
                  <h3 className="text-2xl font-bold mb-4">For Travelers</h3>
                  <p className="text-blue-100 mb-6">
                    Create an account to save favorites, track bookings, and get personalized recommendations
                  </p>
                  <Link to="/signup">
                    <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl w-full">
                      Create Account
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* For Business Owners */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-8 rounded-3xl">
                <CardContent className="p-0">
                  <Store className="h-12 w-12 mb-4 mx-auto" />
                  <h3 className="text-2xl font-bold mb-4">For Business Owners</h3>
                  <p className="text-blue-100 mb-6">
                    List your homestay, restaurant, or service and connect with thousands of travelers
                  </p>
                  <Link to="/vendor-register">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 rounded-xl w-full">
                      List Your Business
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
