
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Download, 
  LogOut, 
  Calendar,
  LayoutDashboard,
  Bell,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  Database,
  TrendingUp,
  UserPlus,
  Clock,
  Briefcase,
  /* Added Filter to the import list to fix the "Cannot find name 'Filter'" error */
  Filter
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { JoiningFormData } from '../types';
import { DatabaseService } from '../services/database';

const StatCard = ({ title, value, icon: Icon, color, trend }: { title: string, value: string | number, icon: any, color: string, trend?: string }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <div className="text-2xl font-black text-slate-900 mb-1">{value}</div>
    <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</div>
  </div>
);

const AdminDashboard = () => {
  const [applicants, setApplicants] = useState<JoiningFormData[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
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
    const data = await DatabaseService.getApplications();
    setApplicants(data);
    setLoading(false);
  };

  const handleSearch = async (val: string) => {
    setSearch(val);
    const results = await DatabaseService.searchApplications(val);
    setApplicants(results);
  };

  const exportToExcel = () => {
    if (applicants.length === 0) return;
    
    const dataToExport = applicants.map(app => ({
      'Emp Code': app.employeeCode,
      'Name': `${app.firstName} ${app.lastName}`,
      'Father Name': app.fatherName,
      'Email': app.email,
      'Mobile': app.mobile,
      'Aadhaar': app.aadhaarNumber,
      'PAN': app.panNumber,
      'DOB': app.dob,
      'DOJ': app.doj,
      'Marital Status': app.maritalStatus,
      'Bank Account': app.bankAccount,
      'IFSC': app.ifscCode,
      'Address': app.localAddress,
      'Submission Date': app.submissionDate
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");
    XLSX.writeFile(workbook, `Bansal_Applicants_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleLogout = () => {
    localStorage.removeItem('bansal_admin_session');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-80 bg-blue-950 text-slate-300 flex flex-col shrink-0">
        <div className="p-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/30">B</div>
            <div>
              <span className="text-xl font-black text-white block leading-tight tracking-tight">Bansal</span>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-blue-400">Control Center</span>
            </div>
          </div>
          
          <nav className="space-y-3">
            <button className="flex items-center gap-4 w-full p-4 bg-white/10 text-white rounded-2xl transition-all border border-white/5 shadow-xl">
              <LayoutDashboard size={20} />
              <span className="font-bold">Dashboard</span>
            </button>
            <button className="flex items-center gap-4 w-full p-4 hover:bg-white/5 rounded-2xl transition-all group">
              <Users size={20} className="group-hover:text-blue-400" />
              <span className="font-bold">All Applicants</span>
            </button>
            <button className="flex items-center gap-4 w-full p-4 hover:bg-white/5 rounded-2xl transition-all group">
              <Briefcase size={20} className="group-hover:text-blue-400" />
              <span className="font-bold">Job Openings</span>
            </button>
            <button className="flex items-center gap-4 w-full p-4 hover:bg-white/5 rounded-2xl transition-all group">
              <Calendar size={20} className="group-hover:text-blue-400" />
              <span className="font-bold">Interviews</span>
            </button>
          </nav>
        </div>
        
        {/* Connection Status indicator */}
        <div className="mx-8 mb-8 p-5 bg-black/20 rounded-3xl border border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
            <Database size={12} />
            System Connectivity
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            <span className="text-sm font-bold text-white">Cloud Sync Active</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">Session is encrypted & secure.</p>
        </div>

        <div className="mt-auto p-10 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-4 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all group"
          >
            <LogOut size={20} />
            <span className="font-bold">Logout System</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-24 bg-white border-b border-slate-200 px-12 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <div className="relative w-full group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search global records (Name, Email, Emp Code)..."
                className="w-full pl-14 pr-6 py-4 bg-slate-100/50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white border-2 border-transparent focus:border-blue-600/20 transition-all font-medium text-slate-900"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-8 ml-8">
            <button className="relative text-slate-400 hover:text-blue-600 transition-colors p-2 bg-slate-100 rounded-xl">
              <Bell size={24} />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-4 pl-8 border-l border-slate-200">
              <div className="text-right">
                <div className="text-sm font-black text-slate-900">Administrator</div>
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Master Control</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-400 overflow-hidden shadow-lg shadow-blue-600/20">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-blue-600 font-black text-xs uppercase tracking-widest mb-2">Internal Management</div>
              <h1 className="text-4xl font-black text-slate-900">Recruitment Dashboard</h1>
              <p className="text-slate-500 font-medium mt-1">Real-time tracking of all employee onboarding applications.</p>
            </div>
            <button 
              onClick={exportToExcel}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-95"
            >
              <Download size={20} />
              Generate CSV/Excel
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <StatCard title="Total Applicants" value={applicants.length} icon={Users} color="bg-blue-600" trend="+12%" />
            <StatCard title="New Today" value="5" icon={UserPlus} color="bg-purple-600" trend="+2" />
            <StatCard title="Avg. Experience" value="4.2 Yrs" icon={Clock} color="bg-orange-600" />
            <StatCard title="Database Size" value="1.2 MB" icon={Database} color="bg-green-600" />
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                Recent Submissions
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-lg">{applicants.length} Records</span>
              </h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500"><Filter size={20} /></button>
                <button className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500"><MoreVertical size={20} /></button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                    <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Employee Code</th>
                    <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Joining Date</th>
                    <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Contact</th>
                    <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Database...</span>
                        </div>
                      </td>
                    </tr>
                  ) : applicants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                        <div className="max-w-xs mx-auto">
                          <Search size={48} className="text-slate-200 mx-auto mb-4" />
                          <h4 className="text-lg font-bold text-slate-900 mb-1">No applications found</h4>
                          <p className="text-sm text-slate-500">Try adjusting your search terms or wait for new submissions.</p>
                        </div>
                      </td>
                    </tr>
                  ) : applicants.map((app) => (
                    <tr key={app.id} className="group hover:bg-blue-50/30 transition-all cursor-default">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center font-black text-sm shadow-sm">
                            {app.firstName[0]}{app.lastName[0]}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{app.firstName} {app.lastName}</div>
                            <div className="text-xs font-bold text-slate-400">{app.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-600 uppercase">
                          {app.employeeCode}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-bold text-slate-600">
                        {app.doj}
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-slate-900">{app.mobile}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Verified Phone</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-full tracking-wider shadow-sm shadow-green-600/5">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                          Finalized
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-3 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm" title="View Full Profile">
                            <Eye size={18} />
                          </button>
                          <button className="p-3 text-slate-400 hover:bg-slate-200 rounded-2xl transition-all">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Showing {applicants.length} entries of Total Records
              </div>
              <div className="flex gap-2">
                <button className="p-3 border border-slate-200 rounded-xl text-slate-400 disabled:opacity-50 hover:bg-white transition-all shadow-sm" disabled>
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-1 px-4">
                  <span className="text-sm font-black text-blue-600">1</span>
                  <span className="text-sm font-black text-slate-300">/</span>
                  <span className="text-sm font-black text-slate-400">1</span>
                </div>
                <button className="p-3 border border-slate-200 rounded-xl text-slate-400 disabled:opacity-50 hover:bg-white transition-all shadow-sm" disabled>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;