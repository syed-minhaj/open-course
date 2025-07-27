import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { BuyCourse_afterPayment } from '@/app/actions/course';
import { prisma } from '@/app/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil',
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    const sig = req.headers.get('stripe-signature')!;

    const rawBody = await req.arrayBuffer();
    const bodyBuffer = Buffer.from(rawBody);

    let event: Stripe.Event;

    try {
	    event = stripe.webhooks.constructEvent(bodyBuffer, sig, endpointSecret);
    } catch (err: any) {
        console.error('Stripe webhook signature verification failed:', err.message);
        return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email!;
        const courseID = session.metadata?.courseID;

        const user = await prisma.user.findUnique({
            where: { 
                email 
            } ,
            select : {
                id: true
            }
        });

        if (user && courseID) {
            const result = await BuyCourse_afterPayment({ courseID, userID: user.id });
            if (result.err) {
                return new NextResponse(`Webhook error: ${result.err}`, { status: 400 });
            }
        }else{
              return new NextResponse(`Webhook error: user not found`, { status: 400 });
        }  
    }

    return new NextResponse('Webhook received!', { status: 200 });
}
