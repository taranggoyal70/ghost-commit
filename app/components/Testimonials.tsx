"use client";

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Developer @ TechCorp",
    content: "Ghost Commit saved me weeks of work. It took my 3-year-old React project and modernized it in minutes!",
    rating: 5,
    avatar: "SC"
  },
  {
    name: "Mike Rodriguez",
    role: "CTO @ StartupXYZ",
    content: "The AI-powered resurrection is incredible. It even added Stack Auth and deployed to production automatically.",
    rating: 5,
    avatar: "MR"
  },
  {
    name: "Emily Watson",
    role: "Freelance Developer",
    content: "I had 10+ dead repos. Ghost Commit brought them all back to life. Now they're generating income again!",
    rating: 5,
    avatar: "EW"
  }
];

export default function Testimonials() {
  return (
    <div className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-white mb-4">
          Loved by Developers
        </h2>
        <p className="text-gray-400 text-lg">
          Join thousands who've resurrected their dead projects
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition"
          >
            <Quote className="absolute top-4 right-4 w-8 h-8 text-purple-400/20" />
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {testimonial.avatar}
              </div>
              <div>
                <h4 className="text-white font-semibold">{testimonial.name}</h4>
                <p className="text-sm text-gray-400">{testimonial.role}</p>
              </div>
            </div>

            <div className="flex space-x-1 mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              "{testimonial.content}"
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
