import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, MapPin, Phone, Mail, CreditCard, Check, X, AlertCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

interface BookingFlowProps {
  serviceType: 'homestay' | 'restaurant' | 'driver' | 'event' | 'creator';
  serviceId: number;
  serviceDetails: {
    name: string;
    image: string;
    location: string;
    rating: number;
    reviews: number;
    basePrice: number;
    features: string[];
    contact?: string;
    policies?: string[];
  };
  onBookingComplete?: (bookingData: any) => void;
  onCancel?: () => void;
}

export default function ProfessionalBookingFlow({
  serviceType,
  serviceId,
  serviceDetails,
  onBookingComplete,
  onCancel
}: BookingFlowProps) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<any>({});
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pricing, setPricing] = useState({
    baseAmount: serviceDetails.basePrice,
    taxes: 0,
    discount: 0,
    total: serviceDetails.basePrice
  });

  const steps = [
    'Details',
    'Timing',
    'Contact',
    'Payment',
    'Confirmation'
  ];

  // Calculate pricing based on booking details
  useEffect(() => {
    calculatePricing();
  }, [bookingData, couponApplied]);

  const calculatePricing = () => {
    let baseAmount = serviceDetails.basePrice;
    
    // Apply service-specific pricing logic
    switch (serviceType) {
      case 'homestay':
        if (bookingData.checkInDate && bookingData.checkOutDate) {
          const nights = Math.ceil((new Date(bookingData.checkOutDate).getTime() - new Date(bookingData.checkInDate).getTime()) / (1000 * 60 * 60 * 24));
          baseAmount = serviceDetails.basePrice * nights * (bookingData.guests || 1);
        }
        break;
      case 'restaurant':
        baseAmount = serviceDetails.basePrice * (bookingData.partySize || 1);
        break;
      case 'driver':
        // Distance-based pricing would be implemented here
        baseAmount = serviceDetails.basePrice;
        break;
      case 'event':
        baseAmount = serviceDetails.basePrice * (bookingData.ticketQuantity || 1);
        break;
      case 'creator':
        baseAmount = serviceDetails.basePrice * (bookingData.sessionDuration || 1);
        break;
    }

    const taxes = Math.round(baseAmount * 0.18); // 18% GST
    const discount = couponApplied ? Math.round(baseAmount * 0.1) : 0; // 10% discount
    const total = baseAmount + taxes - discount;

    setPricing({ baseAmount, taxes, discount, total });
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Details
        return validateDetails();
      case 1: // Timing
        return validateTiming();
      case 2: // Contact
        return validateContact();
      case 3: // Payment
        return validatePayment();
      default:
        return true;
    }
  };

  const validateDetails = (): boolean => {
    switch (serviceType) {
      case 'homestay':
        return !!(bookingData.guests && bookingData.guests > 0);
      case 'restaurant':
        return !!(bookingData.partySize && bookingData.partySize > 0);
      case 'event':
        return !!(bookingData.ticketQuantity && bookingData.ticketQuantity > 0);
      default:
        return true;
    }
  };

  const validateTiming = (): boolean => {
    switch (serviceType) {
      case 'homestay':
        return !!(bookingData.checkInDate && bookingData.checkOutDate);
      case 'restaurant':
        return !!(bookingData.reservationDate && bookingData.reservationTime);
      case 'driver':
        return !!(bookingData.pickupDateTime);
      case 'event':
        return true; // Event date is fixed
      case 'creator':
        return !!(bookingData.sessionDateTime);
      default:
        return true;
    }
  };

  const validateContact = (): boolean => {
    return !!(bookingData.customerName && bookingData.customerPhone && bookingData.customerEmail);
  };

  const validatePayment = (): boolean => {
    return !!paymentMethod;
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      setLoading(true);
      // Simulate coupon validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (couponCode.toUpperCase() === 'WELCOME10') {
        setCouponApplied(true);
        setError('');
      } else {
        setError('Invalid coupon code');
      }
    } catch (error) {
      setError('Failed to apply coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: location.pathname } });
      return;
    }

    try {
      setLoading(true);
      setError('');

      const bookingRequest = {
        serviceType,
        serviceId,
        bookingDetails: bookingData,
        paymentAmount: pricing.total,
        paymentMethod,
        couponCode: couponApplied ? couponCode : undefined,
        specialRequests
      };

      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingRequest)
      });

      const result = await response.json();

      if (result.success) {
        setCurrentStep(steps.length - 1); // Go to confirmation step
        onBookingComplete?.(result.data);
      } else {
        setError(result.message || 'Booking failed');
      }

    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderDetailsStep();
      case 1:
        return renderTimingStep();
      case 2:
        return renderContactStep();
      case 3:
        return renderPaymentStep();
      case 4:
        return renderConfirmationStep();
      default:
        return null;
    }
  };

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Details</h2>
        <p className="text-gray-600">Please provide your booking requirements</p>
      </div>

      {serviceType === 'homestay' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="guests">Number of Guests</Label>
            <Select value={bookingData.guests?.toString()} onValueChange={(value) => setBookingData({...bookingData, guests: parseInt(value)})}>
              <SelectTrigger>
                <SelectValue placeholder="Select guests" />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num} Guest{num > 1 ? 's' : ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="roomType">Room Preference</Label>
            <Select value={bookingData.roomType} onValueChange={(value) => setBookingData({...bookingData, roomType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Room</SelectItem>
                <SelectItem value="deluxe">Deluxe Room</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {serviceType === 'restaurant' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="partySize">Party Size</Label>
            <Select value={bookingData.partySize?.toString()} onValueChange={(value) => setBookingData({...bookingData, partySize: parseInt(value)})}>
              <SelectTrigger>
                <SelectValue placeholder="Select party size" />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num} Person{num > 1 ? 's' : ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tablePreference">Table Preference</Label>
            <Select value={bookingData.tablePreference} onValueChange={(value) => setBookingData({...bookingData, tablePreference: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="window">Window Seat</SelectItem>
                <SelectItem value="private">Private Table</SelectItem>
                <SelectItem value="outdoor">Outdoor Seating</SelectItem>
                <SelectItem value="bar">Bar Counter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {serviceType === 'event' && (
        <div>
          <Label htmlFor="ticketQuantity">Number of Tickets</Label>
          <Select value={bookingData.ticketQuantity?.toString()} onValueChange={(value) => setBookingData({...bookingData, ticketQuantity: parseInt(value)})}>
            <SelectTrigger>
              <SelectValue placeholder="Select tickets" />
            </SelectTrigger>
            <SelectContent>
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <SelectItem key={num} value={num.toString()}>{num} Ticket{num > 1 ? 's' : ''}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {serviceType === 'creator' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sessionType">Session Type</Label>
            <Select value={bookingData.sessionType} onValueChange={(value) => setBookingData({...bookingData, sessionType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">Portrait Photography</SelectItem>
                <SelectItem value="wedding">Wedding Photography</SelectItem>
                <SelectItem value="event">Event Photography</SelectItem>
                <SelectItem value="product">Product Photography</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sessionDuration">Session Duration (hours)</Label>
            <Select value={bookingData.sessionDuration?.toString()} onValueChange={(value) => setBookingData({...bookingData, sessionDuration: parseInt(value)})}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Hour</SelectItem>
                <SelectItem value="2">2 Hours</SelectItem>
                <SelectItem value="4">4 Hours</SelectItem>
                <SelectItem value="8">Full Day (8 Hours)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {serviceType === 'driver' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="pickupLocation">Pickup Location</Label>
            <Input
              id="pickupLocation"
              value={bookingData.pickupLocation || ''}
              onChange={(e) => setBookingData({...bookingData, pickupLocation: e.target.value})}
              placeholder="Enter pickup address"
            />
          </div>
          <div>
            <Label htmlFor="dropoffLocation">Drop-off Location</Label>
            <Input
              id="dropoffLocation"
              value={bookingData.dropoffLocation || ''}
              onChange={(e) => setBookingData({...bookingData, dropoffLocation: e.target.value})}
              placeholder="Enter destination address"
            />
          </div>
          <div>
            <Label htmlFor="passengersCount">Number of Passengers</Label>
            <Select value={bookingData.passengersCount?.toString()} onValueChange={(value) => setBookingData({...bookingData, passengersCount: parseInt(value)})}>
              <SelectTrigger>
                <SelectValue placeholder="Select passengers" />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num} Passenger{num > 1 ? 's' : ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );

  const renderTimingStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
        <p className="text-gray-600">Choose your preferred timing</p>
      </div>

      {serviceType === 'homestay' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="checkIn">Check-in Date</Label>
            <Input
              id="checkIn"
              type="date"
              value={bookingData.checkInDate || ''}
              onChange={(e) => setBookingData({...bookingData, checkInDate: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label htmlFor="checkOut">Check-out Date</Label>
            <Input
              id="checkOut"
              type="date"
              value={bookingData.checkOutDate || ''}
              onChange={(e) => setBookingData({...bookingData, checkOutDate: e.target.value})}
              min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      )}

      {serviceType === 'restaurant' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reservationDate">Reservation Date</Label>
            <Input
              id="reservationDate"
              type="date"
              value={bookingData.reservationDate || ''}
              onChange={(e) => setBookingData({...bookingData, reservationDate: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label htmlFor="reservationTime">Reservation Time</Label>
            <Select value={bookingData.reservationTime} onValueChange={(value) => setBookingData({...bookingData, reservationTime: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map(time => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {(serviceType === 'driver' || serviceType === 'creator') && (
        <div>
          <Label htmlFor="dateTime">Date & Time</Label>
          <Input
            id="dateTime"
            type="datetime-local"
            value={serviceType === 'driver' ? bookingData.pickupDateTime : bookingData.sessionDateTime}
            onChange={(e) => setBookingData({
              ...bookingData, 
              [serviceType === 'driver' ? 'pickupDateTime' : 'sessionDateTime']: e.target.value
            })}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>
      )}
    </div>
  );

  const renderContactStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
        <p className="text-gray-600">We'll use this information to confirm your booking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customerName">Full Name</Label>
          <Input
            id="customerName"
            value={bookingData.customerName || user?.name || ''}
            onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})}
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <Label htmlFor="customerPhone">Phone Number</Label>
          <Input
            id="customerPhone"
            value={bookingData.customerPhone || ''}
            onChange={(e) => setBookingData({...bookingData, customerPhone: e.target.value})}
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="customerEmail">Email Address</Label>
        <Input
          id="customerEmail"
          type="email"
          value={bookingData.customerEmail || user?.email || ''}
          onChange={(e) => setBookingData({...bookingData, customerEmail: e.target.value})}
          placeholder="john@example.com"
        />
      </div>

      <div>
        <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
        <Textarea
          id="specialRequests"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Any special requirements or requests..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment & Confirmation</h2>
        <p className="text-gray-600">Review your booking and complete payment</p>
      </div>

      {/* Pricing Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Base Amount</span>
            <span>₹{pricing.baseAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes & Fees</span>
            <span>₹{pricing.taxes}</span>
          </div>
          {couponApplied && (
            <div className="flex justify-between text-green-600">
              <span>Discount Applied</span>
              <span>-₹{pricing.discount}</span>
            </div>
          )}
          <hr />
          <div className="flex justify-between font-bold text-lg">
            <span>Total Amount</span>
            <span>₹{pricing.total}</span>
          </div>
        </CardContent>
      </Card>

      {/* Coupon Code */}
      <div className="flex gap-2">
        <Input
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          disabled={couponApplied}
        />
        <Button 
          onClick={applyCoupon} 
          disabled={couponApplied || loading}
          variant="outline"
        >
          {couponApplied ? <Check className="h-4 w-4" /> : 'Apply'}
        </Button>
      </div>

      {/* Payment Method */}
      <div>
        <Label>Payment Method</Label>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online" id="online" />
            <Label htmlFor="online">Pay Online (Recommended)</Label>
            <Badge variant="secondary">Instant Confirmation</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash">Pay at Venue</Label>
          </div>
        </RadioGroup>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">Your booking has been successfully created</p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 text-left">
            <div className="flex justify-between">
              <span>Booking Reference:</span>
              <span className="font-bold">CC123456789</span>
            </div>
            <div className="flex justify-between">
              <span>Service:</span>
              <span>{serviceDetails.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Paid:</span>
              <span className="font-bold">₹{pricing.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge>Confirmed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Button onClick={() => navigate('/dashboard')} className="w-full">
          View My Bookings
        </Button>
        <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
          Make Another Booking
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Service Details Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <img 
              src={serviceDetails.image} 
              alt={serviceDetails.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg">{serviceDetails.name}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <MapPin className="h-4 w-4 mr-1" />
                {serviceDetails.location}
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm">{serviceDetails.rating} ({serviceDetails.reviews} reviews)</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">₹{serviceDetails.basePrice}</div>
              <div className="text-sm text-gray-600">per {serviceType === 'homestay' ? 'night' : serviceType === 'event' ? 'ticket' : 'service'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div 
              key={step}
              className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index <= currentStep ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className={`ml-2 text-sm ${index <= currentStep ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                {step}
              </span>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-px mx-4 ${index < currentStep ? 'bg-orange-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      {currentStep < steps.length - 1 && (
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onCancel || handlePrevious}
            disabled={currentStep === 0}
          >
            {currentStep === 0 ? 'Cancel' : 'Previous'}
          </Button>
          
          {currentStep === steps.length - 2 ? (
            <Button 
              onClick={handleBooking} 
              disabled={loading || !validateCurrentStep()}
              className="min-w-32"
            >
              {loading ? 'Processing...' : `Pay ₹${pricing.total}`}
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              disabled={!validateCurrentStep()}
            >
              Continue
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
