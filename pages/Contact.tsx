
import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactInfo = ({ icon: Icon, title, detail }: { icon: any, title: string, detail: string }) => (
  <div className="flex gap-6 items-start">
    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-900 shadow-sm border border-slate-100 shrink-0">
      <Icon size={24} />
    </div>
    <div>
      <h4 className="font-bold text-slate-900 text-lg mb-1">{title}</h4>
      <p className="text-slate-600 leading-relaxed">{detail}</p>
    </div>
  </div>
);

const Contact = () => {
  return (
    <div className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h4 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">Contact Us</h4>
            <h1 className="text-5xl font-extrabold text-slate-900 mb-8 leading-tight">Get in touch with our expert consultants</h1>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              We're here to help you navigate your business complexities. Reach out today for a consultation.
            </p>
            
            <div className="space-y-10">
              <ContactInfo 
                icon={Mail} 
                title="Email Support" 
                detail="General: info@bansalconsultancy.com | Careers: hr@bansalconsultancy.com" 
              />
              <ContactInfo 
                icon={Phone} 
                title="Phone Number" 
                detail="+91 98765 43210 (Main Line) | +91 11 2345 6789 (Front Desk)" 
              />
              <ContactInfo 
                icon={MapPin} 
                title="Office Location" 
                detail="Unit 405, 4th Floor, Global Business Square, Sector 44, Gurugram, Haryana, India" 
              />
            </div>
          </div>
          
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50">
            <h3 className="text-2xl font-bold mb-8">Send us a message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none" placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                <textarea rows={5} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none" placeholder="Your message here..."></textarea>
              </div>
              <button className="w-full bg-blue-900 text-white font-bold py-5 rounded-2xl hover:bg-blue-800 transition-all flex items-center justify-center gap-2 group">
                Send Message <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
