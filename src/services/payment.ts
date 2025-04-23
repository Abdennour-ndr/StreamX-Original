import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY!);

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

class PaymentService {
  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<PaymentIntent> {
    try {
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, currency }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async processPayment(paymentIntentId: string): Promise<void> {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const { error } = await stripe.confirmPayment({
        clientSecret: paymentIntentId,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentIntentId: string): Promise<string> {
    try {
      const response = await fetch(`/api/payment/status/${paymentIntentId}`);
      if (!response.ok) {
        throw new Error('Failed to get payment status');
      }
      const data = await response.json();
      return data.status;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }

  async createSubscription(priceId: string): Promise<any> {
    try {
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      const response = await fetch(`/api/subscription/${subscriptionId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService(); 