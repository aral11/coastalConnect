import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Percent, Gift, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { swiggyTheme } from '@/lib/swiggy-design-system';
import { useAuth } from '@/contexts/AuthContext';

interface Offer {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  discount: string;
  type: 'percentage' | 'amount' | 'bogo' | 'free';
  minOrder?: number;
  validUntil?: string;
  code?: string;
  gradient: string;
  textColor: string;
  icon: React.ReactNode;
  category: string;
  link: string;
  popular?: boolean;
  limitedTime?: boolean;
  usageLimit?: number;
  currentUsage?: number;
  usagePerUser?: number;
  maxDiscount?: number;
}

interface SwiggyOffersProps {
  title?: string;
  subtitle?: string;
  showTitle?: boolean;
  maxItems?: number;
  className?: string;
}

export default function SwiggyOffers({
  title = "Deals for you",
  subtitle = "Exclusive offers just for you",
  showTitle = true,
  maxItems,
  className = ''
}: SwiggyOffersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOffers();
  }, [user]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get personalized offers if user is logged in
      const endpoint = user?.id
        ? `/api/coupons/personalized/${user.id}`
        : '/api/coupons';

      const response = await fetch(endpoint);

      if (!response.ok) {
        // Use fallback data if API is not available
        console.warn('Coupon API not available, using fallback data');
        setOffers(getFallbackOffers());
        return;
      }

      const data = await response.json();

      if (data.success) {
        const formattedOffers = data.data.map((offer: any) => ({
          ...offer,
          icon: getIconComponent(offer.icon || '🎁')
        }));
        setOffers(formattedOffers);
      } else {
        throw new Error(data.message || 'Failed to load offers');
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      // Use fallback data on error
      console.warn('Using fallback coupon data due to API error');
      setOffers(getFallbackOffers());
      setError(null); // Don't show error to user, use fallback instead
    } finally {
      setLoading(false);
    }
  };

  const displayOffers = maxItems ? offers.slice(0, maxItems) : offers;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Helper function to get icon component
  const getIconComponent = (iconText: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      '🎁': <Gift className="h-6 w-6" />,
      '💯': <Percent className="h-6 w-6" />,
      '⏰': <Clock className="h-6 w-6" />,
      '⚡': <Zap className="h-6 w-6" />,
      '🔥': <Gift className="h-6 w-6" />,
      '💰': <Gift className="h-6 w-6" />
    };
    return iconMap[iconText] || <Gift className="h-6 w-6" />;
  };

  // Fallback data when API is not available
  const getFallbackOffers = (): Offer[] => {
    return [
      {
        id: 'welcome100',
        title: 'Welcome Back!',
        subtitle: 'FLAT ₹100 OFF',
        description: 'On orders above ₹499',
        discount: '₹100 OFF',
        type: 'amount',
        minOrder: 499,
        validUntil: '2024-12-31',
        code: 'WELCOME100',
        gradient: 'from-orange-400 to-red-500',
        textColor: 'text-white',
        icon: <Gift className="h-6 w-6" />,
        category: 'All Services',
        link: '/offers/welcome100',
        popular: true
      },
      {
        id: 'stayhome40',
        title: 'Homestay Special',
        subtitle: '40% OFF',
        description: 'On weekend bookings',
        discount: '40% OFF',
        type: 'percentage',
        minOrder: 2000,
        validUntil: '2024-12-25',
        code: 'STAYHOME40',
        gradient: 'from-blue-400 to-purple-500',
        textColor: 'text-white',
        icon: <Percent className="h-6 w-6" />,
        category: 'Homestays',
        link: '/homestays?offer=STAYHOME40',
        limitedTime: true
      },
      {
        id: 'dine25',
        title: 'Restaurant Dining',
        subtitle: '25% OFF',
        description: 'On dining bookings',
        discount: '25% OFF',
        type: 'percentage',
        minOrder: 300,
        validUntil: '2024-12-20',
        code: 'DINE25',
        gradient: 'from-green-400 to-teal-500',
        textColor: 'text-white',
        icon: <Zap className="h-6 w-6" />,
        category: 'Restaurants',
        link: '/eateries?offer=DINE25'
      },
      {
        id: 'ride50',
        title: 'Ride Anywhere',
        subtitle: '₹50 OFF',
        description: 'On rides above ₹200',
        discount: '₹50 OFF',
        type: 'amount',
        minOrder: 200,
        validUntil: '2024-12-30',
        code: 'RIDE50',
        gradient: 'from-yellow-400 to-orange-500',
        textColor: 'text-white',
        icon: <Clock className="h-6 w-6" />,
        category: 'Transport',
        link: '/drivers?offer=RIDE50'
      },
      {
        id: 'capture30',
        title: 'Photography',
        subtitle: '30% OFF',
        description: 'Professional shoots',
        discount: '30% OFF',
        type: 'percentage',
        minOrder: 1500,
        validUntil: '2024-12-28',
        code: 'CAPTURE30',
        gradient: 'from-purple-400 to-pink-500',
        textColor: 'text-white',
        icon: <Gift className="h-6 w-6" />,
        category: 'Creators',
        link: '/creators?offer=CAPTURE30'
      },
      {
        id: 'event200',
        title: 'Event Special',
        subtitle: '₹200 OFF',
        description: 'On event bookings',
        discount: '₹200 OFF',
        type: 'amount',
        minOrder: 1000,
        validUntil: '2024-12-31',
        code: 'EVENT200',
        gradient: 'from-indigo-400 to-blue-500',
        textColor: 'text-white',
        icon: <Percent className="h-6 w-6" />,
        category: 'Events',
        link: '/events?offer=EVENT200'
      }
    ];
  };

  if (loading) {
    return (
      <section className={`${className}`}>
        <div className={swiggyTheme.layouts.container.xl}>
          {showTitle && (
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-gray-600">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex-shrink-0 w-80 lg:w-72 h-64 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`${className}`}>
        <div className={swiggyTheme.layouts.container.xl}>
          {showTitle && (
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-gray-600">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl">
            <div className="text-center">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Unable to load offers at the moment</p>
              <button
                onClick={fetchOffers}
                className="mt-2 text-sm text-orange-600 hover:text-orange-700"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (offers.length === 0) {
    return (
      <section className={`${className}`}>
        <div className={swiggyTheme.layouts.container.xl}>
          {showTitle && (
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-gray-600">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl">
            <div className="text-center">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No offers available right now</p>
              <p className="text-sm text-gray-500 mt-1">Check back later for exciting deals!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${className}`}>
      <div className={swiggyTheme.layouts.container.xl}>
        {/* Section Header */}
        {showTitle && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                {title}
              </h2>
              {subtitle && (
                <p className="text-gray-600">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Desktop Navigation Arrows */}
            <div className="hidden lg:flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full p-0 border-gray-300 hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full p-0 border-gray-300 hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Offers Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayOffers.map((offer) => (
            <Link
              key={offer.id}
              to={offer.link}
              className="flex-shrink-0 group"
            >
              <div className={`
                relative w-80 lg:w-72 bg-gradient-to-br ${offer.gradient}
                rounded-xl overflow-hidden shadow-lg hover:shadow-xl
                transition-all duration-300 ${swiggyTheme.animations.hover.subtle}
              `}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-white rounded-full" />
                  <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white rounded-full" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-6">
                  {/* Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {offer.popular && (
                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full border border-white/30">
                          🔥 Popular
                        </span>
                      )}
                      {offer.limitedTime && (
                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full border border-white/30">
                          ⏰ Limited
                        </span>
                      )}
                    </div>
                    <div className={offer.textColor}>
                      {offer.icon}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="mb-4">
                    <h3 className={`text-xl font-bold ${offer.textColor} mb-1`}>
                      {offer.title}
                    </h3>
                    <div className={`text-2xl font-extrabold ${offer.textColor} mb-2`}>
                      {offer.subtitle}
                    </div>
                    <p className={`text-sm ${offer.textColor} opacity-90 mb-3`}>
                      {offer.description}
                    </p>
                  </div>

                  {/* Offer Details */}
                  <div className="space-y-2">
                    {offer.minOrder && (
                      <div className={`text-xs ${offer.textColor} opacity-80`}>
                        💰 Min order: ₹{offer.minOrder}
                      </div>
                    )}
                    {offer.validUntil && (
                      <div className={`text-xs ${offer.textColor} opacity-80`}>
                        📅 Valid till: {new Date(offer.validUntil).toLocaleDateString()}
                      </div>
                    )}
                    {offer.code && (
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-white/30">
                        <div className={`text-xs ${offer.textColor} opacity-80 mb-1`}>
                          Use code:
                        </div>
                        <div className={`text-sm font-bold ${offer.textColor} tracking-wider`}>
                          {offer.code}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category Tag */}
                  <div className="mt-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                      {offer.category}
                    </span>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
          ))}

          {/* View All Offers Card */}
          <Link
            to="/offers"
            className="flex-shrink-0 group"
          >
            <div className="w-80 lg:w-72 h-full bg-white border-2 border-dashed border-orange-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-orange-400 hover:bg-orange-50 transition-colors duration-200">
              <Gift className="h-12 w-12 text-orange-500 mb-4 group-hover:scale-110 transition-transform duration-200" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                View All Offers
              </h3>
              <p className="text-sm text-gray-600">
                Discover more amazing deals and exclusive offers
              </p>
              <div className="mt-4 text-sm font-medium text-orange-600 group-hover:text-orange-700">
                See All →
              </div>
            </div>
          </Link>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center mt-4 lg:hidden">
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(displayOffers.length / 2) }).map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 bg-gray-300 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Compact Offers Component (for smaller spaces)
export function CompactOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompactOffers();
  }, []);

  const fetchCompactOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/coupons');

      if (!response.ok) {
        // Use fallback data if API is not available
        const fallbackOffers = getFallbackCompactOffers();
        setOffers(fallbackOffers);
        return;
      }

      const data = await response.json();

      if (data.success) {
        const formattedOffers = data.data.slice(0, 3).map((offer: any) => ({
          ...offer,
          icon: getIconComponent(offer.icon || '🎁')
        }));
        setOffers(formattedOffers);
      }
    } catch (error) {
      console.error('Error fetching compact offers:', error);
      // Use fallback data on error
      const fallbackOffers = getFallbackCompactOffers();
      setOffers(fallbackOffers);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackCompactOffers = (): Offer[] => {
    return [
      {
        id: 'welcome100',
        title: 'Welcome Back!',
        subtitle: 'FLAT ₹100 OFF',
        description: 'On orders above ₹499',
        discount: '₹100 OFF',
        type: 'amount',
        gradient: 'from-orange-400 to-red-500',
        textColor: 'text-white',
        icon: <Gift className="h-6 w-6" />,
        category: 'All Services',
        link: '/offers/welcome100'
      },
      {
        id: 'stayhome40',
        title: 'Homestay Special',
        subtitle: '40% OFF',
        description: 'On weekend bookings',
        discount: '40% OFF',
        type: 'percentage',
        gradient: 'from-blue-400 to-purple-500',
        textColor: 'text-white',
        icon: <Percent className="h-6 w-6" />,
        category: 'Homestays',
        link: '/homestays?offer=STAYHOME40'
      },
      {
        id: 'dine25',
        title: 'Restaurant Dining',
        subtitle: '25% OFF',
        description: 'On dining bookings',
        discount: '25% OFF',
        type: 'percentage',
        gradient: 'from-green-400 to-teal-500',
        textColor: 'text-white',
        icon: <Zap className="h-6 w-6" />,
        category: 'Restaurants',
        link: '/eateries?offer=DINE25'
      }
    ];
  };

  const getIconComponent = (iconText: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      '🎁': <Gift className="h-6 w-6" />,
      '💯': <Percent className="h-6 w-6" />,
      '⏰': <Clock className="h-6 w-6" />,
      '⚡': <Zap className="h-6 w-6" />
    };
    return iconMap[iconText] || <Gift className="h-6 w-6" />;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg">
        <p className="text-gray-600 text-sm">No offers available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {offers.map((offer) => (
        <Link
          key={offer.id}
          to={offer.link}
          className={`
            bg-gradient-to-r ${offer.gradient} rounded-lg p-4 text-white
            hover:shadow-lg transition-shadow duration-200
          `}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{offer.title}</span>
            {offer.icon}
          </div>
          <div className="text-lg font-bold mb-1">{offer.subtitle}</div>
          <div className="text-xs opacity-90">{offer.description}</div>
        </Link>
      ))}
    </div>
  );
}
