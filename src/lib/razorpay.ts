import Razorpay from 'razorpay';
import crypto from 'crypto';

// Get environment variables with fallbacks for development
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID ?? 'your_razorpay_key_id';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? 'your_razorpay_key_secret';

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export interface CreateOrderParams {
  amount: number; // Amount in paisa (smallest unit)
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
  notes: Record<string, string>;
}

export interface PaymentVerificationParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Create a Razorpay order
export async function createRazorpayOrder(params: CreateOrderParams): Promise<RazorpayOrder> {
  try {
    const order = await razorpay.orders.create({
      amount: params.amount,
      currency: params.currency ?? 'INR',
      receipt: params.receipt,
      notes: params.notes ?? {},
    });
    
    return order as RazorpayOrder;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
}

// Verify payment signature
export function verifyPaymentSignature(params: PaymentVerificationParams): boolean {
  try {
    const hmac = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
    hmac.update(`${params.razorpay_order_id}|${params.razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');
    
    return generatedSignature === params.razorpay_signature;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
}

// Fetch payment details
export async function fetchPaymentDetails(paymentId: string) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw new Error('Failed to fetch payment details');
  }
}
