import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

interface StripePaymentFormProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onError: (error: any) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent on the server
      const { data: { clientSecret } } = await api.post('/payments/create-payment-intent', {
        amount,
        currency: 'usd'
      });

      // Confirm the card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });

      if (error) {
        onError(error);
        toast.error(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
        toast.success('Payment successful!');
      }
    } catch (err) {
      onError(err);
      toast.error('An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Card Details
        </label>
        <div className="p-3 border border-gray-300 rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full bg-primary-600 text-white py-2 px-4 rounded-md ${
          (!stripe || processing) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'
        }`}
      >
        {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default StripePaymentForm; 