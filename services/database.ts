
import { JoiningFormData } from '../types';

const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://your-api-url.render.com';
const STORAGE_KEYS = {
  APPLICANTS: 'bcs_applicants',
  JOBS: 'bcs_jobs',
  INTERVIEWS: 'bcs_interviews'
};

const fetchWithTimeout = async (url: string, options: any = {}, timeout = 2000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
};

export const DatabaseService = {
  // --- APPLICANTS ---
  saveApplication: async (data: JoiningFormData) => {
    const newEntry = { ...data, id: `BCS-${Date.now()}`, submittedAt: new Date().toISOString() };
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICANTS) || '[]');
    localStorage.setItem(STORAGE_KEYS.APPLICANTS, JSON.stringify([newEntry, ...local]));

    try {
      await fetchWithTimeout(`${API_BASE_URL}/api/save-application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) { console.debug("Sync pending..."); }
    return { success: true, id: newEntry.id };
  },

  getApplications: async (): Promise<JoiningFormData[]> => {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICANTS) || '[]');
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/admin/applications`);
      if (res.ok) {
        const remote = await res.json();
        localStorage.setItem(STORAGE_KEYS.APPLICANTS, JSON.stringify(remote));
        return remote;
      }
    } catch (e) {}
    return local;
  },

  deleteApplication: async (id: string) => {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICANTS) || '[]');
    localStorage.setItem(STORAGE_KEYS.APPLICANTS, JSON.stringify(local.filter((a: any) => a.id !== id)));
    try { await fetchWithTimeout(`${API_BASE_URL}/api/admin/applications/${id}`, { method: 'DELETE' }); } catch(e) {}
  },

  searchApplications: async (query: string) => {
    const all = await DatabaseService.getApplications();
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(a => 
      a.firstName.toLowerCase().includes(q) || 
      a.lastName.toLowerCase().includes(q) || 
      a.employeeCode.toLowerCase().includes(q)
    );
  },

  // --- JOBS & INTERVIEWS (Relatable Mock Data + Local Storage) ---
  getJobs: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.JOBS) || JSON.stringify([
    { id: 1, title: 'Senior Strategy Consultant', dept: 'Consulting', status: 'Active', applicants: 12 },
    { id: 2, title: 'HR Operations Lead', dept: 'Human Resources', status: 'Active', applicants: 8 }
  ])),
  
  saveJob: (job: any) => {
    const jobs = DatabaseService.getJobs();
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify([{...job, id: Date.now()}, ...jobs]));
  },

  deleteJob: (id: number) => {
    const jobs = DatabaseService.getJobs();
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs.filter((j: any) => j.id !== id)));
  },

  getInterviews: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.INTERVIEWS) || JSON.stringify([
    { id: 1, name: 'Rahul Sharma', role: 'Business Analyst', time: '10:30 AM', date: 'Oct 24, 2023', type: 'Video Call', status: 'Confirmed' }
  ])),

  scheduleInterview: (interview: any) => {
    const current = DatabaseService.getInterviews();
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify([{...interview, id: Date.now()}, ...current]));
  }
};
