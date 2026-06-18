const Service = require('../models/Service');
const Booking = require('../models/Booking');

const CATEGORY_LABELS = {
  carwash: 'Car Wash',
  plumber: 'Plumbing',
  carpenter: 'Carpentry',
  maid: 'Home Cleaning',
  cook: 'Personal Cook',
};

const STATUS_LABELS = {
  pending: 'Pending — waiting for a provider',
  accepted: 'Accepted — provider confirmed',
  in_progress: 'In Progress — service is underway',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const formatDate = (date) =>
  new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const getMainOptions = (user) => {
  if (!user) {
    return [
      { id: 'browse_services', label: 'Browse services' },
      { id: 'how_to_book', label: 'How do I book?' },
      { id: 'pricing_info', label: 'Pricing & payments' },
      { id: 'cancellation_policy', label: 'Cancellation policy' },
      { id: 'contact_support', label: 'Contact support' },
    ];
  }

  if (user.role === 'provider') {
    return [
      { id: 'provider_active_jobs', label: 'My active jobs' },
      { id: 'provider_earnings', label: 'Earnings & payouts' },
      { id: 'provider_how_accept', label: 'Accept/reject bookings' },
      { id: 'service_issue', label: 'Report an issue' },
      { id: 'contact_support', label: 'Contact support' },
    ];
  }

  return [
    { id: 'track_booking', label: 'Track my booking' },
    { id: 'cancel_booking', label: 'Cancel a booking' },
    { id: 'payment_refund', label: 'Payment / refund' },
    { id: 'service_issue', label: 'Service not completed' },
    { id: 'book_service', label: 'Book a new service' },
    { id: 'contact_support', label: 'Talk to support' },
  ];
};

const backOption = { id: 'back_main', label: '← Back to main menu' };

const matchIntent = (message) => {
  const text = message.toLowerCase().trim();

  if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|namaste)/.test(text)) return 'greeting';
  if (/(track|status|where|booking\s*status|my\s*order|my\s*booking)/.test(text)) return 'track_booking';
  if (/(cancel|cancellation)/.test(text)) return 'cancel_booking';
  if (/(refund|payment|pay|charged|money|billing)/.test(text)) return 'payment_refund';
  if (/(problem|issue|complaint|bad|not\s*done|incomplete|unsatisfied|poor)/.test(text)) return 'service_issue';
  if (/(book|schedule|appointment|plumber|carpenter|maid|cook|car\s*wash|clean)/.test(text)) return 'book_service';
  if (/(price|cost|how\s*much|pricing|rate|fee)/.test(text)) return 'pricing_info';
  if (/(how\s*to\s*book|book\s*a\s*service)/.test(text)) return 'how_to_book';
  if (/(browse|services|categories)/.test(text)) return 'browse_services';
  if (/(support|contact|help|human|agent|call)/.test(text)) return 'contact_support';
  if (/(earn|payout|income)/.test(text)) return 'provider_earnings';
  if (/(accept|reject|job)/.test(text)) return 'provider_how_accept';

  return 'unknown';
};

const getWelcomeMessage = (user) => {
  if (!user) {
    return "Hi there! 👋 I'm Servify Assistant. I can help you browse services, understand pricing, or answer questions about bookings. What would you like help with?";
  }
  if (user.role === 'provider') {
    return `Hi ${user.name.split(' ')[0]}! 👋 I'm here to help with your jobs, earnings, and provider account. Pick an option below or type your question.`;
  }
  return `Hi ${user.name.split(' ')[0]}! 👋 I'm Servify Assistant. I can help track bookings, resolve issues, or book a new service. How can I help you today?`;
};

const handleTrackBooking = async (user) => {
  if (!user) {
    return {
      message: 'To track your bookings, please log in first. Once signed in, I can show your live booking status right here.',
      options: [
        { id: 'login_prompt', label: 'Go to login' },
        { id: 'how_to_book', label: 'How do I book?' },
        backOption,
      ],
      action: null,
    };
  }

  const bookings = await Booking.find({ customerId: user._id })
    .populate('serviceId', 'name category')
    .sort({ createdAt: -1 })
    .limit(5);

  if (!bookings.length) {
    return {
      message: "You don't have any bookings yet. Would you like to explore our services and book your first one?",
      options: [
        { id: 'browse_services', label: 'Browse services' },
        { id: 'book_service', label: 'See service categories' },
        backOption,
      ],
      action: { type: 'navigate', path: '/services' },
    };
  }

  const lines = bookings.map((b, i) => {
    const serviceName = b.serviceId?.name || 'Service';
    const status = STATUS_LABELS[b.status] || b.status;
    return `${i + 1}. **${serviceName}** — ${status}\n   Scheduled: ${formatDate(b.scheduledAt)} · ${formatCurrency(b.totalAmount)}`;
  });

  return {
    message: `Here are your recent bookings:\n\n${lines.join('\n\n')}\n\nView full details on your bookings page.`,
    options: [
      { id: 'cancel_booking', label: 'Cancel a booking' },
      { id: 'service_issue', label: 'Report an issue' },
      { id: 'book_service', label: 'Book another service' },
      backOption,
    ],
    action: { type: 'navigate', path: '/bookings' },
  };
};

const handleCancelBooking = async (user) => {
  if (!user) {
    return {
      message: 'Please log in to manage your bookings. You can cancel any booking that is still pending or accepted.',
      options: [{ id: 'login_prompt', label: 'Go to login' }, backOption],
      action: { type: 'navigate', path: '/login' },
    };
  }

  const cancellable = await Booking.find({
    customerId: user._id,
    status: { $in: ['pending', 'accepted'] },
  })
    .populate('serviceId', 'name')
    .sort({ scheduledAt: 1 });

  const policy =
    '**Cancellation policy:**\n• Pending or accepted bookings can be cancelled free of charge\n• In-progress bookings cannot be cancelled\n• Refunds are processed within 5–7 business days';

  if (!cancellable.length) {
    return {
      message: `${policy}\n\nYou currently have no bookings that can be cancelled.`,
      options: [
        { id: 'track_booking', label: 'Check booking status' },
        { id: 'payment_refund', label: 'Refund questions' },
        backOption,
      ],
      action: { type: 'navigate', path: '/bookings' },
    };
  }

  const list = cancellable
    .map((b, i) => `${i + 1}. ${b.serviceId?.name || 'Service'} — ${formatDate(b.scheduledAt)}`)
    .join('\n');

  return {
    message: `${policy}\n\n**Cancellable bookings:**\n${list}\n\nGo to your bookings page and tap "Cancel" on the booking you want to remove.`,
    options: [
      { id: 'track_booking', label: 'Track bookings' },
      { id: 'payment_refund', label: 'Refund timeline' },
      backOption,
    ],
    action: { type: 'navigate', path: '/bookings' },
  };
};

const handlePaymentRefund = () => ({
  message:
    '**Payment & refunds**\n\n• Payment is collected after the service is completed\n• UPI, cards, and net banking are accepted\n• Refunds for cancelled bookings take 5–7 business days\n• For failed payments, check your bank statement — pending charges usually reverse within 48 hours\n\nNeed help with a specific charge?',
  options: [
    { id: 'cancel_booking', label: 'I cancelled but no refund' },
    { id: 'service_issue', label: 'Charged for incomplete service' },
    { id: 'contact_support', label: 'Talk to support' },
    backOption,
  ],
  action: null,
});

const handleServiceIssue = (user) => ({
  message: user
    ? `Sorry to hear that, ${user.name.split(' ')[0]}. Here's what we can do:\n\n1. **Incomplete service** — We'll send another provider at no extra cost\n2. **Quality issue** — Partial refund or free re-service\n3. **Provider no-show** — Full refund within 24 hours\n\nPlease share details on the Contact page or email support@servify.com with your booking ID.`
    : "If you faced an issue with a service, please log in so I can look up your booking. You can also reach us at support@servify.com.",
  options: user
    ? [
        { id: 'track_booking', label: 'View my bookings' },
        { id: 'contact_support', label: 'Contact support' },
        backOption,
      ]
    : [{ id: 'login_prompt', label: 'Go to login' }, { id: 'contact_support', label: 'Contact support' }, backOption],
  action: user ? { type: 'navigate', path: '/contact' } : null,
});

const handleBookService = async () => {
  const services = await Service.find({ isActive: true }).sort({ price: 1 });

  const list = services
    .map((s) => `• **${CATEGORY_LABELS[s.category] || s.category}** — ${s.name} from ${formatCurrency(s.price)}`)
    .join('\n');

  return {
    message: `We offer 5 home service categories:\n\n${list}\n\nPick a service, choose your date & time, and a verified provider will be assigned automatically.`,
    options: [
      { id: 'how_to_book', label: 'How to book step-by-step' },
      { id: 'browse_services', label: 'Browse all services' },
      { id: 'pricing_info', label: 'See all pricing' },
      backOption,
    ],
    action: { type: 'navigate', path: '/services' },
  };
};

const handlePricingInfo = async () => {
  const services = await Service.find({ isActive: true }).sort({ category: 1 });
  const list = services
    .map((s) => `• ${s.name}: **${formatCurrency(s.price)}** (${s.duration})`)
    .join('\n');

  return {
    message: `**Current service pricing:**\n\n${list}\n\nPrices include labour. Any spare parts or materials are charged separately with your approval.`,
    options: [
      { id: 'browse_services', label: 'Browse services' },
      { id: 'how_to_book', label: 'How to book' },
      { id: 'payment_refund', label: 'Payment methods' },
      backOption,
    ],
    action: { type: 'navigate', path: '/services' },
  };
};

const handleHowToBook = () => ({
  message:
    '**How to book on Servify:**\n\n1. Browse services or pick a category\n2. Tap "Book Now" on your chosen service\n3. Enter your address, date & time\n4. Confirm — a provider is auto-assigned\n5. Track status in your dashboard\n\nSign up takes less than a minute!',
  options: [
    { id: 'browse_services', label: 'Browse services' },
    { id: 'pricing_info', label: 'Check pricing' },
    { id: 'login_prompt', label: 'Sign up / Log in' },
    backOption,
  ],
  action: { type: 'navigate', path: '/services' },
});

const handleBrowseServices = () => ({
  message: 'Take a look at our full service catalogue — Car Wash, Plumbing, Carpentry, Home Cleaning, and Personal Cook. All providers are background-verified.',
  options: [
    { id: 'how_to_book', label: 'How do I book?' },
    { id: 'pricing_info', label: 'Pricing' },
    backOption,
  ],
  action: { type: 'navigate', path: '/services' },
});

const handleCancellationPolicy = () => ({
  message:
    '**Cancellation policy:**\n\n• Free cancellation for pending & accepted bookings\n• Cancel from your Bookings page anytime before service starts\n• In-progress services cannot be cancelled\n• Refunds processed in 5–7 business days\n• Provider no-shows qualify for a full refund',
  options: [
    { id: 'cancel_booking', label: 'Cancel my booking' },
    { id: 'payment_refund', label: 'Refund timeline' },
    backOption,
  ],
  action: null,
});

const handleContactSupport = () => ({
  message:
    '**Reach our support team:**\n\n📧 support@servify.com\n📞 +91 98765 43210\n⏰ Available 24/7\n\nFor faster help, include your booking ID and registered email. Average response time: under 2 hours.',
  options: [
    { id: 'track_booking', label: 'Track my booking' },
    { id: 'service_issue', label: 'Report an issue' },
    backOption,
  ],
  action: { type: 'navigate', path: '/contact' },
});

const handleProviderActiveJobs = async (user) => {
  if (!user || user.role !== 'provider') {
    return {
      message: 'This option is for service providers. Please log in with your provider account.',
      options: [backOption],
      action: null,
    };
  }

  const jobs = await Booking.find({
    providerId: user._id,
    status: { $in: ['pending', 'accepted', 'in_progress'] },
  })
    .populate('serviceId', 'name')
    .populate('customerId', 'name')
    .sort({ scheduledAt: 1 })
    .limit(5);

  if (!jobs.length) {
    return {
      message: "You have no active jobs right now. Make sure your availability is turned on in your profile to receive new requests.",
      options: [
        { id: 'provider_how_accept', label: 'How to get bookings' },
        backOption,
      ],
      action: { type: 'navigate', path: '/provider/jobs/active' },
    };
  }

  const list = jobs
    .map((j, i) => {
      const status = STATUS_LABELS[j.status] || j.status;
      return `${i + 1}. ${j.serviceId?.name || 'Service'} — ${status}\n   Customer: ${j.customerId?.name || 'N/A'} · ${formatDate(j.scheduledAt)}`;
    })
    .join('\n\n');

  return {
    message: `**Your active jobs:**\n\n${list}`,
    options: [
      { id: 'provider_earnings', label: 'Check earnings' },
      { id: 'provider_how_accept', label: 'Accept/reject help' },
      backOption,
    ],
    action: { type: 'navigate', path: '/provider/jobs/active' },
  };
};

const handleProviderEarnings = () => ({
  message:
    '**Provider earnings:**\n\n• Earnings update when you mark a job as completed\n• View monthly breakdown in Earnings Analytics\n• Payouts are processed every Monday to your registered bank account\n• Platform fee: 15% per completed job',
  options: [
    { id: 'provider_active_jobs', label: 'View active jobs' },
    { id: 'contact_support', label: 'Payout issue' },
    backOption,
  ],
  action: { type: 'navigate', path: '/provider/earnings' },
});

const handleProviderHowAccept = () => ({
  message:
    '**Managing bookings as a provider:**\n\n1. New requests appear on your dashboard\n2. Tap **Accept** to confirm or **Reject** to decline\n3. Unassigned jobs matching your specialization are also visible\n4. Mark job **Complete** after finishing to receive payment\n5. Keep availability ON to get more bookings',
  options: [
    { id: 'provider_active_jobs', label: 'View my jobs' },
    { id: 'provider_earnings', label: 'Earnings info' },
    backOption,
  ],
  action: { type: 'navigate', path: '/provider/dashboard' },
});

const handleLoginPrompt = () => ({
  message: 'Sign in or create a free account to book services, track orders, and get personalized help.',
  options: [
    { id: 'how_to_book', label: 'How to book' },
    { id: 'browse_services', label: 'Browse services first' },
    backOption,
  ],
  action: { type: 'navigate', path: '/login' },
});

const handleUnknown = (user) => ({
  message:
    "I'm not sure I understood that. Pick one of the options below or try rephrasing — for example: \"track my booking\", \"cancel order\", or \"pricing\".",
  options: getMainOptions(user),
  action: null,
});

const HANDLERS = {
  greeting: async (user) => ({
    message: getWelcomeMessage(user),
    options: getMainOptions(user),
    action: null,
  }),
  back_main: async (user) => ({
    message: getWelcomeMessage(user),
    options: getMainOptions(user),
    action: null,
  }),
  track_booking: handleTrackBooking,
  cancel_booking: handleCancelBooking,
  payment_refund: handlePaymentRefund,
  service_issue: handleServiceIssue,
  book_service: handleBookService,
  pricing_info: handlePricingInfo,
  how_to_book: handleHowToBook,
  browse_services: handleBrowseServices,
  cancellation_policy: handleCancellationPolicy,
  contact_support: handleContactSupport,
  provider_active_jobs: handleProviderActiveJobs,
  provider_earnings: handleProviderEarnings,
  provider_how_accept: handleProviderHowAccept,
  login_prompt: handleLoginPrompt,
  unknown: handleUnknown,
};

const processMessage = async ({ message, optionId, user }) => {
  let intent = optionId || 'greeting';

  if (!optionId && message) {
    intent = matchIntent(message);
  }

  const handler = HANDLERS[intent] || HANDLERS.unknown;
  const result = await handler(user, message);

  return {
    message: result.message,
    options: result.options || getMainOptions(user),
    action: result.action || null,
    intent,
  };
};

module.exports = { processMessage, getWelcomeMessage, getMainOptions };
