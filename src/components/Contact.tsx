'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      if (!res.ok) throw new Error('Failed to send message');

      setStatus('success');
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Let's build something <br />
              <span className="text-primary">amazing together.</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-md">
              Have questions about plans, enterprise options, or custom features? We're here to help you succeed.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email Support</p>
                  <a href="mailto:mocxsup@gmail.com" className="text-white font-medium hover:text-primary transition-colors">
                    mocxsup@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Response Time</p>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">Usually within 2 hours</span>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
                      Fast
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl -z-10 opacity-30" />
            
            <form onSubmit={handleSubmit} className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20 resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                    status === 'success' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : status === 'error'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-primary hover:brightness-110 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {status === 'loading' ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : status === 'success' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Message Sent!
                    </>
                  ) : status === 'error' ? (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      Failed. Try again.
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

