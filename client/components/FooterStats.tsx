import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface FooterStatsData {
  totalServices: number;
  totalBookings: number;
  avgRating: number;
  citiesCovered: number;
}

export default function FooterStats() {
  const [stats, setStats] = useState<FooterStatsData>({
    totalServices: 0,
    totalBookings: 0,
    avgRating: 4.8,
    citiesCovered: 2,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [servicesCount, bookingsCount, locationsCount, avgRatingData] =
        await Promise.all([
          supabase
            .from("services")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("bookings")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("locations")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("services")
            .select("average_rating")
            .not("average_rating", "is", null),
        ]);

      // Calculate dynamic average rating
      const validRatings =
        avgRatingData.data?.filter((service) => service.average_rating > 0) ||
        [];
      const dynamicAvgRating =
        validRatings.length > 0
          ? validRatings.reduce(
              (sum, service) => sum + service.average_rating,
              0,
            ) / validRatings.length
          : 4.8;

      setStats({
        totalServices: servicesCount.count || 0,
        totalBookings: bookingsCount.count || 0,
        avgRating: Number(dynamicAvgRating.toFixed(1)),
        citiesCovered: locationsCount.count || 2,
      });
    } catch (error) {
      console.error("Error loading footer stats:", error);
      // Keep default values if error
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <div className="text-center">
        <div className="text-2xl font-bold text-white mb-1">
          {stats.totalServices}+
        </div>
        <div className="text-sm text-gray-400">Verified Services</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-white mb-1">
          {stats.totalBookings}+
        </div>
        <div className="text-sm text-gray-400">Happy Bookings</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-white mb-1">
          {stats.avgRating}★
        </div>
        <div className="text-sm text-gray-400">Average Rating</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-white mb-1">
          {stats.citiesCovered}
        </div>
        <div className="text-sm text-gray-400">Cities Served</div>
      </div>
    </div>
  );
}
