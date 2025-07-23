import { RequestHandler } from "express";
import { getConnection } from "../db/connection";
import { Driver } from "../models";

// Fallback data for when database is not available
const mockDrivers: Driver[] = [
  {
    id: 1,
    name: "Suresh Kumar",
    phone: "+91 94488 12345",
    email: "suresh.driver@gmail.com",
    location: "Udupi City",
    vehicle_type: "Sedan (Maruti Dzire)",
    vehicle_number: "KA 20 A 1234",
    license_number: "DL-2020123456789",
    rating: 4.8,
    total_reviews: 156,
    hourly_rate: 300,
    experience_years: 8,
    languages: "Kannada, Hindi, English, Tulu",
    is_available: true,
    is_active: true
  },
  {
    id: 2,
    name: "Ramesh Bhat",
    phone: "+91 98456 78901",
    email: "ramesh.bhat.driver@yahoo.com",
    location: "Manipal-Udupi",
    vehicle_type: "SUV (Mahindra Scorpio)",
    vehicle_number: "KA 20 B 5678",
    license_number: "DL-2019987654321",
    rating: 4.9,
    total_reviews: 203,
    hourly_rate: 450,
    experience_years: 12,
    languages: "Kannada, English, Tulu, Konkani",
    is_available: true,
    is_active: true
  },
  {
    id: 3,
    name: "Prakash Shetty",
    phone: "+91 95916 54321",
    location: "Malpe-Kaup Route",
    vehicle_type: "Hatchback (Maruti Swift)",
    vehicle_number: "KA 20 C 9012",
    license_number: "DL-2021456789123",
    rating: 4.6,
    total_reviews: 89,
    hourly_rate: 250,
    experience_years: 5,
    languages: "Kannada, Hindi, Tulu",
    is_available: true,
    is_active: true
  },
  {
    id: 4,
    name: "Ganesh Acharya",
    phone: "+91 97411 98765",
    email: "ganesh.taxi@gmail.com",
    location: "Udupi-Mangalore Route",
    vehicle_type: "Sedan (Honda City)",
    vehicle_number: "KA 20 D 3456",
    license_number: "DL-2018654321987",
    rating: 4.7,
    total_reviews: 334,
    hourly_rate: 350,
    experience_years: 15,
    languages: "Kannada, English, Hindi, Tulu, Konkani",
    is_available: true,
    is_active: true
  },
  {
    id: 5,
    name: "Vijay Pai",
    phone: "+91 98862 13579",
    location: "Tourist Circuit Guide",
    vehicle_type: "Tempo Traveller (12 Seater)",
    vehicle_number: "KA 20 E 7890",
    license_number: "DL-2017321654987",
    rating: 4.8,
    total_reviews: 124,
    hourly_rate: 800,
    experience_years: 10,
    languages: "Kannada, English, Hindi, Tulu",
    is_available: true,
    is_active: true
  }
];

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
      count: result.recordset.length,
      source: 'database'
    });
  } catch (error) {
    console.log('Database not available, using fallback drivers data');
    res.json({
      success: true,
      data: mockDrivers,
      count: mockDrivers.length,
      source: 'fallback'
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
      data: result.recordset[0],
      source: 'database'
    });
  } catch (error) {
    console.log('Database not available, using fallback driver data');
    const driver = mockDrivers.find(d => d.id === parseInt(id));
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }
    
    res.json({
      success: true,
      data: driver,
      source: 'fallback'
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
      count: result.recordset.length,
      source: 'database'
    });
  } catch (error) {
    console.log('Database not available, using fallback search');
    let filteredDrivers = [...mockDrivers];
    
    if (location) {
      filteredDrivers = filteredDrivers.filter(d => 
        d.location.toLowerCase().includes((location as string).toLowerCase())
      );
    }
    
    if (vehicleType) {
      filteredDrivers = filteredDrivers.filter(d => 
        d.vehicle_type?.toLowerCase().includes((vehicleType as string).toLowerCase())
      );
    }
    
    if (maxRate) {
      filteredDrivers = filteredDrivers.filter(d => 
        d.hourly_rate && d.hourly_rate <= Number(maxRate)
      );
    }
    
    if (minRating) {
      filteredDrivers = filteredDrivers.filter(d => 
        d.rating && d.rating >= Number(minRating)
      );
    }
    
    // Sort by rating DESC, then name ASC
    filteredDrivers.sort((a, b) => {
      if (a.rating !== b.rating) {
        return (b.rating || 0) - (a.rating || 0);
      }
      return a.name.localeCompare(b.name);
    });
    
    res.json({
      success: true,
      data: filteredDrivers,
      count: filteredDrivers.length,
      source: 'fallback'
    });
  }
};
