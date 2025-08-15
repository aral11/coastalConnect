import { useState } from "react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  CreditCard,
  IndianRupee,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase, trackEvent } from "@/lib/supabase";

interface Driver {
  id: number;
  name: string;
  location: string;
  hourly_rate?: number;
  vehicle_type?: string;
}

interface DriverBookingModalProps {
  driver: Driver;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess?: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function DriverBookingModal({
  driver,
  isOpen,
  onClose,
  onBookingSuccess,
}: DriverBookingModalProps) {
  const { user, session, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [pickupDate, setPickupDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [passengerName, setPassengerName] = useState(user?.name || "");
  const [passengerPhone, setPassengerPhone] = useState(user?.phone || "");
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    if (!driver.hourly_rate) return 0;
    // Minimum 1 hour booking
    return driver.hourly_rate;
  };

  const handleBooking = async () => {
    if (
      !pickupDate ||
      !pickupTime ||
      !pickupLocation ||
      !dropoffLocation ||
      !passengerName ||
      !passengerPhone
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      if (!isAuthenticated || !session) {
        alert("Please login to make a booking");
        window.location.href = "/login";
        return;
      }

      // Create pickup datetime
      const [hours, minutes] = pickupTime.split(":");
      const pickupDateTime = new Date(pickupDate);
      pickupDateTime.setHours(parseInt(hours), parseInt(minutes));

      // Create booking directly in Supabase
      const estimatedCost = (duration * (driver.hourly_rate || 200));

      const bookingPayload = {
        service_id: driver.id.toString(),
        user_id: session.user.id,
        service_type: 'driver',
        guest_name: passengerName,
        guest_phone: passengerPhone,
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        pickup_datetime: pickupDateTime.toISOString(),
        guests: passengers,
        special_requests: '',
        total_amount: estimatedCost,
        status: 'pending',
        payment_status: 'pending',
        payment_method: 'razorpay',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([bookingPayload])
        .select()
        .single();

      if (bookingError) {
        throw new Error(bookingError.message);
      }

      // Track booking event
      await trackEvent('driver_booking_created', {
        booking_id: booking.id,
        driver_id: driver.id,
        user_id: session.user.id,
        amount: estimatedCost,
      });

      // Show success message
      alert('Driver booking submitted successfully! The driver will confirm your ride shortly.');
      onBookingSuccess?.();
      resetAndClose();
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (bookingData: any) => {
    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => processPayment(bookingData);
      document.body.appendChild(script);
    } else {
      processPayment(bookingData);
    }
  };

  const processPayment = (bookingData: any) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
      amount: bookingData.payment_intent.amount * 100, // Amount in paise
      currency: "INR",
      name: "coastalConnect",
      description: `Driver Booking - ${driver.name}`,
      order_id: bookingData.payment_intent.id,
      handler: async function (response: any) {
        try {
          // Confirm payment on server
          const token =
            localStorage.getItem("token") ||
            localStorage.getItem("authToken") ||
            localStorage.getItem("access_token");
          const confirmResponse = await fetch("/api/bookings/confirm-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              booking_id: bookingData.booking.id,
              booking_type: "driver",
            }),
          });

          const confirmData = await confirmResponse.json();

          if (confirmData.success) {
            alert(
              `Booking confirmed! Trip code: ${bookingData.booking.trip_code}. You will receive SMS confirmation shortly.`,
            );
            onClose();
            setStep(1);
            // Reset form
            setPickupDate(undefined);
            setPickupTime("");
            setPickupLocation("");
            setDropoffLocation("");
            setPassengerName("");
            setPassengerPhone("");
            setPassengers(1);
          } else {
            throw new Error(confirmData.message);
          }
        } catch (error) {
          console.error("Payment confirmation error:", error);
          alert("Payment confirmation failed. Please contact support.");
        }
      },
      prefill: {
        name: passengerName,
        contact: passengerPhone,
      },
      theme: {
        color: "#2D5A5A",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const resetAndClose = () => {
    setStep(1);
    setPickupDate(undefined);
    setPickupTime("");
    setPickupLocation("");
    setDropoffLocation("");
    setPassengerName("");
    setPassengerPhone("");
    setPassengers(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-ocean-600" />
            Book {driver.name}
          </DialogTitle>
          <DialogDescription>
            Complete your driver booking in{" "}
            {step === 1 ? "Step 1: Trip Details" : "Step 2: Passenger Details"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pickup Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !pickupDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {pickupDate ? format(pickupDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={pickupDate}
                      onSelect={setPickupDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="pickupTime">Pickup Time *</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <Input
                    id="pickupTime"
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="pickupLocation">Pickup Location *</Label>
              <Input
                id="pickupLocation"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Enter pickup address"
              />
            </div>

            <div>
              <Label htmlFor="dropoffLocation">Dropoff Location *</Label>
              <Input
                id="dropoffLocation"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                placeholder="Enter destination address"
              />
            </div>

            <div>
              <Label htmlFor="passengers">Number of Passengers *</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Users className="h-4 w-4 text-gray-400" />
                <Input
                  id="passengers"
                  type="number"
                  min="1"
                  max="6"
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                  className="flex-1"
                />
              </div>
            </div>

            {driver.hourly_rate && (
              <div className="bg-ocean-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>Estimated Cost:</span>
                  <span className="font-bold text-ocean-600 flex items-center">
                    <IndianRupee className="h-4 w-4" />
                    {calculateTotal()}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  ₹{driver.hourly_rate}/hour (minimum 1 hour)
                </div>
              </div>
            )}

            <Button
              onClick={() => setStep(2)}
              className="w-full btn-ocean"
              disabled={
                !pickupDate ||
                !pickupTime ||
                !pickupLocation ||
                !dropoffLocation
              }
            >
              Continue to Passenger Details
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="passengerName">Passenger Name *</Label>
              <Input
                id="passengerName"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                placeholder="Enter passenger name"
              />
            </div>

            <div>
              <Label htmlFor="passengerPhone">Phone Number *</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Phone className="h-4 w-4 text-gray-400" />
                <Input
                  id="passengerPhone"
                  type="tel"
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  placeholder="+91 98456 78901"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <h4 className="font-medium">Trip Summary:</h4>
              <div className="flex justify-between">
                <span>From:</span>
                <span className="text-right">{pickupLocation}</span>
              </div>
              <div className="flex justify-between">
                <span>To:</span>
                <span className="text-right">{dropoffLocation}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>
                  {pickupDate && pickupTime
                    ? `${format(pickupDate, "PPP")} at ${pickupTime}`
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Passengers:</span>
                <span>{passengers}</span>
              </div>
            </div>

            <div className="bg-ocean-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Total Amount:</span>
                <span className="font-bold text-ocean-600 flex items-center">
                  <IndianRupee className="h-4 w-4" />
                  {calculateTotal()}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleBooking}
                className="flex-1 btn-ocean"
                disabled={loading || !passengerName || !passengerPhone}
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay & Book
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
