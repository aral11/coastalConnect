import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Download,
  MapPin,
  Star,
  Heart,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Shield,
  Calendar,
  Users,
  Camera,
  Navigation,
  Coffee,
  Utensils,
  Building,
  Car,
  TreePine,
  Music
} from "lucide-react";

const SimplePhase1Homepage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/guide?search=${encodeURIComponent(searchQuery.trim())}`;
    } else {
      window.location.href = '/guide';
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // For now, just alert - PDF function will work once properly configured
      alert("PDF download will be available once the database is set up. Visit /guide for now!");
    } catch (error) {
      console.error("PDF download error:", error);
    }
  };

  // Static categories for Phase 1
  const categories = [
    { name: "Restaurants", slug: "restaurants", icon: <Utensils className="w-6 h-6" />, color: "from-red-500 to-orange-500" },
    { name: "Stays", slug: "stays", icon: <Building className="w-6 h-6" />, color: "from-blue-500 to-cyan-500" },
    { name: "Places", slug: "places", icon: <TreePine className="w-6 h-6" />, color: "from-green-500 to-emerald-500" },
    { name: "Experiences", slug: "experiences", icon: <Camera className="w-6 h-6" />, color: "from-purple-500 to-pink-500" },
    { name: "Transport", slug: "transport", icon: <Car className="w-6 h-6" />, color: "from-yellow-500 to-amber-500" },
    { name: "Festivals", slug: "festivals", icon: <Music className="w-6 h-6" />, color: "from-indigo-500 to-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-orange-600">
              CoastalConnect
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/guide" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Guide
              </Link>
              <Link to="/feedback" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Feedback
              </Link>
              <Button 
                onClick={handleDownloadPDF}
                variant="outline" 
                size="sm"
                className="border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                <Download className="w-4 h-4 mr-2" />
                PDF Guide
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-12">
            {/* Badges */}
            <div className="flex justify-center items-center space-x-4">
              <Badge className="bg-orange-500 text-white border-0 px-6 py-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 mr-2" />
                Phase 1: Visitor Guide
              </Badge>
              <Badge className="bg-green-500 text-white border-0 px-6 py-2 text-sm font-semibold">
                <Shield className="h-4 w-4 mr-2" />
                Local Verified
              </Badge>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight">
                Udupi & Manipal
                <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  Visitor Guide
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Discover the best places to eat, stay, visit, and experience in 
                beautiful coastal Karnataka. Your complete guide to local gems.
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/guide">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Open Udupi–Manipal Guide
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Button 
                onClick={handleDownloadPDF}
                variant="outline" 
                size="lg"
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF Guide
              </Button>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="flex">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search restaurants, places, experiences..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 py-4 text-lg border-0 focus:ring-0 focus:outline-none bg-transparent"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 rounded-none rounded-r-2xl"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explore by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our comprehensive guide organized by what matters most to visitors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.slug} to={`/guide?category=${category.slug}`}>
              <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg overflow-hidden bg-white h-full">
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-br ${category.color} p-8 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        {category.icon}
                      </div>
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-white/90 text-sm">
                      Discover the best {category.name.toLowerCase()} in Udupi & Manipal
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">View all places</span>
                      <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Highlights */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Visit Udupi & Manipal?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of tradition, culture, and modern education hub
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-0 shadow-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Authentic Cuisine</h3>
              <p className="text-gray-600">Famous Udupi restaurants serving traditional South Indian delicacies</p>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TreePine className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Temple Heritage</h3>
              <p className="text-gray-600">Ancient temples and spiritual sites with rich cultural history</p>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Coastal Beauty</h3>
              <p className="text-gray-600">Pristine beaches, scenic views, and perfect sunset spots</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-gradient-to-r from-orange-50 to-cyan-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            What's Coming in Phase 2?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We're building something bigger! Your feedback will help us prioritize these features:
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Online Bookings</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Event Management</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <Car className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Driver Booking</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <Coffee className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Food Delivery</p>
            </div>
          </div>

          <Link to="/feedback">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg"
            >
              <Heart className="w-5 h-5 mr-2" />
              Share Your Feedback
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-orange-500">CoastalConnect</h3>
              <p className="text-gray-400 text-sm">
                Your trusted companion for exploring the beautiful coastal region of Udupi & Manipal.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link to="/guide" className="block text-gray-400 hover:text-white transition-colors">
                  Visitor Guide
                </Link>
                <Link to="/feedback" className="block text-gray-400 hover:text-white transition-colors">
                  Feedback
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>hello@coastalconnect.in</p>
                <p>+91 820 252 0187</p>
                <p>Udupi & Manipal, Karnataka</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 CoastalConnect. Made with ❤️ for coastal Karnataka.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SimplePhase1Homepage;
