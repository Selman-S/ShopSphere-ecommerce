import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useOrderStore } from '@/store/useOrderStore';

export default function PaymentForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentOrder } = useOrderStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation`,
          receipt_email: currentOrder?.user?.email,
          payment_method_data: {
            billing_details: {
              name: currentOrder?.shippingAddress?.fullName,
              email: currentOrder?.user?.email,
              address: {
                line1: currentOrder?.shippingAddress?.address,
                city: currentOrder?.shippingAddress?.city,
                postal_code: currentOrder?.shippingAddress?.postalCode,
                country: currentOrder?.shippingAddress?.country,
              },
            },
          },
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error: any) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <PaymentElement />
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isProcessing}
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </Button>
      </div>
    </form>
  );
} 