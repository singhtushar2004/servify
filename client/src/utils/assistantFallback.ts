import { AssistantResponse } from '../types';

const back = { id: 'back_main', label: '← Back to main menu' };

const FALLBACKS: Record<string, AssistantResponse> = {
  browse_services: {
    message: 'Browse our services — Car Wash, Plumbing, Carpentry, Home Cleaning, and Personal Cook. All providers are verified.',
    options: [{ id: 'how_to_book', label: 'How do I book?' }, { id: 'pricing_info', label: 'Pricing' }, back],
    action: { type: 'navigate', path: '/services' },
  },
  how_to_book: {
    message:
      '**How to book:**\n1. Pick a service\n2. Tap "Book Now"\n3. Enter address, date & time\n4. Confirm — a provider is assigned automatically',
    options: [{ id: 'browse_services', label: 'Browse services' }, { id: 'pricing_info', label: 'Check pricing' }, back],
    action: { type: 'navigate', path: '/services' },
  },
  pricing_info: {
    message:
      '**Pricing:** Car Wash from ₹499 · Home Cleaning from ₹599 · Plumbing from ₹799 · Cook from ₹799 · Carpentry from ₹999. Payment is collected after service completion.',
    options: [{ id: 'browse_services', label: 'Browse services' }, { id: 'how_to_book', label: 'How to book' }, back],
    action: { type: 'navigate', path: '/services' },
  },
  cancellation_policy: {
    message:
      '**Cancellation policy:** Free cancellation for pending & accepted bookings. Refunds in 5–7 business days. Cancel from your Bookings page.',
    options: [{ id: 'cancel_booking', label: 'Cancel my booking' }, { id: 'payment_refund', label: 'Refund timeline' }, back],
    action: null,
  },
  contact_support: {
    message: '**Support:** support@servify.com · +91 98765 43210 · Available 24/7. Include your booking ID for faster help.',
    options: [{ id: 'track_booking', label: 'Track my booking' }, back],
    action: { type: 'navigate', path: '/contact' },
  },
  track_booking: {
    message: 'Log in to track your bookings in real time. Go to your Bookings page to see status updates.',
    options: [{ id: 'login_prompt', label: 'Go to login' }, { id: 'how_to_book', label: 'How to book' }, back],
    action: { type: 'navigate', path: '/bookings' },
  },
  cancel_booking: {
    message: 'You can cancel pending or accepted bookings free of charge from your Bookings page.',
    options: [{ id: 'cancellation_policy', label: 'Cancellation policy' }, back],
    action: { type: 'navigate', path: '/bookings' },
  },
  payment_refund: {
    message: 'Refunds for cancelled bookings take 5–7 business days. Payment is collected after service completion.',
    options: [{ id: 'contact_support', label: 'Contact support' }, back],
    action: null,
  },
  service_issue: {
    message: 'Sorry to hear that. Email support@servify.com with your booking ID. We offer free re-service or refunds for valid complaints.',
    options: [{ id: 'contact_support', label: 'Contact support' }, back],
    action: { type: 'navigate', path: '/contact' },
  },
  book_service: {
    message: 'We offer Car Wash, Plumbing, Carpentry, Home Cleaning, and Personal Cook. Browse services to book.',
    options: [{ id: 'browse_services', label: 'Browse services' }, { id: 'pricing_info', label: 'Pricing' }, back],
    action: { type: 'navigate', path: '/services' },
  },
  login_prompt: {
    message: 'Sign in or create a free account to book services and track orders.',
    options: [{ id: 'how_to_book', label: 'How to book' }, back],
    action: { type: 'navigate', path: '/login' },
  },
  back_main: {
    message: "Hi! I'm Servify Assistant. How can I help you today?",
    options: [
      { id: 'browse_services', label: 'Browse services' },
      { id: 'how_to_book', label: 'How do I book?' },
      { id: 'pricing_info', label: 'Pricing & payments' },
      { id: 'contact_support', label: 'Contact support' },
    ],
    action: null,
  },
};

export const getFallbackResponse = (optionId?: string, message?: string): AssistantResponse | null => {
  if (optionId && FALLBACKS[optionId]) return FALLBACKS[optionId];

  const text = (message || '').toLowerCase();
  if (/price|cost|how much/.test(text)) return FALLBACKS.pricing_info;
  if (/book|schedule/.test(text)) return FALLBACKS.how_to_book;
  if (/cancel/.test(text)) return FALLBACKS.cancellation_policy;
  if (/track|status/.test(text)) return FALLBACKS.track_booking;
  if (/support|help|contact/.test(text)) return FALLBACKS.contact_support;

  return {
    message: "I'm here to help! Pick an option below or try asking about bookings, pricing, or services.",
    options: FALLBACKS.back_main.options,
    action: null,
  };
};

export const getGreetingFallback = (userName?: string): AssistantResponse => ({
  message: userName
    ? `Hi ${userName.split(' ')[0]}! 👋 I'm Servify Assistant. How can I help you today?`
    : "Hi there! 👋 I'm Servify Assistant. I can help with services, bookings, and more.",
  options: [
    { id: 'browse_services', label: 'Browse services' },
    { id: 'how_to_book', label: 'How do I book?' },
    { id: 'pricing_info', label: 'Pricing & payments' },
    { id: 'contact_support', label: 'Contact support' },
  ],
  action: null,
});
