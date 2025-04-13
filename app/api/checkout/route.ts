import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export async function POST(req: NextRequest) {
  const { projectId, projectTitle, amount } = await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: `Spende für: ${projectTitle}` },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      metadata: {
        projectId: String(projectId),
        amount: String(amount),
      },
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/',
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: 'Stripe error' }, { status: 500 });
  }
}