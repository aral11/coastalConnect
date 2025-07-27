import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { animations, utils } from '@/lib/design-system';
import { 
  Loader2, 
  Search, 
  MapPin, 
  Star, 
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw 
} from 'lucide-react';

// Pulse animation component
export const PulseLoader = ({ size = 'md', className = '' }: { 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  return (
    <div className={utils.cn('animate-pulse', sizeClasses[size], className)}>
      <div className="h-full w-full bg-gradient-to-r from-blue-400 to-purple-600 rounded-full animate-ping"></div>
    </div>
  );
};

// Spinning loader with coastal theme
export const SpinLoader = ({ size = 'md', className = '' }: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={utils.cn('animate-spin text-blue-600', sizeClasses[size], className)} />
  );
};

// Enhanced search loading state
export const SearchLoader = () => (
  <div className="flex items-center justify-center py-16">
    <div className="text-center">
      <div className="relative mb-4">
        <Search className="h-12 w-12 text-blue-600 mx-auto animate-bounce" />
        <div className="absolute -inset-2 bg-blue-100 rounded-full animate-ping opacity-50"></div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Searching...</h3>
      <p className="text-gray-600">Finding the best options for you</p>
    </div>
  </div>
);

// Loading state for service cards
export const ServiceCardLoader = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <Card key={index} className="overflow-hidden animate-pulse">
        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
        <CardContent className="p-5">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded" />
              </div>
              <Skeleton className="h-6 w-16 rounded" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Map loading with location animation
export const MapLoader = () => (
  <div className="flex items-center justify-center py-16 bg-gray-50 rounded-lg">
    <div className="text-center">
      <div className="relative mb-4">
        <MapPin className="h-12 w-12 text-blue-600 mx-auto animate-bounce" />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-200 rounded-full animate-ping"></div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Map...</h3>
      <p className="text-gray-600">Pinpointing locations near you</p>
    </div>
  </div>
);

// Success state animation
export const SuccessAnimation = ({ 
  title = 'Success!', 
  message = 'Action completed successfully',
  onDismiss 
}: {
  title?: string;
  message?: string;
  onDismiss?: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center animate-in zoom-in duration-300">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="h-8 w-8 text-green-600 animate-in zoom-in duration-500 delay-200" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Continue
        </button>
      )}
    </div>
  </div>
);

// Error state with retry
export const ErrorState = ({ 
  title = 'Something went wrong',
  message = 'Please try again',
  onRetry,
  className = ''
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}) => (
  <div className={utils.cn('flex items-center justify-center py-16', className)}>
    <div className="text-center max-w-md">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  </div>
);

// Empty state component
export const EmptyState = ({
  icon,
  title = 'No results found',
  message = 'Try adjusting your search criteria',
  actionLabel,
  onAction,
  className = ''
}: {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) => (
  <div className={utils.cn('flex items-center justify-center py-16', className)}>
    <div className="text-center max-w-md">
      {icon && (
        <div className="w-16 h-16 text-gray-300 mx-auto mb-4 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  </div>
);

// Skeleton for page header
export const PageHeaderSkeleton = () => (
  <div className="relative bg-gradient-to-br from-gray-400 to-gray-500 text-white overflow-hidden animate-pulse">
    <div className="relative z-10 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Skeleton className="h-12 w-96 mx-auto mb-4 bg-white/20" />
          <Skeleton className="h-6 w-2/3 mx-auto mb-8 bg-white/20" />
          <div className="flex justify-center space-x-8">
            <Skeleton className="h-4 w-24 bg-white/20" />
            <Skeleton className="h-4 w-24 bg-white/20" />
            <Skeleton className="h-4 w-24 bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Loading dots animation
export const LoadingDots = ({ className = '' }: { className?: string }) => (
  <div className={utils.cn('flex space-x-1', className)}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.1}s` }}
      />
    ))}
  </div>
);

// Progress bar component
export const ProgressBar = ({ 
  progress, 
  className = '',
  showPercentage = true 
}: { 
  progress: number; 
  className?: string;
  showPercentage?: boolean;
}) => (
  <div className={utils.cn('w-full', className)}>
    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
      <span>Loading...</span>
      {showPercentage && <span>{Math.round(progress)}%</span>}
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  </div>
);

// Shimmer effect for content loading
export const ShimmerLoader = ({ 
  className = '',
  lines = 3 
}: { 
  className?: string;
  lines?: number;
}) => (
  <div className={utils.cn('animate-pulse space-y-3', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        <div className="rounded-full bg-gray-300 h-10 w-10"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

// Floating notification
export const FloatingNotification = ({
  type = 'info',
  title,
  message,
  onDismiss,
  autoHide = true,
  duration = 5000
}: {
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  onDismiss?: () => void;
  autoHide?: boolean;
  duration?: number;
}) => {
  React.useEffect(() => {
    if (autoHide && onDismiss) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, onDismiss]);

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    info: <AlertCircle className="h-5 w-5" />
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
      <div className={utils.cn(
        'max-w-sm p-4 rounded-lg border shadow-lg',
        typeStyles[type]
      )}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {icons[type]}
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium">{title}</h3>
            {message && (
              <p className="text-sm mt-1 opacity-90">{message}</p>
            )}
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="ml-4 text-sm hover:opacity-75"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default {
  PulseLoader,
  SpinLoader,
  SearchLoader,
  ServiceCardLoader,
  MapLoader,
  SuccessAnimation,
  ErrorState,
  EmptyState,
  PageHeaderSkeleton,
  LoadingDots,
  ProgressBar,
  ShimmerLoader,
  FloatingNotification
};
