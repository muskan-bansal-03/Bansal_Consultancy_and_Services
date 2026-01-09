
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  ArrowRight,
  Globe,
  Award
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center mb-6">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Empowering Enterprises Globally
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-blue-950 mb-8 leading-[1.1]">
              Strategic Solutions for <span className="text-blue-600">Complex Business</span> Challenges.
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
              Bansal Consultancy and Services provides end-to-end recruitment, operational consulting, and enterprise management services tailored for the modern economy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/careers" 
                className="px-8 py-4 bg-blue-900 text-white rounded-xl font-bold text-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
              >
                Join Our Team <ArrowRight size={20} />
              </Link>
              <Link 
                to="/services" 
                className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-xl font-bold text-lg hover:border-blue-900 transition-all flex items-center justify-center"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/5 -skew-x-12 translate-x-32 hidden lg:block"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Corporate Clients', val: '500+' },
              { label: 'Staffing Capacity', val: '10k+' },
              { label: 'Success Rate', val: '98%' },
              { label: 'Years Excellence', val: '15+' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-extrabold text-blue-900 mb-2">{stat.val}</div>
                <div className="text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4 uppercase tracking-wider text-sm text-blue-600">Why Partner With Us</h2>
            <p className="text-4xl font-bold text-slate-900">Comprehensive Consulting for a Competitive Advantage</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={TrendingUp} 
              title="Growth Strategy" 
              description="Identify market opportunities and build robust roadmaps for sustainable organizational growth."
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Talent Solutions" 
              description="We bridge the gap between world-class talent and industry leaders through meticulous screening."
            />
            <FeatureCard 
              icon={Cpu} 
              title="Digital Integration" 
              description="Modernize your operations with cutting-edge tech consulting and system implementations."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-900 rounded-[2rem] overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 p-12 text-blue-800 opacity-20">
              <Globe size={300} />
            </div>
            <div className="px-10 py-20 lg:p-24 relative z-10">
              <div className="max-w-2xl">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to scale your business with experts?</h2>
                <p className="text-xl text-blue-100 mb-10">Let's discuss how Bansal Consultancy can transform your operations and workforce efficiency today.</p>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-900 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl"
                >
                  Schedule a Consultation <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
