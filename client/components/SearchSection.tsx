import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { layouts } from '@/lib/design-system';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  showFilters?: boolean;
  onFiltersClick?: () => void;
  filtersActive?: boolean;
  children?: React.ReactNode;
}

export default function SearchSection({
  searchQuery,
  onSearchChange,
  onSearch,
  placeholder = "Search...",
  showFilters = true,
  onFiltersClick,
  filtersActive = false,
  children
}: SearchSectionProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <section className="bg-gray-50 border-b border-gray-200">
      <div className={layouts.container}>
        <div className="py-8">
          {/* Main Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder={placeholder}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 pr-4 py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              {showFilters && (
                <Button
                  variant={filtersActive ? "default" : "outline"}
                  onClick={onFiltersClick}
                  className="flex items-center gap-2 px-6"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {filtersActive && (
                    <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                      Active
                    </span>
                  )}
                </Button>
              )}
              
              <Button 
                onClick={onSearch}
                className="px-8 bg-blue-600 hover:bg-blue-700"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Additional Search Content */}
          {children && (
            <div className="mt-6">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
