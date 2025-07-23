import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Instagram, 
  ExternalLink, 
  MapPin, 
  Users, 
  Verified,
  Camera,
  Palette,
  UtensilsCrossed,
  Map,
  Building
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
  contact_phone?: string;
  website_url?: string;
  featured_works: string[];
  is_verified: boolean;
  is_active: boolean;
  media_count?: number;
}

const getSpecialtyIcon = (specialty: string) => {
  const lower = specialty.toLowerCase();
  if (lower.includes('photo') || lower.includes('video')) return <Camera className="h-4 w-4" />;
  if (lower.includes('art') || lower.includes('craft')) return <Palette className="h-4 w-4" />;
  if (lower.includes('food') || lower.includes('culinary')) return <UtensilsCrossed className="h-4 w-4" />;
  if (lower.includes('travel') || lower.includes('lifestyle')) return <Map className="h-4 w-4" />;
  if (lower.includes('heritage') || lower.includes('tradition')) return <Building className="h-4 w-4" />;
  return <Camera className="h-4 w-4" />;
};

export default function LocalCreatorsGrid() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setCreators(data.data.slice(0, 4)); // Show only top 4 creators on homepage
        console.log(`Loaded ${data.data.length} creators from ${data.source} source`);
        if (data.source === 'instagram') {
          console.log('✅ Real Instagram data loaded successfully!');
        }
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

  const formatFollowers = (count?: number) => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coastal-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading local creators...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchCreators} className="btn-coastal">
          Try Again
        </Button>
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <Camera className="h-16 w-16 mx-auto text-coastal-400 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-4">No Creators Found</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We're building our creators community. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {creators.map((creator) => (
        <Card key={creator.id} className="card-coastal overflow-hidden group hover:shadow-lg transition-all duration-300">
          {/* Cover Image */}
          {creator.cover_image && (
            <div className="relative h-24 overflow-hidden">
              <img 
                src={creator.cover_image} 
                alt={`${creator.name} cover`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
            </div>
          )}

          {/* Profile Section */}
          <CardHeader className="pb-3 relative">
            <div className="flex items-start space-x-3">
              <div className="relative">
                <img 
                  src={creator.profile_image} 
                  alt={creator.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                />
                {creator.is_verified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                    <Verified className="h-3 w-3 text-white fill-current" />
                  </div>
                )}
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

          <CardContent className="space-y-3">
            {/* Specialty Badge */}
            <div className="flex items-center">
              <Badge variant="secondary" className="text-xs">
                {getSpecialtyIcon(creator.specialty)}
                <span className="ml-1">{creator.specialty}</span>
              </Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-2">
              {creator.description}
            </p>

            {/* Instagram Stats */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              {creator.followers_count && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{formatFollowers(creator.followers_count)} followers</span>
                </div>
              )}
              {creator.media_count && (
                <div className="flex items-center">
                  <Camera className="h-3 w-3 mr-1" />
                  <span>{creator.media_count} posts</span>
                </div>
              )}
            </div>

            {/* Featured Works Preview */}
            {creator.featured_works && creator.featured_works.length > 0 && (
              <div className="grid grid-cols-3 gap-1 mt-3">
                {creator.featured_works.slice(0, 3).map((work, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded">
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
            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-pink-600 border-pink-200 hover:bg-pink-50"
                onClick={() => window.open(creator.instagram_url, '_blank')}
              >
                <Instagram className="h-3 w-3 mr-1" />
                @{creator.instagram_handle}
              </Button>

              {creator.website_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(creator.website_url, '_blank')}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
