
import { JoiningFormData } from '../types';

// In production, change this to your hosted backend URL (e.g., https://api.bansalconsultancy.com)
const API_BASE_URL = window.location.hostname === 'localhost' ? '' : 'https://your-api-url.render.com';
const STORAGE_KEY = 'bansal_consultancy_data';

export const DatabaseService = {
  saveApplication: async (data: JoiningFormData): Promise<{ success: boolean; id: string }> => {
    // If we have a backend URL, try to use the real API
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/save-application`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (response.ok) return await response.json();
      } catch (e) {
        console.warn("Backend unavailable, falling back to LocalStorage", e);
      }
    }

    // Fallback/Development logic
    await new Promise(resolve => setTimeout(resolve, 800));
    const applications = DatabaseService.getApplicationsSync();
    const newId = `APP-${Date.now()}`;
    const newEntry = { ...data, id: newId, submittedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...applications, newEntry]));
    return { success: true, id: newId };
  },

  getApplications: async (id: string): Promise<JoiningFormData[]> => {
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/applications`);
        if (response.ok) return await response.json();
      } catch (e) {
        console.warn("Backend unavailable, falling back to LocalStorage", e);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    return DatabaseService.getApplicationsSync();
  },

  getApplicationsSync: (): JoiningFormData[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
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
