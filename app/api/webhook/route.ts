import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
  });

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const projectId = parseInt(session.metadata?.projectId || '0');
    const amount = parseInt(session.metadata?.amount || '0');

    try {
      // Spendenbetrag zum Projekt hinzufügen
      await prisma.project.update({
        where: { id: projectId },
        data: {
          raised: { increment: amount },
          donations: {
            create: { amount },
          },
        },
      });

      console.log(`✅ Spende von ${amount} € für Projekt ${projectId} gespeichert.`);
    } catch (error) {
      console.error('Fehler beim Speichern der Spende:', error);
    }
  }

  return NextResponse.json({ received: true });
}