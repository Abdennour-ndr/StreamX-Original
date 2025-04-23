import Stripe from 'stripe';
import { IUser } from '@/models/User';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil',
});

export const PLANS = {
  premium: {
    name: 'Premium',
    price: 9.99,
    interval: 'month' as const,
    currency: 'usd' as const,
  },
} as const;

export class StripeService {
  private async getOrCreateCustomer(user: IUser): Promise<string> {
    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        firebaseUID: user.uid,
      },
    });

    return customer.id;
  }

  async createCheckoutSession(user: IUser, planId: keyof typeof PLANS): Promise<string> {
    const plan = PLANS[planId];
    if (!plan) throw new Error('Invalid plan');

    const customerId = await this.getOrCreateCustomer(user);

    // Get or create the price
    let price = await this.getPriceId(planId);
    if (!price) {
      price = await this.createPrice(planId);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/cancel`,
      metadata: {
        firebaseUID: user.uid,
        planId,
      },
    });

    return session.url || '';
  }

  private async getPriceId(planId: keyof typeof PLANS): Promise<string | null> {
    const plan = PLANS[planId];
    const prices = await stripe.prices.list({
      lookup_keys: [planId],
      expand: ['data.product'],
    });

    return prices.data[0]?.id || null;
  }

  private async createPrice(planId: keyof typeof PLANS): Promise<string> {
    const plan = PLANS[planId];

    // Create the product if it doesn't exist
    const product = await stripe.products.create({
      name: plan.name,
      metadata: {
        planId,
      },
    });

    // Create the price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(plan.price * 100), // Convert to cents
      currency: plan.currency,
      recurring: {
        interval: plan.interval,
      },
      lookup_key: planId,
    });

    return price.id;
  }

  async handleWebhook(
    body: string,
    signature: string
  ): Promise<{
    type: string;
    data: {
      customerId: string;
      subscriptionId?: string;
      firebaseUID: string;
      planId: keyof typeof PLANS;
    };
  }> {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${(err as Error).message}`);
    }

    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    const customer = await stripe.customers.retrieve(customerId);

    if (!customer || customer.deleted) {
      throw new Error('Customer not found');
    }

    return {
      type: event.type,
      data: {
        customerId,
        subscriptionId: subscription.id,
        firebaseUID: customer.metadata.firebaseUID,
        planId: customer.metadata.planId as keyof typeof PLANS,
      },
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await stripe.subscriptions.cancel(subscriptionId);
  }

  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return stripe.subscriptions.retrieve(subscriptionId);
  }
} 