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
    console.log('LocalCreatorsGrid: Error occurred, showing fallback creators');

    // Provide fallback creators to prevent blank cards
    const fallbackCreators: Creator[] = [
      {
        id: 1,
        name: 'Priya Shenoy',
        title: 'Coastal Photographer',
        description: 'Capturing the beauty of coastal Karnataka through stunning photography. Specializing in landscapes and cultural documentation.',
        instagram_handle: '@priya_coastal',
        instagram_url: 'https://instagram.com/priya_coastal',
        profile_image: 'https://ui-avatars.com/api/?name=Priya+Shenoy&size=200&background=4F46E5&color=FFFFFF&bold=true&format=png',
        cover_image: '',
        followers_count: 5200,
        specialty: 'Photography',
        location: 'Udupi, Karnataka',
        featured_works: [],
        is_verified: true,
        is_active: true,
        media_count: 156
      },
      {
        id: 2,
        name: 'Arjun Kumar',
        title: 'Food Content Creator',
        description: 'Exploring authentic Udupi cuisine and coastal delicacies. Sharing traditional recipes and restaurant reviews.',
        instagram_handle: '@foodie_arjun',
        instagram_url: 'https://instagram.com/foodie_arjun',
        profile_image: 'https://ui-avatars.com/api/?name=Arjun+Kumar&size=200&background=EC4899&color=FFFFFF&bold=true&format=png',
        cover_image: '',
        followers_count: 3800,
        specialty: 'Food & Culinary',
        location: 'Manipal, Karnataka',
        featured_works: [],
        is_verified: false,
        is_active: true,
        media_count: 89
      },
      {
        id: 3,
        name: 'Deepa Kamath',
        title: 'Cultural Heritage Documenter',
        description: 'Preserving and sharing the rich cultural heritage of coastal Karnataka through visual storytelling.',
        instagram_handle: '@coastal_heritage',
        instagram_url: 'https://instagram.com/coastal_heritage',
        profile_image: 'https://ui-avatars.com/api/?name=Deepa+Kamath&size=200&background=F59E0B&color=FFFFFF&bold=true&format=png',
        cover_image: '',
        followers_count: 2100,
        specialty: 'Heritage & Tradition',
        location: 'Udupi, Karnataka',
        featured_works: [],
        is_verified: true,
        is_active: true,
        media_count: 203
      },
      {
        id: 4,
        name: 'Ravi D\'Souza',
        title: 'Travel & Lifestyle Vlogger',
        description: 'Showcasing hidden gems and travel experiences across coastal Karnataka for fellow explorers.',
        instagram_handle: '@ravi_travels',
        instagram_url: 'https://instagram.com/ravi_travels',
        profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
        cover_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=200&fit=crop',
        followers_count: 4600,
        specialty: 'Travel & Lifestyle',
        location: 'Malpe, Karnataka',
        featured_works: [],
        is_verified: false,
        is_active: true,
        media_count: 134
      }
    ];

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm">
            <Camera className="h-4 w-4 mr-2" />
            Showing sample creators (API unavailable)
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fallbackCreators.map((creator) => (
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
                      <Camera className="h-4 w-4 mr-1" />
                      <span>{creator.media_count} posts</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => window.open(creator.instagram_url, '_blank')}
                  >
                    <Instagram className="h-3 w-3 mr-1" />
                    Follow
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 text-xs btn-coastal"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
                  onError={(e) => {
                    console.log(`Failed to load image: ${creator.profile_image}`);
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1606721977440-2c2b62e4f647?w=300&h=300&fit=crop&crop=face';
                  }}
                  onLoad={() => console.log(`Successfully loaded image for ${creator.name}`)}
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
