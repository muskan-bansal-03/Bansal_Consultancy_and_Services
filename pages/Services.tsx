
import React from 'react';
import { 
  Users, 
  BarChart3, 
  Settings, 
  SearchCode, 
  Database, 
  Network 
} from 'lucide-react';

const ServiceItem = ({ icon: Icon, title, points }: { icon: any, title: string, points: string[] }) => (
  <div className="p-10 bg-white rounded-[2.5rem] border border-slate-200 hover:border-blue-500 transition-all duration-300 group">
    <div className="w-16 h-16 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-900 group-hover:text-white transition-all">
      <Icon size={32} />
    </div>
    <h3 className="text-2xl font-bold mb-6">{title}</h3>
    <ul className="space-y-4">
      {points.map((p, i) => (
        <li key={i} className="flex items-start gap-3 text-slate-600">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
          {p}
        </li>
      ))}
    </ul>
  </div>
);

const Services = () => {
  return (
    <div className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6">Expertise That Matters</h1>
          <p className="text-xl text-slate-600">Tailored solutions designed to solve the most pressing challenges in the modern business landscape.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceItem 
            icon={Users} 
            title="Workforce Solutions" 
            points={['Permanent Staffing', 'Temporary Staffing', 'Executive Search', 'Campus Recruitment']}
          />
          <ServiceItem 
            icon={BarChart3} 
            title="Business Strategy" 
            points={['Market Entry Planning', 'Competitive Intelligence', 'Growth Roadmaps', 'Profitability Audit']}
          />
          <ServiceItem 
            icon={Settings} 
            title="Operational Efficiency" 
            points={['Process Re-engineering', 'Supply Chain Optimization', 'Waste Reduction', 'Compliance Management']}
          />
          <ServiceItem 
            icon={SearchCode} 
            title="IT Consulting" 
            points={['Digital Transformation', 'Cloud Migration', 'Cybersecurity Audit', 'Custom Software Strategy']}
          />
          <ServiceItem 
            icon={Database} 
            title="Data Analytics" 
            points={['Big Data Architecture', 'Predictive Modeling', 'Dashboard Design', 'Customer Insight Reports']}
          />
          <ServiceItem 
            icon={Network} 
            title="HR Outsourcing" 
            points={['Payroll Management', 'Policy Documentation', 'Employee Engagement', 'Training & Development']}
          />
        </div>

        <div className="mt-24 p-12 bg-blue-900 rounded-[3rem] text-white flex flex-col lg:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-blue-100 text-lg max-w-xl">Every business is unique. We provide bespoke consulting packages that align specifically with your corporate DNA and long-term goals.</p>
          </div>
          <button className="px-10 py-5 bg-white text-blue-900 rounded-2xl font-bold text-lg shadow-xl shadow-white/10 shrink-0">
            Request a Proposal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;
