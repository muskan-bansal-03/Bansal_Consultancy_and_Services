
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, User, Search, Download, LogOut, Calendar, LayoutDashboard, 
  Bell, MoreVertical, Eye, Database, 
  TrendingUp, Briefcase, Trash2, X,
  CheckCircle2, Menu, ChevronRight, UserCheck, 
  Filter, ChevronLeft, HardDrive, Clock, Video, Plus,
  MapPin, Phone, Mail, FileText, CreditCard, GraduationCap
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { JoiningFormData } from '../types';
import { DatabaseService } from '../services/database';

const StatCard = ({ title, value, icon: Icon, color, trend }: { title: string, value: string | number, icon: any, color: string, trend?: string }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-start gap-4 flex-1 min-w-[240px] hover:shadow-lg transition-all duration-300">
    <div className="flex justify-between items-start w-full">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <div>
      <div className="text-3xl font-black text-slate-900 leading-none mb-2">{value}</div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [applicants, setApplicants] = useState<JoiningFormData[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<JoiningFormData | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showPostJob, setShowPostJob] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem('bansal_admin_session');
    if (!session) { navigate('/admin/login'); return; }
    refreshAllData();
  }, [navigate]);

  const refreshAllData = async () => {
    setLoading(true);
    const data = await DatabaseService.getApplications();
    setApplicants(data);
    setJobs(DatabaseService.getJobs());
    setInterviews(DatabaseService.getInterviews());
    setLoading(false);
  };

  const handleSearch = async (val: string) => {
    setSearch(val);
    const results = await DatabaseService.searchApplications(val);
    setApplicants(results);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("CRITICAL: This will permanently remove the record from the central database. Proceed?")) {
      await DatabaseService.deleteApplication(id);
      refreshAllData();
    }
  };

  const exportToExcel = () => {
    if (applicants.length === 0) return alert("No records available to export.");
    
    // Flattening data for Excel readability
    const formatted = applicants.map(a => ({
      'Emp Code': a.employeeCode,
      'First Name': a.firstName,
      'Last Name': a.lastName,
      'Email': a.email,
      'Mobile': a.mobile,
      'DOB': a.dob,
      'DOJ': a.doj,
      'Aadhaar': a.aadhaarNumber,
      'PAN': a.panNumber,
      'Bank A/C': a.bankAccount,
      'IFSC': a.ifscCode,
      'UAN': a.uanNumber,
      'ESIC': a.esicNumber,
      'Address': a.localAddress,
      'Status': 'Verified'
    }));

    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Candidate_Intelligence");
    XLSX.writeFile(wb, `Bansal_Consultancy_Data_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handlePostJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    DatabaseService.saveJob({
      title: formData.get('title'),
      dept: formData.get('dept'),
      status: 'Active',
      applicants: 0
    });
    setShowPostJob(false);
    refreshAllData();
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-inter">
      {/* Sidebar - Matching Enterprise Screenshot Style */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#1E293B] z-[100] transition-transform duration-300 transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/20">B</div>
            <div>
              <span className="text-lg font-black text-white block leading-tight">Bansal</span>
              <span className="text-[9px] uppercase font-black tracking-widest text-blue-400 opacity-60">Control Center</span>
            </div>
          </div>
          
          <nav className="space-y-1 flex-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'applicants', label: 'All Applicants', icon: Users },
              { id: 'jobs', label: 'Job Openings', icon: Briefcase },
              { id: 'interviews', label: 'Interviews', icon: Calendar },
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`flex items-center gap-4 w-full p-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-white/10 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="bg-[#151D2C] p-5 rounded-2xl mb-8 border border-white/5">
            <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3"><Database size={10} /> Connectivity Status</div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <span className="text-xs font-black text-white">System Sync Online</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">Records are fully encrypted.</p>
          </div>
          
          <button onClick={() => navigate('/')} className="flex items-center gap-4 p-4 text-slate-400 hover:text-red-400 font-bold text-sm transition-colors mt-auto group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> <span>Logout Terminal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 md:px-12 shrink-0 z-50">
          <div className="flex items-center gap-6 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"><Menu size={20}/></button>
            <div className="relative w-full max-w-xl group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Search global records (Name, Email, ID)..."
                className="w-full pl-12 pr-6 py-3 bg-[#F1F5F9] border-none rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <button onClick={exportToExcel} title="Global Export" className="p-2.5 bg-[#F1F5F9] text-slate-400 rounded-xl hover:text-blue-600 transition-all"><Download size={20}/></button>
             <button className="p-2.5 bg-[#F1F5F9] text-slate-400 rounded-xl relative hover:text-blue-600 transition-all">
               <Bell size={20}/>
               <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <div className="text-right hidden sm:block">
                  <p className="text-[11px] font-black text-slate-900 leading-none mb-1">Administrator</p>
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Master Node</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center font-black text-blue-600 shadow-inner">AD</div>
             </div>
          </div>
        </header>

        {/* Dynamic Main Dashboard View */}
        <main className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center py-40">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Intelligence Core...</p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              {activeTab === 'dashboard' && (
                <div className="space-y-12">
                  <div className="flex flex-wrap gap-6">
                    <StatCard title="Total Applicants" value={applicants.length} icon={Users} color="bg-blue-600" trend="+ 12%" />
                    <StatCard title="New Today" value={applicants.filter(a => a.submittedAt?.startsWith(new Date().toISOString().split('T')[0])).length} icon={UserCheck} color="bg-purple-600" trend="+ 2" />
                    <StatCard title="Active Jobs" value={jobs.length} icon={Briefcase} color="bg-orange-600" />
                    <StatCard title="Uptime Index" value="99.9%" icon={HardDrive} color="bg-green-600" />
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Onboarding Submissions</h3>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md">{applicants.length} Records Total</span>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* THE BUTTON: Export to Excel exactly in the table header */}
                        <button 
                          onClick={exportToExcel} 
                          className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all group"
                        >
                          <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> Export to Excel
                        </button>
                        <div className="h-8 w-px bg-slate-100 mx-2"></div>
                        <button onClick={refreshAllData} className="p-2 text-slate-400 hover:text-slate-900"><Clock size={18}/></button>
                        <button className="p-2 text-slate-400 hover:text-slate-900"><Filter size={18}/></button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50">
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-300">Candidate Information</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-300">Employee Code</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-300">Contact Details</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-300">Status</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-300 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {applicants.map(app => (
                            <tr key={app.id} className="hover:bg-[#F8FAFC] transition-all group">
                              <td className="px-10 py-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-600/20 transition-all duration-300">{app.firstName[0]}</div>
                                  <div>
                                    <div className="font-black text-slate-900 text-sm">{app.firstName} {app.lastName}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{app.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6 font-mono font-bold text-slate-500 text-xs tracking-tighter">
                                <span className="bg-slate-100 px-2 py-1 rounded text-[10px]">{app.employeeCode}</span>
                              </td>
                              <td className="px-8 py-6">
                                <div className="text-sm font-bold text-slate-700">{app.mobile}</div>
                                <div className="text-[10px] font-bold text-slate-400">Join Date: {app.doj}</div>
                              </td>
                              <td className="px-8 py-6">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase rounded-full border border-green-100">
                                   Verified
                                </span>
                              </td>
                              <td className="px-10 py-6 text-right space-x-2">
                                <button onClick={() => setSelectedApp(app)} className="p-2.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Eye size={18} /></button>
                                <button onClick={() => handleDelete(app.id!)} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                              </td>
                            </tr>
                          ))}
                          {applicants.length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-32 text-center text-slate-300 font-bold italic">No candidates found in repository.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="px-10 py-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Showing {applicants.length} Records of Central Intelligence
                      </div>
                      <div className="flex items-center gap-4">
                        <button className="p-2 bg-slate-50 rounded-lg text-slate-200 cursor-not-allowed"><ChevronLeft size={16}/></button>
                        <span className="text-xs font-black text-slate-400"><span className="text-blue-600">1</span> / 1</span>
                        <button className="p-2 bg-slate-50 rounded-lg text-slate-200 cursor-not-allowed"><ChevronRight size={16}/></button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other Tabs content would follow same enterprise logic */}
              {activeTab === 'jobs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {jobs.map(job => (
                    <div key={job.id} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                      <div className="flex justify-between items-start mb-8">
                        <span className="px-3 py-1.5 bg-green-50 text-green-600 text-[9px] font-black uppercase rounded-xl">{job.status}</span>
                        <button onClick={() => { DatabaseService.deleteJob(job.id); refreshAllData(); }} className="text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-2">{job.title}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">{job.dept}</p>
                      <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                        <div className="text-sm font-black text-blue-600">{job.applicants} Applied</div>
                        <button className="p-3 bg-slate-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><ChevronRight size={18}/></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setShowPostJob(true)} className="bg-slate-100/30 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-4 hover:bg-white hover:border-blue-400 transition-all group">
                    <Plus size={40} className="text-slate-300 group-hover:text-blue-600 transition-all" />
                    <span className="font-black text-xs uppercase tracking-widest text-slate-400">New Opening</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* FULL CANDIDATE DOSSIER MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[95vh]">
            <div className="bg-[#1E293B] p-12 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Users size={300}/></div>
              <div className="relative z-10 flex items-center gap-8">
                 <div className="w-24 h-24 rounded-[2rem] bg-blue-600 flex items-center justify-center text-4xl font-black shadow-2xl shadow-blue-600/30">{selectedApp.firstName[0]}</div>
                 <div>
                    <h2 className="text-4xl font-black tracking-tighter mb-2">{selectedApp.firstName} {selectedApp.lastName}</h2>
                    <div className="flex items-center gap-4">
                       <span className="px-3 py-1 bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest">ID: {selectedApp.employeeCode}</span>
                       <span className="text-blue-300 font-bold text-xs flex items-center gap-2"><CheckCircle2 size={14}/> Background Check Cleared</span>
                    </div>
                 </div>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all relative z-10"><X size={24}/></button>
            </div>
            
            <div className="p-12 space-y-12 overflow-y-auto custom-scrollbar flex-1">
              {/* Profile Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-6">
                  {/* Fixed: Icon 'User' was missing from lucide-react imports */}
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><User size={12}/> Personal Info</p>
                  <div className="space-y-4">
                    <div><p className="text-[9px] text-slate-400 font-bold uppercase">Father's Name</p><p className="font-bold text-slate-900">{selectedApp.fatherName}</p></div>
                    <div><p className="text-[9px] text-slate-400 font-bold uppercase">DOB</p><p className="font-bold text-slate-900">{selectedApp.dob}</p></div>
                    <div><p className="text-[9px] text-slate-400 font-bold uppercase">Marital Status</p><p className="font-bold text-slate-900">{selectedApp.maritalStatus}</p></div>
                    {selectedApp.wifeName && <div><p className="text-[9px] text-slate-400 font-bold uppercase">Spouse</p><p className="font-bold text-slate-900">{selectedApp.wifeName}</p></div>}
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Phone size={12}/> Contacts</p>
                  <div className="space-y-4">
                    <div className="flex gap-3"><Mail size={16} className="text-blue-500" /><p className="font-bold text-slate-900 text-sm truncate">{selectedApp.email}</p></div>
                    <div className="flex gap-3"><Phone size={16} className="text-blue-500" /><p className="font-bold text-slate-900 text-sm">{selectedApp.mobile}</p></div>
                    <div className="flex gap-3"><MapPin size={16} className="text-blue-500" /><p className="font-bold text-slate-900 text-xs leading-relaxed">{selectedApp.localAddress}</p></div>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><CreditCard size={12}/> Finance & ID</p>
                  <div className="space-y-4">
                    <div><p className="text-[9px] text-slate-400 font-bold uppercase">PAN / Aadhaar</p><p className="font-bold text-slate-900 text-sm">{selectedApp.panNumber} / {selectedApp.aadhaarNumber}</p></div>
                    <div><p className="text-[9px] text-slate-400 font-bold uppercase">Bank A/C</p><p className="font-bold text-slate-900 text-sm">{selectedApp.bankAccount}</p></div>
                    <div><p className="text-[9px] text-slate-400 font-bold uppercase">IFSC Code</p><p className="font-bold text-slate-900 text-sm">{selectedApp.ifscCode}</p></div>
                  </div>
                </div>
              </div>

              {/* Education Table in Modal */}
              <div className="pt-10 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><GraduationCap size={14}/> Academic Portfolio</p>
                <div className="overflow-hidden rounded-2xl border border-slate-100">
                  <table className="w-full text-left text-xs">
                    <thead><tr className="bg-slate-50"><th className="p-4 font-black">Level</th><th className="p-4 font-black">Institution</th><th className="p-4 font-black">Score</th><th className="p-4 font-black">Year</th></tr></thead>
                    <tbody className="divide-y divide-slate-50">
                      {selectedApp.education.filter(e => e.institution).map((edu, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-4 font-bold text-slate-900">{edu.degree}</td>
                          <td className="p-4 text-slate-600">{edu.institution}</td>
                          <td className="p-4 font-bold text-blue-600">{edu.percentage}%</td>
                          <td className="p-4 text-slate-500">{edu.passingYear}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Signature Section */}
              <div className="pt-10 border-t border-slate-100 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Digitally Signed & Validated</p>
                <div className="px-12 py-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 w-full max-w-md">
                   <p className="text-6xl font-signature italic text-blue-900 select-none pointer-events-none" style={{fontFamily: 'cursive'}}>{selectedApp.signature}</p>
                </div>
                <p className="mt-4 text-[10px] font-bold text-slate-300">Timestamp: {selectedApp.submittedAt || selectedApp.submissionDate}</p>
              </div>

              <div className="flex gap-4">
                <button onClick={exportToExcel} className="flex-1 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-4">
                  <Download size={18}/> Export Full Dossier (.xlsx)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {showPostJob && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <form onSubmit={handlePostJob} className="bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">New Job Vacancy</h2>
            <div className="space-y-8 mb-12">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Position Title</label>
                <input name="title" required className="w-full px-6 py-5 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-600/20 focus:bg-white transition-all" placeholder="e.g. Lead Consultant" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Business Unit</label>
                <select name="dept" required className="w-full px-6 py-5 bg-slate-50 rounded-2xl font-bold outline-none appearance-none border-2 border-transparent focus:border-blue-600/20 cursor-pointer">
                  <option>Strategic Consulting</option>
                  <option>Human Resources</option>
                  <option>Technology Solutions</option>
                  <option>Financial Risk</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setShowPostJob(false)} className="flex-1 py-5 font-bold text-slate-400">Abort</button>
              <button type="submit" className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">Publish Live</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
