import { RequestHandler } from "express";
import { getConnection } from "../db/connection";

export const healthCheck: RequestHandler = async (req, res) => {
  try {
    let dbStatus = 'disconnected';
    let dbMessage = 'Database connection failed';
    
    try {
      await getConnection();
      dbStatus = 'connected';
      dbMessage = 'Database connected successfully';
    } catch (dbError) {
      if (dbError.message?.includes('circuit breaker')) {
        dbStatus = 'circuit_breaker_open';
        dbMessage = 'Database circuit breaker is open - too many recent failures';
      } else {
        dbMessage = `Database connection error: ${dbError.message}`;
      }
    }

    const healthData = {
      status: "healthy",
      database: {
        status: dbStatus,
        message: dbMessage
      },
      authentication: "fallback_enabled",
      location: "Udupi, Karnataka, India",
      timestamp: new Date().toISOString(),
      fallback_mode: dbStatus !== 'connected'
    };

    // Return 200 OK even if database is down (fallback mode available)
    res.json(healthData);
  } catch (error) {
    res.status(503).json({ 
      status: "unhealthy", 
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    });
  }
};

export const databaseStatus: RequestHandler = async (req, res) => {
  try {
    const connection = await getConnection();
    
    // Test query to verify database functionality
    const result = await connection.request().query('SELECT 1 as test');
    
    res.json({
      status: 'connected',
      message: 'Database is fully operational',
      test_query_result: result.recordset[0]?.test === 1,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    let status = 'error';
    let message = 'Database connection failed';
    
    if (error.message?.includes('circuit breaker')) {
      status = 'circuit_breaker_open';
      message = 'Database circuit breaker is open. Too many recent connection failures. Will retry automatically.';
    }
    
    res.status(503).json({
      status,
      message,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback_available: true,
      timestamp: new Date().toISOString()
    });
  }
};
