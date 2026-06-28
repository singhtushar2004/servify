import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Users, TrendingUp, Heart, Globe, Zap, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const team = [
  { name: 'Tanishq Mahajan', role: 'CEO & Co-founder', image: '/images/tanishq.jpeg', bg: 'from-indigo-600/30 to-indigo-600/5' },
  { name: 'Tushar Singh', role: 'CTO & Co-founder', image: '/images/tushar.jpeg', bg: 'from-purple-600/30 to-purple-600/5' },
  { name: 'Jaideep Kushwaha', role: 'Head of Operations', image: '/images/jaideep.jpeg', bg: 'from-blue-600/30 to-blue-600/5' },
  { name: 'Nikhil Maurya', role: 'Head of Customer Success', image: '/images/nikhil.jpeg', bg: 'from-pink-600/30 to-pink-600/5' },
];

const values = [
  { icon: Shield, title: 'Trust & Safety', desc: 'Every professional is thoroughly background-checked, trained, and continuously monitored.', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: Award, title: 'Quality First', desc: 'We only work with the top 15% of applicants to ensure you always get the best.', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { icon: Heart, title: 'Customer Love', desc: 'Every decision we make starts with: how does this help our customers?', color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { icon: Globe, title: 'Sustainability', desc: 'We use eco-friendly products and promote sustainable service practices.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
];

const milestones = [
  { year: '2021', event: 'Servify founded in Bengaluru with 5 service categories' },
  { year: '2022', event: 'Expanded to 10 cities with 500+ verified professionals' },
  { year: '2023', event: 'Crossed 1 lakh bookings and launched mobile app' },
  { year: '2024', event: 'Series A funding — ₹50 Cr raised. Expanded to 30+ cities' },
  { year: '2025', event: '5 lakh customers, 2400+ pros, 98% satisfaction rate' },
];

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      <div className="pt-24">
        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/8 rounded-full blur-3xl" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-4">Our Story</p>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                Building India's Most<br />
                <span className="gradient-text">Trusted Home Services</span>
              </h1>
              <p className="text-white/50 text-lg leading-relaxed max-w-2xl mx-auto">
                Servify was born from a simple frustration — finding a reliable, trustworthy home service professional was unnecessarily difficult. We set out to change that, one booking at a time.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl font-black text-white mb-6">
                Our Mission is Simple:<br />
                <span className="gradient-text">Make Home Care Effortless</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-6">
                At Servify, we believe every household deserves access to professional, affordable, and reliable home services. We're creating an ecosystem where homeowners can book any home service in minutes, and skilled professionals can build a sustainable livelihood.
              </p>
              <p className="text-white/50 leading-relaxed mb-8">
                We've built a platform that rigourously vets professionals, ensures transparent pricing, and guarantees quality — so you can focus on what matters most to you.
              </p>
              <div className="space-y-3">
                {[
                  'Democratizing access to quality home services',
                  'Creating livelihood for 1M+ skilled workers by 2027',
                  'Building the largest verified-professional network in India',
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <p className="text-white/70 text-sm">{point}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Users, value: '5L+', label: 'Happy Customers', color: 'from-indigo-600/20 to-indigo-600/5' },
                { icon: Award, value: '2400+', label: 'Verified Pros', color: 'from-purple-600/20 to-purple-600/5' },
                { icon: Globe, value: '30+', label: 'Cities Served', color: 'from-blue-600/20 to-blue-600/5' },
                { icon: TrendingUp, value: '98%', label: 'Satisfaction Rate', color: 'from-emerald-600/20 to-emerald-600/5' },
              ].map((stat) => (
                <div key={stat.label} className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} border border-white/10`}>
                  <stat.icon className="w-6 h-6 text-white/60 mb-3" />
                  <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-white/40">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Our Values</p>
              <h2 className="text-4xl font-black text-white">What Drives Us</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center mb-4`}>
                    <v.icon className={`w-6 h-6 ${v.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Our Journey</p>
            <h2 className="text-4xl font-black text-white">From Zero to 5 Lakh</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-600/50 to-transparent" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-glow-sm">
                      {m.year}
                    </div>
                  </div>
                  <div className="flex-1 pt-3">
                    <p className="text-white/70 leading-relaxed">{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-white/[0.02] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">The Team</p>
              <h2 className="text-4xl font-black text-white">The People Behind Servify</h2>
              <p className="text-white/50 mt-3 max-w-lg mx-auto">A passionate team of builders, dreamers, and doers on a mission to transform home services in India.</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.bg} border border-white/10 flex items-center justify-center text-4xl mx-auto mb-4`}>
                    <img 
                        src={member.image} 
                        alt={`${member.name} - ${member.role}`} 
                        className="w-full h-full object-cover"
                      />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-sm text-indigo-400">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;
