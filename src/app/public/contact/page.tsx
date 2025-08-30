'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import CommonFooter from '@/components/CommonFooter';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    alert('Message sent!');
  };

  return (
    <>
    <div className="bg-white text-gray-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Contact Form */}
        <div>
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Get in Touch</h2>
          <p className="mb-6 text-gray-600">Have questions or need help? Fill out the form and we'll get back to you shortly.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              required
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Contact Information</h3>
            <div className="flex items-start gap-3 text-gray-700">
              <Phone className="text-blue-600 mt-1" />
              <span>+855 12 345 678</span>
            </div>
            <div className="flex items-start gap-3 text-gray-700 mt-2">
              <Mail className="text-blue-600 mt-1" />
              <span>support@finddoctor.com</span>
            </div>
            <div className="flex items-start gap-3 text-gray-700 mt-2">
              <MapPin className="text-blue-600 mt-1" />
              <span>123 Health Street, Phnom Penh, Cambodia</span>
            </div>
          </div>

          {/* Optional: Google Map */}
          <div className="rounded-xl overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d488349.7642110038!2d104.6755871!3d11.5563737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109514b97e27aa7%3A0x4f94c187bc2504f2!2sPhnom%20Penh!5e0!3m2!1sen!2skh!4v1710693519797!5m2!1sen!2skh"
              width="100%"
              height="250"
              loading="lazy"
              className="w-full h-64 border-0"
            ></iframe>
          </div>
        </div>
      </div>
      
    </div>
    {/* SOCIAL MEDIA SECTION */}
          <CommonFooter/>
    </>
    
  );
}
