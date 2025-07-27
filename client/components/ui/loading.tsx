import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <div className={cn('animate-spin', sizeClasses[size], className)}>
      <div className="h-full w-full border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
    </div>
  );
}

interface LoadingCardProps {
  className?: string;
  showImage?: boolean;
}

export function LoadingCard({ className, showImage = true }: LoadingCardProps) {
  return (
    <div className={cn('bg-white rounded-2xl shadow-lg p-6 animate-pulse', className)}>
      {showImage && (
        <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
      )}
      <div className="space-y-3">
        <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
        <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
        </div>
      </div>
    </div>
  );
}

interface LoadingGridProps {
  count?: number;
  className?: string;
  showImage?: boolean;
}

export function LoadingGrid({ count = 6, className, showImage = true }: LoadingGridProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <LoadingCard key={index} showImage={showImage} />
      ))}
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({ className, lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={cn('animate-pulse space-y-3', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className={cn(
            'h-4 bg-gray-200 rounded-lg',
            index === 0 && 'w-3/4',
            index === 1 && 'w-full',
            index === 2 && 'w-2/3',
            index > 2 && 'w-full'
          )}
        ></div>
      ))}
    </div>
  );
}

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center animate-bounce">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="mb-6">
          <LoadingSpinner size="xl" className="mx-auto" />
        </div>

        {/* Message */}
        <div className="text-xl font-semibold text-gray-800 mb-2">{message}</div>
        <div className="text-gray-600">Please wait while we load your coastal experiences...</div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}

interface LoadingButtonProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function LoadingButton({ loading, children, className, ...props }: LoadingButtonProps) {
  return (
    <button 
      className={cn(
        'relative transition-all duration-200',
        loading && 'cursor-not-allowed opacity-70',
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" className="text-current" />
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
}

// Component for page transitions
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
      {children}
    </div>
  );
}

// Floating action button with coastal theme
export function FloatingActionButton({ onClick, icon, label }: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 group"
      aria-label={label}
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110">
        {icon}
      </div>
      <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {label}
      </div>
    </button>
  );
}
