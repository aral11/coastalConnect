import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getHomestays, getHomestayById, searchHomestays } from "./routes/homestays";
import { getEateries, getEateryById, searchEateries } from "./routes/eateries";
import { getDrivers, getDriverById, searchDrivers } from "./routes/drivers";
import { initializeDatabase, getConnection } from "./db/connection";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize database connection
  initializeDatabase().catch(console.error);

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

  return app;
}
