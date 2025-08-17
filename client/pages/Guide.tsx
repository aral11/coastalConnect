import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Search,
  MapPin,
  Phone,
  ExternalLink,
  Download,
  Star,
  Clock,
  DollarSign,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  getGuideCategories,
  getGuideItems,
  GuideCategory,
  GuideItem,
  submitGuideFeedback,
} from "../lib/supabase";
import { useToast } from "../hooks/use-toast";

const Guide: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<GuideCategory[]>([]);
  const [guideItems, setGuideItems] = useState<GuideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "all",
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCity, setSelectedCity] = useState<"all" | "Udupi" | "Manipal">(
    "all",
  );
  const [selectedItem, setSelectedItem] = useState<GuideItem | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    message: "",
    want_all_in_one: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadGuideData();
  }, []);

  const loadGuideData = async () => {
    try {
      setLoading(true);
      const [categoriesData, itemsData] = await Promise.all([
        getGuideCategories(),
        getGuideItems(),
      ]);

      setCategories(categoriesData);
      setGuideItems(itemsData);
    } catch (error) {
      console.error("Error loading guide data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load guide data. Please refresh the page.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    let filtered = guideItems;

    // Filter by category
    if (selectedCategory !== "all") {
      const category = categories.find((c) => c.slug === selectedCategory);
      if (category) {
        filtered = filtered.filter((item) => item.category_id === category.id);
      }
    }

    // Filter by city
    if (selectedCity !== "all") {
      filtered = filtered.filter((item) => item.city === selectedCity);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.cuisine_or_type?.toLowerCase().includes(query) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    return filtered;
  }, [guideItems, selectedCategory, selectedCity, searchQuery, categories]);

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch("/.netlify/functions/generate-guide-pdf");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "CoastalConnect_Udupi_Manipal_Guide.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Download Started",
          description: "Your guide PDF is downloading...",
        });
      } else {
        throw new Error("PDF generation failed");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Unable to generate PDF. Please try again later.",
      });
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedbackData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please enter your name to submit feedback.",
      });
      return;
    }

    try {
      await submitGuideFeedback(feedbackData);

      toast({
        title: "Thanks! Your input helps shape CoastalConnect.",
        description: "We'll consider your feedback for future updates.",
      });

      setFeedbackData({
        name: "",
        email: "",
        message: "",
        want_all_in_one: false,
      });
      setShowFeedback(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Unable to submit feedback. Please try again.",
      });
    }
  };

  const openInGoogleMaps = (item: GuideItem) => {
    const mapsUrl =
      item.gmaps_url ||
      `https://www.google.com/maps/search/${encodeURIComponent(item.title + " " + item.address)}`;
    window.open(mapsUrl, "_blank");
  };

  const callPhone = (phone: string) => {
    window.open(`tel:${phone}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Udupi & Manipal Visitor Guide
              </h1>
              <p className="text-lg text-gray-600">
                Discover the best places to eat, stay, and explore in coastal
                Karnataka
              </p>
            </div>
            <Button
              onClick={handleDownloadPDF}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Guide PDF
            </Button>
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
                  variant={
                    selectedCategory === category.slug ? "default" : "outline"
                  }
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

            {/* City Filter */}
            <div className="flex gap-3">
              <Button
                variant={selectedCity === "all" ? "default" : "outline"}
                onClick={() => setSelectedCity("all")}
                className={`rounded-full px-4 py-2 ${
                  selectedCity === "all"
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "border-gray-300 hover:border-blue-500 hover:text-blue-600"
                }`}
              >
                All Cities
              </Button>
              <Button
                variant={selectedCity === "Udupi" ? "default" : "outline"}
                onClick={() => setSelectedCity("Udupi")}
                className={`rounded-full px-4 py-2 ${
                  selectedCity === "Udupi"
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "border-gray-300 hover:border-blue-500 hover:text-blue-600"
                }`}
              >
                Udupi
              </Button>
              <Button
                variant={selectedCity === "Manipal" ? "default" : "outline"}
                onClick={() => setSelectedCity("Manipal")}
                className={`rounded-full px-4 py-2 ${
                  selectedCity === "Manipal"
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "border-gray-300 hover:border-blue-500 hover:text-blue-600"
                }`}
              >
                Manipal
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-lg text-gray-700">
            Found{" "}
            <span className="font-semibold text-orange-600">
              {filteredItems.length}
            </span>{" "}
            places
            {selectedCategory !== "all" &&
              ` in ${categories.find((c) => c.slug === selectedCategory)?.name}`}
            {selectedCity !== "all" && ` in ${selectedCity}`}
          </p>
        </div>

        {/* Guide Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg overflow-hidden bg-white"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={
                    item.image_url ||
                    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400"
                  }
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {item.is_featured && (
                  <Badge className="absolute top-3 right-3 bg-orange-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {item.is_verified && (
                  <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                    Verified
                  </Badge>
                )}
              </div>

              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {item.city}
                    </Badge>
                  </div>

                  {item.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {item.cuisine_or_type && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {item.cuisine_or_type}
                      </div>
                    )}
                    {item.price_range && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {item.price_range}
                      </div>
                    )}
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No places found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Feedback Section */}
        <div className="bg-gradient-to-r from-orange-50 to-cyan-50 rounded-xl p-8 border border-orange-100">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              Help us improve!
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your feedback helps us shape the future of CoastalConnect. Tell us
              what you'd like to see!
            </p>
            <Button
              onClick={() => setShowFeedback(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-lg"
            >
              Share Your Feedback
            </Button>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <Dialog
          open={!!selectedItem}
          onOpenChange={() => setSelectedItem(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {selectedItem.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <img
                src={
                  selectedItem.image_url ||
                  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600"
                }
                alt={selectedItem.title}
                className="w-full h-64 object-cover rounded-lg"
              />

              <div className="space-y-4">
                {selectedItem.description && (
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {selectedItem.description}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedItem.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">
                        {selectedItem.address}
                      </span>
                    </div>
                  )}

                  {selectedItem.phone && (
                    <button
                      onClick={() => callPhone(selectedItem.phone!)}
                      className="flex items-center gap-3 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span>{selectedItem.phone}</span>
                    </button>
                  )}

                  {selectedItem.cuisine_or_type && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">
                        {selectedItem.cuisine_or_type}
                      </span>
                    </div>
                  )}

                  {selectedItem.price_range && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">
                        {selectedItem.price_range}
                      </span>
                    </div>
                  )}
                </div>

                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => openInGoogleMaps(selectedItem)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in Google Maps
                  </Button>

                  {selectedItem.website && (
                    <Button
                      onClick={() =>
                        window.open(selectedItem.website, "_blank")
                      }
                      variant="outline"
                      className="flex-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Feedback Modal */}
      {showFeedback && (
        <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Share Your Feedback
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <Input
                  type="text"
                  value={feedbackData.name}
                  onChange={(e) =>
                    setFeedbackData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (optional)
                </label>
                <Input
                  type="email"
                  value={feedbackData.email}
                  onChange={(e) =>
                    setFeedbackData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What else do you want?
                </label>
                <textarea
                  value={feedbackData.message}
                  onChange={(e) =>
                    setFeedbackData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Tell us what features you'd like to see..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="want_all_in_one"
                  checked={feedbackData.want_all_in_one}
                  onChange={(e) =>
                    setFeedbackData((prev) => ({
                      ...prev,
                      want_all_in_one: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor="want_all_in_one"
                  className="text-sm text-gray-700"
                >
                  Yes—bring everything into one platform (bookings, fests,
                  drivers, etc.)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFeedback(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Submit Feedback
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Guide;
