import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import SearchSection from '@/components/SearchSection';
import { designSystem, layouts, statusColors } from '@/lib/design-system';
import { 
  Search,
  MapPin, 
  Star, 
  ArrowLeft,
  Filter,
  RefreshCw,
  Instagram,
  ExternalLink,
  Users,
  Camera,
  Heart,
  MessageCircle,
  Verified,
  TrendingUp,
  Globe,
  Mail,
  Eye,
  Share2,
  Bookmark,
  Play,
  Image,
  Award,
  Calendar,
  CheckCircle,
  Zap,
  Sparkles
} from 'lucide-react';

interface Creator {
  id: number;
  name: string;
  title: string;
  description: string;
  instagram_handle: string;
  instagram_url: string;
  profile_image: string;
  cover_image?: string;
  followers_count?: number;
  specialty: string;
  location: string;
  contact_email?: string;
  website_url?: string;
  featured_works: string[];
  is_verified: boolean;
  is_active: boolean;
  media_count?: number;
  engagement_rate?: number;
  recent_posts?: number;
  collaboration_rate?: number;
  languages?: string[];
  categories?: string[];
}

interface InstagramStats {
  followers: number;
  posts: number;
  engagement: number;
}

export default function Creators() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Creators', count: 0 },
    { id: 'photography', name: 'Photography', count: 15 },
    { id: 'food', name: 'Food & Dining', count: 23 },
    { id: 'travel', name: 'Travel & Adventure', count: 18 },
    { id: 'lifestyle', name: 'Lifestyle', count: 12 },
    { id: 'culture', name: 'Culture & Heritage', count: 8 },
    { id: 'fashion', name: 'Fashion', count: 10 }
  ];

  useEffect(() => {
    fetchCreators();
    loadFavorites();
  }, []);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/creators');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        // Enhance creators with additional mock data
        const enhancedCreators = data.data.map((creator: Creator, index: number) => {
          // Fallback profile images if not provided
          const fallbackProfiles = [
            'https://images.unsplash.com/photo-1606721977440-2c2b62e4f647?w=300&h=300&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1559829175-0d0535334ecb?w=300&h=300&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face'
          ];

          // Fallback cover images
          const fallbackCovers = [
            'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=400&fit=crop',
            'https://images.unsplash.com/photo-1588678401-c846c6021369?w=800&h=400&fit=crop'
          ];

          return {
            ...creator,
            profile_image: creator.profile_image || fallbackProfiles[index % fallbackProfiles.length],
            cover_image: creator.cover_image || fallbackCovers[index % fallbackCovers.length],
            followers_count: creator.followers_count || Math.floor(Math.random() * 50000) + 5000,
            media_count: creator.media_count || Math.floor(Math.random() * 500) + 50,
            engagement_rate: Math.floor(Math.random() * 8) + 3, // 3-10%
            recent_posts: Math.floor(Math.random() * 15) + 5,
            collaboration_rate: Math.floor(Math.random() * 5000) + 2000,
            languages: ['English', 'Kannada', 'Hindi'].slice(0, Math.floor(Math.random() * 3) + 1),
            categories: ['Photography', 'Travel', 'Food'].slice(0, Math.floor(Math.random() * 2) + 1)
          };
        });
        
        setCreators(enhancedCreators);
        
        // Update category counts
        categories.forEach(cat => {
          if (cat.id === 'all') {
            cat.count = enhancedCreators.length;
          } else {
            cat.count = enhancedCreators.filter(creator => 
              creator.specialty?.toLowerCase().includes(cat.id) ||
              creator.categories?.some(c => c.toLowerCase().includes(cat.id))
            ).length;
          }
        });
      } else {
        throw new Error('Failed to fetch creators');
      }
    } catch (error) {
      console.error('Error fetching creators:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('creator_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const toggleFavorite = (creatorId: number) => {
    const newFavorites = favorites.includes(creatorId)
      ? favorites.filter(id => id !== creatorId)
      : [...favorites, creatorId];
    
    setFavorites(newFavorites);
    localStorage.setItem('creator_favorites', JSON.stringify(newFavorites));
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const shareCreator = (creator: Creator) => {
    if (navigator.share) {
      navigator.share({
        title: `${creator.name} - Creator`,
        text: `Check out ${creator.name} on coastalConnect!`,
        url: window.location.href + `/${creator.id}`
      });
    } else {
      navigator.clipboard.writeText(window.location.href + `/${creator.id}`);
      alert('Link copied to clipboard!');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getSpecialtyColor = (specialty: string) => {
    const colors = {
      'Photography': 'bg-purple-100 text-purple-800',
      'Food': 'bg-orange-100 text-orange-800',
      'Travel': 'bg-blue-100 text-blue-800',
      'Lifestyle': 'bg-pink-100 text-pink-800',
      'Culture': 'bg-green-100 text-green-800',
      'Fashion': 'bg-red-100 text-red-800'
    };
    return colors[specialty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getEngagementLevel = (rate: number) => {
    if (rate >= 8) return { label: 'Excellent', color: 'text-green-600' };
    if (rate >= 6) return { label: 'Very Good', color: 'text-blue-600' };
    if (rate >= 4) return { label: 'Good', color: 'text-yellow-600' };
    return { label: 'Average', color: 'text-gray-600' };
  };

  const filteredCreators = selectedCategory === 'all' 
    ? creators 
    : creators.filter(creator => 
        creator.specialty?.toLowerCase().includes(selectedCategory) ||
        creator.categories?.some(c => c.toLowerCase().includes(selectedCategory))
      );

  if (error) {
    return (
      <Layout>
        <PageHeader
          title="Creators"
          description="Discover talented local content creators"
          icon={<Camera className="h-8 w-8" />}
        />
        <div className={layouts.container}>
          <div className="py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-4">
                <p className="font-medium">Failed to load creators</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
              <Button onClick={fetchCreators} className="w-full">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout fullWidth>
      <PageHeader
        title="Local Creators"
        description="Discover talented content creators showcasing the beauty and culture of coastal Karnataka through their unique perspectives"
        icon={<Camera className="h-8 w-8" />}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Creators' }
        ]}
      >
        <div className="flex justify-center items-center mt-6 space-x-6 text-sm text-blue-100">
          <span className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {creators.length}+ Creators
          </span>
          <span className="flex items-center">
            <Verified className="h-4 w-4 mr-1" />
            Verified Profiles
          </span>
          <span className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            Growing Community
          </span>
        </div>
      </PageHeader>

      <SearchSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        placeholder="Search creators by name, specialty, or location..."
        showFilters={true}
        onFiltersClick={() => setShowFilters(!showFilters)}
        filtersActive={showFilters}
      >
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="text-sm"
            >
              {category.name}
              <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </SearchSection>

      <main className="bg-white">
        <div className={layouts.container}>
          <div className="py-8">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Content Creators</h2>
                <p className="text-gray-600 mt-1">
                  {loading ? 'Loading...' : `${filteredCreators.length} creators found`}
                </p>
              </div>
              
              {!loading && filteredCreators.length > 0 && (
                <div className="hidden lg:flex items-center gap-4">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                    <option>Most Popular</option>
                    <option>Highest Engagement</option>
                    <option>Most Recent</option>
                    <option>Followers Count</option>
                    <option>Local Favorites</option>
                  </select>
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-32 w-full" />
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-32 mb-2" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-9 w-full" />
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Creators Grid */}
            {!loading && filteredCreators.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCreators.map((creator) => (
                  <Card key={creator.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                    {/* Cover Image */}
                    <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
                      {creator.cover_image && (
                        <img
                          src={creator.cover_image}
                          alt={`${creator.name} cover`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log(`❌ Failed to load cover image for ${creator.name}: ${creator.cover_image}`);
                            const fallbackCovers = [
                              'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=400&fit=crop',
                              'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=400&fit=crop',
                              'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop',
                              'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=400&fit=crop',
                              'https://images.unsplash.com/photo-1588678401-c846c6021369?w=800&h=400&fit=crop'
                            ];
                            const randomCover = fallbackCovers[creator.id % fallbackCovers.length];
                            e.currentTarget.src = randomCover;
                          }}
                          onLoad={() => console.log(`✅ Successfully loaded cover image for ${creator.name}`)}
                        />
                      )}
                      
                      {/* Overlay Actions */}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                          onClick={() => toggleFavorite(creator.id)}
                        >
                          <Heart className={`h-4 w-4 ${favorites.includes(creator.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                          onClick={() => shareCreator(creator)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Verification Badge */}
                      {creator.is_verified && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-blue-600 text-white border-0">
                            <Verified className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-5">
                      {/* Profile Section */}
                      <div className="flex items-start space-x-3 -mt-8 mb-4 relative z-10">
                        <img
                          src={creator.profile_image}
                          alt={creator.name}
                          className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
                          onError={(e) => {
                            console.log(`❌ Failed to load profile image for ${creator.name}: ${creator.profile_image}`);
                            const fallbackImages = [
                              'https://images.unsplash.com/photo-1606721977440-2c2b62e4f647?w=300&h=300&fit=crop&crop=face',
                              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face',
                              'https://images.unsplash.com/photo-1559829175-0d0535334ecb?w=300&h=300&fit=crop&crop=face',
                              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face'
                            ];
                            const randomFallback = fallbackImages[creator.id % fallbackImages.length];
                            e.currentTarget.src = randomFallback;
                          }}
                          onLoad={() => console.log(`✅ Successfully loaded profile image for ${creator.name}`)}
                        />
                        
                        <div className="flex-1 pt-2">
                          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                            {creator.name}
                          </h3>
                          <p className="text-sm text-gray-600">{creator.title}</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getSpecialtyColor(creator.specialty)}>
                              {creator.specialty}
                            </Badge>
                            {creator.categories?.slice(0, 1).map(category => (
                              <Badge key={category} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {creator.description}
                      </p>

                      {/* Location */}
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                        <MapPin className="h-4 w-4" />
                        {creator.location}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 py-3 border-y border-gray-100 mb-4">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">
                            {formatNumber(creator.followers_count || 0)}
                          </div>
                          <div className="text-xs text-gray-500">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">
                            {creator.media_count || 0}
                          </div>
                          <div className="text-xs text-gray-500">Posts</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">
                            {creator.engagement_rate || 0}%
                          </div>
                          <div className="text-xs text-gray-500">Engagement</div>
                        </div>
                      </div>

                      {/* Engagement Level */}
                      {creator.engagement_rate && (
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-gray-600">Engagement Level:</span>
                          <span className={`text-sm font-medium ${getEngagementLevel(creator.engagement_rate).color}`}>
                            {getEngagementLevel(creator.engagement_rate).label}
                          </span>
                        </div>
                      )}

                      {/* Languages */}
                      {creator.languages && creator.languages.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {creator.languages.map(lang => (
                            <Badge key={lang} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          asChild 
                          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        >
                          <a 
                            href={creator.instagram_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                          >
                            <Instagram className="h-4 w-4" />
                            Follow
                          </a>
                        </Button>
                        
                        {creator.contact_email && (
                          <Button variant="outline" size="sm" className="px-3">
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {creator.website_url && (
                          <Button variant="outline" size="sm" className="px-3">
                            <Globe className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredCreators.length === 0 && (
              <div className="text-center py-16">
                <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No creators found</h3>
                <p className="text-gray-600 mb-6">
                  {selectedCategory === 'all' 
                    ? "Try adjusting your search criteria or check back later."
                    : "No creators found in this category. Try selecting a different category."
                  }
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={fetchCreators}>
                    Refresh Results
                  </Button>
                  {selectedCategory !== 'all' && (
                    <Button variant="outline" onClick={() => setSelectedCategory('all')}>
                      View All Creators
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
