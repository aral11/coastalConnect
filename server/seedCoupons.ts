import { getConnection } from './db/connection';
import sql from 'mssql';

export async function seedCoupons(): Promise<void> {
  try {
    const connection = await getConnection();
    
    console.log('🎟️ Seeding coupon data...');

    // Clear existing coupon data
    await connection.request().query(`
      DELETE FROM CouponUsage;
      DELETE FROM PersonalizedOffers;
      DELETE FROM Coupons;
    `);

    // Seed coupons data
    const coupons = [
      {
        code: 'WELCOME100',
        title: 'Welcome Back!',
        subtitle: 'FLAT ₹100 OFF',
        description: 'On orders above ₹499',
        discount_type: 'amount',
        discount_value: 100,
        min_order_amount: 499,
        max_discount_amount: null,
        valid_from: new Date('2024-01-01'),
        valid_until: new Date('2024-12-31'),
        category: 'All Services',
        usage_limit: 1000,
        usage_per_user: 1,
        is_popular: true,
        is_limited_time: false,
        gradient_class: 'from-orange-400 to-red-500',
        text_color_class: 'text-white',
        icon_type: '🎁'
      },
      {
        code: 'STAYHOME40',
        title: 'Homestay Special',
        subtitle: '40% OFF',
        description: 'On weekend bookings',
        discount_type: 'percentage',
        discount_value: 40,
        min_order_amount: 2000,
        max_discount_amount: 1000,
        valid_from: new Date('2024-01-01'),
        valid_until: new Date('2024-12-25'),
        category: 'Homestays',
        usage_limit: 500,
        usage_per_user: 2,
        is_popular: false,
        is_limited_time: true,
        gradient_class: 'from-blue-400 to-purple-500',
        text_color_class: 'text-white',
        icon_type: '💯'
      },
      {
        code: 'DINE25',
        title: 'Restaurant Dining',
        subtitle: '25% OFF',
        description: 'On dining bookings',
        discount_type: 'percentage',
        discount_value: 25,
        min_order_amount: 300,
        max_discount_amount: 500,
        valid_from: new Date('2024-01-01'),
        valid_until: new Date('2024-12-20'),
        category: 'Restaurants',
        usage_limit: 300,
        usage_per_user: 1,
        is_popular: false,
        is_limited_time: false,
        gradient_class: 'from-green-400 to-teal-500',
        text_color_class: 'text-white',
        icon_type: '⚡'
      },
      {
        code: 'RIDE50',
        title: 'Ride Anywhere',
        subtitle: '₹50 OFF',
        description: 'On rides above ₹200',
        discount_type: 'amount',
        discount_value: 50,
        min_order_amount: 200,
        max_discount_amount: null,
        valid_from: new Date('2024-01-01'),
        valid_until: new Date('2024-12-30'),
        category: 'Transport',
        usage_limit: 1000,
        usage_per_user: 3,
        is_popular: false,
        is_limited_time: false,
        gradient_class: 'from-yellow-400 to-orange-500',
        text_color_class: 'text-white',
        icon_type: '⏰'
      },
      {
        code: 'CAPTURE30',
        title: 'Photography',
        subtitle: '30% OFF',
        description: 'Professional shoots',
        discount_type: 'percentage',
        discount_value: 30,
        min_order_amount: 1500,
        max_discount_amount: 800,
        valid_from: new Date('2024-01-01'),
        valid_until: new Date('2024-12-28'),
        category: 'Creators',
        usage_limit: 200,
        usage_per_user: 1,
        is_popular: false,
        is_limited_time: false,
        gradient_class: 'from-purple-400 to-pink-500',
        text_color_class: 'text-white',
        icon_type: '🎁'
      },
      {
        code: 'EVENT200',
        title: 'Event Special',
        subtitle: '₹200 OFF',
        description: 'On event bookings',
        discount_type: 'amount',
        discount_value: 200,
        min_order_amount: 1000,
        max_discount_amount: null,
        valid_from: new Date('2024-01-01'),
        valid_until: new Date('2024-12-31'),
        category: 'Events',
        usage_limit: 150,
        usage_per_user: 1,
        is_popular: true,
        is_limited_time: false,
        gradient_class: 'from-indigo-400 to-blue-500',
        text_color_class: 'text-white',
        icon_type: '💯'
      },
      {
        code: 'FIRSTRIDE',
        title: 'First Ride Free',
        subtitle: '100% OFF',
        description: 'Up to ₹150 on first booking',
        discount_type: 'amount',
        discount_value: 150,
        min_order_amount: 100,
        max_discount_amount: 150,
        valid_from: new Date('2024-01-01'),
        valid_until: new Date('2024-12-31'),
        category: 'Transport',
        usage_limit: null,
        usage_per_user: 1,
        is_popular: true,
        is_limited_time: true,
        gradient_class: 'from-red-400 to-pink-500',
        text_color_class: 'text-white',
        icon_type: '🔥'
      },
      {
        code: 'WEEKEND20',
        title: 'Weekend Special',
        subtitle: '20% OFF',
        description: 'On all services during weekends',
        discount_type: 'percentage',
        discount_value: 20,
        min_order_amount: 500,
        max_discount_amount: 400,
        valid_from: new Date('2024-01-01'),
        valid_until: new Date('2024-12-31'),
        category: 'All Services',
        usage_limit: 2000,
        usage_per_user: 2,
        is_popular: false,
        is_limited_time: false,
        gradient_class: 'from-cyan-400 to-blue-500',
        text_color_class: 'text-white',
        icon_type: '💰'
      }
    ];

    // Insert coupons
    for (const coupon of coupons) {
      await connection.request()
        .input('code', sql.NVarChar, coupon.code)
        .input('title', sql.NVarChar, coupon.title)
        .input('subtitle', sql.NVarChar, coupon.subtitle)
        .input('description', sql.NVarChar, coupon.description)
        .input('discount_type', sql.NVarChar, coupon.discount_type)
        .input('discount_value', sql.Decimal(10, 2), coupon.discount_value)
        .input('min_order_amount', sql.Decimal(10, 2), coupon.min_order_amount)
        .input('max_discount_amount', sql.Decimal(10, 2), coupon.max_discount_amount)
        .input('valid_from', sql.DateTime, coupon.valid_from)
        .input('valid_until', sql.DateTime, coupon.valid_until)
        .input('category', sql.NVarChar, coupon.category)
        .input('usage_limit', sql.Int, coupon.usage_limit)
        .input('usage_per_user', sql.Int, coupon.usage_per_user)
        .input('is_popular', sql.Bit, coupon.is_popular)
        .input('is_limited_time', sql.Bit, coupon.is_limited_time)
        .input('gradient_class', sql.NVarChar, coupon.gradient_class)
        .input('text_color_class', sql.NVarChar, coupon.text_color_class)
        .input('icon_type', sql.NVarChar, coupon.icon_type)
        .query(`
          INSERT INTO Coupons 
          (code, title, subtitle, description, discount_type, discount_value, min_order_amount, 
           max_discount_amount, valid_from, valid_until, category, usage_limit, usage_per_user, 
           is_popular, is_limited_time, gradient_class, text_color_class, icon_type)
          VALUES 
          (@code, @title, @subtitle, @description, @discount_type, @discount_value, @min_order_amount,
           @max_discount_amount, @valid_from, @valid_until, @category, @usage_limit, @usage_per_user,
           @is_popular, @is_limited_time, @gradient_class, @text_color_class, @icon_type)
        `);
    }

    console.log(`✅ Successfully seeded ${coupons.length} coupons`);
    
    // Show summary
    const summaryResult = await connection.request().query(`
      SELECT 
        COUNT(*) as total_coupons,
        SUM(CASE WHEN is_popular = 1 THEN 1 ELSE 0 END) as popular_coupons,
        SUM(CASE WHEN is_limited_time = 1 THEN 1 ELSE 0 END) as limited_time_coupons,
        COUNT(DISTINCT category) as unique_categories
      FROM Coupons
    `);

    const summary = summaryResult.recordset[0];
    console.log(`📊 Coupon Summary:`);
    console.log(`   • Total Coupons: ${summary.total_coupons}`);
    console.log(`   • Popular Coupons: ${summary.popular_coupons}`);
    console.log(`   • Limited Time: ${summary.limited_time_coupons}`);
    console.log(`   • Categories: ${summary.unique_categories}`);

  } catch (error) {
    console.error('❌ Error seeding coupons:', error);
    throw error;
  }
}

// Run directly if called as script
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCoupons()
    .then(() => {
      console.log('🎉 Coupon seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Coupon seeding failed:', error);
      process.exit(1);
    });
}
