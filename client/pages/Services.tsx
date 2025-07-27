import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import {
  Search,
  ArrowRight,
  Star,
  MapPin,
  Users,
  Clock,
  Phone,
  Mail,
  ExternalLink,
  Palette,
  Scissors,
  Music,
  ShoppingBag,
  Calendar,
  Wrench,
  Camera,
  Sparkles,
  Building,
  PartyPopper
} from 'lucide-react';

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  serviceCount: number;
  averageRating: number;
  priceRange: string;
  topServices: string[];
}

interface ServiceProvider {
  id: number;
  name: string;
  category: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: string;
  image: string;
  phone?: string;
  featured: boolean;
}

export default function Services() {
  const { id } = useParams();
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [featuredProviders, setFeaturedProviders] = useState<ServiceProvider[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const defaultCategories: ServiceCategory[] = [
    {
      id: 'arts-history',
      title: 'Arts & History',
      description: 'Museums, Heritage Sites, Cultural Events & Traditional Art Forms',
      icon: <Palette className="h-8 w-8" />,
      link: '/arts-history',
      color: 'from-purple-500 to-purple-600',
      serviceCount: 12,
      averageRating: 4.6,
      priceRange: '���100-500',
      topServices: ['Heritage Tours', 'Art Galleries', 'Cultural Centers']
    },
    {
      id: 'beauty-wellness',
      title: 'Beauty & Wellness',
      description: 'Salons, Spas, Fitness Centers & Wellness Services',
      icon: <Sparkles className="h-8 w-8" />,
      link: '/beauty-wellness',
      color: 'from-pink-500 to-pink-600',
      serviceCount: 28,
      averageRating: 4.4,
      priceRange: '₹200-2000',
      topServices: ['Hair Salons', 'Spa Services', 'Fitness Centers']
    },
    {
      id: 'nightlife',
      title: 'Nightlife',
      description: 'Bars, Pubs, Lounges & Late Night Entertainment',
      icon: <Music className="h-8 w-8" />,
      link: '/nightlife',
      color: 'from-indigo-500 to-indigo-600',
      serviceCount: 15,
      averageRating: 4.2,
      priceRange: '₹300-1500',
      topServices: ['Pubs & Bars', 'Live Music', 'Karaoke']
    },
    {
      id: 'shopping',
      title: 'Shopping',
      description: 'Local Markets, Stores, Handicrafts & Shopping Centers',
      icon: <ShoppingBag className="h-8 w-8" />,
      link: '/shopping',
      color: 'from-green-500 to-green-600',
      serviceCount: 45,
      averageRating: 4.3,
      priceRange: '₹50-5000',
      topServices: ['Local Markets', 'Handicrafts', 'Textiles']
    },
    {
      id: 'entertainment',
      title: 'Entertainment',
      description: 'Movie Theaters, Gaming Zones, Adventure Sports & Recreation',
      icon: <Camera className="h-8 w-8" />,
      link: '/entertainment',
      color: 'from-red-500 to-red-600',
      serviceCount: 18,
      averageRating: 4.5,
      priceRange: '₹150-800',
      topServices: ['Cinemas', 'Gaming', 'Adventure Sports']
    },
    {
      id: 'event-management',
      title: 'Event Management',
      description: 'Wedding Planners, Party Organizers & Event Services',
      icon: <PartyPopper className="h-8 w-8" />,
      link: '/event-management',
      color: 'from-yellow-500 to-yellow-600',
      serviceCount: 22,
      averageRating: 4.7,
      priceRange: '₹5000-50000',
      topServices: ['Wedding Planning', 'Corporate Events', 'Catering']
    },
    {
      id: 'other-services',
      title: 'Other Services',
      description: 'Professional Services, Repairs, Maintenance & More',
      icon: <Wrench className="h-8 w-8" />,
      link: '/other-services',
      color: 'from-gray-500 to-gray-600',
      serviceCount: 35,
      averageRating: 4.1,
      priceRange: '₹100-3000',
      topServices: ['Home Repairs', 'Professional Services', 'Consultancy']
    }
  ];

  const defaultFeaturedProviders: ServiceProvider[] = [
    {
      id: 1,
      name: 'Coastal Spa & Wellness',
      category: 'Beauty & Wellness',
      description: 'Ayurvedic treatments and massages using traditional coastal herbs and oils.',
      location: 'Malpe Beach Road',
      rating: 4.8,
      reviewCount: 156,
      price: '₹1,500/session',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
      phone: '+91 98765 43210',
      featured: true
    },
    {
      id: 2,
      name: 'Heritage Art Gallery',
      category: 'Arts & History',
      description: 'Showcasing traditional coastal Karnataka art, sculptures and historical artifacts.',
      location: 'Car Street, Udupi',
      rating: 4.6,
      reviewCount: 89,
      price: '₹100/entry',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      featured: true
    },
    {
      id: 3,
      name: 'Dream Wedding Planners',
      category: 'Event Management',
      description: 'Complete wedding planning services with traditional coastal ceremonies.',
      location: 'Manipal Center',
      rating: 4.9,
      reviewCount: 234,
      price: '₹25,000/event',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
      phone: '+91 98765 54321',
      featured: true
    },
    {
      id: 4,
      name: 'Coastal Adventure Sports',
      category: 'Entertainment',
      description: 'Water sports, parasailing, and beach activities at Malpe Beach.',
      location: 'Malpe Beach',
      rating: 4.7,
      reviewCount: 178,
      price: '₹500/activity',
      image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop',
      featured: true
    },
    {
      id: 5,
      name: 'Udupi Handicrafts Center',
      category: 'Shopping',
      description: 'Authentic local handicrafts, textiles, and traditional coastal artifacts.',
      location: 'Temple Street, Udupi',
      rating: 4.4,
      reviewCount: 92,
      price: '₹200-2000',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      featured: true
    },
    {
      id: 6,
      name: 'Ocean View Lounge',
      category: 'Nightlife',
      description: 'Rooftop lounge with live music and coastal cuisine in a vibrant atmosphere.',
      location: 'Manipal',
      rating: 4.3,
      reviewCount: 145,
      price: '₹800/person',
      image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop',
      featured: true
    }
  ];

  useEffect(() => {
    fetchServicesData();
  }, []);

  const fetchServicesData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      const response = await fetch('/api/services');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && Array.isArray(data.data)) {
          // Ensure each category has required fields with fallbacks
          const validatedCategories = data.data.map((category: any) => ({
            ...category,
            topServices: category.topServices || [],
            serviceCount: category.serviceCount || 0,
            averageRating: category.averageRating || 4.0,
            priceRange: category.priceRange || 'Contact for pricing'
          }));
          setServiceCategories(validatedCategories);
        } else {
          throw new Error('API data not available');
        }
      } else {
        throw new Error('API not available');
      }
    } catch (error) {
      console.log('Services API not available, using fallback data');
      setServiceCategories(defaultCategories);
      setFeaturedProviders(defaultFeaturedProviders);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = serviceCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProviders = featuredProviders.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {/* Page Header */}
      <PageHeader
        title="All Services"
        description="Discover comprehensive services across Udupi & Manipal - from beauty & wellness to entertainment and professional services"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' }
        ]}
      />

      {/* Search Section */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search services, categories, or providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-2 border-orange-200 focus:border-orange-500 rounded-xl"
              />
            </div>
            <div className="text-center mt-4">
              <p className="text-gray-600">
                Explore {serviceCategories.length} service categories with {serviceCategories.reduce((total, cat) => total + cat.serviceCount, 0)}+ verified providers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Categories Grid */}
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Categories</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Browse our comprehensive range of services across different categories
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                  <Link key={category.id} to={category.link} className="group">
                    <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden">
                      <div className={`bg-gradient-to-br ${category.color} p-6 text-white relative`}>
                        <div className="flex items-center justify-between mb-4">
                          {category.icon}
                          <ArrowRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                        <p className="text-sm opacity-90 mb-4 line-clamp-2">{category.description}</p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{category.serviceCount} services</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 fill-current" />
                            <span>{category.averageRating}</span>
                          </div>
                        </div>
                        
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Price Range:</span>
                            <span className="font-medium">{category.priceRange}</span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-2">Popular Services:</p>
                            <div className="flex flex-wrap gap-1">
                              {category.topServices?.slice(0, 3).map((service, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {service}
                                </Badge>
                              )) || []}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured Service Providers */}
            {filteredProviders.length > 0 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Service Providers</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Handpicked top-rated service providers trusted by our community
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProviders.map((provider) => (
                    <Card key={provider.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative h-48">
                        <img
                          src={provider.image}
                          alt={provider.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-orange-500 text-white">
                            Featured
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/90 rounded-full px-2 py-1 flex items-center text-sm">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="font-medium">{provider.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{provider.name}</CardTitle>
                            <CardDescription className="text-sm text-orange-600">
                              {provider.category}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {provider.description}
                        </p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {provider.location}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-gray-600">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{provider.reviewCount} reviews</span>
                            </div>
                            <div className="font-semibold text-orange-600">
                              {provider.price}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 pt-3 border-t">
                          {provider.phone && (
                            <Button size="sm" variant="outline" className="flex-1">
                              <Phone className="h-3 w-3 mr-1" />
                              Call
                            </Button>
                          )}
                          <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchQuery && filteredCategories.length === 0 && filteredProviders.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any services matching "{searchQuery}". Try a different search term.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Provide Services in Your Area?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our network of trusted service providers and reach thousands of local customers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/vendor-register">
              <Button size="lg" variant="outline" className="bg-white text-orange-600 hover:bg-gray-50">
                <Building className="h-5 w-5 mr-2" />
                Register as Vendor
              </Button>
            </Link>
            <Link to="/business-dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Users className="h-5 w-5 mr-2" />
                Business Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
