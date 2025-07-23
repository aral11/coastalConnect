import { RequestHandler } from "express";
import { getConnection } from "../db/connection";
import { Homestay } from "../models";

export const getHomestays: RequestHandler = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.request().query(`
      SELECT * FROM Homestays 
      WHERE is_active = 1 
      ORDER BY rating DESC, name ASC
    `);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length
    });
  } catch (error) {
    console.error('Error fetching homestays:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching homestays',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getHomestayById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.request()
      .input('id', id)
      .query('SELECT * FROM Homestays WHERE id = @id AND is_active = 1');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Homestay not found'
      });
    }
    
    res.json({
      success: true,
      data: result.recordset[0]
    });
  } catch (error) {
    console.error('Error fetching homestay:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching homestay',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const searchHomestays: RequestHandler = async (req, res) => {
  try {
    const { location, maxPrice, minRating } = req.query;
    const connection = await getConnection();
    
    let query = 'SELECT * FROM Homestays WHERE is_active = 1';
    const request = connection.request();
    
    if (location) {
      query += ' AND (location LIKE @location OR address LIKE @location)';
      request.input('location', `%${location}%`);
    }
    
    if (maxPrice) {
      query += ' AND price_per_night <= @maxPrice';
      request.input('maxPrice', Number(maxPrice));
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
    console.error('Error searching homestays:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching homestays',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
