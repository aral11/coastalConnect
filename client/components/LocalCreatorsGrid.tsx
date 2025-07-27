import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, ExternalLink, Users, Star, MapPin, Camera, Palette, Coffee, Mountain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { designSystem } from '@/lib/design-system';

interface Creator {
  id: string;
  name: string;
  title: string;
  description: string;
  instagram_handle: string;
  profile_image: string;
  followers_count: number;
  specialty: string;
  location: string;
  is_verified: boolean;
}

interface LocalCreatorsGridProps {
  maxItems?: number;
  className?: string;
}

const LocalCreatorsGrid: React.FC<LocalCreatorsGridProps> = ({ 
  maxItems = 4, 
  className = '' 
}) => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCreators();
  }, [maxItems]);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`/api/creators?limit=${maxItems}`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setCreators(data.data || []);
          console.log('✅ Creators loaded successfully');
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error(`Creators API returned ${response.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Creators API unavailable:', errorMessage);
      setCreators([]);
      setError('Unable to load creators. Please check back later.');
    } finally {
      setLoading(false);
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getSpecialtyIcon = (specialty: string) => {
    const lowerSpecialty = specialty.toLowerCase();
    if (lowerSpecialty.includes('photo')) return <Camera className="h-4 w-4" />;
    if (lowerSpecialty.includes('art')) return <Palette className="h-4 w-4" />;
    if (lowerSpecialty.includes('food')) return <Coffee className="h-4 w-4" />;
    if (lowerSpecialty.includes('travel')) return <Mountain className="h-4 w-4" />;
    return <Star className="h-4 w-4" />;
  };

  const generateInitialsAvatar = (name: string, id: string) => {
    const initials = name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
    const colors = ['4F46E5', 'EC4899', 'F59E0B', '0EA5E9', '10B981', '8B5CF6'];
    const colorIndex = parseInt(id, 36) % colors.length;
    const bgColor = colors[colorIndex];
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgColor}&color=fff&size=150&font-size=0.6`;
  };

  if (loading) {
    return (
      <section className={`py-12 lg:py-16 bg-white ${className}`}>
        <div className={designSystem.layouts.container.standard}>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Local Creators
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with talented creators showcasing coastal Karnataka
            </p>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(maxItems)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 lg:py-16 bg-white ${className}`}>
      <div className={designSystem.layouts.container.standard}>
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Local Creators
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with talented creators showcasing coastal Karnataka
          </p>
        </div>

        {/* Creators Content */}
        {error ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Creators Available</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchCreators} variant="outline">
              Try Again
            </Button>
          </div>
        ) : creators.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Creators Listed</h3>
            <p className="text-gray-500 mb-4">Creators will appear here once they join the platform</p>
            <Link to="/creators">
              <Button variant="outline">Browse All Creators</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {creators.map((creator) => (
                <Card key={creator.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Profile Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-400 to-red-500">
                      <img
                        src={creator.profile_image}
                        alt={creator.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src = generateInitialsAvatar(creator.name, creator.id);
                        }}
                      />
                      
                      {/* Verified Badge */}
                      {creator.is_verified && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-blue-500 text-white p-1 rounded-full">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}

                      {/* Followers Count */}
                      <div className="absolute bottom-3 left-3">
                        <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {formatFollowers(creator.followers_count)}
                        </div>
                      </div>
                    </div>

                    {/* Creator Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-orange-600 transition-colors line-clamp-1">
                            {creator.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{creator.title}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {creator.description}
                      </p>

                      {/* Specialty & Location */}
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                          {getSpecialtyIcon(creator.specialty)}
                          {creator.specialty}
                        </Badge>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <MapPin className="h-3 w-3 mr-1" />
                        {creator.location}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <a
                          href={`https://instagram.com/${creator.instagram_handle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button size="sm" variant="outline" className="w-full text-xs">
                            <Instagram className="h-3 w-3 mr-1" />
                            Follow
                          </Button>
                        </a>
                        <Link to={`/creators/${creator.id}`} className="flex-1">
                          <Button size="sm" className="w-full text-xs bg-orange-500 hover:bg-orange-600">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-10">
              <Link to="/creators">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                  View All Creators
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LocalCreatorsGrid;
