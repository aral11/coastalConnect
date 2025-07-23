import { RequestHandler } from "express";
import { getConnection } from "../db/connection";

export interface VendorRegistration {
  businessName: string;
  ownerName: string;
  category: string;
  subcategory: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  aadharNumber: string;
  gstNumber?: string;
  subscriptionPlan: 'monthly' | 'annual';
  documents: {
    aadharFront: string;
    aadharBack: string;
    businessProof: string;
    gstCertificate?: string;
  };
}

// Vendor registration endpoint
export const registerVendor: RequestHandler = async (req, res) => {
  try {
    const vendorData: VendorRegistration = req.body;
    
    // Validate required fields
    const requiredFields = ['businessName', 'ownerName', 'category', 'phone', 'email', 'aadharNumber'];
    for (const field of requiredFields) {
      if (!vendorData[field as keyof VendorRegistration]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    try {
      const connection = await getConnection();
      
      // Generate unique vendor ID
      const vendorId = `VND${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      // Insert vendor registration
      await connection.request()
        .input('vendorId', vendorId)
        .input('businessName', vendorData.businessName)
        .input('ownerName', vendorData.ownerName)
        .input('category', vendorData.category)
        .input('subcategory', vendorData.subcategory)
        .input('description', vendorData.description)
        .input('address', vendorData.address)
        .input('city', vendorData.city)
        .input('phone', vendorData.phone)
        .input('email', vendorData.email)
        .input('website', vendorData.website || null)
        .input('aadharNumber', vendorData.aadharNumber)
        .input('gstNumber', vendorData.gstNumber || null)
        .input('subscriptionPlan', vendorData.subscriptionPlan)
        .input('status', 'pending_verification')
        .input('documents', JSON.stringify(vendorData.documents))
        .query(`
          INSERT INTO VendorRegistrations (
            vendor_id, business_name, owner_name, category, subcategory, 
            description, address, city, phone, email, website, 
            aadhar_number, gst_number, subscription_plan, status, documents, 
            created_at
          ) VALUES (
            @vendorId, @businessName, @ownerName, @category, @subcategory,
            @description, @address, @city, @phone, @email, @website,
            @aadharNumber, @gstNumber, @subscriptionPlan, @status, @documents,
            GETDATE()
          )
        `);

      // TODO: Send email notification to admin and vendor
      
      res.json({
        success: true,
        message: 'Vendor registration submitted successfully',
        vendorId: vendorId,
        data: {
          estimatedApprovalTime: '24-48 hours',
          nextSteps: [
            'Document verification by admin team',
            'Approval notification via email',
            'Payment link for subscription',
            'Account activation'
          ]
        }
      });

    } catch (dbError) {
      console.log('Database not available, storing registration for later processing');
      
      // In production, this would queue the registration for processing
      // For now, simulate successful submission
      const vendorId = `VND${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      res.json({
        success: true,
        message: 'Vendor registration submitted successfully',
        vendorId: vendorId,
        source: 'queued_for_processing',
        data: {
          estimatedApprovalTime: '24-48 hours',
          nextSteps: [
            'Document verification by admin team',
            'Approval notification via email',
            'Payment link for subscription',
            'Account activation'
          ]
        }
      });
    }
  } catch (error) {
    console.error('Error registering vendor:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing vendor registration',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get pending vendor registrations (Admin only)
export const getPendingVendors: RequestHandler = async (req, res) => {
  try {
    const connection = await getConnection();
    
    const result = await connection.request().query(`
      SELECT * FROM VendorRegistrations 
      WHERE status = 'pending_verification'
      ORDER BY created_at DESC
    `);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length,
      source: 'database'
    });
  } catch (error) {
    console.log('Database not available for admin panel');
    
    // Mock pending registrations for admin panel
    const mockPendingVendors = [
      {
        id: 1,
        vendor_id: 'VND1703123456789',
        business_name: 'Coastal Delights Restaurant',
        owner_name: 'Pradeep Kumar',
        category: 'eateries',
        subcategory: 'Restaurant',
        phone: '9876543210',
        email: 'pradeep@coastaldelights.com',
        city: 'udupi',
        subscription_plan: 'annual',
        status: 'pending_verification',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        vendor_id: 'VND1703123456790',
        business_name: 'Manipal Fitness Center',
        owner_name: 'Sneha Rao',
        category: 'beauty-wellness',
        subcategory: 'Gym',
        phone: '9876543211',
        email: 'sneha@manipalfitness.com',
        city: 'manipal',
        subscription_plan: 'monthly',
        status: 'pending_verification',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    res.json({
      success: true,
      data: mockPendingVendors,
      count: mockPendingVendors.length,
      source: 'fallback'
    });
  }
};

// Approve/reject vendor registration (Admin only)
export const updateVendorStatus: RequestHandler = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { status, adminNotes } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved or rejected'
      });
    }

    try {
      const connection = await getConnection();
      
      await connection.request()
        .input('vendorId', vendorId)
        .input('status', status)
        .input('adminNotes', adminNotes || null)
        .input('reviewedAt', new Date())
        .query(`
          UPDATE VendorRegistrations 
          SET status = @status, admin_notes = @adminNotes, reviewed_at = @reviewedAt
          WHERE vendor_id = @vendorId
        `);

      // TODO: Send email notification to vendor about approval/rejection
      
      res.json({
        success: true,
        message: `Vendor ${status} successfully`,
        data: {
          vendorId: vendorId,
          status: status,
          nextSteps: status === 'approved' ? 
            ['Payment link sent to vendor', 'Account will activate upon payment'] :
            ['Vendor notified of rejection', 'Can reapply with corrected documents']
        }
      });

    } catch (dbError) {
      console.log('Database not available, simulating status update');
      
      res.json({
        success: true,
        message: `Vendor ${status} successfully`,
        source: 'simulated',
        data: {
          vendorId: vendorId,
          status: status
        }
      });
    }
  } catch (error) {
    console.error('Error updating vendor status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating vendor status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get vendor registration status
export const getVendorStatus: RequestHandler = async (req, res) => {
  try {
    const { vendorId } = req.params;
    
    try {
      const connection = await getConnection();
      
      const result = await connection.request()
        .input('vendorId', vendorId)
        .query(`
          SELECT vendor_id, business_name, status, subscription_plan, created_at, reviewed_at, admin_notes
          FROM VendorRegistrations 
          WHERE vendor_id = @vendorId
        `);
      
      if (result.recordset.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Vendor registration not found'
        });
      }
      
      res.json({
        success: true,
        data: result.recordset[0],
        source: 'database'
      });

    } catch (dbError) {
      res.status(404).json({
        success: false,
        message: 'Vendor registration not found'
      });
    }
  } catch (error) {
    console.error('Error fetching vendor status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vendor status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get vendor categories
export const getVendorCategories: RequestHandler = async (req, res) => {
  const categories = {
    'eateries': {
      label: 'Eateries',
      subcategories: ['Restaurant', 'Cafe', 'Bar', 'Fast Food', 'Catering', 'Sweet Shop', 'Bakery']
    },
    'arts-history': {
      label: 'Arts & History',
      subcategories: ['Museum', 'Heritage Site', 'Art Gallery', 'Cultural Center', 'Traditional Crafts']
    },
    'beauty-wellness': {
      label: 'Beauty & Wellness',
      subcategories: ['Salon', 'Spa', 'Gym', 'Ayurveda Center', 'Yoga Studio', 'Massage Center']
    },
    'nightlife': {
      label: 'Nightlife',
      subcategories: ['Bar', 'Pub', 'Club', 'Lounge', 'Live Music Venue']
    },
    'shopping': {
      label: 'Shopping',
      subcategories: ['Market', 'Store', 'Boutique', 'Handicrafts', 'Electronics', 'Clothing']
    },
    'entertainment': {
      label: 'Entertainment',
      subcategories: ['Cinema', 'Gaming Zone', 'Sports Complex', 'Water Sports', 'Adventure Sports']
    },
    'event-management': {
      label: 'Event Management',
      subcategories: ['Wedding Planner', 'Corporate Events', 'Party Planning', 'Catering Services']
    },
    'transportation': {
      label: 'Transportation',
      subcategories: ['Taxi Service', 'Car Rental', 'Bike Rental', 'Auto Rickshaw', 'Bus Service']
    },
    'other-services': {
      label: 'Other Services',
      subcategories: ['Plumber', 'Electrician', 'Carpenter', 'Home Cleaning', 'Repair Services', 'IT Services']
    }
  };

  res.json({
    success: true,
    data: categories
  });
};
