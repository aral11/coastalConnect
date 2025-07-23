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
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Sparkles className="h-4 w-4 text-orange-600 mr-2" />
                  <span className="font-semibold text-gray-900">Kambala Festivals</span>
                </div>
                <p className="text-sm text-gray-600">Traditional buffalo races and cultural celebrations</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-semibold text-gray-900">Beach Festivals</span>
                </div>
                <p className="text-sm text-gray-600">Malpe beach events and coastal celebrations</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Sparkles className="h-4 w-4 text-green-600 mr-2" />
                  <span className="font-semibold text-gray-900">Cultural Programs</span>
                </div>
                <p className="text-sm text-gray-600">Yakshagana performances and art exhibitions</p>
              </div>
            </div>

            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              View All Events <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
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
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 text-yellow-600 mr-2" />
                  <span className="font-semibold text-gray-900">Temple Timings</span>
                </div>
                <p className="text-sm text-gray-600">Krishna Temple, Anantheshwara Temple, and more</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-semibold text-gray-900">Church Services</span>
                </div>
                <p className="text-sm text-gray-600">Mass timings and special celebrations</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 text-green-600 mr-2" />
                  <span className="font-semibold text-gray-900">Mosque Prayers</span>
                </div>
                <p className="text-sm text-gray-600">Prayer times and community gatherings</p>
              </div>
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
