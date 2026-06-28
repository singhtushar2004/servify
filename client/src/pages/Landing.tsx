import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, Star, Shield, Clock, Award, Users, TrendingUp, CheckCircle,
  Car, Wrench, HardHat, Sparkles, ChefHat, Zap, Play, Phone,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestimonialCard from '../components/TestimonialCard';
import FAQAccordion from '../components/FAQAccordion';

const Counter: React.FC<{ end: number; suffix?: string; prefix?: string }> = ({ end, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const services = [
  { icon: Car, label: 'Car Wash', desc: 'Premium wash at doorstep', color: 'from-blue-500/20 to-cyan-500/10', border: 'hover:border-blue-500/30' },
  { icon: Wrench, label: 'Plumbing', desc: 'Certified plumbers', color: 'from-orange-500/20 to-yellow-500/10', border: 'hover:border-orange-500/30' },
  { icon: HardHat, label: 'Carpentry', desc: 'Expert woodwork', color: 'from-amber-500/20 to-yellow-500/10', border: 'hover:border-amber-500/30' },
  { icon: Sparkles, label: 'Home Cleaning', desc: 'Deep clean experts', color: 'from-emerald-500/20 to-teal-500/10', border: 'hover:border-emerald-500/30' },
  { icon: ChefHat, label: 'Personal Cook', desc: 'Home-cooked meals', color: 'from-pink-500/20 to-rose-500/10', border: 'hover:border-pink-500/30' },
];

const steps = [
  { num: '01', title: 'Choose a Service', desc: 'Browse our wide range of professional home services and pick what you need.' },
  { num: '02', title: 'Book a Slot', desc: 'Select your preferred date, time, and provide your address in seconds.' },
  { num: '03', title: 'Pro Arrives', desc: 'A verified professional arrives at your doorstep fully equipped and ready.' },
  { num: '04', title: 'Relax & Pay', desc: 'Enjoy the service and pay securely after completion. Guaranteed satisfaction.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Home Owner', rating: 5, review: 'Absolutely fantastic service! The plumber who came was professional, quick, and resolved our leaky pipe issue in no time. The booking process was seamless.', service: 'Plumbing' },
  { name: 'Rahul Mehta', role: 'Software Engineer', rating: 5, review: 'Booked a car wash and the team was incredibly professional. My car looks showroom-fresh! Will definitely use Servify again for all home services.', service: 'Car Wash' },
  { name: 'Ananya Bose', role: 'Entrepreneur', rating: 5, review: 'The home cleaning service is exceptional. They were thorough, used eco-friendly products, and left our entire apartment sparkling. Highly recommended!', service: 'Home Cleaning' },
  { name: 'Vikram Singh', role: 'Doctor', rating: 4, review: 'Used the carpentry service to install a new wardrobe. The craftsman was skilled and finished ahead of schedule. Really impressed with the quality of work.', service: 'Carpentry' },
  { name: 'Sneha Patel', role: 'Teacher', rating: 5, review: 'The personal cook service transformed our weekdays! Fresh, healthy meals prepared right in our kitchen. The chef was talented and very hygienic.', service: 'Personal Cook' },
  { name: 'Arjun Kumar', role: 'Business Owner', rating: 5, review: 'Outstanding platform! I have been using Servify for 6 months now for various home services. Every professional has been top-notch. 5 stars always!', service: 'Multiple Services' },
];

const faqs = [
  { question: 'How are service professionals verified?', answer: 'All professionals undergo a rigorous 5-step verification process including background checks, skill assessments, document verification, and training. Only the top 15% are onboarded onto our platform.' },
  { question: 'What if I am not satisfied with the service?', answer: 'We offer a 100% satisfaction guarantee. If you are not happy with the service quality, contact us within 48 hours and we will either redo the service for free or provide a full refund.' },
  { question: 'How do I cancel or reschedule a booking?', answer: 'You can cancel or reschedule through your dashboard up to 2 hours before the scheduled time. Cancellations made with less notice may incur a small fee to compensate the professional.' },
  { question: 'Are the service charges transparent?', answer: 'Absolutely! All pricing is displayed upfront before you book. There are no hidden charges — the price you see is the price you pay. GST applicable on some services.' },
  { question: 'What areas does Servify currently serve?', answer: 'Servify currently operates in 30+ cities across India including Bengaluru, Mumbai, Delhi, Hyderabad, Chennai, Pune, and more. We are expanding rapidly every month.' },
];

const Landing: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' });

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-[#0a0a0f] to-purple-950" />
        <div className="absolute inset-0 bg-mesh opacity-60" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8"
              >
                <Zap className="w-4 h-4" />
                Trusted by 5,00,000+ happy customers
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
                <span className="text-white">Home Services</span>
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Reimagined.
                </span>
              </h1>

              <p className="text-lg text-white/50 mb-10 leading-relaxed max-w-lg">
                Premium home services at your doorstep. Book verified professionals for cleaning, plumbing, carpentry, car wash & more in just minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/register" className="btn-primary text-base !px-8 !py-4">
                  Book a Service
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/about" className="btn-secondary text-base !px-8 !py-4">
                  <Play className="w-4 h-4" />
                  How It Works
                </Link>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {['👩', '👨', '👩', '🧑'].map((emoji, i) => (
                    <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 border-2 border-[#0a0a0f] flex items-center justify-center text-sm">
                      {emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-white/50">4.9/5 from 50,000+ reviews</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-indigo-500/10"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-sm text-white/50">Next Booking</p>
                      <p className="text-lg font-bold text-white">Home Deep Clean</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-4">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/40 flex items-center justify-center text-base">👩</div>
                    <div>
                      <p className="text-sm font-medium text-white">Priya S.</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">On the way</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-white/40">
                      <Clock className="w-3.5 h-3.5" />
                      Today, 2:00 PM
                    </div>
                    <span className="text-indigo-400 font-semibold">₹599</span>
                  </div>
                </motion.div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -top-6 -right-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl"
                >
                  <p className="text-xs text-white/50 mb-1">Satisfaction Rate</p>
                  <p className="text-2xl font-black text-white">98.7<span className="text-sm text-indigo-400">%</span></p>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-6 -left-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl"
                >
                  <p className="text-xs text-white/50 mb-1">Pros Available</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-xl font-black text-white">2,400<span className="text-xs text-green-400">+</span></p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 720 0 0 30L0 60Z" fill="#0a0a0f" />
          </svg>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Our Services</p>
            <h2 className="section-heading">Everything Your Home Needs</h2>
            <p className="section-subheading mx-auto">
              From cleaning to repairs — book any home service with a few taps and get a verified professional at your door.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {services.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <Link
                  to="/services"
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br ${s.color} border border-white/10 ${s.border} transition-all duration-300 text-center group`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <s.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{s.label}</p>
                    <p className="text-xs text-white/40 mt-0.5">{s.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services" className="btn-secondary inline-flex items-center gap-2">
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/50 to-purple-950/50" />
        <div className="absolute inset-0 bg-mesh" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { end: 500000, suffix: '+', label: 'Happy Customers', icon: Users },
              { end: 2400, suffix: '+', label: 'Verified Pros', icon: Award },
              { end: 30, suffix: '+', label: 'Cities Covered', icon: TrendingUp },
              { end: 98, suffix: '%', label: 'Satisfaction Rate', icon: Star },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="text-4xl font-black text-white mb-1">
                  <Counter end={stat.end} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-white/50">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-[#0a0a0f]" ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={featuresInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Why Servify</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                The Most Trusted<br />
                <span className="gradient-text">Home Services Platform</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-8">
                We combine technology with human expertise to deliver a 5-star home service experience every time.
              </p>
              <div className="space-y-4">
                {[
                  'Background-verified & trained professionals',
                  'Transparent pricing — no hidden charges',
                  '100% satisfaction guarantee or money back',
                  'Real-time tracking & live updates',
                  'Eco-friendly products & sustainable practices',
                ].map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={featuresInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <p className="text-white/70 text-sm">{feature}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={featuresInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Shield, title: 'Verified Pros', desc: 'Every professional is background-checked and trained', color: 'from-blue-600/20 to-blue-600/5' },
                { icon: Clock, title: 'On-Time Guarantee', desc: 'We respect your time. Punctuality is our promise', color: 'from-purple-600/20 to-purple-600/5' },
                { icon: Award, title: 'Premium Quality', desc: 'Only top-rated professionals in your area', color: 'from-indigo-600/20 to-indigo-600/5' },
                { icon: Phone, title: '24/7 Support', desc: 'Our team is always here to help you', color: 'from-pink-600/20 to-pink-600/5' },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} border border-white/10 hover:border-white/20 transition-all duration-300`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{card.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="section-heading">Book in 4 Simple Steps</h2>
            <p className="section-subheading mx-auto">Get a professional at your door in under 60 seconds.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative"
              >
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-indigo-500/30 to-transparent z-0" />
                )}
                <div className="relative z-10 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all duration-300">
                  <div className="text-4xl font-black gradient-text mb-4">{step.num}</div>
                  <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="section-heading">Loved by Thousands</h2>
            <p className="section-subheading mx-auto">
              Don't just take our word for it. Here's what our community says.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} {...t} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/10" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">FAQs</p>
            <h2 className="section-heading">Frequently Asked Questions</h2>
            <p className="section-subheading mx-auto">Everything you need to know about Servify.</p>
          </motion.div>
          <FAQAccordion items={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-[#0a0a0f]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              Ready to experience premium service?
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              Your Home, Our<br />
              <span className="gradient-text-warm">Expertise.</span>
            </h2>
            <p className="text-xl text-white/50 mb-10 max-w-xl mx-auto">
              Join 5 lakh+ satisfied customers. Book your first service today and experience the Servify difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-base !px-10 !py-4">
                Get Started for Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/register?role=provider" className="btn-secondary text-base !px-10 !py-4">
                Become a Service Pro
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
