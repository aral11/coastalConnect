import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Star, IndianRupee, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { designSystem } from '@/lib/design-system';

interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  event_date: string;
  start_time?: string;
  organizer: string;
  entry_fee: number;
  is_featured?: boolean;
}

interface ReligiousService {
  id: number;
  name: string;
  description: string;
  religion: string;
  category: string;
  location: string;
  morning_timings?: string;
  evening_timings?: string;
}

const CommunityFeatures: React.FC = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [religiousServices, setReligiousServices] = useState<ReligiousService[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [religiousLoading, setReligiousLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [religiousError, setReligiousError] = useState<string | null>(null);

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    // Try to fetch featured events with proper error handling
    try {
      setEventsLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const eventsResponse = await fetch('/api/community/featured-events?limit=3', {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        if (eventsData.success && eventsData.data) {
          setFeaturedEvents(eventsData.data ? eventsData.data.slice(0, 3) : []);
          console.log('✅ Featured events loaded successfully');
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error(`Events API returned ${eventsResponse.status}`);
      }
    } catch (eventsError) {
      console.error('Events API unavailable:', eventsError instanceof Error ? eventsError.message : 'Unknown error');
      setFeaturedEvents([]);
      setEventsError('Unable to load events. Please check back later.');
    } finally {
      setEventsLoading(false);
    }

    // Try to fetch religious services with proper error handling
    try {
      setReligiousLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const religiousResponse = await fetch('/api/community/religious-services?limit=6', {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (religiousResponse.ok) {
        const religiousData = await religiousResponse.json();
        if (religiousData.success && religiousData.data) {
          setReligiousServices(religiousData.data ? religiousData.data.slice(0, 6) : []);
          console.log('✅ Religious services loaded successfully');
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error(`Religious services API returned ${religiousResponse.status}`);
      }
    } catch (religiousError) {
      console.error('Religious services API unavailable:', religiousError instanceof Error ? religiousError.message : 'Unknown error');
      setReligiousServices([]);
      setReligiousError('Unable to load religious services. Please check back later.');
    } finally {
      setReligiousLoading(false);
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'religious': 'bg-orange-100 text-orange-800',
      'cultural': 'bg-purple-100 text-purple-800',
      'community': 'bg-green-100 text-green-800',
      'festival': 'bg-red-100 text-red-800',
      'sports': 'bg-blue-100 text-blue-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getReligionIcon = (religion: string) => {
    switch (religion.toLowerCase()) {
      case 'hindu': return '🕉️';
      case 'christian': return '✝️';
      case 'islam': return '☪️';
      case 'buddhist': return '☸️';
      case 'jain': return '🔱';
      default: return '🛐';
    }
  };

  if (eventsLoading || religiousLoading) {
    return (
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className={designSystem.layouts.container.standard}>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Community & Culture
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover local events and religious services in coastal Karnataka
            </p>
          </div>
          
          {/* Loading skeletons */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-xl h-48 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className={designSystem.layouts.container.standard}>
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Community & Culture
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover local events and religious services in coastal Karnataka
          </p>
        </div>

        {/* Featured Events Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Featured Events</h3>
            <Link to="/events">
              <Button variant="outline" className="hover:bg-orange-50 hover:border-orange-500">
                View All Events
              </Button>
            </Link>
          </div>

          {eventsError ? (
            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Available</h3>
              <p className="text-gray-500 mb-4">{eventsError}</p>
              <Button onClick={fetchCommunityData} variant="outline">
                Try Again
              </Button>
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Scheduled</h3>
              <p className="text-gray-500 mb-4">Check back soon for upcoming community events</p>
              <Link to="/events">
                <Button variant="outline">Browse All Events</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <Card key={event.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getCategoryColor(event.category)}>
                        {event.category}
                      </Badge>
                      {event.is_featured && (
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <CardTitle className="text-lg group-hover:text-orange-600 transition-colors">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{formatEventDate(event.event_date)}</span>
                        {event.start_time && (
                          <span className="ml-2">at {event.start_time}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        <span>by {event.organizer}</span>
                      </div>
                      <div className="flex items-center">
                        <IndianRupee className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{event.entry_fee === 0 ? 'Free' : `₹${event.entry_fee}`}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Religious Services Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Religious Services</h3>
            <Link to="/religious-services">
              <Button variant="outline" className="hover:bg-orange-50 hover:border-orange-500">
                View All Services
              </Button>
            </Link>
          </div>

          {religiousError ? (
            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-4xl mb-4">🛐</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Religious Services Available</h3>
              <p className="text-gray-500 mb-4">{religiousError}</p>
              <Button onClick={fetchCommunityData} variant="outline">
                Try Again
              </Button>
            </div>
          ) : religiousServices.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-4xl mb-4">🛐</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Religious Services Listed</h3>
              <p className="text-gray-500 mb-4">Religious services will appear here once added to the platform</p>
              <Link to="/religious-services">
                <Button variant="outline">Browse All Services</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {religiousServices.map((service) => (
                <Card key={service.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-2xl">{getReligionIcon(service.religion)}</div>
                      <Badge variant="outline" className="capitalize">
                        {service.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-orange-600 transition-colors">
                      {service.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{service.location}</span>
                      </div>
                      {service.morning_timings && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Morning: {service.morning_timings}</span>
                        </div>
                      )}
                      {service.evening_timings && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Evening: {service.evening_timings}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CommunityFeatures;
