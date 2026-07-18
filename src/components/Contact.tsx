import React, { useState } from 'react';
import { Mail, Linkedin, Github, Check, Send, AlertCircle, Sparkles } from 'lucide-react';
import { ContactMessage } from '../types';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validate = () => {
    let tempErrors = { name: '', email: '', message: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please provide a valid email';
      isValid = false;
    }

    if (!formData.message.trim()) {
      tempErrors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = 'Please write a brief description (min 10 characters)';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate electrical sequence transmission
    setTimeout(() => {
      try {
        const newMessage: ContactMessage = {
          id: Math.random().toString(36).substring(2, 9),
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim() || undefined,
          message: formData.message.trim(),
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };

        // Read existing messages from localStorage
        const stored = localStorage.getItem('sahin_portfolio_messages');
        const currentMessages = stored ? JSON.parse(stored) : [];
        currentMessages.unshift(newMessage);
        localStorage.setItem('sahin_portfolio_messages', JSON.stringify(currentMessages));

        // Increment admin stats contact counter
        const storedStats = localStorage.getItem('sahin_admin_stats');
        if (storedStats) {
          const stats = JSON.parse(storedStats);
          stats.contactRequests = (stats.contactRequests || 0) + 1;
          localStorage.setItem('sahin_admin_stats', JSON.stringify(stats));
        }

        setFormData({ name: '', email: '', company: '', message: '' });
        setSubmitStatus('success');
      } catch (err) {
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
        // Clear success notification after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }
    }, 1200);
  };

  const availabilityItems = [
    'International engineering roles',
    'Factory electrical contracting projects',
    'Technical mentorship & knowledge sharing'
  ];

  return (
    <section 
      id="contact" 
      className="py-20 md:py-28 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Context & Availability */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="font-mono text-xs text-amber-500 uppercase tracking-widest block mb-2">
                04 — Transmission Node
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-100 light:text-zinc-900 tracking-tight">
                Let's collaborate
              </h2>
              <div className="h-0.5 w-12 bg-amber-500 mt-4" />
            </div>

            <p className="text-zinc-400 light:text-zinc-600 leading-relaxed text-sm sm:text-base">
              Open to project collaborations, technical discussions, and international opportunities in the 
              electrical and power systems space. Let me know what you are looking to build or solve.
            </p>

            {/* Checklist of availability */}
            <div className="space-y-3 pt-2">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">
                Current Availability Status
              </span>
              {availabilityItems.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-sm">
                  <div className="flex-shrink-0 w-5 h-5 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-zinc-300 light:text-zinc-700 font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Social channels */}
            <div className="space-y-3 pt-4 border-t border-zinc-900 dark:border-zinc-900 light:border-zinc-200">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">
                Direct Contact Channels
              </span>
              <div className="flex space-x-3">
                <a 
                  href="mailto:sardershain@gmail.com" 
                  className="flex items-center space-x-2 text-xs font-mono text-zinc-400 light:text-zinc-600 hover:text-amber-500 border border-zinc-900 dark:border-zinc-900 light:border-zinc-250 hover:border-amber-500/30 bg-zinc-900/40 light:bg-white px-3 py-2 rounded transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>sardershain@gmail.com</span>
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2 text-zinc-400 light:text-zinc-600 hover:text-amber-500 border border-zinc-900 dark:border-zinc-900 light:border-zinc-250 hover:border-amber-500/30 bg-zinc-900/40 light:bg-white rounded transition-colors"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4.5 h-4.5" />
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2 text-zinc-400 light:text-zinc-600 hover:text-amber-500 border border-zinc-900 dark:border-zinc-900 light:border-zinc-250 hover:border-amber-500/30 bg-zinc-900/40 light:bg-white rounded transition-colors"
                  title="GitHub Profile"
                >
                  <Github className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg circuit-border">
              
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase tracking-wide">
                      Your Name <span className="text-amber-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sahidul Islam"
                      className={`w-full px-3.5 py-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border rounded text-sm text-zinc-100 light:text-zinc-900 focus:outline-none focus:border-amber-500 transition-colors ${
                        errors.name ? 'border-rose-500/50' : 'border-zinc-900 dark:border-zinc-900 light:border-zinc-250'
                      }`}
                    />
                    {errors.name && (
                      <span className="block text-[10px] text-rose-500 font-mono flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.name}</span>
                      </span>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase tracking-wide">
                      Email Address <span className="text-amber-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. sahid@factory.com"
                      className={`w-full px-3.5 py-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border rounded text-sm text-zinc-100 light:text-zinc-900 focus:outline-none focus:border-amber-500 transition-colors ${
                        errors.email ? 'border-rose-500/50' : 'border-zinc-900 dark:border-zinc-900 light:border-zinc-250'
                      }`}
                    />
                    {errors.email && (
                      <span className="block text-[10px] text-rose-500 font-mono flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.email}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Company / Project field */}
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase tracking-wide">
                    Company / Project Name <span className="text-zinc-600">(Optional)</span>
                  </label>
                  <input 
                    type="text" 
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Apex Industrial Ltd"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border border-zinc-900 dark:border-zinc-900 light:border-zinc-250 rounded text-sm text-zinc-100 light:text-zinc-900 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Message field */}
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase tracking-wide">
                    Engineering Message / Query <span className="text-amber-500">*</span>
                  </label>
                  <textarea 
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Specify voltage ratings, system details, or the scope of your opportunity..."
                    className={`w-full px-3.5 py-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border rounded text-sm text-zinc-100 light:text-zinc-900 focus:outline-none focus:border-amber-500 transition-colors ${
                      errors.message ? 'border-rose-500/50' : 'border-zinc-900 dark:border-zinc-900 light:border-zinc-250'
                    }`}
                  />
                  {errors.message ? (
                    <span className="block text-[10px] text-rose-500 font-mono flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.message}</span>
                    </span>
                  ) : (
                    <span className="block text-[10px] text-zinc-500 font-mono">
                      Please avoid sensitive corporate details; keep queries technical.
                    </span>
                  )}
                </div>

                {/* Submit Feedback */}
                {submitStatus === 'success' && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono rounded flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-pulse" />
                    <span>Message transmitted successfully! Recorded on Admin console.</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono rounded flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>Failed to transmit data. Please check connection parameters.</span>
                  </div>
                )}

                {/* Submit button */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-medium px-5 py-2.5 rounded text-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting Signals...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Transmit Message</span>
                      </>
                    )}
                  </button>

                  <span className="font-mono text-[10px] text-zinc-500">
                    * Usually replies within 24 hours
                  </span>
                </div>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
