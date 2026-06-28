import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GradientButton from '../components/GradientButton';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
    reset();
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const contactInfo = [
    { icon: Mail, label: 'Email Us', value: 'hello@servify.in', sub: 'We reply within 24 hours' },
    { icon: Phone, label: 'Call Us', value: '+91 800 123 4567', sub: 'Mon–Sat, 8am–8pm IST' },
    { icon: MapPin, label: 'Visit Us', value: '91 Springboard, Koramangala', sub: 'Bengaluru, Karnataka 560034' },
    { icon: Clock, label: 'Support Hours', value: '24/7 Live Chat', sub: 'Always here to help' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      <div className="pt-24 pb-20">
        {/* Header */}
        <div className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 to-transparent" />
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Get in Touch</p>
              <h1 className="text-5xl font-black text-white mb-4">We'd Love to Hear<br />From You</h1>
              <p className="text-white/50 text-lg max-w-xl mx-auto">
                Have a question, suggestion, or just want to say hello? Our team is always happy to chat.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact Info Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-xs text-white/40 mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-white mb-0.5">{item.value}</p>
                <p className="text-xs text-white/30">{item.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Form + Map */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Send a Message</h2>
                    <p className="text-sm text-white/40">We'll get back to you promptly</p>
                  </div>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-white/50 text-sm">Thanks for reaching out. We'll reply within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Your Name</label>
                        <input
                          type="text"
                          {...register('name', { required: 'Name is required' })}
                          placeholder="Full name"
                          className="input-field"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
                        <input
                          type="email"
                          {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                          placeholder="you@example.com"
                          className="input-field"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Subject</label>
                      <input
                        type="text"
                        {...register('subject', { required: 'Subject is required' })}
                        placeholder="How can we help?"
                        className="input-field"
                      />
                      {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Message</label>
                      <textarea
                        {...register('message', { required: 'Message is required', minLength: { value: 20, message: 'Please write at least 20 characters' } })}
                        rows={5}
                        placeholder="Tell us more..."
                        className="input-field resize-none"
                      />
                      {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
                    </div>
                    <GradientButton type="submit" isLoading={isLoading} fullWidth size="lg" rightIcon={<Send className="w-4 h-4" />}>
                      Send Message
                    </GradientButton>
                  </form>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-950/50 to-purple-950/30 border border-indigo-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Frequently Asked</h3>
                <div className="space-y-4">
                  {[
                    { q: 'How quickly can I get a professional?', a: 'Most services can be booked within 2 hours of your preferred time slot.' },
                    { q: 'Is my payment information secure?', a: 'Absolutely. We use industry-standard SSL encryption and never store card details.' },
                    { q: 'What if the professional doesn\'t show up?', a: 'We\'ll immediately rebook for free or provide a full refund — your choice.' },
                  ].map((item, i) => (
                    <div key={i} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                      <p className="text-sm font-medium text-white mb-1.5">{item.q}</p>
                      <p className="text-sm text-white/40">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-2">Join Our Team</h3>
                <p className="text-sm text-white/50 mb-4">We're always looking for passionate people to join the Servify mission.</p>
                <a href="mailto:careers@servify.in" className="btn-secondary inline-flex text-sm">
                  View Open Positions →
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
