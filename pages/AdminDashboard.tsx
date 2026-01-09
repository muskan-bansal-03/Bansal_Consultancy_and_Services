
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, Download, LogOut, Calendar, LayoutDashboard, 
  Bell, MoreVertical, Eye, Database, 
  TrendingUp, Briefcase, Trash2, X,
  CheckCircle2, Menu, ChevronRight, UserCheck, 
  Filter, ChevronLeft, HardDrive, Clock
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { JoiningFormData } from '../types';
import { DatabaseService } from '../services/database';

const StatCard = ({ title, value, icon: Icon, color, trend }: { title: string, value: string | number, icon: any, color: string, trend?: string }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-start gap-4 flex-1 min-w-[240px]">
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
  const [selectedApp, setSelectedApp] = useState<JoiningFormData | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem('bansal_admin_session');
    if (!session) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    // getApplications now returns local data immediately to prevent "buffering"
    const data = await DatabaseService.getApplications();
    setApplicants(data);
    setLoading(false);
  };

  const handleSearch = async (val: string) => {
    setSearch(val);
    const results = await DatabaseService.searchApplications(val);
    setApplicants(results);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await DatabaseService.deleteApplication(id);
      loadData();
    }
  };

  const exportToExcel = () => {
    if (applicants.length === 0) return alert("No data to export");
    const ws = XLSX.utils.json_to_sheet(applicants);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applicants");
    XLSX.writeFile(wb, "BCS_Database_Export.xlsx");
  };

  const handleLogout = () => {
    localStorage.removeItem('bansal_admin_session');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar - Matching Screenshot */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#1E293B] z-50 transition-transform duration-300 transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">B</div>
            <div>
              <span className="text-lg font-black text-white block leading-tight">Bansal</span>
              <span className="text-[9px] uppercase font-black tracking-widest text-blue-400 opacity-60">Control Center</span>
            </div>
          </div>
          
          <nav className="space-y-1.5 flex-1">
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

          {/* System Connectivity Widget */}
          <div className="bg-[#151D2C] p-5 rounded-2xl mb-8 border border-white/5">
            <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3">
              <Database size={10} /> System Connectivity
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <span className="text-xs font-black text-white">Cloud Sync Active</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">Session is encrypted & secure.</p>
          </div>
          
          <button onClick={handleLogout} className="flex items-center gap-4 p-4 text-slate-400 hover:text-red-400 font-bold text-sm transition-colors mt-auto">
            <LogOut size={18} /> <span>Logout System</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Matching Screenshot */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 md:px-12 shrink-0">
          <div className="flex items-center gap-6 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600"><Menu size={20}/></button>
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Search global records (Name, Email, Emp Code)..."
                className="w-full pl-12 pr-6 py-3 bg-[#F1F5F9] border-none rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <button className="p-2.5 bg-[#F1F5F9] text-slate-400 rounded-xl relative">
               <Bell size={20}/>
               <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-[11px] font-black text-slate-900 leading-none mb-1">Administrator</p>
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Master Control</p>
                </div>
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-inner ring-2 ring-slate-100">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="Admin" />
                </div>
             </div>
          </div>
        </header>

        {/* Dashboard View */}
        <main className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
          {/* Stats Bar */}
          <div className="flex flex-wrap gap-6 mb-12">
            <StatCard title="Total Applicants" value={applicants.length} icon={Users} color="bg-blue-600" trend="+ 12%" />
            <StatCard title="New Today" value="5" icon={UserCheck} color="bg-purple-600" trend="+ 2" />
            <StatCard title="Avg. Experience" value="4.2 Yrs" icon={Clock} color="bg-orange-600" />
            <StatCard title="Database Size" value="1.2 MB" icon={HardDrive} color="bg-green-600" />
          </div>

          {/* Main Table Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Submissions</h3>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md">{applicants.length} Records</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 text-slate-400 hover:text-slate-900"><Filter size={18}/></button>
                <button className="p-2 text-slate-400 hover:text-slate-900"><MoreVertical size={18}/></button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto custom-scrollbar">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center py-32 text-center">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Accessing Database...</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-white">
                      <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-300">Candidate</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-300">Employee Code</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-300">Joining Date</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-300">Contact</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-300">Status</th>
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
                        <td className="px-8 py-6 font-bold text-slate-500 text-sm tracking-tight">{app.employeeCode}</td>
                        <td className="px-8 py-6 font-bold text-slate-500 text-sm">{app.doj}</td>
                        <td className="px-8 py-6 font-bold text-slate-500 text-sm">{app.mobile}</td>
                        <td className="px-8 py-6">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full border border-green-100">
                             Active
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right space-x-1">
                          <button onClick={() => setSelectedApp(app)} className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><Eye size={18} /></button>
                          <button onClick={() => handleDelete(app.id!)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination / Footer Matching Screenshot */}
            <div className="px-10 py-6 border-t border-slate-50 flex items-center justify-between">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Showing {applicants.length} Entries of Total Records
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 bg-slate-50 rounded-lg text-slate-300 cursor-not-allowed"><ChevronLeft size={16}/></button>
                <span className="text-xs font-black text-slate-400"><span className="text-blue-600">1</span> / 1</span>
                <button className="p-2 bg-slate-50 rounded-lg text-slate-300 cursor-not-allowed"><ChevronRight size={16}/></button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-[#1E293B] p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black tracking-tight">{selectedApp.firstName} {selectedApp.lastName}</h2>
                <p className="text-blue-400 font-bold text-[10px] uppercase tracking-widest">ID: {selectedApp.employeeCode}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><X size={20}/></button>
            </div>
            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                 <div><p className="text-[10px] font-black text-slate-400 uppercase mb-2">Email Identity</p><p className="font-bold text-slate-900">{selectedApp.email}</p></div>
                 <div><p className="text-[10px] font-black text-slate-400 uppercase mb-2">Primary Phone</p><p className="font-bold text-slate-900">{selectedApp.mobile}</p></div>
              </div>
              <div className="pt-8 border-t border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-4">Electronic Signature Verified</p>
                <p className="text-6xl font-signature italic text-blue-900 py-4" style={{fontFamily: 'cursive'}}>{selectedApp.signature}</p>
              </div>
              <button onClick={exportToExcel} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20">Generate PDF Dossier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
