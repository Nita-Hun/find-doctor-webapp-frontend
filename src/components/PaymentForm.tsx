'use client';

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  appointmentId: number;
  amountInCents: number;
  onBack: () => void;
  onSubmitSuccess: () => void;
  loading: boolean;
}

export default function PaymentForm({
  appointmentId,
  amountInCents,
  onBack,
  onSubmitSuccess,
  loading,
}: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [creatingPaymentIntent, setCreatingPaymentIntent] = useState(false);

  useEffect(() => {
    async function createPaymentIntent() {
      setCreatingPaymentIntent(true);
      try {
        const { data } = await apiClient.post("/api/payments/create-payment-intent", {
          appointmentId,
          amountInCents,
          currency: "usd",
        });

        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        toast.error("Failed to initialize payment");
      } finally {
        setCreatingPaymentIntent(false);
      }
    }

    if (appointmentId && amountInCents) {
      createPaymentIntent();
    }
  }, [appointmentId, amountInCents]);

  if (creatingPaymentIntent) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-700">Initializing secure payment...</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h3 className="mt-3 text-lg font-medium text-gray-900">Payment Error</h3>
        <p className="mt-2 text-gray-500">
          Unable to initialize payment. Please check your details or try again later.
        </p>
        <div className="mt-6">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-colors"
          >
            Back to Previous Step
          </button>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm
        clientSecret={clientSecret}
        onPaymentSuccess={onSubmitSuccess}
        onBack={onBack}
        loading={loading}
      />
    </Elements>
  );
}

function CheckoutForm({
  clientSecret,
  onPaymentSuccess,
  onBack,
  loading,
}: {
  clientSecret: string;
  onPaymentSuccess: () => void;
  onBack: () => void;
  loading: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      toast.error("Payment system not ready. Please try again.");
      return;
    }
    setProcessing(true);
    setMessage(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Please enter your card details.");
      setProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card: cardElement } }
    );

    if (error) {
      setMessage(error.message || "Payment failed. Please try again.");
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      toast.success("Payment successful! Your appointment is confirmed.");
      onPaymentSuccess();
    } else {
      setMessage("Payment not completed. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Secure Payment</h2>
        
        {/* Payment Method Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            type="button"
            className="flex-1 py-3 px-1 text-center border-b-2 border-blue-600 font-medium text-blue-600"
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Credit Card
            </span>
          </button>
          <button
            type="button"
            disabled
            className="flex-1 py-3 px-1 text-center font-medium text-gray-500 opacity-50 cursor-not-allowed"
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.5 6.5h-21v11h21v-11zm-20 10v-7h19v7h-19zm0-8v-1h19v1h-19zm2 4h4v1h-4v-1z" />
              </svg>
              PayPal
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Input Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Information
            </label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CardElement
                options={{
                  hidePostalCode: true,
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#1a202c",
                      fontFamily: '"Inter", sans-serif',
                      "::placeholder": {
                        color: "#a0aec0",
                      },
                    },
                    invalid: {
                      color: "#e53e3e",
                    },
                  },
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              {['visa', 'mastercard', 'discover'].map((card) => (
                <div key={card} className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">
                  <img 
                    src={`../assets/images/${card}.svg`} 
                    alt={card} 
                    className="h-5 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Security Info */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 text-sm">
              <p className="text-gray-600">
                Your payment is securely processed by Stripe. We don't store your card details.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {message && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onBack}
              disabled={loading || processing}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading || processing}
              className={`px-8 py-3 rounded-lg font-medium text-white transition-colors ${
                processing || loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {processing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Pay Now"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}