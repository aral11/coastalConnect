/**
 * CoastalConnect - Swiggy/Zomato Style Booking Flow
 * Modern, intuitive multi-step booking process
 */

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
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { trackEvent } from '@/lib/supabase';
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
  Gift,
  ArrowRight,
  ArrowLeft,
  Zap,
  Award,
  Timer,
  CheckCircle,
  Home,
  Car,
  Utensils,
  Camera,
  Music,
  Crown,
  Percent,
  Lock,
  Smartphone,
  Copy,
  Share2,
  Download,
  Eye,
  Calendar as CalIcon,
  Globe,
  Shield as ShieldIcon,
} from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';

interface BookingItem {
  id: string;
  name: string;
  type: 'homestay' | 'driver' | 'restaurant' | 'event' | 'creator';
  price: number;
  image: string;
  rating: number;
  location: string;
  description: string;
  cancellationPolicy: string;
  amenities?: string[];
  vendor?: {
    name: string;
    verified: boolean;
    responseTime: string;
  };
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
  duration?: number;
  timeSlot?: string;
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
  bookingReference?: string;
}

interface SwiggyStyleBookingFlowProps {
  item: BookingItem;
  onBookingComplete: (booking: BookingDetails) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const steps = [
  { id: 1, title: "Select Dates", subtitle: "When would you like to book?" },
  { id: 2, title: "Guest Details", subtitle: "Who's coming along?" },
  { id: 3, title: "Contact Info", subtitle: "How can we reach you?" },
  { id: 4, title: "Payment", subtitle: "Secure your booking" },
  { id: 5, title: "Confirmation", subtitle: "You're all set!" },
];

export default function SwiggyStyleBookingFlow({
  item,
  onBookingComplete,
  onCancel,
  isOpen
}: SwiggyStyleBookingFlowProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

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
    timeSlot: '',
    specialRequests: '',
    contactInfo: {
      firstName: user?.user_metadata?.firstName || '',
      lastName: user?.user_metadata?.lastName || '',
      email: user?.email || '',
      phone: user?.user_metadata?.phone || '',
    },
    paymentMethod: '',
    promoCode: '',
    totalAmount: 0,
    discount: 0,
    taxes: 0,
    finalAmount: 0,
  });

  useEffect(() => {
    calculateTotalAmount();
  }, [bookingDetails.dates, bookingDetails.guests, bookingDetails.rooms, bookingDetails.duration, bookingDetails.promoCode]);

  const calculateTotalAmount = () => {
    let baseAmount = item.price;
    
    if (item.type === 'homestay' && bookingDetails.dates.checkIn && bookingDetails.dates.checkOut) {
      const nights = differenceInDays(bookingDetails.dates.checkOut, bookingDetails.dates.checkIn);
      baseAmount = item.price * nights * (bookingDetails.rooms || 1);
    } else if (item.type === 'driver') {
      baseAmount = item.price * (bookingDetails.duration || 1);
    } else if (item.type === 'restaurant') {
      baseAmount = item.price * (bookingDetails.guests.adults + bookingDetails.guests.children);
    }

    const taxes = baseAmount * 0.18; // 18% GST
    let discount = 0;

    // Apply promo discount
    if (bookingDetails.promoCode && promoApplied) {
      if (bookingDetails.promoCode === 'WELCOME25') {
        discount = baseAmount * 0.25;
      } else if (bookingDetails.promoCode === 'FIRST10') {
        discount = baseAmount * 0.10;
      }
    }

    const finalAmount = baseAmount + taxes - discount;

    setBookingDetails(prev => ({
      ...prev,
      totalAmount: baseAmount,
      taxes,
      discount,
      finalAmount: Math.max(0, finalAmount),
    }));
  };

  const applyPromoCode = () => {
    const validCodes = ['WELCOME25', 'FIRST10', 'COASTAL20'];
    if (validCodes.includes(bookingDetails.promoCode)) {
      setPromoApplied(true);
      setError('');
    } else {
      setError('Invalid promo code');
      setPromoApplied(false);
    }
  };

  const handleNextStep = async () => {
    if (step === 4) {
      await handleBookingSubmit();
    } else {
      setStep(step + 1);
      await trackEvent('booking_step_completed', {
        step,
        service_id: item.id,
        user_id: user?.id,
      });
    }
  };

  const handleBackStep = () => {
    setStep(step - 1);
  };

  const handleBookingSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Generate booking reference
      const bookingRef = `CC${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
      
      const finalBooking = {
        ...bookingDetails,
        bookingReference: bookingRef,
      };

      // Track successful booking
      await trackEvent('booking_completed', {
        service_id: item.id,
        service_type: item.type,
        amount: bookingDetails.finalAmount,
        user_id: user?.id,
        booking_reference: bookingRef,
      });

      setBookingDetails(finalBooking);
      setStep(5);
      
      // Simulate API call
      setTimeout(() => {
        onBookingComplete(finalBooking);
      }, 1000);

    } catch (error) {
      console.error('Booking error:', error);
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = () => {
    switch (item.type) {
      case 'homestay': return <Home className="h-5 w-5" />;
      case 'driver': return <Car className="h-5 w-5" />;
      case 'restaurant': return <Utensils className="h-5 w-5" />;
      case 'event': return <Music className="h-5 w-5" />;
      case 'creator': return <Camera className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getServiceIcon()}
              <div>
                <h2 className="text-2xl font-bold">{item.name}</h2>
                <div className="flex items-center space-x-2 text-orange-100">
                  <MapPin className="h-4 w-4" />
                  <span>{item.location}</span>
                  <Star className="h-4 w-4 fill-current" />
                  <span>{item.rating}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center">
            {steps.map((stepItem, index) => (
              <div key={stepItem.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step >= stepItem.id
                    ? 'bg-white text-orange-500'
                    : 'bg-white/20 text-white'
                }`}>
                  {step > stepItem.id ? <Check className="h-5 w-5" /> : stepItem.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 transition-all duration-300 ${
                    step > stepItem.id ? 'bg-white' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <h3 className="text-lg font-semibold">{steps[step - 1]?.title}</h3>
            <p className="text-orange-100 text-sm">{steps[step - 1]?.subtitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-200px)]">
          {/* Main Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Check-in Date */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                      {item.type === 'homestay' ? 'Check-in Date' : 'Date'}
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left h-12 rounded-xl">
                          <CalendarIcon className="mr-3 h-5 w-5 text-orange-500" />
                          {bookingDetails.dates.checkIn ? (
                            format(bookingDetails.dates.checkIn, "PPP")
                          ) : (
                            <span className="text-gray-500">Select date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={bookingDetails.dates.checkIn}
                          onSelect={(date) => setBookingDetails(prev => ({
                            ...prev,
                            dates: { ...prev.dates, checkIn: date }
                          }))}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Check-out Date (only for homestays) */}
                  {item.type === 'homestay' && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                        Check-out Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left h-12 rounded-xl">
                            <CalendarIcon className="mr-3 h-5 w-5 text-orange-500" />
                            {bookingDetails.dates.checkOut ? (
                              format(bookingDetails.dates.checkOut, "PPP")
                            ) : (
                              <span className="text-gray-500">Select date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={bookingDetails.dates.checkOut}
                            onSelect={(date) => setBookingDetails(prev => ({
                              ...prev,
                              dates: { ...prev.dates, checkOut: date }
                            }))}
                            disabled={(date) => date <= (bookingDetails.dates.checkIn || new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}

                  {/* Time Slot (for restaurants/events) */}
                  {(item.type === 'restaurant' || item.type === 'event') && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                        Time Slot
                      </Label>
                      <Select value={bookingDetails.timeSlot} onValueChange={(value) => 
                        setBookingDetails(prev => ({ ...prev, timeSlot: value }))}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {item.type === 'restaurant' ? (
                            <>
                              <SelectItem value="12:00">12:00 PM</SelectItem>
                              <SelectItem value="13:00">1:00 PM</SelectItem>
                              <SelectItem value="19:00">7:00 PM</SelectItem>
                              <SelectItem value="20:00">8:00 PM</SelectItem>
                              <SelectItem value="21:00">9:00 PM</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="morning">Morning (9:00 AM - 12:00 PM)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (2:00 PM - 5:00 PM)</SelectItem>
                              <SelectItem value="evening">Evening (6:00 PM - 9:00 PM)</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Duration (for drivers/creators) */}
                  {(item.type === 'driver' || item.type === 'creator') && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                        Duration (hours)
                      </Label>
                      <Select value={bookingDetails.duration?.toString()} onValueChange={(value) => 
                        setBookingDetails(prev => ({ ...prev, duration: parseInt(value) }))}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 6, 8, 12].map(hours => (
                            <SelectItem key={hours} value={hours.toString()}>
                              {hours} hour{hours > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Quick Date Options */}
                <div>
                  <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                    Quick Options
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Today', date: new Date() },
                      { label: 'Tomorrow', date: addDays(new Date(), 1) },
                      { label: 'This Weekend', date: addDays(new Date(), 2) },
                      { label: 'Next Week', date: addDays(new Date(), 7) }
                    ].map((option) => (
                      <Button
                        key={option.label}
                        variant="outline"
                        onClick={() => setBookingDetails(prev => ({
                          ...prev,
                          dates: { ...prev.dates, checkIn: option.date }
                        }))}
                        className="h-12 rounded-xl border-2 hover:border-orange-500 hover:text-orange-500"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Adults */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                      Adults
                    </Label>
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                      <span className="text-gray-700">Adults (13+ years)</span>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBookingDetails(prev => ({
                            ...prev,
                            guests: { ...prev.guests, adults: Math.max(1, prev.guests.adults - 1) }
                          }))}
                          className="w-8 h-8 rounded-full"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-semibold">{bookingDetails.guests.adults}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBookingDetails(prev => ({
                            ...prev,
                            guests: { ...prev.guests, adults: prev.guests.adults + 1 }
                          }))}
                          className="w-8 h-8 rounded-full"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Children */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                      Children
                    </Label>
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                      <span className="text-gray-700">Children (2-12 years)</span>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBookingDetails(prev => ({
                            ...prev,
                            guests: { ...prev.guests, children: Math.max(0, prev.guests.children - 1) }
                          }))}
                          className="w-8 h-8 rounded-full"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-semibold">{bookingDetails.guests.children}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBookingDetails(prev => ({
                            ...prev,
                            guests: { ...prev.guests, children: prev.guests.children + 1 }
                          }))}
                          className="w-8 h-8 rounded-full"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Rooms (for homestays) */}
                  {item.type === 'homestay' && (
                    <div className="md:col-span-2">
                      <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                        Rooms
                      </Label>
                      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                        <span className="text-gray-700">Number of rooms</span>
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setBookingDetails(prev => ({
                              ...prev,
                              rooms: Math.max(1, (prev.rooms || 1) - 1)
                            }))}
                            className="w-8 h-8 rounded-full"
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-semibold">{bookingDetails.rooms}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setBookingDetails(prev => ({
                              ...prev,
                              rooms: (prev.rooms || 1) + 1
                            }))}
                            className="w-8 h-8 rounded-full"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Special Requests */}
                <div>
                  <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                    Special Requests (Optional)
                  </Label>
                  <Textarea
                    value={bookingDetails.specialRequests}
                    onChange={(e) => setBookingDetails(prev => ({
                      ...prev,
                      specialRequests: e.target.value
                    }))}
                    placeholder="Any special requirements or preferences..."
                    className="rounded-xl resize-none"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-2 block">
                      First Name *
                    </Label>
                    <Input
                      value={bookingDetails.contactInfo.firstName}
                      onChange={(e) => setBookingDetails(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, firstName: e.target.value }
                      }))}
                      className="h-12 rounded-xl"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-2 block">
                      Last Name *
                    </Label>
                    <Input
                      value={bookingDetails.contactInfo.lastName}
                      onChange={(e) => setBookingDetails(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, lastName: e.target.value }
                      }))}
                      className="h-12 rounded-xl"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-2 block">
                      Email Address *
                    </Label>
                    <Input
                      type="email"
                      value={bookingDetails.contactInfo.email}
                      onChange={(e) => setBookingDetails(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, email: e.target.value }
                      }))}
                      className="h-12 rounded-xl"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-2 block">
                      Phone Number *
                    </Label>
                    <Input
                      type="tel"
                      value={bookingDetails.contactInfo.phone}
                      onChange={(e) => setBookingDetails(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, phone: e.target.value }
                      }))}
                      className="h-12 rounded-xl"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                {/* Contact Preferences */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Smartphone className="h-5 w-5 mr-2 text-blue-500" />
                    Communication Preferences
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <Checkbox defaultChecked />
                      <span className="ml-3 text-sm text-gray-700">
                        Send booking confirmation via WhatsApp
                      </span>
                    </label>
                    <label className="flex items-center">
                      <Checkbox defaultChecked />
                      <span className="ml-3 text-sm text-gray-700">
                        Send email updates about my booking
                      </span>
                    </label>
                    <label className="flex items-center">
                      <Checkbox />
                      <span className="ml-3 text-sm text-gray-700">
                        Subscribe to offers and promotions
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                {/* Promo Code */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Percent className="h-5 w-5 mr-2 text-green-500" />
                    Have a promo code?
                  </h4>
                  <div className="flex space-x-3">
                    <Input
                      value={bookingDetails.promoCode}
                      onChange={(e) => setBookingDetails(prev => ({
                        ...prev,
                        promoCode: e.target.value.toUpperCase()
                      }))}
                      placeholder="Enter promo code"
                      className="flex-1 h-12 rounded-xl"
                    />
                    <Button onClick={applyPromoCode} variant="outline" className="h-12 px-6 rounded-xl">
                      Apply
                    </Button>
                  </div>
                  {promoApplied && (
                    <div className="mt-3 flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Promo code applied successfully!</span>
                    </div>
                  )}
                </div>

                {/* Payment Methods */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-orange-500" />
                    Payment Method
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'razorpay', name: 'Card/UPI/Wallet', icon: CreditCard, desc: 'Secure payment via Razorpay' },
                      { id: 'upi', name: 'UPI Direct', icon: Smartphone, desc: 'Pay directly via UPI apps' },
                      { id: 'cash', name: 'Pay at Venue', icon: Globe, desc: 'Pay when you arrive' },
                    ].map((method) => (
                      <label key={method.id} className="cursor-pointer">
                        <div className={`p-4 rounded-xl border-2 transition-all ${
                          bookingDetails.paymentMethod === method.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="payment"
                              value={method.id}
                              checked={bookingDetails.paymentMethod === method.id}
                              onChange={(e) => setBookingDetails(prev => ({
                                ...prev,
                                paymentMethod: e.target.value
                              }))}
                              className="sr-only"
                            />
                            <method.icon className="h-5 w-5 text-gray-600" />
                            <div>
                              <div className="font-medium text-gray-900">{method.name}</div>
                              <div className="text-sm text-gray-500">{method.desc}</div>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-gray-50 rounded-xl p-4 flex items-center space-x-3">
                  <ShieldIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Secure Payment:</span> Your payment information is encrypted and secure. We never store your card details.
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Booking Confirmed!
                  </h3>
                  <p className="text-gray-600">
                    Your booking has been successfully confirmed. You'll receive a confirmation email shortly.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 max-w-md mx-auto">
                  <div className="text-sm text-gray-600 mb-1">Booking Reference</div>
                  <div className="text-2xl font-bold text-gray-900 mb-3">
                    {bookingDetails.bookingReference}
                  </div>
                  <div className="flex justify-center space-x-3">
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 rounded-xl">
                    <Eye className="h-5 w-5 mr-2" />
                    View Booking Details
                  </Button>
                  <Button variant="outline" className="w-full h-12 rounded-xl">
                    Book Another Service
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="w-80 bg-gray-50 p-6 border-l border-gray-200">
            <div className="sticky top-0 space-y-6">
              {/* Service Details */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start space-x-3">
                  <img
                    src={item.image || `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=80&h=80&fit=crop&sig=${item.id}`}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                      <span>{item.rating}</span>
                      <span className="mx-1">•</span>
                      <span className="capitalize">{item.type}</span>
                    </div>
                    {item.vendor?.verified && (
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified Partner
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
                <h4 className="font-semibold text-gray-900">Booking Details</h4>
                
                {bookingDetails.dates.checkIn && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.type === 'homestay' ? 'Check-in' : 'Date'}:
                    </span>
                    <span className="font-medium">
                      {format(bookingDetails.dates.checkIn, "MMM dd, yyyy")}
                    </span>
                  </div>
                )}
                
                {bookingDetails.dates.checkOut && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">
                      {format(bookingDetails.dates.checkOut, "MMM dd, yyyy")}
                    </span>
                  </div>
                )}

                {bookingDetails.timeSlot && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{bookingDetails.timeSlot}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Guests:</span>
                  <span className="font-medium">
                    {bookingDetails.guests.adults} adults
                    {bookingDetails.guests.children > 0 && `, ${bookingDetails.guests.children} children`}
                  </span>
                </div>

                {item.type === 'homestay' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rooms:</span>
                    <span className="font-medium">{bookingDetails.rooms}</span>
                  </div>
                )}

                {(item.type === 'driver' || item.type === 'creator') && bookingDetails.duration && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{bookingDetails.duration} hours</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
                <h4 className="font-semibold text-gray-900">Price Details</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base amount:</span>
                    <span>{formatPrice(bookingDetails.totalAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & fees:</span>
                    <span>{formatPrice(bookingDetails.taxes)}</span>
                  </div>
                  
                  {bookingDetails.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount:</span>
                      <span>-{formatPrice(bookingDetails.discount)}</span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-orange-500">{formatPrice(bookingDetails.finalAmount)}</span>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="space-y-3">
                {step < 5 && (
                  <Button
                    onClick={handleNextStep}
                    disabled={loading || 
                      (step === 1 && !bookingDetails.dates.checkIn) ||
                      (step === 3 && (!bookingDetails.contactInfo.firstName || !bookingDetails.contactInfo.email)) ||
                      (step === 4 && !bookingDetails.paymentMethod)
                    }
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 rounded-xl"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : step === 4 ? (
                      <>
                        <Lock className="h-5 w-5 mr-2" />
                        Secure Payment
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>
                )}
                
                {step > 1 && step < 5 && (
                  <Button
                    onClick={handleBackStep}
                    variant="outline"
                    className="w-full h-12 rounded-xl"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back
                  </Button>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="bg-green-50 rounded-xl p-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Free cancellation</span>
                  </div>
                  <div className="flex items-center text-sm text-green-700">
                    <ShieldIcon className="h-4 w-4 mr-2" />
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center text-sm text-green-700">
                    <Award className="h-4 w-4 mr-2" />
                    <span>Best price guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
