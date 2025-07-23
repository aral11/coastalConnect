import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import LocalCreatorsGrid from '@/components/LocalCreatorsGrid';
import ComprehensiveServices from '@/components/ComprehensiveServices';
import CommunityFeatures from '@/components/CommunityFeatures';
import PlatformStats from '@/components/PlatformStats';
import { designSystem, layouts } from '@/lib/design-system';
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
  Waves,
  Anchor,
  UtensilsCrossed,
  Store,
  Palette,
  Sparkles,
  Music,
  ShoppingBag,
  Camera,
  PartyPopper,
  Wrench,
  Bike,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Award,
  Heart,
  PlayCircle
} from 'lucide-react';

export default function Index() {
  return (
    <Layout fullWidth>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-40 right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-400/15 rounded-full blur-lg"></div>
          </div>
        </div>

        <div className={`${layouts.container} relative z-10`}>
          <div className="py-20 lg:py-32 text-center">
            {/* Status Badge */}
            <div className="flex items-center justify-center mb-8">
              <Badge className="bg-green-500/20 text-green-300 border-green-400/30 text-sm font-medium px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Live in Udupi & Manipal • Mangalore Coming Soon
              </Badge>
            </div>

            {/* Main Heading */}
            <div className="max-w-5xl mx-auto mb-8">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="block bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Your Coastal Karnataka
                </span>
                <span className="block bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Experience Starts Here
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
                Discover authentic local experiences with our comprehensive platform connecting you to 
                verified homestays, eateries, drivers, and creators across coastal Karnataka.
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-blue-200 text-sm">Verified Vendors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">10k+</div>
                <div className="text-blue-200 text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-blue-200 text-sm">Local Creators</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">4.8★</div>
                <div className="text-blue-200 text-sm">Average Rating</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="/eateries">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 text-lg">
                  <UtensilsCrossed className="mr-2 h-5 w-5" />
                  Explore Eateries
                </Button>
              </Link>
              <Link to="/hotels">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 text-lg">
                  <Home className="mr-2 h-5 w-5" />
                  Book Homestays
                </Button>
              </Link>
            </div>

            {/* Quick Access */}
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/drivers" className="flex items-center bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-sm">
                <Car className="h-4 w-4 mr-2" />
                Drivers
              </Link>
              <Link to="/creators" className="flex items-center bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-sm">
                <Camera className="h-4 w-4 mr-2" />
                Creators
              </Link>
              <Link to="/vendor-register" className="flex items-center bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-sm">
                <Store className="h-4 w-4 mr-2" />
                For Vendors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className={`${layouts.section} bg-white`}>
        <div className={layouts.container}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your one-stop platform for all coastal Karnataka experiences
            </p>
          </div>

          {/* Main Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Homestays */}
            <Card className={`${designSystem.components.card.default} group cursor-pointer hover:shadow-xl transition-all duration-300`}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Home className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold">Authentic Homestays</CardTitle>
                <CardDescription>Experience local hospitality with verified hosts</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Verified Properties</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Local Experiences</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>24/7 Support</span>
                  </div>
                </div>
                <Link to="/hotels">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Book Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Eateries */}
            <Card className={`${designSystem.components.card.default} group cursor-pointer hover:shadow-xl transition-all duration-300`}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <UtensilsCrossed className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl font-bold">Local Eateries</CardTitle>
                <CardDescription>Savor authentic coastal Karnataka cuisine</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Authentic Cuisine</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Verified Reviews</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Online Booking</span>
                  </div>
                </div>
                <Link to="/eateries">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Drivers */}
            <Card className={`${designSystem.components.card.default} group cursor-pointer hover:shadow-xl transition-all duration-300`}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <Car className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-bold">Trusted Drivers</CardTitle>
                <CardDescription>Safe and reliable transportation services</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Verified Drivers</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>GPS Tracking</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Transparent Pricing</span>
                  </div>
                </div>
                <Link to="/drivers">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Book Ride <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Creators */}
            <Card className={`${designSystem.components.card.default} group cursor-pointer hover:shadow-xl transition-all duration-300`}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Camera className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-bold">Local Creators</CardTitle>
                <CardDescription>Connect with talented local artists</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Verified Profiles</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Portfolio Showcase</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Direct Contact</span>
                  </div>
                </div>
                <Link to="/creators">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Discover <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comprehensive Services */}
      <ComprehensiveServices />

      {/* Local Creators Section */}
      <section className={`${layouts.section} bg-white`}>
        <div className={layouts.container}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Local Creators</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover and connect with talented content creators showcasing the beauty of coastal Karnataka
            </p>
          </div>
          <LocalCreatorsGrid />
          <div className="text-center mt-12">
            <Link to="/creators">
              <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                View All Creators <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Features */}
      <CommunityFeatures />

      {/* For Business Section */}
      <section className={`${layouts.section} bg-gradient-to-r from-blue-600 to-purple-600`}>
        <div className={layouts.container}>
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Join Our Growing Network</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
              Are you a local business owner? Join thousands of verified vendors and grow your business with coastalConnect
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Increase Visibility</h3>
                <p className="text-blue-100">Reach thousands of potential customers actively looking for your services</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Verified Business</h3>
                <p className="text-blue-100">Build trust with our verification badge and quality assurance program</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Support</h3>
                <p className="text-blue-100">Get dedicated support and marketing tools to grow your business</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/vendor-register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8">
                  <Store className="mr-2 h-5 w-5" />
                  Register as Vendor
                </Button>
              </Link>
              <Link to="/organizer-register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8">
                  <PartyPopper className="mr-2 h-5 w-5" />
                  Event Organizer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className={`${layouts.section} bg-gray-50`}>
        <div className={layouts.container}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose coastalConnect?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your safety and satisfaction are our top priorities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Services</h3>
              <p className="text-gray-600">All vendors undergo strict verification for your safety</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support for peace of mind</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentic Reviews</h3>
              <p className="text-gray-600">Real reviews from verified customers</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Community</h3>
              <p className="text-gray-600">Supporting and empowering local businesses</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
