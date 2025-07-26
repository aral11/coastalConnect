import { Router, Request, Response } from 'express';

const router = Router();

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: 'monthly' | 'annual';
  features: string[];
  isLaunchOffer: boolean;
  validUntil?: string;
}

// Calculate pricing based on current date and launch timeline
const calculateSubscriptionPricing = (): SubscriptionPlan[] => {
  const launchDate = new Date('2024-01-01'); // Platform launch date
  const currentDate = new Date();
  
  // Calculate months since launch
  const monthsSinceLaunch = (currentDate.getFullYear() - launchDate.getFullYear()) * 12 + 
                           (currentDate.getMonth() - launchDate.getMonth());
  
  const isFirstMonth = monthsSinceLaunch === 0;
  
  const plans: SubscriptionPlan[] = [
    {
      id: 'monthly',
      name: isFirstMonth ? 'Launch Special - Monthly' : 'Monthly Plan',
      price: isFirstMonth ? 99 : 199,
      originalPrice: isFirstMonth ? 199 : undefined,
      duration: 'monthly',
      isLaunchOffer: isFirstMonth,
      validUntil: isFirstMonth ? '2024-02-01' : undefined,
      features: [
        'Business profile on coastalConnect',
        'Customer booking management',
        'Customer reviews and ratings',
        'Basic analytics dashboard',
        'Email notifications',
        'Customer support'
      ]
    },
    {
      id: 'annual',
      name: 'Annual Plan',
      price: 199, // Special annual pricing
      originalPrice: undefined,
      duration: 'annual',
      isLaunchOffer: false,
      features: [
        'All monthly plan features',
        'Priority listing in search results',
        'Advanced analytics and insights',
        'Promotional campaign tools',
        'Custom business hours settings',
        'Priority customer support',
        'Monthly performance reports'
      ]
    }
  ];
  
  return plans;
};

// Get subscription plans endpoint
router.get('/plans', (req: Request, res: Response) => {
  try {
    const plans = calculateSubscriptionPricing();
    
    res.json({
      success: true,
      data: {
        plans,
        currency: 'INR',
        location: 'Udupi & Manipal, Karnataka',
        note: 'Pricing based on registration date. Launch offer valid for first month after platform launch.'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription plans',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Calculate price for specific user based on registration date
router.post('/calculate-price', (req: Request, res: Response) => {
  try {
    const { planType, userRegistrationDate } = req.body;
    
    if (!planType || !['monthly', 'annual'].includes(planType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan type. Must be "monthly" or "annual"'
      });
    }
    
    const registrationDate = userRegistrationDate ? new Date(userRegistrationDate) : new Date();
    const launchDate = new Date('2024-01-01');
    
    // Calculate pricing based on when user registered
    const monthsSinceLaunch = (registrationDate.getFullYear() - launchDate.getFullYear()) * 12 + 
                             (registrationDate.getMonth() - launchDate.getMonth());
    
    const isFirstMonth = monthsSinceLaunch === 0;
    
    let price: number;
    let isLaunchOffer: boolean;
    
    if (planType === 'monthly') {
      price = isFirstMonth ? 99 : 199;
      isLaunchOffer = isFirstMonth;
    } else {
      price = 199; // Annual plan special pricing
      isLaunchOffer = false;
    }
    
    res.json({
      success: true,
      data: {
        planType,
        price,
        originalPrice: isLaunchOffer ? 199 : undefined,
        isLaunchOffer,
        registrationDate: registrationDate.toISOString(),
        monthsSinceLaunch,
        currency: 'INR',
        savings: isLaunchOffer ? 100 : (planType === 'annual' ? 0 : undefined)
      }
    });
  } catch (error) {
    console.error('Error calculating subscription price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate subscription price',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get subscription features
router.get('/features', (req: Request, res: Response) => {
  try {
    const features = {
      basic: [
        'Business profile listing',
        'Customer reviews and ratings',
        'Basic booking management',
        'Email notifications'
      ],
      premium: [
        'Priority search ranking',
        'Advanced analytics dashboard',
        'Custom promotional campaigns',
        'Priority customer support',
        'Multiple location management',
        'Bulk operation tools'
      ],
      enterprise: [
        'White-label solution',
        'Custom integrations',
        'Dedicated account manager',
        'Custom reporting',
        'API access',
        'Multi-language support'
      ]
    };
    
    res.json({
      success: true,
      data: features
    });
  } catch (error) {
    console.error('Error fetching subscription features:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription features'
    });
  }
});

export default router;
