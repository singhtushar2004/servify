import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Twitter, Instagram, Linkedin, Github, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#06040f] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white">Servify</span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-5">
              India's most trusted home services platform. Get expert professionals for all your home needs, delivered at your doorstep.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5">Our Services</h3>
            <ul className="space-y-3">
              {['Car Wash', 'Plumbing', 'Carpentry', 'Home Cleaning', 'Personal Cook'].map((s) => (
                <li key={s}>
                  <Link
                    to="/services"
                    className="text-sm text-white/40 hover:text-white transition-colors duration-200"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5">Company</h3>
            <ul className="space-y-3">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
                { label: 'Become a Pro', to: '/register' },
                { label: 'Privacy Policy', to: '/' },
                { label: 'Terms of Service', to: '/' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm text-white/40 hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/40">
                  91 Springboard, Koramangala<br />Bengaluru, Karnataka 560034
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <a href="tel:+918001234567" className="text-sm text-white/40 hover:text-white transition-colors">
                  +91 800 123 4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <a href="mailto:hello@servify.in" className="text-sm text-white/40 hover:text-white transition-colors">
                  hello@servify.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} Servify Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/20">Built with</span>
            <span className="text-xs font-medium bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              React + Node.js + MongoDB
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
