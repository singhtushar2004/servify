import { BookingStatus, ServiceCategory } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status: BookingStatus): string => {
  const colors: Record<BookingStatus, string> = {
    pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    accepted: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    in_progress: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    completed: 'bg-green-500/20 text-green-300 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
  };
  return colors[status] || 'bg-gray-500/20 text-gray-300';
};

export const getStatusLabel = (status: BookingStatus): string => {
  const labels: Record<BookingStatus, string> = {
    pending: 'Pending',
    accepted: 'Accepted',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

export const getCategoryIcon = (category: ServiceCategory): string => {
  const icons: Record<ServiceCategory, string> = {
    carwash: '🚗',
    plumber: '🔧',
    carpenter: '🪚',
    maid: '🧹',
    cook: '👨‍🍳',
  };
  return icons[category] || '🔨';
};

export const getCategoryLabel = (category: ServiceCategory): string => {
  const labels: Record<ServiceCategory, string> = {
    carwash: 'Car Wash',
    plumber: 'Plumbing',
    carpenter: 'Carpentry',
    maid: 'Home Cleaning',
    cook: 'Personal Cook',
  };
  return labels[category] || category;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const getMinDateTime = (): string => {
  const now = new Date();
  now.setHours(now.getHours() + 1);
  return now.toISOString().slice(0, 16);
};
