import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Check,
  AlertCircle,
  Loader2,
  Shield,
  Star,
  MessageSquare,
  FileText,
  Gift
} from 'lucide-react';
import { format } from 'date-fns';
import { designSystem } from '@/lib/design-system';

interface BookingItem {
  id: string;
  name: string;
  type: 'homestay' | 'driver' | 'restaurant' | 'service';
  price: number;
  image: string;
  rating: number;
  location: string;
  description: string;
  cancellationPolicy: string;
  amenities?: string[];
}

interface BookingDetails {
  item: BookingItem;
  dates: {
    checkIn: Date | undefined;
    checkOut: Date | undefined;
  };
  guests: {
    adults: number;
    children: number;
  };
  rooms?: number;
  duration?: number; // for services/drivers
  specialRequests: string;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  paymentMethod: string;
  promoCode: string;
  totalAmount: number;
  discount: number;
  taxes: number;
  finalAmount: number;
}

interface BookingFlowProps {
  item: BookingItem;
  onBookingComplete: (booking: BookingDetails) => void;
  onCancel: () => void;
}

export default function BookingFlow({ item, onBookingComplete, onCancel }: BookingFlowProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    item,
    dates: {
      checkIn: undefined,
      checkOut: undefined,
    },
    guests: {
      adults: 1,
      children: 0,
    },
    rooms: 1,
    duration: 1,
    specialRequests: '',
    contactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    paymentMethod: '',
    promoCode: '',
    totalAmount: 0,
    discount: 0,
    taxes: 0,
    finalAmount: 0,
  });

  // Calculate pricing whenever booking details change
  useEffect(() => {
    calculatePricing();
  }, [bookingDetails.dates, bookingDetails.guests, bookingDetails.rooms, bookingDetails.duration, bookingDetails.promoCode]);

  const calculatePricing = () => {
    let baseAmount = item.price;
    
    if (item.type === 'homestay') {
      const nights = bookingDetails.dates.checkIn && bookingDetails.dates.checkOut 
        ? Math.ceil((bookingDetails.dates.checkOut.getTime() - bookingDetails.dates.checkIn.getTime()) / (1000 * 60 * 60 * 24))
        : 1;
      baseAmount = item.price * nights * (bookingDetails.rooms || 1);
    } else if (item.type === 'driver' || item.type === 'service') {
      baseAmount = item.price * (bookingDetails.duration || 1);
    }

    // Apply guest multiplier for certain services
    if (item.type === 'restaurant' || item.type === 'service') {
      baseAmount = baseAmount * (bookingDetails.guests.adults + bookingDetails.guests.children);
    }

    // Calculate discount
    let discount = 0;
    if (bookingDetails.promoCode === 'WELCOME10') {
      discount = baseAmount * 0.1;
    } else if (bookingDetails.promoCode === 'SAVE20') {
      discount = baseAmount * 0.2;
    }

    // Calculate taxes (18% GST)
    const taxes = (baseAmount - discount) * 0.18;
    const finalAmount = baseAmount - discount + taxes;

    setBookingDetails(prev => ({
      ...prev,
      totalAmount: baseAmount,
      discount,
      taxes,
      finalAmount,
    }));
  };

  const handleInputChange = <K extends keyof BookingDetails>(
    key: K,
    value: BookingDetails[K]
  ) => {
    setBookingDetails(prev => ({ ...prev, [key]: value }));
  };

  const handleContactInfoChange = <K extends keyof BookingDetails['contactInfo']>(
    key: K,
    value: BookingDetails['contactInfo'][K]
  ) => {
    setBookingDetails(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [key]: value }
    }));
  };

  const handleDateChange = (type: 'checkIn' | 'checkOut', date: Date | undefined) => {
    setBookingDetails(prev => ({
      ...prev,
      dates: { ...prev.dates, [type]: date }
    }));
  };

  const handleGuestChange = (type: 'adults' | 'children', count: number) => {
    setBookingDetails(prev => ({
      ...prev,
      guests: { ...prev.guests, [type]: Math.max(0, count) }
    }));
  };

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        if (item.type === 'homestay') {
          return !!(bookingDetails.dates.checkIn && bookingDetails.dates.checkOut);
        }
        return true;
      case 2:
        return !!(
          bookingDetails.contactInfo.firstName &&
          bookingDetails.contactInfo.lastName &&
          bookingDetails.contactInfo.email &&
          bookingDetails.contactInfo.phone
        );
      case 3:
        return !!bookingDetails.paymentMethod;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setError('');
      setStep(step + 1);
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
    setError('');
  };

  const handleBookingSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulate API call to process booking
      const bookingPayload = {
        ...bookingDetails,
        bookingId: `BK${Date.now()}`,
        status: 'confirmed',
        createdAt: new Date(),
      };

      // Determine correct API endpoint based on item type
      let endpoint = '/api/bookings/homestay';
      if (item.type === 'driver' || item.category === 'Driver' || item.category === 'Transportation') {
        endpoint = '/api/bookings/driver';
      } else if (item.type === 'service' || item.category === 'Service') {
        endpoint = '/api/bookings/service';
      }

      // Send booking request
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Send confirmation email
        await sendConfirmationEmail(bookingPayload);
        
        onBookingComplete(bookingPayload);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Booking failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendConfirmationEmail = async (booking: any) => {
    try {
      await fetch('/api/notifications/booking-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: booking.contactInfo.email,
          bookingDetails: booking,
        }),
      });
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }
  };

  const applyPromoCode = () => {
    calculatePricing();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                stepNumber <= step 
                  ? 'border-blue-600 bg-blue-600 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {stepNumber < step ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  stepNumber < step ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Dates & Guests</span>
          <span>Contact Info</span>
          <span>Payment</span>
          <span>Confirmation</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Booking Form */}
        <div className="lg:col-span-2">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Dates and Guests */}
          {step === 1 && (
            <StepDatesAndGuests
              bookingDetails={bookingDetails}
              onDateChange={handleDateChange}
              onGuestChange={handleGuestChange}
              onInputChange={handleInputChange}
            />
          )}

          {/* Step 2: Contact Information */}
          {step === 2 && (
            <StepContactInfo
              bookingDetails={bookingDetails}
              onContactInfoChange={handleContactInfoChange}
              onInputChange={handleInputChange}
            />
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <StepPayment
              bookingDetails={bookingDetails}
              onInputChange={handleInputChange}
              onPromoCodeApply={applyPromoCode}
            />
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <StepConfirmation
              bookingDetails={bookingDetails}
              onSubmit={handleBookingSubmit}
              loading={loading}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={step === 1 ? onCancel : handlePrevious}
              disabled={loading}
            >
              {step === 1 ? 'Cancel' : 'Previous'}
            </Button>
            
            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!validateStep(step) || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleBookingSubmit}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Booking Summary Sidebar */}
        <div className="lg:col-span-1">
          <BookingSummary bookingDetails={bookingDetails} />
        </div>
      </div>
    </div>
  );
}

// Step Components
function StepDatesAndGuests({ bookingDetails, onDateChange, onGuestChange, onInputChange }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Dates and Guests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {bookingDetails.item.type === 'homestay' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingDetails.dates.checkIn ? format(bookingDetails.dates.checkIn, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={bookingDetails.dates.checkIn}
                    onSelect={(date) => onDateChange('checkIn', date)}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingDetails.dates.checkOut ? format(bookingDetails.dates.checkOut, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={bookingDetails.dates.checkOut}
                    onSelect={(date) => onDateChange('checkOut', date)}
                    disabled={(date) => date <= (bookingDetails.dates.checkIn || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Adults</Label>
            <div className="flex items-center mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onGuestChange('adults', bookingDetails.guests.adults - 1)}
                disabled={bookingDetails.guests.adults <= 1}
              >
                -
              </Button>
              <span className="mx-4 font-medium">{bookingDetails.guests.adults}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onGuestChange('adults', bookingDetails.guests.adults + 1)}
              >
                +
              </Button>
            </div>
          </div>
          
          <div>
            <Label>Children</Label>
            <div className="flex items-center mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onGuestChange('children', bookingDetails.guests.children - 1)}
                disabled={bookingDetails.guests.children <= 0}
              >
                -
              </Button>
              <span className="mx-4 font-medium">{bookingDetails.guests.children}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onGuestChange('children', bookingDetails.guests.children + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {bookingDetails.item.type === 'homestay' && (
            <div>
              <Label>Rooms</Label>
              <div className="flex items-center mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onInputChange('rooms', Math.max(1, (bookingDetails.rooms || 1) - 1))}
                  disabled={(bookingDetails.rooms || 1) <= 1}
                >
                  -
                </Button>
                <span className="mx-4 font-medium">{bookingDetails.rooms || 1}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onInputChange('rooms', (bookingDetails.rooms || 1) + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="special-requests">Special Requests</Label>
          <Textarea
            id="special-requests"
            placeholder="Any special requests or requirements..."
            value={bookingDetails.specialRequests}
            onChange={(e) => onInputChange('specialRequests', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StepContactInfo({ bookingDetails, onContactInfoChange }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={bookingDetails.contactInfo.firstName}
              onChange={(e) => onContactInfoChange('firstName', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={bookingDetails.contactInfo.lastName}
              onChange={(e) => onContactInfoChange('lastName', e.target.value)}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={bookingDetails.contactInfo.email}
            onChange={(e) => onContactInfoChange('email', e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={bookingDetails.contactInfo.phone}
            onChange={(e) => onContactInfoChange('phone', e.target.value)}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StepPayment({ bookingDetails, onInputChange, onPromoCodeApply }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Payment Method</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {['credit_card', 'debit_card', 'upi', 'wallet'].map((method) => (
              <Button
                key={method}
                variant={bookingDetails.paymentMethod === method ? 'default' : 'outline'}
                onClick={() => onInputChange('paymentMethod', method)}
                className="h-12"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {method.replace('_', ' ').toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="promo">Promo Code</Label>
          <div className="flex gap-2">
            <Input
              id="promo"
              placeholder="Enter promo code"
              value={bookingDetails.promoCode}
              onChange={(e) => onInputChange('promoCode', e.target.value)}
            />
            <Button variant="outline" onClick={onPromoCodeApply}>
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StepConfirmation({ bookingDetails, onSubmit, loading }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirm Your Booking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your booking is secured with our 24/7 customer support and flexible cancellation policy.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <h4 className="font-medium">Booking Details:</h4>
          <p><strong>Guest:</strong> {bookingDetails.contactInfo.firstName} {bookingDetails.contactInfo.lastName}</p>
          <p><strong>Email:</strong> {bookingDetails.contactInfo.email}</p>
          <p><strong>Phone:</strong> {bookingDetails.contactInfo.phone}</p>
          {bookingDetails.dates.checkIn && (
            <p><strong>Dates:</strong> {format(bookingDetails.dates.checkIn, 'PPP')} - {bookingDetails.dates.checkOut ? format(bookingDetails.dates.checkOut, 'PPP') : 'Same day'}</p>
          )}
          <p><strong>Guests:</strong> {bookingDetails.guests.adults} Adults, {bookingDetails.guests.children} Children</p>
        </div>

        <Separator />

        <div className="flex items-center space-x-2">
          <Checkbox id="terms" required />
          <Label htmlFor="terms" className="text-sm">
            I agree to the terms and conditions and cancellation policy
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}

// Booking Summary Component
function BookingSummary({ bookingDetails }: { bookingDetails: BookingDetails }) {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg">Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <img
            src={bookingDetails.item.image}
            alt={bookingDetails.item.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="font-medium">{bookingDetails.item.name}</h4>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="h-3 w-3 text-yellow-400 mr-1" />
              {bookingDetails.item.rating}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-3 w-3 mr-1" />
              {bookingDetails.item.location}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{bookingDetails.totalAmount.toLocaleString()}</span>
          </div>
          {bookingDetails.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{bookingDetails.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Taxes & Fees</span>
            <span>₹{bookingDetails.taxes.toLocaleString()}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium text-base">
            <span>Total</span>
            <span>₹{bookingDetails.finalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center text-blue-700 text-sm">
            <Gift className="h-4 w-4 mr-2" />
            <span>Free cancellation up to 24 hours before</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
