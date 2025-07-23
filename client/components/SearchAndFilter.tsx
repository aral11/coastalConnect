import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar as CalendarIcon,
  Users, 
  Star, 
  IndianRupee,
  X,
  SlidersHorizontal,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';
import { designSystem } from '@/lib/design-system';

interface SearchFilters {
  query: string;
  location: string;
  category: string;
  priceRange: [number, number];
  rating: number;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  amenities: string[];
  sortBy: string;
  availability: boolean;
  verified: boolean;
}

interface SearchAndFilterProps {
  onSearchChange: (filters: SearchFilters) => void;
  categories: Array<{ id: string; name: string; count: number }>;
  locations: Array<{ id: string; name: string; count: number }>;
  amenities: Array<{ id: string; name: string }>;
  loading?: boolean;
  resultCount?: number;
  className?: string;
}

export default function SearchAndFilter({
  onSearchChange,
  categories = [],
  locations = [],
  amenities = [],
  loading = false,
  resultCount = 0,
  className = ''
}: SearchAndFilterProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    category: '',
    priceRange: [0, 10000],
    rating: 0,
    dateRange: {
      from: undefined,
      to: undefined,
    },
    amenities: [],
    sortBy: 'relevance',
    availability: false,
    verified: false,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Debounced search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((newFilters: SearchFilters) => {
      onSearchChange(newFilters);
    }, 300),
    [onSearchChange]
  );

  useEffect(() => {
    debouncedSearch(filters);
    updateActiveFilters();
  }, [filters, debouncedSearch]);

  const updateActiveFilters = () => {
    const active: string[] = [];
    
    if (filters.query) active.push(`Search: "${filters.query}"`);
    if (filters.location) active.push(`Location: ${filters.location}`);
    if (filters.category) active.push(`Category: ${filters.category}`);
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) {
      active.push(`Price: ₹${filters.priceRange[0]} - ₹${filters.priceRange[1]}`);
    }
    if (filters.rating > 0) active.push(`Rating: ${filters.rating}+ stars`);
    if (filters.dateRange.from) {
      active.push(`Date: ${format(filters.dateRange.from, 'MMM dd')}${filters.dateRange.to ? ` - ${format(filters.dateRange.to, 'MMM dd')}` : ''}`);
    }
    if (filters.amenities.length > 0) active.push(`Amenities: ${filters.amenities.length} selected`);
    if (filters.availability) active.push('Available Now');
    if (filters.verified) active.push('Verified Only');
    
    setActiveFilters(active);
  };

  const handleFilterChange = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      query: '',
      location: '',
      category: '',
      priceRange: [0, 10000],
      rating: 0,
      dateRange: { from: undefined, to: undefined },
      amenities: [],
      sortBy: 'relevance',
      availability: false,
      verified: false,
    });
  };

  const removeFilter = (filterText: string) => {
    if (filterText.startsWith('Search:')) {
      handleFilterChange('query', '');
    } else if (filterText.startsWith('Location:')) {
      handleFilterChange('location', '');
    } else if (filterText.startsWith('Category:')) {
      handleFilterChange('category', '');
    } else if (filterText.startsWith('Price:')) {
      handleFilterChange('priceRange', [0, 10000]);
    } else if (filterText.startsWith('Rating:')) {
      handleFilterChange('rating', 0);
    } else if (filterText.startsWith('Date:')) {
      handleFilterChange('dateRange', { from: undefined, to: undefined });
    } else if (filterText.startsWith('Amenities:')) {
      handleFilterChange('amenities', []);
    } else if (filterText === 'Available Now') {
      handleFilterChange('availability', false);
    } else if (filterText === 'Verified Only') {
      handleFilterChange('verified', false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Search Bar */}
      <Card className={designSystem.components.card.elevated}>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            {/* Search Input */}
            <div className="lg:col-span-4">
              <Label htmlFor="search">What are you looking for?</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search restaurants, hotels, services..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Location */}
            <div className="lg:col-span-3">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Select 
                  value={filters.location} 
                  onValueChange={(value) => handleFilterChange('location', value)}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name} ({location.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category */}
            <div className="lg:col-span-3">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={filters.category} 
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search & Filter Buttons */}
            <div className="lg:col-span-2 flex gap-2">
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
              
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="end">
                  <AdvancedFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    amenities={amenities}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            Active Filters ({resultCount} results):
          </span>
          {activeFilters.map((filter, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer pr-1"
              onClick={() => removeFilter(filter)}
            >
              {filter}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <QuickFilter
          label="Available Now"
          active={filters.availability}
          onClick={() => handleFilterChange('availability', !filters.availability)}
        />
        <QuickFilter
          label="Verified Only"
          active={filters.verified}
          onClick={() => handleFilterChange('verified', !filters.verified)}
        />
        <QuickFilter
          label="Top Rated (4+)"
          active={filters.rating >= 4}
          onClick={() => handleFilterChange('rating', filters.rating >= 4 ? 0 : 4)}
        />
        <QuickFilter
          label="Budget Friendly"
          active={filters.priceRange[1] <= 2000}
          onClick={() => handleFilterChange('priceRange', filters.priceRange[1] <= 2000 ? [0, 10000] : [0, 2000])}
        />
      </div>
    </div>
  );
}

// Advanced Filters Component
function AdvancedFilters({ 
  filters, 
  onFilterChange, 
  amenities 
}: {
  filters: SearchFilters;
  onFilterChange: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  amenities: Array<{ id: string; name: string }>;
}) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Advanced Filters</h3>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-2 block">
          Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
        </Label>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => onFilterChange('priceRange', value as [number, number])}
          max={10000}
          min={0}
          step={100}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>₹0</span>
          <span>₹10,000+</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Minimum Rating</Label>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((rating) => (
            <Button
              key={rating}
              variant={filters.rating === rating ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange('rating', rating)}
              className="flex items-center gap-1"
            >
              <Star className="h-3 w-3" />
              {rating === 0 ? 'Any' : `${rating}+`}
            </Button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Date Range</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange.from ? (
                filters.dateRange.to ? (
                  `${format(filters.dateRange.from, 'LLL dd')} - ${format(filters.dateRange.to, 'LLL dd')}`
                ) : (
                  format(filters.dateRange.from, 'LLL dd, y')
                )
              ) : (
                'Pick a date range'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={filters.dateRange.from}
              selected={filters.dateRange}
              onSelect={(range) => onFilterChange('dateRange', range || { from: undefined, to: undefined })}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Amenities */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Amenities</Label>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
          {amenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Checkbox
                id={amenity.id}
                checked={filters.amenities.includes(amenity.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onFilterChange('amenities', [...filters.amenities, amenity.id]);
                  } else {
                    onFilterChange('amenities', filters.amenities.filter(id => id !== amenity.id));
                  }
                }}
              />
              <Label htmlFor={amenity.id} className="text-sm">
                {amenity.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Sort By</Label>
        <Select value={filters.sortBy} onValueChange={(value) => onFilterChange('sortBy', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="distance">Distance</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Quick Filter Component
function QuickFilter({ 
  label, 
  active, 
  onClick 
}: { 
  label: string; 
  active: boolean; 
  onClick: () => void; 
}) {
  return (
    <Button
      variant={active ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      className={active ? 'bg-blue-600 hover:bg-blue-700' : ''}
    >
      {label}
    </Button>
  );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
