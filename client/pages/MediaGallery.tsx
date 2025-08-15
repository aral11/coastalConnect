/**
 * Media Gallery Page
 * Browse and upload Haldi, Roce, Wedding, and other ceremony photos
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Layout from "@/components/Layout";
import MediaUploadGallery from "@/components/MediaUploadGallery";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase, trackEvent } from "@/lib/supabase";
import {
  Camera,
  Upload,
  Search,
  Filter,
  Calendar,
  MapPin,
  User,
  Heart,
  Eye,
  Download,
  Share2,
  Sparkles,
  Crown,
  Plus,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
} from "lucide-react";

interface MediaGallery {
  id: string;
  user_id: string;
  category: string;
  event_name: string;
  event_date?: string;
  location?: string;
  photographer?: string;
  description?: string;
  total_files: number;
  uploaded_files: number;
  status: string;
  created_at: string;
  users?: { name: string; avatar_url?: string };
}

interface MediaFile {
  id: string;
  gallery_id: string;
  title: string;
  description?: string;
  public_url: string;
  file_type: string;
  created_at: string;
}

const CATEGORIES = [
  { id: "all", name: "All Categories", icon: Grid3X3, color: "bg-gray-500" },
  { id: "haldi", name: "Haldi Ceremony", icon: Sparkles, color: "bg-yellow-500" },
  { id: "roce", name: "Roce Ceremony", icon: Heart, color: "bg-pink-500" },
  { id: "wedding", name: "Wedding", icon: Crown, color: "bg-purple-500" },
  { id: "engagement", name: "Engagement", icon: Heart, color: "bg-blue-500" },
  { id: "reception", name: "Reception", icon: Crown, color: "bg-green-500" },
];

export default function MediaGallery() {
  const { user, isAuthenticated } = useAuth();
  
  const [galleries, setGalleries] = useState<MediaGallery[]>([]);
  const [featuredPhotos, setFeaturedPhotos] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<MediaGallery | null>(null);

  useEffect(() => {
    loadGalleries();
    loadFeaturedPhotos();
  }, [selectedCategory, sortBy]);

  const loadGalleries = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('media_galleries')
        .select(`
          *,
          users(name, avatar_url)
        `)
        .eq('status', 'completed');

      // Filter by category
      if (selectedCategory !== "all") {
        query = query.eq('category', selectedCategory);
      }

      // Search filter
      if (searchQuery.trim()) {
        query = query.or(`event_name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,photographer.ilike.%${searchQuery}%`);
      }

      // Sorting
      switch (sortBy) {
        case "newest":
          query = query.order('created_at', { ascending: false });
          break;
        case "oldest":
          query = query.order('created_at', { ascending: true });
          break;
        case "name":
          query = query.order('event_name', { ascending: true });
          break;
        case "photos":
          query = query.order('uploaded_files', { ascending: false });
          break;
      }

      const { data, error } = await query.limit(50);

      if (error) {
        console.error('Error loading galleries:', error);
        setGalleries([]);
      } else {
        setGalleries(data || []);
      }
    } catch (error) {
      console.error('Error loading galleries:', error);
      setGalleries([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .eq('upload_status', 'completed')
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) {
        console.error('Error loading featured photos:', error);
      } else {
        setFeaturedPhotos(data || []);
      }
    } catch (error) {
      console.error('Error loading featured photos:', error);
    }
  };

  const handleSearch = () => {
    loadGalleries();
  };

  const handleUploadComplete = () => {
    setIsUploadModalOpen(false);
    loadGalleries();
    loadFeaturedPhotos();
  };

  const getCategoryConfig = (categoryId: string) => {
    return CATEGORIES.find(cat => cat.id === categoryId) || CATEGORIES[0];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Media Gallery
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Celebrate life's precious moments - Haldi, Roce, Weddings, and more
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-gray-100"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Photos
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-gray-100"
                  onClick={() => window.location.href = '/login'}
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Login to Upload
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-600"
                onClick={() => document.getElementById('galleries')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Eye className="h-5 w-5 mr-2" />
                Browse Galleries
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Photos Section */}
        {featuredPhotos.length > 0 && (
          <div className="py-16">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Featured Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {featuredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="aspect-square rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={photo.public_url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div id="galleries" className="py-8 border-t bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className={selectedCategory === category.id ? `${category.color} text-white` : ''}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>

              {/* Search and Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search events, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-64"
                  />
                  <Button onClick={handleSearch} size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name">By Name</SelectItem>
                    <SelectItem value="photos">Most Photos</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant={viewMode === "grid" ? "default" : "outline"}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant={viewMode === "list" ? "default" : "outline"}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Galleries Grid */}
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : galleries.length === 0 ? (
              <div className="text-center py-16">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No galleries found
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedCategory === "all" 
                    ? "Be the first to upload photos to the gallery!"
                    : `No ${getCategoryConfig(selectedCategory).name.toLowerCase()} galleries found.`
                  }
                </p>
                {isAuthenticated && (
                  <Button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload First Gallery
                  </Button>
                )}
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {galleries.map((gallery) => {
                  const categoryConfig = getCategoryConfig(gallery.category);
                  const Icon = categoryConfig.icon;

                  return (
                    <Card key={gallery.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${categoryConfig.color} text-white`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-lg group-hover:text-orange-600 transition-colors">
                                {gallery.event_name}
                              </CardTitle>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Badge variant="outline" className="mr-2">
                                  {categoryConfig.name}
                                </Badge>
                                <span>{gallery.uploaded_files} photos</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-sm text-gray-600">
                          {gallery.event_date && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {formatDate(gallery.event_date)}
                            </div>
                          )}
                          {gallery.location && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {gallery.location}
                            </div>
                          )}
                          {gallery.photographer && (
                            <div className="flex items-center">
                              <Camera className="h-4 w-4 mr-2" />
                              {gallery.photographer}
                            </div>
                          )}
                          {gallery.users?.name && (
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              Uploaded by {gallery.users.name}
                            </div>
                          )}
                        </div>
                        
                        {gallery.description && (
                          <p className="text-sm text-gray-700 mt-3 line-clamp-2">
                            {gallery.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xs text-gray-500">
                            {formatDate(gallery.created_at)}
                          </span>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        <MediaUploadGallery
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          initialCategory={selectedCategory !== "all" ? selectedCategory : "wedding"}
          onUploadComplete={handleUploadComplete}
        />
      </div>
    </Layout>
  );
}
