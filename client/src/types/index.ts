export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'provider';
  avatar: string;
  phone: string;
  createdAt: string;
}

export interface ProviderProfile {
  _id: string;
  userId: string;
  specialization: ServiceCategory;
  bio: string;
  experience: number;
  baseRate: number;
  rating: number;
  totalRatings: number;
  completedJobs: number;
  totalEarnings: number;
  serviceArea: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory = 'carwash' | 'plumber' | 'carpenter' | 'maid' | 'cook';

export interface Service {
  _id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  image: string;
  description: string;
  features: string[];
  duration: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: string;
}

export type BookingStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface Booking {
  _id: string;
  customerId: User | string;
  providerId: User | string | null;
  serviceId: Service | string;
  status: BookingStatus;
  address: string;
  totalAmount: number;
  scheduledAt: string;
  notes: string;
  paymentStatus: PaymentStatus;
  completedAt: string | null;
  rating: number | null;
  review: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DashboardStats {
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalSpent: number;
}

export interface ProviderStats {
  totalEarnings: number;
  completedJobs: number;
  rating: number;
  pendingJobs: number;
  acceptedJobs: number;
  cancelledJobs: number;
  totalJobs: number;
}

export interface MonthlyAnalytics {
  month: string;
  year: number;
  revenue: number;
  jobs: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface AssistantOption {
  id: string;
  label: string;
}

export interface AssistantAction {
  type: 'navigate';
  path: string;
}

export interface AssistantResponse {
  message: string;
  options: AssistantOption[];
  action: AssistantAction | null;
  intent?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  options?: AssistantOption[];
  action?: AssistantAction | null;
  timestamp: Date;
}
