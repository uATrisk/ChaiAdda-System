# 🚀 Deployment Guide - Chai Adda

This guide will help you deploy the Chai Adda application with the frontend on Vercel and backend on Render.

## 📋 Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Render account (sign up at https://render.com)
- PostgreSQL database (we'll use Render's free PostgreSQL)

---

## 🗄️ Step 1: Deploy PostgreSQL Database on Render

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" → "PostgreSQL"

2. **Configure Database**
   - **Name**: `chaiadda-db`
   - **Database**: `chaiadda`
   - **User**: (auto-generated)
   - **Region**: Choose closest to you
   - **Plan**: Free

3. **Create Database**
   - Click "Create Database"
   - Wait for provisioning (2-3 minutes)

4. **Get Connection String**
   - Go to your database dashboard
   - Copy the **Internal Database URL** (starts with `postgresql://`)
   - Save this for later - you'll need it for the backend

---

## 🔧 Step 2: Prepare Backend for Deployment

### 2.1 Update Backend Configuration

1. **Create/Update `backend/.env.production`**
```bash
cd backend
```

Create a file named `.env.production` (this is just for reference, actual values will be set in Render):
```env
DATABASE_URL=your_render_postgres_url
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=8000
NODE_ENV=production
```

2. **Update `backend/package.json`**

Add these scripts if not already present:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "postinstall": "prisma generate"
  }
}
```

3. **Create `backend/render.yaml` (optional but recommended)**
```yaml
services:
  - type: web
    name: chaiadda-backend
    env: node
    buildCommand: npm install && npx prisma generate && npm run build
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: NODE_ENV
        value: production
```

4. **Commit Changes**
```bash
git add .
git commit -m "Prepare backend for deployment"
git push
```

---

## 🌐 Step 3: Deploy Backend on Render

1. **Create New Web Service**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `chaiadda-backend`
   - **Region**: Same as your database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: 
     ```bash
     npm install && npx prisma generate && npm run build
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```
   - **Plan**: Free

3. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   
   - **DATABASE_URL**: Paste your Render PostgreSQL Internal URL
   - **JWT_SECRET**: Create a strong secret (e.g., `your-super-secret-jwt-key-2024`)
   - **NODE_ENV**: `production`
   - **PORT**: `8000`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL (e.g., `https://chaiadda-backend.onrender.com`)

5. **Run Database Migrations**
   - Go to your backend service dashboard
   - Click "Shell" tab
   - Run:
     ```bash
     npx prisma migrate deploy
     ```

---

## 🎨 Step 4: Prepare Frontend for Deployment

### 4.1 Update Frontend Configuration

1. **Update `frontend/.env.local`**
```bash
cd ../frontend
```

Create/update `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

Replace `your-backend-url` with your actual Render backend URL.

2. **Update API Configuration**

Check `frontend/src/lib/api.ts`:
```typescript
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
```

3. **Update Socket Configuration**

Check `frontend/src/lib/socket.ts` and ensure it uses the environment variable:
```typescript
import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");
```

4. **Commit Changes**
```bash
git add .
git commit -m "Configure frontend for production"
git push
```

---

## ☁️ Step 5: Deploy Frontend on Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Click "Import Git Repository"
   - Select your `ChaiAdda-System` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)

4. **Add Environment Variables**
   Click "Environment Variables":
   
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend-url.onrender.com` (your Render backend URL)
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (3-5 minutes)
   - Your frontend will be live at `https://your-project.vercel.app`

---

## 🔐 Step 6: Configure CORS on Backend

1. **Update Backend CORS Settings**

Edit `backend/src/index.ts`:
```typescript
import cors from "cors";

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-project.vercel.app", // Add your Vercel URL
    "https://*.vercel.app" // Allow all Vercel preview deployments
  ],
  credentials: true
}));
```

2. **Update Socket.io CORS**
```typescript
export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://your-project.vercel.app",
      "https://*.vercel.app"
    ],
    credentials: true
  },
});
```

3. **Commit and Push**
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Render will automatically redeploy your backend.

---

## ✅ Step 7: Verify Deployment

1. **Test Backend**
   - Visit `https://your-backend-url.onrender.com`
   - You should see "Backend is running"

2. **Test Frontend**
   - Visit `https://your-project.vercel.app`
   - Try logging in with vendor credentials
   - Test creating orders

3. **Check Database**
   - Go to Render → Your Database
   - Click "Connect" → "External Connection"
   - Use a tool like pgAdmin or TablePlus to verify data

---

## 🐛 Troubleshooting

### Backend Issues

**Issue**: "Application failed to respond"
- **Solution**: Check Render logs, ensure all environment variables are set correctly

**Issue**: Database connection errors
- **Solution**: Verify DATABASE_URL is the Internal URL from Render PostgreSQL

**Issue**: Prisma errors
- **Solution**: Run migrations in Render Shell: `npx prisma migrate deploy`

### Frontend Issues

**Issue**: API calls failing
- **Solution**: Check NEXT_PUBLIC_API_URL is set correctly in Vercel

**Issue**: CORS errors
- **Solution**: Verify backend CORS settings include your Vercel URL

**Issue**: Socket.io not connecting
- **Solution**: Ensure socket.ts uses NEXT_PUBLIC_API_URL

---

## 📝 Post-Deployment Checklist

- [ ] Backend is accessible at Render URL
- [ ] Database migrations are applied
- [ ] Frontend is accessible at Vercel URL
- [ ] Login works for both student and vendor
- [ ] Orders can be created
- [ ] Real-time updates work
- [ ] File uploads work (payment proofs)
- [ ] Reviews and ratings work

---

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:

- **Vercel**: Auto-deploys on every push to `main` branch
- **Render**: Auto-deploys on every push to `main` branch

To disable auto-deploy:
- **Vercel**: Settings → Git → Disable "Auto Deploy"
- **Render**: Settings → Build & Deploy → Disable "Auto-Deploy"

---

## 💡 Tips

1. **Free Tier Limitations**:
   - Render free tier sleeps after 15 minutes of inactivity
   - First request after sleep takes 30-60 seconds
   - Consider upgrading for production use

2. **Environment Variables**:
   - Never commit `.env` files to Git
   - Use Vercel/Render dashboards to set variables

3. **Database Backups**:
   - Render free tier doesn't include automatic backups
   - Export data regularly using `pg_dump`

4. **Monitoring**:
   - Check Render logs for backend errors
   - Use Vercel Analytics for frontend monitoring

---

## 🎉 Success!

Your Chai Adda application is now live! Share your URLs:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

For any issues, check the logs in Vercel and Render dashboards.
