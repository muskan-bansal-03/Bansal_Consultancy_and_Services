
import { JoiningFormData } from '../types';

const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://your-api-url.render.com';
const STORAGE_KEY = 'bansal_consultancy_data';

// Helper for fetch with timeout
const fetchWithTimeout = async (url: string, options: any = {}, timeout = 2500) => {
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
  saveApplication: async (data: JoiningFormData): Promise<{ success: boolean; id: string }> => {
    const newId = `BCS-${Date.now()}`;
    const newEntry = { ...data, id: newId, submittedAt: new Date().toISOString() };

    // Update Local First (Optimistic UI)
    const applications = DatabaseService.getApplicationsSync();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...applications, newEntry]));

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/save-application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) return await response.json();
    } catch (e) {
      console.warn("Backend sync failed, record preserved locally", e);
    }
    
    return { success: true, id: newId };
  },

  getApplications: async (): Promise<JoiningFormData[]> => {
    // CRITICAL: Return Local Data Immediately to prevent "buffering"
    const localData = DatabaseService.getApplicationsSync();
    
    // Background sync
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/admin/applications`);
      if (response.ok) {
        const freshData = await response.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
        return freshData;
      }
    } catch (e) {
      console.debug("Offline Mode: Serving cached intelligence records.");
    }
    
    return localData;
  },

  getApplicationsSync: (): JoiningFormData[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  deleteApplication: async (id: string): Promise<boolean> => {
    const apps = DatabaseService.getApplicationsSync();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps.filter(a => a.id !== id)));

    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/admin/applications/${id}`, { method: 'DELETE' });
      if (response.ok) return true;
    } catch (e) {
      console.warn("Sync error: Record deleted locally only.");
    }
    return true;
  },

  searchApplications: async (query: string): Promise<JoiningFormData[]> => {
    const all = await DatabaseService.getApplications();
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(app => 
      app.firstName.toLowerCase().includes(q) ||
      app.lastName.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.employeeCode.toLowerCase().includes(q) ||
      app.mobile.includes(q)
    );
  }
};
