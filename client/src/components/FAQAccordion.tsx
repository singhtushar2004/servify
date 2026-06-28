import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className={`rounded-xl border transition-all duration-300 overflow-hidden ${
            openIndex === index
              ? 'border-indigo-500/30 bg-indigo-600/5'
              : 'border-white/10 bg-white/5'
          }`}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="flex items-center justify-between w-full px-5 py-4 text-left"
          >
            <span className={`text-sm font-semibold transition-colors ${openIndex === index ? 'text-white' : 'text-white/70'}`}>
              {item.question}
            </span>
            <div className={`flex-shrink-0 ml-4 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
              openIndex === index
                ? 'bg-indigo-600 text-white'
                : 'bg-white/10 text-white/40'
            }`}>
              {openIndex === index ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </div>
          </button>

          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <div className="px-5 pb-4">
                  <p className="text-sm text-white/50 leading-relaxed">{item.answer}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default FAQAccordion;
