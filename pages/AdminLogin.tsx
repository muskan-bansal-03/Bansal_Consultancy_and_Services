
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate auth with the provided default credentials
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('bansal_admin_session', 'true');
        navigate('/admin/dashboard');
      } else {
        alert("Authentication failed. Ensure you are using correct administrative credentials.");
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 relative overflow-hidden px-4">
      {/* Abstract Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-900 to-slate-900"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-blue-900/10 to-transparent"></div>
      </div>

      <div className="max-w-lg w-full relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2rem] text-blue-950 font-black text-5xl mb-8 shadow-[0_0_50px_rgba(255,255,255,0.1)] transform hover:rotate-6 transition-transform">B</div>
          <div className="flex flex-col items-center gap-3">
            <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-blue-500/20">Secured Node</span>
            <h1 className="text-4xl font-black text-white tracking-tight">Enterprise Console</h1>
            <p className="text-slate-400 font-medium">Internal administrative access for Bansal Consultancy</p>
          </div>
        </div>

        <div className="bg-white p-12 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="group">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Access Identity</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none font-bold text-slate-900"
                    placeholder="Username"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Security Key</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-14 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none font-bold text-slate-900"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-600 transition-all cursor-pointer" />
                <span className="text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Remember device</span>
              </label>
              <button type="button" className="text-sm font-black text-blue-600 hover:text-blue-700">Need help?</button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-900 text-white font-black py-5 rounded-2xl hover:bg-black transition-all shadow-2xl shadow-blue-900/10 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Authorizing...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={22} />
                  <span>Execute Authentication</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => navigate('/')} 
            className="group inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm font-black uppercase tracking-widest transition-all"
          >
            <span className="w-8 h-[2px] bg-slate-700 group-hover:bg-blue-600 group-hover:w-12 transition-all"></span>
            Terminate & Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
