
import React from 'react';
import { Target, Eye, Heart, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-20">
      {/* Intro Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-20">
          <h4 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">Our Story</h4>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-8">Redefining Global Consulting</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Since our inception, Bansal Consultancy and Services has been committed to delivering unparalleled expertise to organizations seeking transformation and growth.
          </p>
        </div>
        
        <div className="relative rounded-[3rem] overflow-hidden h-[500px] shadow-2xl">
          <img 
            src="https://picsum.photos/1200/600?grayscale" 
            alt="Office" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/60 flex items-center justify-center p-12">
            <div className="text-center max-w-2xl">
              <h2 className="text-4xl font-bold text-white mb-6">Excellence in Action</h2>
              <p className="text-blue-100 text-lg">We combine decades of experience with a fresh perspective on digital transformation and talent management.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision/Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="p-12 bg-slate-50 rounded-[2.5rem]">
              <Target size={48} className="text-blue-600 mb-8" />
              <h3 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                To empower our clients to achieve sustainable competitive advantage by providing high-quality consulting and manpower solutions that drive operational efficiency and foster innovation.
              </p>
            </div>
            <div className="p-12 bg-blue-900 text-white rounded-[2.5rem]">
              <Eye size={48} className="text-blue-300 mb-8" />
              <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
              <p className="text-lg text-blue-100 leading-relaxed">
                To be the world's most trusted partner for enterprise growth, recognized for our integrity, strategic brilliance, and unwavering commitment to professional excellence.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-16">Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Globe, title: 'Global Outlook', desc: 'Thinking beyond boundaries to deliver worldwide impact.' },
              { icon: Heart, title: 'Integrity', desc: 'Operating with honesty and high ethical standards.' },
              { icon: Target, title: 'Precision', desc: 'Detail-oriented solutions that hit the mark every time.' },
              { icon: Eye, title: 'Transparency', desc: 'Clear communication at every stage of the process.' }
            ].map((v, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <v.icon className="text-blue-600" size={32} />
                </div>
                <h4 className="text-xl font-bold mb-2">{v.title}</h4>
                <p className="text-slate-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
