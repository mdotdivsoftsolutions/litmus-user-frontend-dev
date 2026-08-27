import { LITMUS_LOGO_BASE64 } from "@/constants/brandLogo";

/**
 * razorpay.ts — Utility to lazily load the Razorpay Checkout SDK and open the payment modal.
 *
 * Why lazy-load? The Razorpay script is ~200KB. We only load it when the user
 * actually reaches Step 4 (Payment), not on every page.
 */

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

/**
 * Dynamically loads the Razorpay checkout.js script.
 * Safe to call multiple times — won't add duplicate script tags.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    // Already loaded
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    // Already being loaded (script tag exists)
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`
    );
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    // Create and inject the script
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayPaymentOptions {
  /** Razorpay order ID (from backend) */
  orderId: string;
  /** Amount in paise (from backend — never from frontend) */
  amount: number;
  /** INR */
  currency: string;
  /** Your Razorpay Key ID (public, rzp_test_... or rzp_live_...) */
  keyId: string;
  /** Internal booking ID — stored in notes, not used for payment */
  bookingId: string;
  /** Pre-fill user details in the checkout modal */
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  /** Called with payment details when user completes payment successfully */
  onSuccess: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  /** Called when user dismisses the modal or payment fails */
  onFailure: (error: { code: string; description: string; reason: string }) => void;
  /** Called when user closes the modal without paying */
  onDismiss?: () => void;
}

/**
 * Opens the Razorpay Checkout modal.
 * Loads the script if not already loaded.
 *
 * @returns Promise<void> — resolves once the modal is configured and opened.
 *          The onSuccess / onFailure callbacks handle the actual result.
 */
export async function openRazorpayCheckout(options: RazorpayPaymentOptions): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded || typeof window.Razorpay === 'undefined') {
    options.onFailure({
      code: 'SCRIPT_LOAD_FAILED',
      description: 'Failed to load Razorpay payment SDK. Please check your internet connection.',
      reason: 'script_load_error',
    });
    return;
  }

  const rzp = new window.Razorpay({
    key: options.keyId,
    amount: options.amount, // in paise
    currency: options.currency,
    order_id: options.orderId,
    name: 'Litmus Labs',
    description: 'Food & Diagnostic Testing Services',
    image: LITMUS_LOGO_BASE64, // embedded base64 data URI so it loads immediately in Razorpay iframe without 404
    prefill: {
      name: options.prefill?.name || '',
      email: options.prefill?.email || '',
      contact: options.prefill?.contact || '',
    },
    notes: {
      bookingId: options.bookingId,
    },
    theme: {
      color: '#059669', // Litmus brand action color
    },
    modal: {
      ondismiss: () => {
        options.onDismiss?.();
      },
      escape: false, // prevent accidental close with ESC
    },
    handler: (response: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => {
      // This fires ONLY when payment is successful on Razorpay's end
      options.onSuccess({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });
    },
  });

  rzp.on('payment.failed', (response: any) => {
    options.onFailure({
      code: response.error?.code || 'PAYMENT_FAILED',
      description: response.error?.description || 'Payment failed',
      reason: response.error?.reason || 'unknown',
    });
  });

  rzp.open();
}
