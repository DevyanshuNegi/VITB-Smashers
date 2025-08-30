import { type NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '~/lib/razorpay';
import { z } from 'zod';

const createOrderSchema = z.object({
    amount: z.number().min(1),
    productId: z.string(),
    productName: z.string(),
});

export async function POST(request: NextRequest) {
    try {
        const body: unknown = await request.json();
        const { amount, productId, productName } = createOrderSchema.parse(body);

        // Create Razorpay order
        const order = await createRazorpayOrder({
            amount,
            receipt: `rcpt_${Date.now().toString().slice(-8)}`, // Keep receipt under 40 chars
            notes: {
                productId,
                productName,
            },
        });

        return NextResponse.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create order'
            },
            { status: 500 }
        );
    }
}
