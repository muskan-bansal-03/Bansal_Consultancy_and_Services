
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, Download, LogOut, Calendar, LayoutDashboard, 
  Bell, MoreVertical, Eye, Database, 
  TrendingUp, Briefcase, Trash2, X,
  CheckCircle2, Menu, ChevronRight, UserCheck, 
  Filter, ChevronLeft, HardDrive, Clock, Video, Plus,
  MapPin, Phone, Mail, FileText
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
    if (window.confirm("CRITICAL: Permanent deletion from database. Proceed?")) {
      await DatabaseService.deleteApplication(id);
      refreshAllData();
    }
  };

  const exportToExcel = () => {
    if (applicants.length === 0) return alert("No records available.");
    const formatted = applicants.map(a => ({
      'Employee Code': a.employeeCode,
      'Full Name': `${a.firstName} ${a.lastName}`,
      'Email': a.email,
      'Contact': a.mobile,
      'Joining': a.doj,
      'Aadhaar': a.aadhaarNumber,
      'PAN': a.panNumber,
      'Address': a.localAddress,
      'Status': 'Verified'
    }));
    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TalentPool");
    XLSX.writeFile(wb, `Bansal_DB_Export_${Date.now()}.xlsx`);
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

  const renderDashboard = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-wrap gap-6">
        <StatCard title="Total Applicants" value={applicants.length} icon={Users} color="bg-blue-600" trend="+ 12%" />
        <StatCard title="New Submissions" value={applicants.filter(a => a.submittedAt?.includes(new Date().toISOString().split('T')[0])).length} icon={UserCheck} color="bg-purple-600" trend="+ 3" />
        <StatCard title="Open Positions" value={jobs.length} icon={Briefcase} color="bg-orange-600" />
        <StatCard title="Database Index" value="1.4 MB" icon={HardDrive} color="bg-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Intelligence</h3>
              <button onClick={() => setActiveTab('applicants')} className="text-blue-600 font-bold text-xs hover:underline">View All Repository</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-300">Candidate</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-300">Emp Code</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-300 text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {applicants.slice(0, 5).map(app => (
                    <tr key={app.id} className="hover:bg-slate-50/50 group transition-all">
                      <td className="px-10 py-6 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">{app.firstName[0]}</div>
                        <div className="font-bold text-slate-900 text-sm">{app.firstName} {app.lastName}</div>
                      </td>
                      <td className="px-8 py-6 font-bold text-slate-400 text-xs tracking-widest">{app.employeeCode}</td>
                      <td className="px-10 py-6 text-right">
                        <button onClick={() => setSelectedApp(app)} className="p-2 text-slate-300 hover:text-blue-600"><Eye size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Schedule</h3>
          {interviews.map(i => (
            <div key={i.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{i.time}</span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <h4 className="font-black text-slate-900 text-sm mb-1">{i.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{i.role}</p>
              <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-blue-600 transition-all">
                <Video size={14}/> Connect Line
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
      {jobs.map(job => (
        <div key={job.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative group">
          <button onClick={() => { DatabaseService.deleteJob(job.id); refreshAllData(); }} className="absolute top-6 right-6 p-2 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
            <Trash2 size={18} />
          </button>
          <div className="inline-block px-3 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase rounded-lg mb-6">{job.status}</div>
          <h3 className="text-xl font-black text-slate-900 mb-2">{job.title}</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">{job.dept}</p>
          <div className="flex items-center justify-between pt-8 border-t border-slate-50">
            <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{job.applicants} Applied</div>
            <button className="p-3 bg-slate-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><ChevronRight size={18}/></button>
          </div>
        </div>
      ))}
      <button onClick={() => setShowPostJob(true)} className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 hover:bg-white hover:border-blue-400 transition-all text-slate-400">
        <Plus size={32}/>
        <span className="font-black text-xs uppercase tracking-widest">Publish New Vacancy</span>
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-inter">
      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-[90] lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#1E293B] z-[100] transition-transform duration-300 transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">B</div>
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
            <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3"><Database size={10} /> Connectivity</div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-black text-white">Cloud Sync Active</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">Secure internal session.</p>
          </div>
          
          <button onClick={() => navigate('/')} className="flex items-center gap-4 p-4 text-slate-400 hover:text-red-400 font-bold text-sm transition-colors mt-auto">
            <LogOut size={18} /> <span>Exit Terminal</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 md:px-12 shrink-0 z-50">
          <div className="flex items-center gap-6 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"><Menu size={20}/></button>
            <div className="relative w-full max-w-xl group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Search candidates, employee codes, emails..."
                className="w-full pl-12 pr-6 py-3 bg-[#F1F5F9] border-none rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <button onClick={exportToExcel} className="p-2.5 bg-[#F1F5F9] text-slate-400 rounded-xl hover:text-blue-600 transition-all"><Download size={20}/></button>
             <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <div className="text-right hidden sm:block">
                  <p className="text-[11px] font-black text-slate-900 leading-none">Admin</p>
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Master</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center font-black text-blue-600">AD</div>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center py-40">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retrieving Master Records...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'jobs' && renderJobs()}
              {activeTab === 'applicants' && (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col animate-in fade-in duration-500">
                  <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Talent Repository</h3>
                    <div className="flex items-center gap-4">
                      <button onClick={exportToExcel} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all">
                        <Download size={14}/> Export XLSX
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900"><Filter size={18}/></button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-300">Candidate</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-300">Code</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-300">Joining</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-300">Contact</th>
                          <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-300 text-right">Review</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {applicants.map(app => (
                          <tr key={app.id} className="hover:bg-[#F8FAFC] transition-all group">
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">{app.firstName[0]}</div>
                                <div className="font-bold text-slate-900 text-sm">{app.firstName} {app.lastName}</div>
                              </div>
                            </td>
                            <td className="px-8 py-6 font-bold text-slate-400 text-xs">{app.employeeCode}</td>
                            <td className="px-8 py-6 font-bold text-slate-500 text-xs">{app.doj}</td>
                            <td className="px-8 py-6 font-bold text-slate-500 text-xs">{app.mobile}</td>
                            <td className="px-10 py-6 text-right space-x-1">
                              <button onClick={() => setSelectedApp(app)} className="p-2.5 text-slate-300 hover:text-blue-600"><Eye size={18} /></button>
                              <button onClick={() => handleDelete(app.id!)} className="p-2.5 text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Candidate Profile Dossier Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[95vh]">
            <div className="bg-[#1E293B] p-10 text-white flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-1">{selectedApp.firstName} {selectedApp.lastName}</h2>
                <div className="flex items-center gap-2">
                   <span className="px-2 py-0.5 bg-blue-600 rounded text-[9px] font-black uppercase tracking-widest">ID: {selectedApp.employeeCode}</span>
                   <span className="text-blue-400 font-bold text-[10px] uppercase tracking-widest">Master Verified</span>
                </div>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><X size={24}/></button>
            </div>
            
            <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-2 gap-8">
                 <div className="flex gap-4 items-start">
                   <Mail className="text-slate-300" size={18} />
                   <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p><p className="font-bold text-slate-900 text-sm">{selectedApp.email}</p></div>
                 </div>
                 <div className="flex gap-4 items-start">
                   <Phone className="text-slate-300" size={18} />
                   <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mobile</p><p className="font-bold text-slate-900 text-sm">{selectedApp.mobile}</p></div>
                 </div>
                 <div className="flex gap-4 items-start">
                   <FileText className="text-slate-300" size={18} />
                   <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Aadhaar</p><p className="font-bold text-slate-900 text-sm">{selectedApp.aadhaarNumber}</p></div>
                 </div>
                 <div className="flex gap-4 items-start">
                   <Database className="text-slate-300" size={18} />
                   <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bank Account</p><p className="font-bold text-slate-900 text-sm">{selectedApp.bankAccount}</p></div>
                 </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><MapPin size={12}/> Address Mapping</p>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-xs font-bold text-slate-600 leading-relaxed">
                  {selectedApp.localAddress}
                </div>
              </div>
              
              <div className="pt-10 border-t border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Electronic Signature</p>
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex items-center justify-center">
                  <p className="text-6xl font-signature italic text-blue-900 leading-none select-none" style={{fontFamily: 'cursive'}}>{selectedApp.signature}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {showPostJob && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <form onSubmit={handlePostJob} className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Publish New Vacancy</h2>
            <div className="space-y-6 mb-10">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Position Title</label>
                <input name="title" required className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-600/5 transition-all" placeholder="e.g. Lead Developer" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Department</label>
                <select name="dept" required className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold outline-none appearance-none cursor-pointer">
                  <option>Consulting</option>
                  <option>Technology</option>
                  <option>HR & Admin</option>
                  <option>Finance</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setShowPostJob(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
              <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20">Execute Post</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
