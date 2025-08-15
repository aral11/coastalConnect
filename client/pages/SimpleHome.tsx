/**
 * Simple Working Homepage
 * Basic UI that loads immediately without dependencies
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Star,
  Search,
  Menu,
  Heart,
  Calendar,
  Users,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
  Zap,
  Award,
  TrendingUp
} from 'lucide-react';

export default function SimpleHome() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">CC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CoastalConnect</h1>
                <p className="text-xs text-gray-600">Coastal Karnataka</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-white/20 text-white mb-6">
            🌊 Now Live in Coastal Karnataka
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Coastal
            <br />
            <span className="text-yellow-300">Karnataka</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
            Your gateway to authentic experiences, local services, and unforgettable adventures along India's beautiful western coast
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search hotels, restaurants, activities..."
                  className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                />
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600 px-8">
                Search
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">150+</div>
              <div className="text-white/80">Services</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">5K+</div>
              <div className="text-white/80">Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">25+</div>
              <div className="text-white/80">Locations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">4.8★</div>
              <div className="text-white/80">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Categories</h2>
            <p className="text-gray-600 text-lg">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Hotels', icon: '🏨', count: 45 },
              { name: 'Food', icon: '🍽️', count: 78 },
              { name: 'Transport', icon: '🚗', count: 32 },
              { name: 'Events', icon: '🎉', count: 23 },
              { name: 'Adventure', icon: '🏄', count: 19 },
              { name: 'Wellness', icon: '🧘', count: 15 }
            ].map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600">
                    {category.name}
                  </h3>
                  <Badge variant="secondary">
                    {category.count} services
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Services</h2>
              <p className="text-gray-600">Hand-picked experiences for you</p>
            </div>
            <Button variant="outline">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Beachside Villa Resort',
                price: '₹3,500',
                rating: 4.8,
                reviews: 245,
                location: 'Malpe Beach',
                category: 'Hotels'
              },
              {
                name: 'Coastal Food Tour',
                price: '₹899',
                rating: 4.9,
                reviews: 156,
                location: 'Mangalore',
                category: 'Food'
              },
              {
                name: 'Sunset Cruise Experience',
                price: '₹1,200',
                rating: 4.7,
                reviews: 89,
                location: 'Karwar',
                category: 'Adventure'
              }
            ].map((service, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="aspect-video bg-gradient-to-br from-orange-200 to-pink-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-50">🏖️</span>
                  </div>
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                  <Badge className="absolute top-3 left-3 bg-orange-500">
                    Featured
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600">
                      {service.name}
                    </h3>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">{service.price}</div>
                      <div className="text-xs text-gray-500">per night</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                      <span>{service.rating}</span>
                      <span className="ml-1">({service.reviews})</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {service.location}
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="mb-4">
                    {service.category}
                  </Badge>
                  
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Why Choose CoastalConnect?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Verified Services</h3>
              <p className="text-gray-600">All our partners are verified and trusted</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Instant Booking</h3>
              <p className="text-gray-600">Book services instantly with confirmed availability</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing with no hidden charges</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CC</span>
                </div>
                <span className="text-xl font-bold">CoastalConnect</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your gateway to authentic coastal Karnataka experiences.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Hotels & Homestays</li>
                <li>Restaurants</li>
                <li>Transport</li>
                <li>Events</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Careers</li>
                <li>Press</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Safety</li>
                <li>Terms</li>
                <li>Privacy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 CoastalConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
