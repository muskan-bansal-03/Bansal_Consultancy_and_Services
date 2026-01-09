
# Bansal Consultancy - Go-Live Guide

Follow these steps to make your website public and functional for all users.

## Phase 1: The Database (Shared Storage)
1. Go to [Railway.app](https://railway.app) or [Aiven.io](https://aiven.io).
2. Create a "MySQL" database (Free Tier).
3. Copy the **Connection String** (Host, User, Password, Port).
4. Run the code in `schema.sql` inside your new database.

## Phase 2: The Backend (API)
1. Create a GitHub Repository and upload the `server.js` and `package.json`.
2. Go to [Render.com](https://render.com).
3. Select **New Web Service** and connect your GitHub.
4. Add **Environment Variables** in Render:
   - `DB_HOST`: (your cloud db host)
   - `DB_USER`: (your cloud db user)
   - `DB_PASS`: (your cloud db password)
   - `DB_NAME`: bansal_consultancy
5. Once deployed, Render will give you a URL like: `https://bansal-api.onrender.com`.

## Phase 3: The Frontend (Website)
1. In `services/database.ts`, update `API_BASE_URL` with your Render URL.
2. Go to [Vercel.com](https://vercel.com).
3. Click **Add New** -> **Project** -> Connect GitHub.
4. Click **Deploy**.
5. Vercel will give you a public URL like: `https://bansal-consultancy.vercel.app`.

## Phase 4: Verification
1. Open your Vercel URL on your phone or another computer.
2. Fill out a joining form.
3. Open the URL on a different device, log into the Admin Dashboard (`admin`/`admin123`).
4. You should see the data appearing everywhere!

---
**Need help?** For a truly professional enterprise setup, you should also purchase the domain `bansalconsultancy.com` via GoDaddy or Google Domains and point it to Vercel.
