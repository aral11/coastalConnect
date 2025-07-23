import { RequestHandler } from "express";
import { getConnection } from "../db/connection";
import { Eatery } from "../models";

export const getEateries: RequestHandler = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.request().query(`
      SELECT * FROM Eateries 
      WHERE is_active = 1 
      ORDER BY rating DESC, name ASC
    `);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length
    });
  } catch (error) {
    console.error('Error fetching eateries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching eateries',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getEateryById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.request()
      .input('id', id)
      .query('SELECT * FROM Eateries WHERE id = @id AND is_active = 1');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Eatery not found'
      });
    }
    
    res.json({
      success: true,
      data: result.recordset[0]
    });
  } catch (error) {
    console.error('Error fetching eatery:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching eatery',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const searchEateries: RequestHandler = async (req, res) => {
  try {
    const { location, cuisine, minRating } = req.query;
    const connection = await getConnection();
    
    let query = 'SELECT * FROM Eateries WHERE is_active = 1';
    const request = connection.request();
    
    if (location) {
      query += ' AND (location LIKE @location OR address LIKE @location)';
      request.input('location', `%${location}%`);
    }
    
    if (cuisine) {
      query += ' AND cuisine_type LIKE @cuisine';
      request.input('cuisine', `%${cuisine}%`);
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
    console.error('Error searching eateries:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching eateries',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
