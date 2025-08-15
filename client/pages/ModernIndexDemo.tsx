/**
 * Modern CoastalConnect Homepage - Demo Version
 * Works without Supabase for UI preview
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Users,
  TrendingUp,
  Zap,
  ArrowRight,
  Heart,
  Filter,
  ChevronDown,
  PlayCircle,
  Award,
  Percent,
  Phone,
  Mail,
  Menu,
  X,
} from "lucide-react";

// Demo data
const demoCategories = [
  {
    id: "1",
    name: "Hotels & Homestays",
    icon: "🏨",
    count: 45,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "2",
    name: "Food & Dining",
    icon: "🍽️",
    count: 78,
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "3",
    name: "Transport",
    icon: "🚗",
    count: 32,
    color: "bg-green-100 text-green-700",
  },
  {
    id: "4",
    name: "Events",
    icon: "🎉",
    count: 23,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "5",
    name: "Adventure",
    icon: "🏄",
    count: 19,
    color: "bg-red-100 text-red-700",
  },
  {
    id: "6",
    name: "Wellness",
    icon: "🧘",
    count: 15,
    color: "bg-pink-100 text-pink-700",
  },
];

const demoServices = [
  {
    id: "1",
    name: "Beachside Villa Resort",
    category: "Hotels & Homestays",
    price: 3500,
    rating: 4.8,
    reviews: 245,
    location: "Malpe Beach",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
    featured: true,
  },
  {
    id: "2",
    name: "Coastal Food Tour",
    category: "Food & Dining",
    price: 899,
    rating: 4.9,
    reviews: 156,
    location: "Mangalore",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
    featured: true,
  },
  {
    id: "3",
    name: "Sunset Cruise Experience",
    category: "Adventure",
    price: 1200,
    rating: 4.7,
    reviews: 89,
    location: "Karwar",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
    featured: false,
  },
];

const demoLocations = [
  "Mangalore",
  "Udupi",
  "Karwar",
  "Gokarna",
  "Murudeshwar",
];

export default function ModernIndexDemo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                CoastalConnect
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/services"
                className="text-gray-600 hover:text-orange-600 font-medium"
              >
                Services
              </Link>
              <Link
                to="/events"
                className="text-gray-600 hover:text-orange-600 font-medium"
              >
                Events
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-orange-600 font-medium"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-orange-600 font-medium"
              >
                Contact
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-2 space-y-2">
              <Link
                to="/services"
                className="block py-2 text-gray-600 hover:text-orange-600"
              >
                Services
              </Link>
              <Link
                to="/events"
                className="block py-2 text-gray-600 hover:text-orange-600"
              >
                Events
              </Link>
              <Link
                to="/about"
                className="block py-2 text-gray-600 hover:text-orange-600"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block py-2 text-gray-600 hover:text-orange-600"
              >
                Contact
              </Link>
              <hr className="my-2" />
              <Link
                to="/login"
                className="block py-2 text-gray-600 hover:text-orange-600"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block py-2 text-orange-600 font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <Badge className="bg-white/20 text-white border-white/30">
              ✨ Now Live in Coastal Karnataka
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Discover Coastal
              <br />
              <span className="text-yellow-300">Karnataka</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Your gateway to authentic experiences, local services, and
              unforgettable adventures along India's beautiful western coast
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mt-8">
              <Card className="p-2">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search for hotels, restaurants, activities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 border-0 focus:ring-0"
                    />
                  </div>

                  <div className="relative min-w-[200px]">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full h-12 pl-10 pr-8 rounded-md border-0 focus:ring-0 appearance-none bg-white text-gray-900"
                    >
                      <option value="">All Locations</option>
                      {demoLocations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>

                  <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 px-8"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </div>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold">150+</div>
                <div className="text-white/80 text-sm">Services</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">5K+</div>
                <div className="text-white/80 text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">25+</div>
                <div className="text-white/80 text-sm">Locations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.8★</div>
                <div className="text-white/80 text-sm">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Categories
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover local services and experiences across coastal Karnataka
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {demoCategories.map((category) => (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </h3>
                  <Badge variant="secondary" className={category.color}>
                    {category.count} services
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Services
              </h2>
              <p className="text-gray-600">Hand-picked experiences for you</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/services">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoServices.map((service) => (
              <Card
                key={service.id}
                className="overflow-hidden group hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                  {service.featured && (
                    <Badge className="absolute top-3 left-3 bg-orange-500">
                      Featured
                    </Badge>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {service.name}
                    </h3>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">
                        ₹{service.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">per night</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                      <span className="font-medium">{service.rating}</span>
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Coastal Journey?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of travelers discovering the magic of coastal
            Karnataka
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <PlayCircle className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Explore Services
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
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
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-500 transition-colors">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-500 transition-colors">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-500 transition-colors">
                  <span className="text-xs">i</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/hotels" className="hover:text-white">
                    Hotels & Homestays
                  </Link>
                </li>
                <li>
                  <Link to="/restaurants" className="hover:text-white">
                    Restaurants
                  </Link>
                </li>
                <li>
                  <Link to="/transport" className="hover:text-white">
                    Transport
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="hover:text-white">
                    Events
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/press" className="hover:text-white">
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/safety" className="hover:text-white">
                    Safety
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-800 my-8" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 CoastalConnect. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              Made with ❤️ for coastal Karnataka
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
