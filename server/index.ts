import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getHomestays, getHomestayById, searchHomestays } from "./routes/homestays";
import { getEateries, getEateryById, searchEateries } from "./routes/eateries";
import { getDrivers, getDriverById, searchDrivers } from "./routes/drivers";
import { getCreators, getCreatorById, searchCreators, getInstagramStats } from "./routes/creators";
import { googleAuth, appleAuth, emailAuth, register, verifyToken } from "./routes/auth";
import { createHomestayBooking, createDriverBooking, confirmPayment, getUserBookings, updateDriverBookingStatus, validateTripCode } from "./routes/bookings";
import { getBeautyWellness, getArtsHistory, getNightlife, getShopping, getEntertainment, getEventManagement, getOtherServices } from "./routes/services";
import { getLocalEvents, getReligiousServices, getFeaturedEvents, searchEvents } from "./routes/community";
import { registerVendor, getPendingVendors, updateVendorStatus, getVendorStatus, getVendorCategories } from "./routes/vendors";
import { initializeDatabase, getConnection } from "./db/connection";
import { seedDatabase } from "./seedData";
import { authenticateToken } from "./middleware/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize database connection (optional - fallback data available)
  initializeDatabase().catch(error => {
    console.log('Database initialization failed, using fallback data:', error.message);
  });

  // Health check routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "coastalConnect Udupi API v1.0 - Server is running!" });
  });

  app.get("/api/health", async (_req, res) => {
    try {
      await getConnection();
      res.json({ 
        status: "healthy", 
        database: "connected",
        location: "Udupi, Karnataka, India",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(503).json({ 
        status: "unhealthy", 
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Legacy demo route
  app.get("/api/demo", handleDemo);

  // Database seeding endpoint (for development)
  app.post("/api/seed", async (_req, res) => {
    try {
      await seedDatabase();
      res.json({
        success: true,
        message: "Database seeded successfully with Udupi data!"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error seeding database",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Homestays API routes
  app.get("/api/homestays", getHomestays);
  app.get("/api/homestays/search", searchHomestays);
  app.get("/api/homestays/:id", getHomestayById);

  // Eateries API routes
  app.get("/api/eateries", getEateries);
  app.get("/api/eateries/search", searchEateries);
  app.get("/api/eateries/:id", getEateryById);

  // Drivers API routes
  app.get("/api/drivers", getDrivers);
  app.get("/api/drivers/search", searchDrivers);
  app.get("/api/drivers/:id", getDriverById);

  // Creators API routes
  app.get("/api/creators", getCreators);
  app.get("/api/creators/search", searchCreators);
  app.get("/api/creators/:id", getCreatorById);
  app.get("/api/creators/instagram/:username", getInstagramStats);

  // Authentication API routes
  app.post("/api/auth/google", googleAuth);
  app.post("/api/auth/apple", appleAuth);
  app.post("/api/auth/email", emailAuth);
  app.post("/api/auth/register", register);
  app.get("/api/auth/verify", verifyToken);

  // Booking API routes (protected)
  app.post("/api/bookings/homestay", authenticateToken, createHomestayBooking);
  app.post("/api/bookings/driver", authenticateToken, createDriverBooking);
  app.post("/api/bookings/confirm-payment", confirmPayment);
  app.get("/api/bookings/user", authenticateToken, getUserBookings);
  app.put("/api/bookings/driver/:booking_id/status", updateDriverBookingStatus);
  app.post("/api/bookings/validate-trip-code", validateTripCode);

  // Services API routes - All 9 Sectors
  app.get("/api/services/beauty-wellness", getBeautyWellness);
  app.get("/api/services/arts-history", getArtsHistory);
  app.get("/api/services/nightlife", getNightlife);
  app.get("/api/services/shopping", getShopping);
  app.get("/api/services/entertainment", getEntertainment);
  app.get("/api/services/event-management", getEventManagement);
  app.get("/api/services/other-services", getOtherServices);

  // Community API routes - Events & Religious Services
  app.get("/api/community/events", getLocalEvents);
  app.get("/api/community/events/featured", getFeaturedEvents);
  app.get("/api/community/events/search", searchEvents);
  app.get("/api/community/religious-services", getReligiousServices);

  return app;
}
