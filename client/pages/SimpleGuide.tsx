import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  MapPin, 
  Star, 
  Download,
  ArrowLeft,
  Phone,
  ExternalLink,
  Clock,
  DollarSign
} from "lucide-react";

const SimpleGuide: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Static sample data for Phase 1 demonstration
  const categories = [
    { id: "1", name: "Restaurants", slug: "restaurants" },
    { id: "2", name: "Stays", slug: "stays" },
    { id: "3", name: "Places", slug: "places" },
    { id: "4", name: "Experiences", slug: "experiences" },
    { id: "5", name: "Transport", slug: "transport" },
    { id: "6", name: "Festivals", slug: "festivals" }
  ];

  const samplePlaces = [
    {
      id: "1",
      title: "Woodlands Restaurant",
      description: "Famous South Indian vegetarian restaurant serving authentic Udupi cuisine with traditional flavors.",
      address: "Car Street, Udupi",
      city: "Udupi",
      phone: "+91 820 252 0187",
      price_range: "₹200-500",
      cuisine_or_type: "South Indian Vegetarian",
      category: "restaurants",
      image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
      is_featured: true,
      is_verified: true
    },
    {
      id: "2",
      title: "Krishna Temple",
      description: "Historic temple dedicated to Lord Krishna, famous for its architecture and spiritual significance.",
      address: "Car Street, Udupi",
      city: "Udupi",
      phone: "+91 820 252 0020",
      price_range: "Free",
      cuisine_or_type: "Religious Temple",
      category: "places",
      image_url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400",
      is_featured: true,
      is_verified: true
    },
    {
      id: "3",
      title: "Malpe Beach",
      description: "Beautiful beach with golden sand, water sports, and stunning sunset views.",
      address: "Malpe, Udupi",
      city: "Udupi",
      phone: "+91 820 252 1234",
      price_range: "Free",
      cuisine_or_type: "Beach",
      category: "places",
      image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
      is_featured: true,
      is_verified: true
    },
    {
      id: "4",
      title: "The Ocean Pearl",
      description: "Luxury hotel with modern amenities and excellent service in the heart of Manipal.",
      address: "Manipal-576104",
      city: "Manipal",
      phone: "+91 820 292 0000",
      price_range: "₹4000-8000",
      cuisine_or_type: "Luxury Hotel",
      category: "stays",
      image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
      is_featured: false,
      is_verified: true
    }
  ];

  const filteredPlaces = samplePlaces.filter(place => {
    const matchesCategory = selectedCategory === "all" || place.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.cuisine_or_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleDownloadPDF = () => {
    alert("PDF download will be available once the backend is fully configured!");
  };

  const openInGoogleMaps = (place: any) => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(place.title + " " + place.address)}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </div>
            <Button 
              onClick={handleDownloadPDF}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
          
          <div className="mt-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Udupi & Manipal Visitor Guide
            </h1>
            <p className="text-lg text-gray-600">
              Discover the best places to eat, stay, and explore in coastal Karnataka
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search restaurants, places, experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className={`rounded-full px-6 py-2 font-medium transition-all duration-200 ${
                  selectedCategory === "all"
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "border-gray-300 hover:border-orange-500 hover:text-orange-600"
                }`}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`rounded-full px-6 py-2 font-medium transition-all duration-200 ${
                    selectedCategory === category.slug
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "border-gray-300 hover:border-orange-500 hover:text-orange-600"
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-lg text-gray-700">
            Found <span className="font-semibold text-orange-600">{filteredPlaces.length}</span> places
            {selectedCategory !== "all" && ` in ${categories.find(c => c.slug === selectedCategory)?.name}`}
          </p>
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPlaces.map((place) => (
            <Card
              key={place.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg overflow-hidden bg-white"
            >
              <div className="relative overflow-hidden">
                <img
                  src={place.image_url}
                  alt={place.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {place.is_featured && (
                  <Badge className="absolute top-3 right-3 bg-orange-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {place.is_verified && (
                  <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                    Verified
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {place.title}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {place.city}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {place.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {place.cuisine_or_type}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {place.price_range}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => openInGoogleMaps(place)}
                      size="sm"
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Maps
                    </Button>
                    
                    {place.phone && (
                      <Button
                        onClick={() => window.open(`tel:${place.phone}`, '_blank')}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No places found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-gradient-to-r from-orange-50 to-cyan-50 rounded-xl p-8 border border-orange-100">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Phase 1 Demo</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              This is a Phase 1 demonstration with sample data. The complete guide with real places 
              and live data will be available once the Supabase database is fully configured.
            </p>
            <Link to="/feedback">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-lg">
                Share Your Feedback
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleGuide;
