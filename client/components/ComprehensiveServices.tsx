import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  UtensilsCrossed,
  Palette,
  Sparkles,
  Music,
  ShoppingBag,
  Camera,
  PartyPopper,
  Wrench,
  Bike,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Star
} from 'lucide-react';

interface ServiceData {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  rating?: number;
  total_reviews?: number;
  image_url?: string;
}

interface ServiceSector {
  title: string;
  description: string;
  apiEndpoint: string;
  color: string;
  icon: React.ReactNode;
  link: string;
  data?: ServiceData[];
  count?: number;
}

export default function ComprehensiveServices() {
  const [serviceSectors, setServiceSectors] = useState<ServiceSector[]>([
    {
      title: 'Eateries',
      description: 'Restaurants, Cafés, Bars',
      apiEndpoint: '/api/eateries',
      color: 'red',
      icon: <UtensilsCrossed className="h-6 w-6 text-red-600" />,
      link: '/eateries'
    },
    {
      title: 'Arts & History',
      description: 'Museums, Heritage, Cultural Events',
      apiEndpoint: '/api/services/arts-history',
      color: 'purple',
      icon: <Palette className="h-6 w-6 text-purple-600" />,
      link: '/arts-history'
    },
    {
      title: 'Beauty & Wellness',
      description: 'Salons, Spas, Gyms',
      apiEndpoint: '/api/services/beauty-wellness',
      color: 'pink',
      icon: <Sparkles className="h-6 w-6 text-pink-600" />,
      link: '/beauty-wellness'
    },
    {
      title: 'Nightlife',
      description: 'Bars, Pubs, Clubs',
      apiEndpoint: '/api/services/nightlife',
      color: 'indigo',
      icon: <Music className="h-6 w-6 text-indigo-600" />,
      link: '/nightlife'
    },
    {
      title: 'Shopping',
      description: 'Markets, Stores, Boutiques',
      apiEndpoint: '/api/services/shopping',
      color: 'green',
      icon: <ShoppingBag className="h-6 w-6 text-green-600" />,
      link: '/shopping'
    },
    {
      title: 'Entertainment',
      description: 'Cinemas, Festivals, Activities',
      apiEndpoint: '/api/services/entertainment',
      color: 'orange',
      icon: <Camera className="h-6 w-6 text-orange-600" />,
      link: '/entertainment'
    },
    {
      title: 'Event Management',
      description: 'Weddings, Parties, Corporate',
      apiEndpoint: '/api/services/event-management',
      color: 'blue',
      icon: <PartyPopper className="h-6 w-6 text-blue-600" />,
      link: '/event-management'
    },
    {
      title: 'Other Services',
      description: 'Caterers, Plumbers, Electricians',
      apiEndpoint: '/api/services/other-services',
      color: 'gray',
      icon: <Wrench className="h-6 w-6 text-gray-600" />,
      link: '/other-services'
    },
    {
      title: 'Transportation',
      description: 'Auto, Car & Bike Rentals',
      apiEndpoint: '/api/drivers',
      color: 'teal',
      icon: <Bike className="h-6 w-6 text-teal-600" />,
      link: '/drivers'
    }
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllServiceData();
  }, []);

  const fetchAllServiceData = async () => {
    try {
      setLoading(true);

      const updatedSectors = await Promise.all(
        serviceSectors.map(async (sector) => {
          try {
            const response = await fetch(sector.apiEndpoint);
            if (response.ok) {
              const data = await response.json();
              return {
                ...sector,
                data: data.data ? data.data.slice(0, 3) : [], // Show top 3 for each sector
                count: data.count || 0
              };
            } else {
              return { ...sector, count: 0 };
            }
          } catch (error) {
            console.log(`Failed to fetch ${sector.title} data:`, error);
            return { ...sector, count: 0 };
          }
        })
      );

      setServiceSectors(updatedSectors);
    } catch (error) {
      console.error('Error fetching service data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderServiceCard = (sector: ServiceSector) => {
    const bgColorClass = `bg-${sector.color}-100`;
    const hoverBgColorClass = `group-hover:bg-${sector.color}-200`;
    const buttonColorClass = `bg-${sector.color}-600 hover:bg-${sector.color}-700`;
    const textColorClass = `text-${sector.color}-600`;

    return (
      <div key={sector.title} className="card-coastal p-6 group cursor-pointer">
        <div className="flex items-center mb-4">
          <div className={`${bgColorClass} rounded-lg p-3 mr-4 ${hoverBgColorClass} transition-colors`}>
            {sector.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{sector.title}</h3>
            <p className={`${textColorClass} text-sm`}>{sector.description}</p>
            {sector.count !== undefined && (
              <p className="text-xs text-gray-500 mt-1">
                {sector.count} {sector.count === 1 ? 'service' : 'services'} available
              </p>
            )}
          </div>
        </div>

        {/* Show sample data if available */}
        {sector.data && sector.data.length > 0 && (
          <div className="mb-4">
            <div className="space-y-2">
              {sector.data.slice(0, 2).map((service) => (
                <div key={service.id} className="text-xs bg-gray-50 p-2 rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{service.name}</span>
                    {service.rating && (
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        <span>{service.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="truncate">{service.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-gray-600 text-sm mb-4">
          {sector.title === 'Eateries' && 'Authentic Udupi cuisine, coastal specialties, and local dining experiences.'}
          {sector.title === 'Arts & History' && 'Traditional art forms, cultural sites, Yakshagana performances, and heritage tours.'}
          {sector.title === 'Beauty & Wellness' && 'Traditional Ayurvedic treatments, modern spa services, and fitness centers.'}
          {sector.title === 'Nightlife' && 'Evening entertainment, live music venues, and social gathering spots.'}
          {sector.title === 'Shopping' && 'Local markets, traditional handicrafts, and modern shopping experiences.'}
          {sector.title === 'Entertainment' && 'Movie theaters, beach activities, cultural festivals, and outdoor adventures.'}
          {sector.title === 'Event Management' && 'Traditional wedding planning, corporate events, and celebration management.'}
          {sector.title === 'Other Services' && 'Essential services, home maintenance, and professional contractors.'}
          {sector.title === 'Transportation' && 'Local transport, vehicle rentals, and trusted driver services.'}
        </p>

        <Link to={sector.link}>
          <Button size="sm" className={`w-full ${buttonColorClass}`}>
            {sector.title === 'Eateries' && 'Explore'}
            {sector.title === 'Arts & History' && 'Discover'}
            {sector.title === 'Beauty & Wellness' && 'Book Now'}
            {sector.title === 'Nightlife' && 'Explore'}
            {sector.title === 'Shopping' && 'Shop'}
            {sector.title === 'Entertainment' && 'Book'}
            {sector.title === 'Event Management' && 'Plan Event'}
            {sector.title === 'Other Services' && 'Find Services'}
            {sector.title === 'Transportation' && 'Book Ride'}
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>
    );
  };
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">coastalConnect Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your one-stop platform connecting local vendors across Udupi and Manipal.
            Join our growing network of trusted local businesses and reach more customers.
          </p>
          <div className="mt-6">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-lg px-6 py-2">
              ��� Launch Offer - ₹99/month (First Month) | ₹199/month After
            </Badge>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coastal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading service sectors...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {loading ? (
            // Skeleton loading state
            Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="card-coastal p-6">
                <div className="flex items-center mb-4">
                  <Skeleton className="w-12 h-12 rounded-lg mr-4" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            ))
          ) : (
            serviceSectors.map(renderServiceCard)
          )}
        </div>
        )}

        {/* Vendor CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-coastal-500 to-ocean-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Become a Verified Vendor!</h3>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Join coastalConnect with affordable subscription plans. Get verified by our admin team and start reaching customers in Udupi & Manipal today!
            </p>
            <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">₹99</div>
                <div className="text-sm opacity-90">per month</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">₹199</div>
                <div className="text-sm opacity-90">annual plan</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-coastal-600 hover:bg-gray-100">
                <Mail className="mr-2 h-5 w-5" />
                Contact: admin@coastalconnect.in
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Phone className="mr-2 h-5 w-5" />
                Call: 8105003858
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
