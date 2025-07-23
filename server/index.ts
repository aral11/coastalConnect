import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getHomestays, getHomestayById, searchHomestays } from "./routes/homestays";
import { getEateries, getEateryById, searchEateries } from "./routes/eateries";
import { getDrivers, getDriverById, searchDrivers } from "./routes/drivers";
import { googleAuth, appleAuth, emailAuth, register, verifyToken } from "./routes/auth";
import { createHomestayBooking, createDriverBooking, confirmPayment, getUserBookings, updateDriverBookingStatus, validateTripCode } from "./routes/bookings";
import { initializeDatabase, getConnection } from "./db/connection";
import { seedDatabase } from "./seedData";

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

  // Authentication API routes
  app.post("/api/auth/google", googleAuth);
  app.post("/api/auth/apple", appleAuth);
  app.post("/api/auth/email", emailAuth);
  app.post("/api/auth/register", register);
  app.get("/api/auth/verify", verifyToken);

  // Booking API routes
  app.post("/api/bookings/homestay", createHomestayBooking);
  app.post("/api/bookings/driver", createDriverBooking);
  app.post("/api/bookings/confirm-payment", confirmPayment);
  app.get("/api/bookings/user", getUserBookings);
  app.put("/api/bookings/driver/:booking_id/status", updateDriverBookingStatus);
  app.post("/api/bookings/validate-trip-code", validateTripCode);

  return app;
}
