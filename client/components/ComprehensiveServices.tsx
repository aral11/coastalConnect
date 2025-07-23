import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">coastalConnect Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your one-stop platform connecting local vendors across Udupi and Manipal. Pre-launch offers available for early sign-ups! 
            Vendors can add their business listings with minimal lifetime subscription.
          </p>
          <div className="mt-6">
            <Badge variant="secondary" className="bg-green-100 text-green-800 text-lg px-6 py-2">
              🚀 Pre-Launch Special Offers Available!
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Food & Drink */}
          <div className="card-coastal p-6 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 rounded-lg p-3 mr-4 group-hover:bg-red-200 transition-colors">
                <UtensilsCrossed className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Food & Drink</h3>
                <p className="text-red-600 text-sm">Restaurants, Cafés, Bars</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">Authentic Udupi cuisine, coastal specialties, and local dining experiences.</p>
            <Link to="/eateries">
              <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                Explore <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>

          {/* Arts & History */}
          <div className="card-coastal p-6 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 rounded-lg p-3 mr-4 group-hover:bg-purple-200 transition-colors">
                <Palette className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Arts & History</h3>
                <p className="text-purple-600 text-sm">Museums, Heritage, Cultural Events</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">Traditional art forms, cultural sites, Yakshagana performances, and heritage tours.</p>
            <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
              Discover <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>

          {/* Beauty & Wellness */}
          <div className="card-coastal p-6 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="bg-pink-100 rounded-lg p-3 mr-4 group-hover:bg-pink-200 transition-colors">
                <Sparkles className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Beauty & Wellness</h3>
                <p className="text-pink-600 text-sm">Salons, Spas, Gyms</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">Traditional Ayurvedic treatments, modern spa services, and fitness centers.</p>
            <Button size="sm" className="w-full bg-pink-600 hover:bg-pink-700">
              Book Now <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>

          {/* Nightlife */}
          <div className="card-coastal p-6 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 rounded-lg p-3 mr-4 group-hover:bg-indigo-200 transition-colors">
                <Music className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Nightlife</h3>
                <p className="text-indigo-600 text-sm">Bars, Pubs, Clubs</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">Evening entertainment, live music venues, and social gathering spots.</p>
            <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
              Explore <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>

          {/* Shopping */}
          <div className="card-coastal p-6 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-lg p-3 mr-4 group-hover:bg-green-200 transition-colors">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Shopping</h3>
                <p className="text-green-600 text-sm">Markets, Stores, Boutiques</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">Local markets, traditional handicrafts, and modern shopping experiences.</p>
            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
              Shop <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>

          {/* Entertainment */}
          <div className="card-coastal p-6 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 rounded-lg p-3 mr-4 group-hover:bg-orange-200 transition-colors">
                <Camera className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Entertainment</h3>
                <p className="text-orange-600 text-sm">Cinemas, Festivals, Activities</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">Movie theaters, beach activities, cultural festivals, and outdoor adventures.</p>
            <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
              Book <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>

          {/* Event Management */}
          <div className="card-coastal p-6 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-lg p-3 mr-4 group-hover:bg-blue-200 transition-colors">
                <PartyPopper className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Event Management</h3>
                <p className="text-blue-600 text-sm">Weddings, Parties, Corporate</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">Traditional wedding planning, corporate events, and celebration management.</p>
            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
              Plan Event <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>

          {/* Other Services */}
          <div className="card-coastal p-6 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="bg-gray-100 rounded-lg p-3 mr-4 group-hover:bg-gray-200 transition-colors">
                <Wrench className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Other Services</h3>
                <p className="text-gray-600 text-sm">Caterers, Plumbers, Electricians</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">Essential services, home maintenance, and professional contractors.</p>
            <Button size="sm" className="w-full bg-gray-600 hover:bg-gray-700">
              Find Services <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>

          {/* Transportation */}
          <div className="card-coastal p-6 group cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="bg-teal-100 rounded-lg p-3 mr-4 group-hover:bg-teal-200 transition-colors">
                <Bike className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Transportation</h3>
                <p className="text-teal-600 text-sm">Auto, Car & Bike Rentals</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">Local transport, vehicle rentals, and trusted driver services.</p>
            <Link to="/drivers">
              <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700">
                Book Ride <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Vendor CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-coastal-500 to-ocean-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Join coastalConnect Today!</h3>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Vendors can add their business listings during the launch with a minimal lifetime subscription. 
              Advertise your services and reach a wider audience through our community-focused platform.
            </p>
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
