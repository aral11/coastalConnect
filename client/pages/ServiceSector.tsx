import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  MapPin,
  Star,
  Phone,
  Clock,
  Globe,
  Users,
  Palette,
  Sparkles,
  Music,
  ShoppingBag,
  Camera,
  PartyPopper,
  Wrench,
  IndianRupee
} from 'lucide-react';

interface ServiceData {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  address?: string;
  rating?: number;
  total_reviews?: number;
  phone?: string;
  email?: string;
  opening_hours?: string;
  website_url?: string;
  image_url?: string;
  price_range?: string;
  services?: string;
  specialties?: string;
}

interface SectorConfig {
  title: string;
  description: string;
  apiEndpoint: string;
  icon: React.ReactNode;
  color: string;
}

const sectorConfigs: { [key: string]: SectorConfig } = {
  'arts-history': {
    title: 'Arts & History',
    description: 'Museums, Heritage Sites, Cultural Events & Traditional Art Forms',
    apiEndpoint: '/api/services/arts-history',
    icon: <Palette className="h-8 w-8" />,
    color: 'purple'
  },
  'beauty-wellness': {
    title: 'Beauty & Wellness',
    description: 'Salons, Spas, Gyms & Ayurvedic Centers',
    apiEndpoint: '/api/services/beauty-wellness',
    icon: <Sparkles className="h-8 w-8" />,
    color: 'pink'
  },
  'nightlife': {
    title: 'Nightlife',
    description: 'Bars, Pubs, Clubs & Entertainment Venues',
    apiEndpoint: '/api/services/nightlife',
    icon: <Music className="h-8 w-8" />,
    color: 'indigo'
  },
  'shopping': {
    title: 'Shopping',
    description: 'Markets, Stores, Boutiques & Local Crafts',
    apiEndpoint: '/api/services/shopping',
    icon: <ShoppingBag className="h-8 w-8" />,
    color: 'green'
  },
  'entertainment': {
    title: 'Entertainment',
    description: 'Cinemas, Festivals, Activities & Outdoor Adventures',
    apiEndpoint: '/api/services/entertainment',
    icon: <Camera className="h-8 w-8" />,
    color: 'orange'
  },
  'event-management': {
    title: 'Event Management',
    description: 'Weddings, Parties, Corporate Events & Celebrations',
    apiEndpoint: '/api/services/event-management',
    icon: <PartyPopper className="h-8 w-8" />,
    color: 'blue'
  },
  'other-services': {
    title: 'Other Services',
    description: 'Caterers, Plumbers, Electricians & Essential Services',
    apiEndpoint: '/api/services/other-services',
    icon: <Wrench className="h-8 w-8" />,
    color: 'gray'
  }
};

export default function ServiceSector() {
  const { sector } = useParams<{ sector: string }>();
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const config = sector ? sectorConfigs[sector] : null;

  useEffect(() => {
    if (config) {
      fetchServices();
    }
  }, [config]);

  const fetchServices = async () => {
    if (!config) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(config.apiEndpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setServices(data.data);
      } else {
        setError(data.message || 'Failed to fetch services');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Network error: ${errorMessage}`);
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">The requested service sector does not exist.</p>
          <Link to="/">
            <Button className="btn-coastal">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatServices = (servicesStr?: string) => {
    if (!servicesStr) return [];
    try {
      return JSON.parse(servicesStr);
    } catch {
      return servicesStr.split(',').map(s => s.trim());
    }
  };

  const renderServiceCard = (service: ServiceData) => (
    <Card key={service.id} className="card-coastal overflow-hidden hover:shadow-lg transition-shadow">
      {service.image_url && (
        <div className="h-48 overflow-hidden">
          <img 
            src={service.image_url} 
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop';
            }}
          />
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-gray-900 mb-2">{service.name}</CardTitle>
            <CardDescription className="text-gray-600 line-clamp-2">
              {service.description}
            </CardDescription>
          </div>
          {service.rating && (
            <div className="flex items-center ml-4">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="font-semibold">{service.rating}</span>
              {service.total_reviews && (
                <span className="text-sm text-gray-500 ml-1">({service.total_reviews})</span>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Location */}
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{service.address || service.location}</span>
        </div>
        
        {/* Category */}
        {service.category && (
          <Badge variant="secondary" className={`bg-${config.color}-100 text-${config.color}-700`}>
            {service.category.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        )}
        
        {/* Services/Specialties */}
        {(service.services || service.specialties) && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Services:</h4>
            <div className="flex flex-wrap gap-1">
              {formatServices(service.services || service.specialties).slice(0, 4).map((srv: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {srv}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Price Range */}
        {service.price_range && (
          <div className="flex items-center text-gray-600">
            <IndianRupee className="h-4 w-4 mr-2" />
            <span>{service.price_range}</span>
          </div>
        )}
        
        {/* Opening Hours */}
        {service.opening_hours && (
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span className="truncate">{service.opening_hours}</span>
          </div>
        )}
        
        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-2 pt-4">
          {service.phone && (
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${service.phone}`}>
                <Phone className="h-3 w-3 mr-1" />
                Call
              </a>
            </Button>
          )}
          {service.website_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={service.website_url} target="_blank" rel="noopener noreferrer">
                <Globe className="h-3 w-3 mr-1" />
                Website
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className={`py-20 bg-gradient-to-r from-${config.color}-500 to-${config.color}-600 text-white`}>
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center mb-6">
            <div className={`bg-white/20 rounded-lg p-4 mr-6`}>
              {config.icon}
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">{config.title}</h1>
              <p className="text-xl text-white/90 max-w-2xl">{config.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-white/80">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>{services.length} services available</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>Udupi & Manipal</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coastal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading {config.title.toLowerCase()}...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchServices} className="btn-coastal">
                Try Again
              </Button>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              {config.icon}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-4">No Services Found</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're building our {config.title.toLowerCase()} directory. Check back soon for amazing local services!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map(renderServiceCard)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
