import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Star, MapPin } from 'lucide-react';

interface PlatformStatsData {
  vendors: number;
  orders: number;
  rating: number;
  cities: number;
}

const PlatformStats: React.FC = () => {
  const [stats, setStats] = useState<PlatformStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/api/stats/platform', {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setStats(data.data);
          console.log('✅ Platform stats loaded successfully');
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error(`Stats API returned ${response.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Stats API unavailable:', errorMessage);
      setStats(null);
      setError('Unable to load platform statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M+`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k+`;
    } else if (num > 0) {
      return num.toString();
    }
    return '0';
  };

  const formatRating = (rating: number) => {
    return rating > 0 ? `${rating.toFixed(1)}★` : 'New';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4 text-center">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-gray-900">Growing</div>
          <div className="text-sm text-gray-600">Vendors</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">Starting</div>
          <div className="text-sm text-gray-600">Orders</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">New</div>
          <div className="text-sm text-gray-600">Platform</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">Expanding</div>
          <div className="text-sm text-gray-600">Cities</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4 text-center">
      <div>
        <div className="text-2xl font-bold text-gray-900">
          {stats.vendors > 0 ? formatNumber(stats.vendors) : 'Growing'}
        </div>
        <div className="text-sm text-gray-600">Vendors</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">
          {stats.orders > 0 ? formatNumber(stats.orders) : 'Starting'}
        </div>
        <div className="text-sm text-gray-600">Orders</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">
          {formatRating(stats.rating)}
        </div>
        <div className="text-sm text-gray-600">Rating</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">
          {stats.cities > 0 ? stats.cities : 'Expanding'}
        </div>
        <div className="text-sm text-gray-600">Cities</div>
      </div>
    </div>
  );
};

export default PlatformStats;
