import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Briefcase,
  CheckSquare,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getInitials } from '../utils/helpers';

const customerNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/bookings', icon: Calendar, label: 'My Bookings' },
  { to: '/services', icon: Briefcase, label: 'Browse Services' },
  { to: '/profile', icon: Settings, label: 'Profile Settings' },
];

const providerNav = [
  { to: '/provider/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/provider/jobs/active', icon: Briefcase, label: 'Active Jobs' },
  { to: '/provider/jobs/completed', icon: CheckSquare, label: 'Completed Jobs' },
  { to: '/provider/earnings', icon: TrendingUp, label: 'Earnings' },
  { to: '/provider/profile', icon: Settings, label: 'Profile Settings' },
];

const DashboardSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = user?.role === 'provider' ? providerNav : customerNav;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully. See you soon!');
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-glow-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Servify
          </span>
        </NavLink>
      </div>

      {/* User Profile */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              getInitials(user?.name || 'U')
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-white/40 truncate">{user?.email}</p>
          </div>
          <div className="ml-auto">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              user?.role === 'provider'
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-indigo-500/20 text-indigo-300'
            }`}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-white/40 group-hover:text-white/70'}`} style={{ width: '18px', height: '18px' }} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm text-white"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col bg-[#0a0814] border-r border-white/10 min-h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-[#0a0814] border-r border-white/10"
            >
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;
