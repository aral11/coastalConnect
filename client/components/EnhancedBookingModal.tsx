import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import PaymentGateway, { PaymentSuccess, PaymentError } from './PaymentGateway';
import {
  Calendar,
  Users,
  CreditCard,
  CheckCircle,
  X,
  Star,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  ArrowRight,
  Home,
  Car,
  ChefHat,
  Loader2
} from 'lucide-react';

interface BookingService {
  id: number;
  name: string;
  type: 'homestay' | 'restaurant' | 'driver';
  price: number;
  location: string;
  rating?: number;
  image?: string;
  description?: string;
}

interface EnhancedBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: BookingService | null;
  onBookingComplete?: (bookingData: any) => void;
}

type BookingStep = 'details' | 'contact' | 'payment' | 'confirmation';

export default function EnhancedBookingModal({ 
  isOpen, 
  onClose, 
  service,
  onBookingComplete 
}: EnhancedBookingModalProps) {
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState<BookingStep>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  // Form data
  const [bookingData, setBookingData] = useState({
    // Common fields
    service_id: 0,
    service_type: 'homestay' as const,
    
    // Homestay specific
    check_in_date: '',
    check_out_date: '',
    guests: 2,
    rooms: 1,
    
    // Restaurant specific
    reservation_date: '',
    reservation_time: '',
    party_size: 2,
    
    // Driver specific
    pickup_date: '',
    pickup_time: '',
    pickup_location: '',
    dropoff_location: '',
    passengers: 2,
    
    // Contact details
    guest_name: user?.name || '',
    guest_email: user?.email || '',
    guest_phone: user?.phone || '',
    special_requests: '',
    
    // Payment
    total_amount: 0,
    base_amount: 0,
    tax_amount: 0,
    convenience_fee: 0
  });

  useEffect(() => {
    if (service && isOpen) {
      resetForm();
      calculateAmount();
    }
  }, [service, isOpen]);

  const resetForm = () => {
    setCurrentStep('details');
    setBookingComplete(false);
    setShowPayment(false);
    setError(null);
    setPaymentData(null);
    setBookingReference('');
    
    setBookingData(prev => ({
      ...prev,
      service_id: service?.id || 0,
      service_type: service?.type || 'homestay',
      guest_name: user?.name || '',
      guest_email: user?.email || '',
      guest_phone: user?.phone || ''
    }));
  };

  const calculateAmount = () => {
    if (!service) return;

    let baseAmount = service.price;
    
    // Calculate based on service type
    if (service.type === 'homestay') {
      const days = calculateDays();
      baseAmount = service.price * days * bookingData.rooms;
    } else if (service.type === 'restaurant') {
      baseAmount = service.price * bookingData.party_size;
    } else if (service.type === 'driver') {
      baseAmount = service.price; // Fixed rate or calculated based on distance
    }

    const taxAmount = Math.round(baseAmount * 0.18); // 18% GST
    const convenienceFee = Math.round(baseAmount * 0.02); // 2% convenience fee
    const totalAmount = baseAmount + taxAmount + convenienceFee;

    setBookingData(prev => ({
      ...prev,
      base_amount: baseAmount,
      tax_amount: taxAmount,
      convenience_fee: convenienceFee,
      total_amount: totalAmount
    }));
  };

  const calculateDays = () => {
    if (!bookingData.check_in_date || !bookingData.check_out_date) return 1;
    const checkIn = new Date(bookingData.check_in_date);
    const checkOut = new Date(bookingData.check_out_date);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const nextStep = () => {
    if (currentStep === 'details') {
      calculateAmount();
      setCurrentStep('contact');
    } else if (currentStep === 'contact') {
      setCurrentStep('payment');
    }
  };

  const prevStep = () => {
    if (currentStep === 'contact') {
      setCurrentStep('details');
    } else if (currentStep === 'payment') {
      setCurrentStep('contact');
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 'details':
        if (service?.type === 'homestay') {
          return bookingData.check_in_date && bookingData.check_out_date;
        } else if (service?.type === 'restaurant') {
          return bookingData.reservation_date && bookingData.reservation_time;
        } else if (service?.type === 'driver') {
          return bookingData.pickup_date && bookingData.pickup_time && 
                 bookingData.pickup_location && bookingData.dropoff_location;
        }
        return false;
      case 'contact':
        return bookingData.guest_name && bookingData.guest_email && bookingData.guest_phone;
      case 'payment':
        return true;
      default:
        return false;
    }
  };

  const createBooking = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/professional-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          ...bookingData,
          service_name: service?.name,
          service_location: service?.location
        })
      });

      const data = await response.json();

      if (data.success) {
        setBookingReference(data.data.booking_reference);
        setShowPayment(true);
        return data.data.booking_reference;
      } else {
        throw new Error(data.message || 'Failed to create booking');
      }
    } catch (error) {
      setError(error.message || 'Failed to create booking');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentResult: any) => {
    setPaymentData(paymentResult);
    setShowPayment(false);
    setBookingComplete(true);
    
    // Call the completion callback
    if (onBookingComplete) {
      onBookingComplete({
        booking_reference: bookingReference,
        payment_data: paymentResult,
        service: service,
        booking_details: bookingData
      });
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(`Payment failed: ${errorMessage}`);
    setShowPayment(false);
  };

  const handleStartPayment = async () => {
    const bookingRef = await createBooking();
    if (bookingRef) {
      // Booking created successfully, payment component will show
    }
  };

  const getServiceIcon = () => {
    switch (service?.type) {
      case 'homestay': return <Home className="h-5 w-5 text-orange-600" />;
      case 'restaurant': return <ChefHat className="h-5 w-5 text-orange-600" />;
      case 'driver': return <Car className="h-5 w-5 text-orange-600" />;
      default: return <Calendar className="h-5 w-5 text-orange-600" />;
    }
  };

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          {getServiceIcon()}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{service?.name}</h3>
          <p className="text-sm text-gray-600">{service?.location}</p>
        </div>
      </div>

      {service?.type === 'homestay' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="check_in">Check-in Date</Label>
            <Input
              id="check_in"
              type="date"
              value={bookingData.check_in_date}
              onChange={(e) => setBookingData(prev => ({ ...prev, check_in_date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label htmlFor="check_out">Check-out Date</Label>
            <Input
              id="check_out"
              type="date"
              value={bookingData.check_out_date}
              onChange={(e) => setBookingData(prev => ({ ...prev, check_out_date: e.target.value }))}
              min={bookingData.check_in_date || new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label htmlFor="guests">Guests</Label>
            <Input
              id="guests"
              type="number"
              min="1"
              max="10"
              value={bookingData.guests}
              onChange={(e) => setBookingData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="rooms">Rooms</Label>
            <Input
              id="rooms"
              type="number"
              min="1"
              max="5"
              value={bookingData.rooms}
              onChange={(e) => setBookingData(prev => ({ ...prev, rooms: parseInt(e.target.value) }))}
            />
          </div>
        </div>
      )}

      {service?.type === 'restaurant' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reservation_date">Reservation Date</Label>
            <Input
              id="reservation_date"
              type="date"
              value={bookingData.reservation_date}
              onChange={(e) => setBookingData(prev => ({ ...prev, reservation_date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label htmlFor="reservation_time">Time</Label>
            <Input
              id="reservation_time"
              type="time"
              value={bookingData.reservation_time}
              onChange={(e) => setBookingData(prev => ({ ...prev, reservation_time: e.target.value }))}
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="party_size">Party Size</Label>
            <Input
              id="party_size"
              type="number"
              min="1"
              max="20"
              value={bookingData.party_size}
              onChange={(e) => setBookingData(prev => ({ ...prev, party_size: parseInt(e.target.value) }))}
            />
          </div>
        </div>
      )}

      {service?.type === 'driver' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pickup_date">Pickup Date</Label>
              <Input
                id="pickup_date"
                type="date"
                value={bookingData.pickup_date}
                onChange={(e) => setBookingData(prev => ({ ...prev, pickup_date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="pickup_time">Pickup Time</Label>
              <Input
                id="pickup_time"
                type="time"
                value={bookingData.pickup_time}
                onChange={(e) => setBookingData(prev => ({ ...prev, pickup_time: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="pickup_location">Pickup Location</Label>
            <Input
              id="pickup_location"
              placeholder="Enter pickup address"
              value={bookingData.pickup_location}
              onChange={(e) => setBookingData(prev => ({ ...prev, pickup_location: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="dropoff_location">Drop-off Location</Label>
            <Input
              id="dropoff_location"
              placeholder="Enter destination address"
              value={bookingData.dropoff_location}
              onChange={(e) => setBookingData(prev => ({ ...prev, dropoff_location: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="passengers">Number of Passengers</Label>
            <Input
              id="passengers"
              type="number"
              min="1"
              max="8"
              value={bookingData.passengers}
              onChange={(e) => setBookingData(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderContactStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contact Information</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="guest_name">Full Name</Label>
          <Input
            id="guest_name"
            value={bookingData.guest_name}
            onChange={(e) => setBookingData(prev => ({ ...prev, guest_name: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="guest_email">Email Address</Label>
          <Input
            id="guest_email"
            type="email"
            value={bookingData.guest_email}
            onChange={(e) => setBookingData(prev => ({ ...prev, guest_email: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="guest_phone">Phone Number</Label>
          <Input
            id="guest_phone"
            type="tel"
            value={bookingData.guest_phone}
            onChange={(e) => setBookingData(prev => ({ ...prev, guest_phone: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="special_requests">Special Requests (Optional)</Label>
          <Textarea
            id="special_requests"
            placeholder="Any special requirements or requests..."
            value={bookingData.special_requests}
            onChange={(e) => setBookingData(prev => ({ ...prev, special_requests: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Payment Summary</h3>
      
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Base Amount</span>
              <span>₹{bookingData.base_amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Taxes & Fees</span>
              <span>₹{(bookingData.tax_amount + bookingData.convenience_fee).toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span>₹{bookingData.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleStartPayment}
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600"
        size="lg"
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Creating Booking...</span>
          </div>
        ) : (
          `Proceed to Pay ₹${bookingData.total_amount.toLocaleString()}`
        )}
      </Button>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-6">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
        <p className="text-gray-600">Your booking has been successfully processed.</p>
      </div>
      
      <Card>
        <CardContent className="p-4 text-left">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Booking Reference:</span>
              <span className="font-mono text-orange-600">{bookingReference}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Payment ID:</span>
              <span className="font-mono">{paymentData?.payment_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount Paid:</span>
              <span className="font-semibold">₹{bookingData.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button onClick={onClose} className="w-full">
          Done
        </Button>
        <p className="text-xs text-gray-500">
          Confirmation details have been sent to {bookingData.guest_email}
        </p>
      </div>
    </div>
  );

  const renderStepContent = () => {
    if (showPayment) {
      return (
        <PaymentGateway
          amount={bookingData.total_amount}
          currency="INR"
          bookingId={bookingReference}
          description={`${service?.type} booking - ${service?.name}`}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onCancel={() => setShowPayment(false)}
        />
      );
    }

    if (bookingComplete) {
      return renderConfirmation();
    }

    switch (currentStep) {
      case 'details':
        return renderDetailsStep();
      case 'contact':
        return renderContactStep();
      case 'payment':
        return renderPaymentStep();
      default:
        return null;
    }
  };

  const getStepNumber = (step: BookingStep) => {
    const steps = ['details', 'contact', 'payment'];
    return steps.indexOf(step) + 1;
  };

  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              {getServiceIcon()}
            </div>
            <div>
              <div className="text-lg font-semibold">{service.name}</div>
              <div className="text-sm text-gray-600 font-normal">{service.location}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        {!bookingComplete && !showPayment && (
          <div className="flex items-center justify-between mb-6">
            {['details', 'contact', 'payment'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  getStepNumber(currentStep) > index + 1 ? 'bg-green-500 text-white' :
                  getStepNumber(currentStep) === index + 1 ? 'bg-orange-500 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {getStepNumber(currentStep) > index + 1 ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    getStepNumber(currentStep) > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {renderStepContent()}

        {/* Action Buttons */}
        {!bookingComplete && !showPayment && (
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={currentStep === 'details' ? onClose : prevStep}
              disabled={loading}
            >
              {currentStep === 'details' ? 'Cancel' : 'Back'}
            </Button>

            {currentStep !== 'payment' && (
              <Button
                onClick={nextStep}
                disabled={!validateStep() || loading}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
