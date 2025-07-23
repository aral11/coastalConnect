import { RequestHandler } from "express";
import { getConnection } from "../db/connection";
import { Driver } from "../models";

export const getDrivers: RequestHandler = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.request().query(`
      SELECT * FROM Drivers 
      WHERE is_active = 1 AND is_available = 1 
      ORDER BY rating DESC, name ASC
    `);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching drivers',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getDriverById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.request()
      .input('id', id)
      .query('SELECT * FROM Drivers WHERE id = @id AND is_active = 1');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }
    
    res.json({
      success: true,
      data: result.recordset[0]
    });
  } catch (error) {
    console.error('Error fetching driver:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching driver',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const searchDrivers: RequestHandler = async (req, res) => {
  try {
    const { location, vehicleType, maxRate, minRating } = req.query;
    const connection = await getConnection();
    
    let query = 'SELECT * FROM Drivers WHERE is_active = 1 AND is_available = 1';
    const request = connection.request();
    
    if (location) {
      query += ' AND location LIKE @location';
      request.input('location', `%${location}%`);
    }
    
    if (vehicleType) {
      query += ' AND vehicle_type LIKE @vehicleType';
      request.input('vehicleType', `%${vehicleType}%`);
    }
    
    if (maxRate) {
      query += ' AND hourly_rate <= @maxRate';
      request.input('maxRate', Number(maxRate));
    }
    
    if (minRating) {
      query += ' AND rating >= @minRating';
      request.input('minRating', Number(minRating));
    }
    
    query += ' ORDER BY rating DESC, name ASC';
    
    const result = await request.query(query);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length
    });
  } catch (error) {
    console.error('Error searching drivers:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching drivers',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
