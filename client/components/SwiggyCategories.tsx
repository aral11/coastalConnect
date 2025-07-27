import React from 'react';
import { Link } from 'react-router-dom';
import { swiggyTheme } from '@/lib/swiggy-design-system';
import {
  Home,
  UtensilsCrossed,
  Car,
  Camera,
  Calendar,
  Sparkles,
  MapPin,
  ShoppingBag,
  Music,
  Waves,
  Coffee,
  Mountain
} from 'lucide-react';

interface Category {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  gradient: string;
  popular?: boolean;
  new?: boolean;
}

const CATEGORIES: Category[] = [
  {
    id: 'homestays',
    title: 'Hotels & Homestays',
    subtitle: 'Accommodations',
    icon: <Home className="h-8 w-8" />,
    link: '/homestays',
    color: 'text-blue-600',
    gradient: 'from-blue-50 to-indigo-50',
    popular: true
  },
  {
    id: 'restaurants',
    title: 'Restaurants',
    subtitle: 'Dining & Cuisine',
    icon: <UtensilsCrossed className="h-8 w-8" />,
    link: '/eateries',
    color: 'text-orange-600',
    gradient: 'from-orange-50 to-red-50',
    popular: true
  },
  {
    id: 'rides',
    title: 'Rides',
    subtitle: 'Local Transport',
    icon: <Car className="h-8 w-8" />,
    link: '/drivers',
    color: 'text-green-600',
    gradient: 'from-green-50 to-emerald-50'
  },
  {
    id: 'photography',
    title: 'Photography',
    subtitle: 'Creators',
    icon: <Camera className="h-8 w-8" />,
    link: '/creators',
    color: 'text-purple-600',
    gradient: 'from-purple-50 to-pink-50'
  },
  {
    id: 'events',
    title: 'Events',
    subtitle: 'Experiences',
    icon: <Calendar className="h-8 w-8" />,
    link: '/events',
    color: 'text-cyan-600',
    gradient: 'from-cyan-50 to-blue-50',
    new: true
  },
  {
    id: 'wellness',
    title: 'Wellness',
    subtitle: 'Beauty & Spa',
    icon: <Sparkles className="h-8 w-8" />,
    link: '/beauty-wellness',
    color: 'text-pink-600',
    gradient: 'from-pink-50 to-rose-50'
  },
  {
    id: 'beaches',
    title: 'Beaches',
    subtitle: 'Coastal Spots',
    icon: <Waves className="h-8 w-8" />,
    link: '/beaches',
    color: 'text-teal-600',
    gradient: 'from-teal-50 to-cyan-50'
  },
  {
    id: 'shopping',
    title: 'Shopping',
    subtitle: 'Local Markets',
    icon: <ShoppingBag className="h-8 w-8" />,
    link: '/shopping',
    color: 'text-violet-600',
    gradient: 'from-violet-50 to-purple-50'
  },
  {
    id: 'nightlife',
    title: 'Nightlife',
    subtitle: 'Entertainment',
    icon: <Music className="h-8 w-8" />,
    link: '/nightlife',
    color: 'text-indigo-600',
    gradient: 'from-indigo-50 to-blue-50'
  },
  {
    id: 'cafes',
    title: 'Cafes',
    subtitle: 'Coffee & Snacks',
    icon: <Coffee className="h-8 w-8" />,
    link: '/cafes',
    color: 'text-amber-600',
    gradient: 'from-amber-50 to-yellow-50'
  },
  {
    id: 'temples',
    title: 'Temples',
    subtitle: 'Sacred Places',
    icon: <Mountain className="h-8 w-8" />,
    link: '/temples',
    color: 'text-orange-700',
    gradient: 'from-orange-50 to-amber-50'
  },
  {
    id: 'more',
    title: 'More',
    subtitle: 'Explore All',
    icon: <MapPin className="h-8 w-8" />,
    link: '/explore',
    color: 'text-gray-600',
    gradient: 'from-gray-50 to-slate-50'
  }
];

interface SwiggyCategoriesProps {
  title?: string;
  subtitle?: string;
  showAll?: boolean;
  maxItems?: number;
  className?: string;
}

export default function SwiggyCategories({
  title = "What's on your mind?",
  subtitle = "Explore services and experiences",
  showAll = false,
  maxItems = 8,
  className = ''
}: SwiggyCategoriesProps) {
  const displayCategories = showAll ? CATEGORIES : CATEGORIES.slice(0, maxItems);

  return (
    <section className={`${className}`}>
      <div className={swiggyTheme.layouts.container.xl}>
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 text-lg">
              {subtitle}
            </p>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-6 gap-4 lg:gap-6">
          {displayCategories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className={`
                group relative bg-white rounded-xl p-4 lg:p-6
                border border-gray-100 hover:border-orange-200
                shadow-sm hover:shadow-md transition-all duration-200
                ${swiggyTheme.animations.hover.subtle}
              `}
            >
              {/* Background Gradient */}
              <div className={`
                absolute inset-0 bg-gradient-to-br ${category.gradient} 
                rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200
              `} />

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Icon */}
                <div className={`
                  mx-auto mb-3 ${category.color}
                  transform group-hover:scale-110 transition-transform duration-200
                `}>
                  {category.icon}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 text-sm lg:text-base mb-1 group-hover:text-gray-800">
                  {category.title}
                </h3>

                {/* Subtitle */}
                {category.subtitle && (
                  <p className="text-xs text-gray-500 group-hover:text-gray-600">
                    {category.subtitle}
                  </p>
                )}
              </div>

              {/* Badges */}
              {(category.popular || category.new) && (
                <div className="absolute -top-2 -right-2">
                  {category.popular && (
                    <div className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      🔥
                    </div>
                  )}
                  {category.new && (
                    <div className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      NEW
                    </div>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Show More Button */}
        {!showAll && CATEGORIES.length > maxItems && (
          <div className="text-center mt-8">
            <Link
              to="/explore"
              className={`
                inline-flex items-center px-6 py-3 bg-white border-2 border-orange-500 
                text-orange-500 font-semibold rounded-lg hover:bg-orange-50 
                transition-colors duration-200
              `}
            >
              Explore All Categories
              <MapPin className="ml-2 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// Quick Categories Component (for mobile)
export function QuickCategories() {
  const quickCategories = CATEGORIES.slice(0, 4);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide lg:hidden">
      {quickCategories.map((category) => (
        <Link
          key={category.id}
          to={category.link}
          className="flex-shrink-0 flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-2 hover:border-orange-300 transition-colors"
        >
          <div className={`${category.color} scale-75`}>
            {category.icon}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {category.title}
          </span>
        </Link>
      ))}
    </div>
  );
}
