import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  TrendingUp
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
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [instagramStats, setInstagramStats] = useState<{ [key: string]: InstagramStats }>({});
  const [dataSource, setDataSource] = useState<string>('');

  useEffect(() => {
    fetchCreators();
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
        setCreators(data.data);
        setDataSource(data.source);
        console.log(`Loaded ${data.data.length} creators from ${data.source} source`);
        
        // Fetch Instagram stats for each creator
        fetchInstagramStats(data.data);
      } else {
        setError(data.message || 'Failed to fetch creators');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Network error: ${errorMessage}`);
      console.error('Error fetching creators:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstagramStats = async (creators: Creator[]) => {
    const stats: { [key: string]: InstagramStats } = {};
    
    for (const creator of creators.slice(0, 3)) { // Fetch stats for first 3 creators
      try {
        const response = await fetch(`/api/creators/instagram/${creator.instagram_handle}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            stats[creator.instagram_handle] = data.data.stats;
          }
        }
      } catch (error) {
        console.log(`Could not fetch Instagram stats for ${creator.instagram_handle}`);
      }
    }
    
    setInstagramStats(stats);
  };

  const formatFollowers = (count?: number) => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getSpecialtyColor = (specialty: string) => {
    const lower = specialty.toLowerCase();
    if (lower.includes('photo') || lower.includes('video')) return 'bg-purple-100 text-purple-800';
    if (lower.includes('art') || lower.includes('craft')) return 'bg-pink-100 text-pink-800';
    if (lower.includes('food') || lower.includes('culinary')) return 'bg-orange-100 text-orange-800';
    if (lower.includes('travel') || lower.includes('lifestyle')) return 'bg-blue-100 text-blue-800';
    if (lower.includes('heritage') || lower.includes('tradition')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-coastal-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-coastal-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fa92c07345b2448db8df3322125c3b3e6%2Fd353be6a54374bebb7d9c1f516095097?format=webp&width=800"
                alt="coastalConnect"
                className="logo-brand h-10"
              />
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/hotels" className="text-gray-600 hover:text-coastal-600 transition-colors">Homestays</Link>
              <Link to="/drivers" className="text-gray-600 hover:text-coastal-600 transition-colors">Drivers</Link>
              <Link to="/eateries" className="text-gray-600 hover:text-coastal-600 transition-colors">Eateries</Link>
              <Link to="/creators" className="text-coastal-600 font-medium">Creators</Link>
              <Link to="/about" className="text-gray-600 hover:text-coastal-600 transition-colors">About</Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-coastal-600 hover:text-coastal-700">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="btn-coastal">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link to="/" className="mr-4">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="max-w-4xl">
            <div className="flex items-center mb-4">
              <Instagram className="h-8 w-8 mr-3" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {dataSource === 'instagram' ? 'Live Instagram Data' : 'Enhanced Creator Profiles'}
              </Badge>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Local Creators</h1>
            <p className="text-xl opacity-90 max-w-2xl">
              Meet the talented Instagram creators showcasing the beauty and culture of coastal Karnataka. 
              Follow them for authentic local content and inspiration.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Search creators by specialty or location..." 
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button variant="outline" className="h-12 px-6">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button 
              onClick={fetchCreators} 
              className="h-12 px-8 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </section>

      {/* Creators Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Creators</h2>
              <p className="text-gray-600">
                {creators.length} creators found
                {dataSource === 'instagram' && (
                  <span className="ml-2 text-green-600">• Live Instagram data</span>
                )}
              </p>
            </div>
            
            {creators.length > 0 && creators[0].instagram_handle === 'shutterboxfilms_official' && (
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                Featuring @shutterboxfilms_official
              </Badge>
            )}
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading Instagram creators...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchCreators} className="bg-gradient-to-r from-pink-500 to-purple-600">
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && creators.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Instagram className="h-16 w-16 mx-auto text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Creators Found</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're building our creators community. Check back soon!
              </p>
            </div>
          )}

          {!loading && !error && creators.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {creators.map((creator) => {
                const stats = instagramStats[creator.instagram_handle];
                return (
                  <Card key={creator.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                    {/* Cover Image */}
                    {creator.cover_image && (
                      <div className="relative h-32 overflow-hidden">
                        <img 
                          src={creator.cover_image} 
                          alt={`${creator.name} cover`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
                        
                        {/* Instagram verification badge */}
                        {creator.is_verified && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-blue-500 text-white">
                              <Verified className="h-3 w-3 mr-1 fill-current" />
                              Verified
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Profile Section */}
                    <CardHeader className="pb-3 relative">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <img 
                            src={creator.profile_image} 
                            alt={creator.name}
                            className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-pink-500 rounded-full p-1">
                            <Instagram className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-bold truncate">{creator.name}</CardTitle>
                          <CardDescription className="text-sm">{creator.title}</CardDescription>
                          
                          <div className="flex items-center mt-2 text-xs text-gray-600">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="truncate">{creator.location}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Instagram Stats */}
                      <div className="grid grid-cols-3 gap-2 bg-gradient-to-r from-pink-50 to-purple-50 p-3 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {formatFollowers(stats?.followers || creator.followers_count)}
                          </div>
                          <div className="text-xs text-gray-600">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {stats?.posts || creator.media_count || 0}
                          </div>
                          <div className="text-xs text-gray-600">Posts</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {stats?.engagement ? `${stats.engagement}%` : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-600">Engagement</div>
                        </div>
                      </div>

                      {/* Specialty Badge */}
                      <div className="flex items-center justify-center">
                        <Badge className={getSpecialtyColor(creator.specialty)}>
                          {creator.specialty}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {creator.description.replace(/\\n/g, ' ')}
                      </p>

                      {/* Featured Works Preview */}
                      {creator.featured_works && creator.featured_works.length > 0 && (
                        <div className="grid grid-cols-3 gap-1">
                          {creator.featured_works.slice(0, 3).map((work, index) => (
                            <div key={index} className="aspect-square overflow-hidden rounded-lg">
                              <img 
                                src={work} 
                                alt={`Work ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                          size="sm"
                          onClick={() => window.open(creator.instagram_url, '_blank')}
                        >
                          <Instagram className="h-3 w-3 mr-1" />
                          Follow
                        </Button>
                        
                        {creator.website_url ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(creator.website_url, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Website
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCreator(creator)}
                          >
                            View More
                          </Button>
                        )}
                      </div>

                      {/* Instagram Handle */}
                      <div className="text-center text-xs text-gray-500 bg-gray-50 py-2 rounded">
                        @{creator.instagram_handle}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
