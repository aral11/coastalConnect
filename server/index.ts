import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getHomestays, getHomestayById, searchHomestays } from "./routes/homestays";
import { getEateries, getEateryById, searchEateries } from "./routes/eateries";
import { getDrivers, getDriverById, searchDrivers } from "./routes/drivers";
import { getCreators, getCreatorById, searchCreators, getInstagramStats } from "./routes/creators";
import { googleAuth, appleAuth, emailAuth, register, verifyToken, logout } from "./routes/auth";
import { createHomestayBooking, createDriverBooking, confirmPayment, getUserBookings, updateDriverBookingStatus, validateTripCode } from "./routes/bookings";
// Old services route removed - replaced with new service categories
import { getLocalEvents, getReligiousServices, getFeaturedEvents, searchEvents } from "./routes/community";
import vendorRouter from "./routes/vendors";
import statsRouter from "./routes/stats";
import { registerOrganizer, loginOrganizer, getOrganizerProfile, updateOrganizerProfile, getOrganizerDashboard, authenticateOrganizer, requireVerifiedOrganizer } from "./routes/eventOrganizers";
import { createEvent, getOrganizerEvents, getEventDetails, updateEvent, submitEventForApproval, deleteEvent, cancelEvent, getEventRegistrations, getEventAnalytics } from "./routes/organizerEvents";
import { sendBookingConfirmation, sendBookingCancellation, sendBookingReminder, sendWelcomeEmail, sendCustomNotification, sendBulkNotification, getNotificationHistory, testEmail, testSMS } from "./routes/notifications";
import { getPlatformStats } from "./routes/stats";
import { getServiceCategories, getServiceCategory } from "./routes/services";
import { submitContactForm, getContactInfo } from "./routes/contact";
import searchRouter from "./routes/search";
import subscriptionRouter from "./routes/subscription";
import adminRouter from "./routes/admin";
import testNotificationsRouter from "./routes/test-notifications";
import couponRouter from "./routes/coupons";
import { getBusinessMetrics, getRecentBookings, getBookingDetails, updateBookingStatus, getBusinessAnalytics } from "./routes/business";
import { getCategories, getLocations, getPriceRanges, getFeatures, getAppConfig } from "./routes/common";
import { createSupportTicket, getSupportTickets, getSupportTicket, updateSupportTicket } from "./routes/support";
import { submitFeedback, getFeedbacks, getFeedbackStats } from "./routes/feedback";
import { getConnection } from "./db/connection";
import { connectDB } from "./config/database";
import { seedDatabase } from "./seedData";
import { seedCoupons } from "./seedCoupons";
import { authenticateToken } from "./middleware/auth";
import bookingApiRouter from "./routes/bookingApi";
import professionalBookingsRouter from "./routes/professionalBookings";
import seedingRouter from "./routes/seeding";
import dynamicServicesRouter from "./routes/dynamicServices";
import { healthCheck, databaseStatus } from "./routes/health";
import { createPayment, verifyRazorpayPayment, verifyStripePayment, processRefund, getPaymentMethods, stripeWebhook } from "./routes/payments";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize database connection with user's configuration
  connectDB().catch(error => {
    console.log('Database connection failed, using fallback data:', error.message);
    console.log('💡 Make sure your SQL Server is running and credentials are correct');
    console.log('📋 Database: costalConnectDEV, Server: 127.0.0.1, User: aral21');
  });

  // Health check routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "coastalConnect Udupi API v1.0 - Server is running!" });
  });

  app.get("/api/health", healthCheck);
  app.get("/api/database-status", databaseStatus);

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

  // Coupon seeding endpoint (for development)
  app.post("/api/seed-coupons", async (_req, res) => {
    try {
      await seedCoupons();
      res.json({
        success: true,
        message: "Coupons seeded successfully!"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error seeding coupons",
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
  app.post("/api/auth/logout", logout);

  // Payment API routes (live gateways)
  app.post("/api/payments/create", createPayment);
  app.post("/api/payments/verify/razorpay", verifyRazorpayPayment);
  app.post("/api/payments/verify/stripe", verifyStripePayment);
  app.post("/api/payments/refund", processRefund);
  app.get("/api/payments/methods", getPaymentMethods);
  app.post("/api/payments/webhook/stripe", express.raw({type: 'application/json'}), stripeWebhook);

  // Booking API routes (protected)
  app.post("/api/bookings/homestay", authenticateToken, createHomestayBooking);
  app.post("/api/bookings/driver", authenticateToken, createDriverBooking);
  app.post("/api/bookings/confirm-payment", confirmPayment);
  app.get("/api/bookings/user", authenticateToken, getUserBookings);
  app.put("/api/bookings/driver/:booking_id/status", updateDriverBookingStatus);
  app.post("/api/bookings/validate-trip-code", validateTripCode);

  // Old service routes removed - replaced with new service categories API

  // Community API routes - Events & Religious Services
  app.get("/api/community/events", getLocalEvents);
  app.get("/api/community/events/featured", getFeaturedEvents);
  app.get("/api/community/events/search", searchEvents);
  app.get("/api/community/religious-services", getReligiousServices);

  // Vendor Management API routes
  app.use("/api/vendors", vendorRouter);

  // Platform statistics - handled by statsRouter

  // Event Organizer Authentication routes
  app.post("/api/organizers/register", registerOrganizer);
  app.post("/api/organizers/login", loginOrganizer);
  app.get("/api/organizers/profile", authenticateOrganizer, getOrganizerProfile);
  app.put("/api/organizers/profile", authenticateOrganizer, updateOrganizerProfile);
  app.get("/api/organizers/dashboard", authenticateOrganizer, getOrganizerDashboard);

  // Event Management routes (for organizers)
  app.post("/api/organizers/events", authenticateOrganizer, requireVerifiedOrganizer, createEvent);
  app.get("/api/organizers/events", authenticateOrganizer, getOrganizerEvents);
  app.get("/api/organizers/events/:id", authenticateOrganizer, getEventDetails);
  app.put("/api/organizers/events/:id", authenticateOrganizer, updateEvent);
  app.post("/api/organizers/events/:id/submit", authenticateOrganizer, submitEventForApproval);
  app.delete("/api/organizers/events/:id", authenticateOrganizer, deleteEvent);
  app.post("/api/organizers/events/:id/cancel", authenticateOrganizer, cancelEvent);
  app.get("/api/organizers/events/:id/registrations", authenticateOrganizer, getEventRegistrations);
  app.get("/api/organizers/events/:id/analytics", authenticateOrganizer, getEventAnalytics);

  // Notification API routes
  app.post("/api/notifications/booking-confirmation", sendBookingConfirmation);
  app.post("/api/notifications/booking-cancellation", sendBookingCancellation);
  app.post("/api/notifications/booking-reminder", sendBookingReminder);
  app.post("/api/notifications/welcome-email", sendWelcomeEmail);
  app.post("/api/notifications/custom", sendCustomNotification);
  app.post("/api/notifications/bulk", sendBulkNotification);
  app.get("/api/notifications/history", getNotificationHistory);
  app.post("/api/notifications/test-email", testEmail);
  app.post("/api/notifications/test-sms", testSMS);

  // Platform statistics
  app.use("/api/stats", statsRouter);

  // Search API routes
  app.use("/api/search", searchRouter);

  // Subscription API routes
  app.use("/api/subscription", subscriptionRouter);

  // Admin API routes
  app.use("/api/admin", adminRouter);

  // Coupon API routes
  app.use("/api/coupons", couponRouter);

  // Professional Booking API routes
  app.use("/api/bookings", bookingApiRouter);
  app.use("/api/bookings", professionalBookingsRouter);

  // Test notifications API routes (for development/testing)
  app.use("/api/test-notifications", testNotificationsRouter);

  // Development seeding routes
  app.use("/api/dev", seedingRouter);

  // Dynamic services routes (database-driven)
  app.use("/api", dynamicServicesRouter);

  // Service categories
app.get("/api/services", getServiceCategories);
app.get("/api/services/:categoryId", getServiceCategory);

// Contact form
app.post("/api/contact", submitContactForm);
app.get("/api/contact/info", getContactInfo);

// Business dashboard
app.get("/api/business/metrics", getBusinessMetrics);
app.get("/api/business/recent-bookings", getRecentBookings);
app.get("/api/business/bookings/:bookingId", getBookingDetails);
app.put("/api/business/bookings/:bookingId/status", updateBookingStatus);
app.get("/api/business/analytics", getBusinessAnalytics);

// Common data (categories, locations, etc.)
app.get("/api/categories", getCategories);
app.get("/api/locations", getLocations);
app.get("/api/price-ranges", getPriceRanges);
app.get("/api/features", getFeatures);
app.get("/api/config", getAppConfig);

// Support tickets
app.post("/api/support/tickets", createSupportTicket);
app.get("/api/support/tickets", getSupportTickets);
app.get("/api/support/tickets/:ticketId", getSupportTicket);
app.put("/api/support/tickets/:ticketId", updateSupportTicket);

// Feedback
app.post("/api/feedback", submitFeedback);
app.get("/api/feedback", getFeedbacks);
app.get("/api/feedback/stats", getFeedbackStats);

  return app;
}
