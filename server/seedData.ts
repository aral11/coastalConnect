import { getConnection } from './db/connection';

const udupiHomestays = [
  {
    name: "Coastal Heritage Homestay",
    description: "Experience traditional Udupi hospitality in our heritage home with authentic coastal Karnataka cuisine and modern amenities.",
    location: "Malpe Beach Road, Udupi",
    address: "Near Malpe Beach, Udupi, Karnataka 576103",
    price_per_night: 2500,
    rating: 4.8,
    total_reviews: 124,
    phone: "+91 98456 78901",
    email: "stay@coastalheritage.com",
    amenities: "AC Rooms, Free WiFi, Traditional Breakfast, Beach Access, Parking, Kitchen Access",
    image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
    latitude: 13.3494,
    longitude: 74.7421
  },
  {
    name: "Krishna Temple View Homestay",
    description: "Stay near the famous Krishna Temple with temple views and authentic Udupi vegetarian meals.",
    location: "Car Street, Udupi",
    address: "Car Street, Near Krishna Temple, Udupi, Karnataka 576101",
    price_per_night: 1800,
    rating: 4.6,
    total_reviews: 89,
    phone: "+91 94488 12345",
    email: "info@krishnaview.com",
    amenities: "Temple View, Vegetarian Meals, AC, Free WiFi, Cultural Tours, Parking",
    image_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
    latitude: 13.3409,
    longitude: 74.7421
  },
  {
    name: "Backwater Bliss Homestay",
    description: "Peaceful homestay surrounded by backwaters and coconut groves, perfect for nature lovers.",
    location: "Brahmavar, Udupi",
    address: "Brahmavar Backwaters, Udupi District, Karnataka 576213",
    price_per_night: 2200,
    rating: 4.7,
    total_reviews: 67,
    phone: "+91 95916 54321",
    email: "contact@backwaterbliss.in",
    amenities: "Backwater View, Kayaking, Traditional Food, AC, WiFi, Nature Walks",
    image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    latitude: 13.3625,
    longitude: 74.7678
  },
  {
    name: "Kaup Beach Cottage",
    description: "Beachfront cottage with stunning lighthouse views and easy access to Kaup Beach.",
    location: "Kaup, Udupi",
    address: "Kaup Beach Road, Near Lighthouse, Kaup, Udupi, Karnataka 574106",
    price_per_night: 3000,
    rating: 4.9,
    total_reviews: 156,
    phone: "+91 97411 98765",
    email: "kaupbeach@gmail.com",
    amenities: "Beach Access, Lighthouse View, Seafood, AC, WiFi, Beach Sports",
    image_url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&h=400&fit=crop",
    latitude: 13.2167,
    longitude: 74.7500
  },
  {
    name: "Manipal University Guest House",
    description: "Comfortable accommodation near Manipal University with modern facilities and local cuisine.",
    location: "Manipal, Udupi",
    address: "Tiger Circle Road, Manipal, Udupi, Karnataka 576104",
    price_per_night: 2000,
    rating: 4.5,
    total_reviews: 203,
    phone: "+91 98862 13579",
    email: "manipalguesthouse@yahoo.com",
    amenities: "University Access, Student Friendly, AC, WiFi, Local Tours, Restaurant",
    image_url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop",
    latitude: 13.3467,
    longitude: 74.7869
  }
];

const udupiEateries = [
  {
    name: "Woodlands Restaurant",
    description: "Famous for authentic Udupi vegetarian cuisine and South Indian breakfast items.",
    location: "Car Street, Udupi",
    address: "Car Street, Udupi, Karnataka 576101",
    cuisine_type: "South Indian Vegetarian",
    rating: 4.7,
    total_reviews: 892,
    phone: "+91 820 252 0794",
    opening_hours: "6:00 AM - 10:30 PM",
    price_range: "₹150-300 per person",
    image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop",
    latitude: 13.3409,
    longitude: 74.7421
  },
  {
    name: "Mitra Samaj Bhojanalaya",
    description: "Historic restaurant serving traditional Udupi meals on banana leaves since 1920.",
    location: "Car Street, Udupi",
    address: "Car Street, Near Krishna Temple, Udupi, Karnataka 576101",
    cuisine_type: "Traditional Udupi",
    rating: 4.8,
    total_reviews: 654,
    phone: "+91 820 252 2039",
    opening_hours: "11:00 AM - 3:00 PM, 7:00 PM - 9:30 PM",
    price_range: "₹200-400 per person",
    image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
    latitude: 13.3409,
    longitude: 74.7421
  },
  {
    name: "Dollops Restaurant",
    description: "Modern restaurant offering fusion of coastal Karnataka and international cuisines.",
    location: "Manipal, Udupi",
    address: "Manipal University Road, Manipal, Karnataka 576104",
    cuisine_type: "Multi-cuisine",
    rating: 4.5,
    total_reviews: 334,
    phone: "+91 820 292 3456",
    opening_hours: "11:00 AM - 11:00 PM",
    price_range: "₹300-600 per person",
    image_url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop",
    latitude: 13.3467,
    longitude: 74.7869
  },
  {
    name: "Malpe Sea Food Restaurant",
    description: "Fresh seafood restaurant with variety of coastal Karnataka fish preparations.",
    location: "Malpe, Udupi",
    address: "Malpe Beach Road, Malpe, Udupi, Karnataka 576103",
    cuisine_type: "Seafood, Coastal Karnataka",
    rating: 4.6,
    total_reviews: 445,
    phone: "+91 820 252 8901",
    opening_hours: "11:30 AM - 3:00 PM, 6:30 PM - 10:00 PM",
    price_range: "₹400-800 per person",
    image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop",
    latitude: 13.3494,
    longitude: 74.7421
  },
  {
    name: "Hotel Janatha Deluxe",
    description: "Local favorite for traditional Udupi breakfast, dosas, and filter coffee.",
    location: "Udupi Bus Stand",
    address: "Near Bus Stand, Udupi, Karnataka 576101",
    cuisine_type: "South Indian Breakfast",
    rating: 4.4,
    total_reviews: 278,
    phone: "+91 820 252 1234",
    opening_hours: "6:30 AM - 12:00 PM, 3:00 PM - 9:00 PM",
    price_range: "₹100-250 per person",
    image_url: "https://images.unsplash.com/photo-1630409346253-6d74b5e49fd1?w=600&h=400&fit=crop",
    latitude: 13.3378,
    longitude: 74.7483
  },
  {
    name: "Gokul Vegetarian",
    description: "Popular vegetarian restaurant known for North Indian and Chinese dishes.",
    location: "Service Bus Stand, Udupi",
    address: "Service Bus Stand Road, Udupi, Karnataka 576101",
    cuisine_type: "North Indian, Chinese, South Indian",
    rating: 4.3,
    total_reviews: 567,
    phone: "+91 820 252 7890",
    opening_hours: "10:00 AM - 10:30 PM",
    price_range: "₹200-450 per person",
    image_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop",
    latitude: 13.3378,
    longitude: 74.7483
  }
];

const udupiDrivers = [
  {
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

export const seedDatabase = async () => {
  try {
    const connection = await getConnection();
    
    console.log('Seeding homestays...');
    for (const homestay of udupiHomestays) {
      await connection.request()
        .input('name', homestay.name)
        .input('description', homestay.description)
        .input('location', homestay.location)
        .input('address', homestay.address)
        .input('price_per_night', homestay.price_per_night)
        .input('rating', homestay.rating)
        .input('total_reviews', homestay.total_reviews)
        .input('phone', homestay.phone)
        .input('email', homestay.email)
        .input('amenities', homestay.amenities)
        .input('image_url', homestay.image_url)
        .input('latitude', homestay.latitude)
        .input('longitude', homestay.longitude)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM Homestays WHERE name = @name)
          INSERT INTO Homestays (name, description, location, address, price_per_night, rating, total_reviews, phone, email, amenities, image_url, latitude, longitude)
          VALUES (@name, @description, @location, @address, @price_per_night, @rating, @total_reviews, @phone, @email, @amenities, @image_url, @latitude, @longitude)
        `);
    }
    
    console.log('Seeding eateries...');
    for (const eatery of udupiEateries) {
      await connection.request()
        .input('name', eatery.name)
        .input('description', eatery.description)
        .input('location', eatery.location)
        .input('address', eatery.address)
        .input('cuisine_type', eatery.cuisine_type)
        .input('rating', eatery.rating)
        .input('total_reviews', eatery.total_reviews)
        .input('phone', eatery.phone)
        .input('opening_hours', eatery.opening_hours)
        .input('price_range', eatery.price_range)
        .input('image_url', eatery.image_url)
        .input('latitude', eatery.latitude)
        .input('longitude', eatery.longitude)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM Eateries WHERE name = @name)
          INSERT INTO Eateries (name, description, location, address, cuisine_type, rating, total_reviews, phone, opening_hours, price_range, image_url, latitude, longitude)
          VALUES (@name, @description, @location, @address, @cuisine_type, @rating, @total_reviews, @phone, @opening_hours, @price_range, @image_url, @latitude, @longitude)
        `);
    }
    
    console.log('Seeding drivers...');
    for (const driver of udupiDrivers) {
      await connection.request()
        .input('name', driver.name)
        .input('phone', driver.phone)
        .input('email', driver.email || null)
        .input('location', driver.location)
        .input('vehicle_type', driver.vehicle_type)
        .input('vehicle_number', driver.vehicle_number)
        .input('license_number', driver.license_number)
        .input('rating', driver.rating)
        .input('total_reviews', driver.total_reviews)
        .input('hourly_rate', driver.hourly_rate)
        .input('experience_years', driver.experience_years)
        .input('languages', driver.languages)
        .input('is_available', driver.is_available)
        .input('is_active', driver.is_active)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM Drivers WHERE phone = @phone)
          INSERT INTO Drivers (name, phone, email, location, vehicle_type, vehicle_number, license_number, rating, total_reviews, hourly_rate, experience_years, languages, is_available, is_active)
          VALUES (@name, @phone, @email, @location, @vehicle_type, @vehicle_number, @license_number, @rating, @total_reviews, @hourly_rate, @experience_years, @languages, @is_available, @is_active)
        `);
    }
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};
