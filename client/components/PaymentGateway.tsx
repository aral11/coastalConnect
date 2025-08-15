import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import {
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  Lock,
} from "lucide-react";

// Types for payment
interface PaymentMethod {
  gateway: "razorpay" | "stripe";
  methods: string[];
  currency: string;
  name: string;
  description: string;
}

interface PaymentProps {
  amount: number;
  currency?: string;
  bookingId: string;
  description: string;
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
}

// Razorpay declaration
declare global {
  interface Window {
    Razorpay: any;
    Stripe: any;
  }
}

export default function PaymentGateway({
  amount,
  currency = "INR",
  bookingId,
  description,
  onSuccess,
  onError,
  onCancel,
}: PaymentProps) {
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<"razorpay" | "stripe">(
    "razorpay",
  );
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load payment scripts and methods
  useEffect(() => {
    loadPaymentMethods();
    loadPaymentScripts();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const response = await fetch(
        `/api/payments/methods?currency=${currency}&country=IN`,
      );
      const data = await response.json();

      if (data.success) {
        setPaymentMethods(data.data);
        // Set default gateway based on currency
        if (
          currency === "INR" &&
          data.data.find((m) => m.gateway === "razorpay")
        ) {
          setSelectedGateway("razorpay");
        } else if (data.data.find((m) => m.gateway === "stripe")) {
          setSelectedGateway("stripe");
        }
      }
    } catch (error) {
      console.error("Failed to load payment methods:", error);
    }
  };

  const loadPaymentScripts = () => {
    // Load Razorpay script
    if (currency === "INR" && !window.Razorpay) {
      const razorpayScript = document.createElement("script");
      razorpayScript.src = "https://checkout.razorpay.com/v1/checkout.js";
      razorpayScript.onload = () => setScriptLoaded(true);
      document.head.appendChild(razorpayScript);
    }

    // Load Stripe script
    if (!window.Stripe && currency !== "INR") {
      const stripeScript = document.createElement("script");
      stripeScript.src = "https://js.stripe.com/v3/";
      stripeScript.onload = () => setScriptLoaded(true);
      document.head.appendChild(stripeScript);
    }

    if (currency === "INR" || (window.Stripe && window.Razorpay)) {
      setScriptLoaded(true);
    }
  };

  const processRazorpayPayment = async () => {
    try {
      setLoading(true);

      // Create order
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          booking_id: bookingId,
          gateway: "razorpay",
          description: description,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to create payment order");
      }

      const order = data.data.gateway_response;

      // Configure Razorpay options
      const options = {
        key:
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_9WgjuKhbMPLvB4", // Use test key for demo
        amount: order.amount,
        currency: order.currency,
        name: "CoastalConnect",
        description: description,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch(
              "/api/payments/verify/razorpay",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({
                  order_id: response.razorpay_order_id,
                  payment_id: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }),
              },
            );

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              onSuccess({
                gateway: "razorpay",
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                amount: order.amount,
                currency: order.currency,
              });
            } else {
              throw new Error(
                verifyData.message || "Payment verification failed",
              );
            }
          } catch (error) {
            onError(error.message || "Payment verification failed");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        notes: {
          booking_id: bookingId,
        },
        theme: {
          color: "#F97316", // Orange theme
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            onCancel?.();
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setLoading(false);
      onError(error.message || "Failed to initiate payment");
    }
  };

  const processStripePayment = async () => {
    try {
      setLoading(true);

      // Create payment intent
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          booking_id: bookingId,
          gateway: "stripe",
          description: description,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to create payment intent");
      }

      const stripe = window.Stripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      );
      const { client_secret } = data.data.gateway_response;

      // Redirect to Stripe hosted checkout or use Elements
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        client_secret,
        {
          payment_method: {
            card: {}, // This would be replaced with actual card element
            billing_details: {
              name: user?.name || "",
              email: user?.email || "",
            },
          },
        },
      );

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === "succeeded") {
        // Verify on backend
        const verifyResponse = await fetch("/api/payments/verify/stripe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            payment_intent_id: paymentIntent.id,
          }),
        });

        const verifyData = await verifyResponse.json();

        if (verifyData.success) {
          onSuccess({
            gateway: "stripe",
            payment_id: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
          });
        } else {
          throw new Error(verifyData.message || "Payment verification failed");
        }
      }
    } catch (error) {
      setLoading(false);
      onError(error.message || "Failed to process payment");
    }
  };

  const initiatePayment = () => {
    if (selectedGateway === "razorpay") {
      processRazorpayPayment();
    } else if (selectedGateway === "stripe") {
      processStripePayment();
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    if (currency === "INR") {
      return `₹${amount.toLocaleString("en-IN")}`;
    } else if (currency === "USD") {
      return `$${amount.toFixed(2)}`;
    }
    return `${amount} ${currency}`;
  };

  const getPaymentMethodIcons = (methods: string[]) => {
    return methods.map((method) => {
      switch (method) {
        case "upi":
          return <Smartphone key={method} className="h-6 w-6 text-blue-600" />;
        case "card":
          return <CreditCard key={method} className="h-6 w-6 text-gray-700" />;
        case "netbanking":
          return <Building2 key={method} className="h-6 w-6 text-green-600" />;
        case "wallet":
          return <Wallet key={method} className="h-6 w-6 text-purple-600" />;
        default:
          return <CreditCard key={method} className="h-6 w-6 text-gray-600" />;
      }
    });
  };

  if (!scriptLoaded) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading payment methods...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lock className="h-5 w-5 text-green-600" />
          <span>Secure Payment</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Payment Amount */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">Total Amount</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatAmount(amount, currency)}
          </div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>

        {/* Payment Method Selection */}
        {paymentMethods.length > 1 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-900">
              Select Payment Method
            </div>
            {paymentMethods.map((method) => (
              <button
                key={method.gateway}
                onClick={() => setSelectedGateway(method.gateway)}
                className={`w-full p-3 rounded-lg border-2 transition-colors ${
                  selectedGateway === method.gateway
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      {getPaymentMethodIcons(method.methods)}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        {method.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {method.description}
                      </div>
                    </div>
                  </div>
                  {selectedGateway === method.gateway && (
                    <CheckCircle className="h-5 w-5 text-orange-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Security badges */}
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Shield className="h-4 w-4" />
            <span>256-bit SSL</span>
          </div>
          <div className="flex items-center space-x-1">
            <Lock className="h-4 w-4" />
            <span>PCI Compliant</span>
          </div>
        </div>

        {/* Payment button */}
        <Button
          onClick={initiatePayment}
          disabled={loading || paymentMethods.length === 0}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3"
          size="lg"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <span>Pay {formatAmount(amount, currency)}</span>
          )}
        </Button>

        {/* Cancel button */}
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="w-full"
          >
            Cancel
          </Button>
        )}

        {/* Terms */}
        <div className="text-xs text-gray-500 text-center">
          By proceeding, you agree to our{" "}
          <a href="/terms" className="text-orange-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-orange-600 hover:underline">
            Privacy Policy
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

// Payment Success Component
export function PaymentSuccess({
  paymentData,
  onClose,
}: {
  paymentData: any;
  onClose: () => void;
}) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-600 mb-4">
          Your payment has been processed successfully.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm">
          <div className="flex justify-between">
            <span>Payment ID:</span>
            <span className="font-mono">{paymentData.payment_id}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-semibold">
              {paymentData.currency === "INR" ? "₹" : "$"}
              {(paymentData.amount / 100).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Gateway:</span>
            <Badge variant="outline">{paymentData.gateway}</Badge>
          </div>
        </div>

        <Button onClick={onClose} className="w-full">
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}

// Payment Error Component
export function PaymentError({
  error,
  onRetry,
  onClose,
}: {
  error: string;
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h3>
        <p className="text-gray-600 mb-4">{error}</p>

        <div className="space-y-3">
          <Button onClick={onRetry} className="w-full">
            Try Again
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
