import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Heart,
  Sparkles,
  ChevronRight,
  Star
} from 'lucide-react';

interface LocalEvent {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  event_date: string;
  start_time?: string;
  organizer?: string;
  entry_fee?: number;
  image_url?: string;
  is_featured: boolean;
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
  phone?: string;
  image_url?: string;
}

export default function CommunityFeatures() {
  const [featuredEvents, setFeaturedEvents] = useState<LocalEvent[]>([]);
  const [religiousServices, setReligiousServices] = useState<ReligiousService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    try {
      setLoading(true);

      // Fetch featured events
      const eventsResponse = await fetch('/api/community/events/featured');
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setFeaturedEvents(eventsData.data || []);
      }

      // Fetch religious services
      const religiousResponse = await fetch('/api/community/religious-services?limit=6');
      if (religiousResponse.ok) {
        const religiousData = await religiousResponse.json();
        setReligiousServices(religiousData.data ? religiousData.data.slice(0, 6) : []);
      }
    } catch (error) {
      console.error('Error fetching community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Supporting Our Community</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            coastalConnect highlights local events, religious services, and community activities. 
            A comprehensive guide to happenings in Udupi and Manipal, with plans to expand to Mangalore.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Local Events */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="bg-orange-100 rounded-lg p-3 mr-4">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Local Events</h3>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">Live Updates</Badge>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Loading events...</p>
                </div>
              ) : featuredEvents.length > 0 ? (
                featuredEvents.map((event, index) => {
                  const colors = ['orange', 'blue', 'green'];
                  const color = colors[index % colors.length];
                  return (
                    <div key={event.id} className={`p-4 bg-${color}-50 rounded-lg`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Sparkles className={`h-4 w-4 text-${color}-600 mr-2`} />
                          <span className="font-semibold text-gray-900">{event.title}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {formatDate(event.event_date)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{event.location}</span>
                        </div>
                        {event.entry_fee !== undefined && (
                          <span>
                            {event.entry_fee === 0 ? 'Free' : `₹${event.entry_fee}`}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600">No upcoming events available</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                View All Events <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full text-orange-600 border-orange-600 hover:bg-orange-50"
                onClick={() => window.location.href = '/organizer-register'}
              >
                Organize an Event
              </Button>
            </div>
          </div>

          {/* Religious Services */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 rounded-lg p-3 mr-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Religious Services</h3>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">Daily Updates</Badge>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Loading services...</p>
                </div>
              ) : religiousServices.length > 0 ? (
                religiousServices.slice(0, 3).map((service, index) => {
                  const colors = ['yellow', 'blue', 'green'];
                  const color = colors[index % colors.length];
                  const religionIcons = {
                    hindu: '🕉️',
                    christian: '✝️',
                    islam: '☪️'
                  };
                  return (
                    <div key={service.id} className={`p-4 bg-${color}-50 rounded-lg`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <MapPin className={`h-4 w-4 text-${color}-600 mr-2`} />
                          <span className="font-semibold text-gray-900">{service.name}</span>
                        </div>
                        <span className="text-lg">
                          {religionIcons[service.religion as keyof typeof religionIcons] || '🏛️'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                        {service.morning_timings && (
                          <div>
                            <span className="font-medium">Morning:</span> {service.morning_timings}
                          </div>
                        )}
                        {service.evening_timings && (
                          <div>
                            <span className="font-medium">Evening:</span> {service.evening_timings}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600">No religious services data available</p>
                </div>
              )}
            </div>

            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              View Timings <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Community Engagement */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 rounded-lg p-3 mr-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Community Focus</h3>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">Growing Together</Badge>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Heart className="h-4 w-4 text-red-600 mr-2" />
                  <span className="font-semibold text-gray-900">Local Business Support</span>
                </div>
                <p className="text-sm text-gray-600">Promoting and uplifting local vendors</p>
              </div>
              
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Sparkles className="h-4 w-4 text-indigo-600 mr-2" />
                  <span className="font-semibold text-gray-900">Platform Expansion</span>
                </div>
                <p className="text-sm text-gray-600">Growing to Mangalore based on community response</p>
              </div>
              
              <div className="p-4 bg-teal-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Users className="h-4 w-4 text-teal-600 mr-2" />
                  <span className="font-semibold text-gray-900">Quality Content</span>
                </div>
                <p className="text-sm text-gray-600">Creating content that inspires and connects</p>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Join Community <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Coastal Vibes Connection */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-100 rounded-full p-4 mr-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">About coastalConnect</h3>
                <p className="text-blue-600">Powered by Coastal Vibes</p>
              </div>
            </div>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Founded by <span className="font-semibold text-gray-900">Aral Aldrin John D'Souza</span> in 2020, 
              Coastal Vibes connects and uplifts the coastal community. We promote local talents, 
              support charities, and create quality content that inspires!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Visit @coastalvibes.in
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600">
                Coastal Vibes Channel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
