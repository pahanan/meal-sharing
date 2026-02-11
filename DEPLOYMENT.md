# Deployment Guide

## 🚀 Deploy to Render.com (Free)

### Step 1: Prepare Your Project
1. Push your code to GitHub (already done!)
2. Sign up at [render.com](https://render.com)

### Step 2: Deploy Backend API
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `meal-sharing-api`
   - **Root Directory**: `api`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     PORT=10000
     NODE_ENV=production
     ```

### Step 3: Deploy Frontend
1. Click "New" → "Static Site"
2. Connect same GitHub repository
3. Configure:
   - **Name**: `meal-sharing-frontend`
   - **Root Directory**: `api/src/frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`
   - **Environment Variables**:
     ```
     REACT_APP_API_URL=https://meal-sharing-api.onrender.com
     ```

### Step 4: Update Frontend API URL
In `api/src/frontend/package.json`, update the proxy:
```json
{
  "proxy": "https://meal-sharing-api.onrender.com"
}
```

### Step 5: Commit and Deploy
```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

## 🌐 Alternative: Vercel + Railway

### Frontend on Vercel
1. Push to GitHub
2. Import project to [vercel.com](https://vercel.com)
3. Configure root directory: `api/src/frontend`

### Backend on Railway
1. Import project to [railway.app](https://railway.app)
2. Configure root directory: `api`
3. Add environment variables

## 📱 Your Live URLs
- **Frontend**: `https://meal-sharing-frontend.onrender.com`
- **API**: `https://meal-sharing-api.onrender.com`
- **API Endpoints**: `https://meal-sharing-api.onrender.com/api/all-meals`

## 🔧 What You Get
✅ **Live URL** - Share with employers  
✅ **HTTPS** - Secure connection  
✅ **Auto-deploy** - Updates when you push  
✅ **Free hosting** - No credit card needed  
✅ **Custom domain** - Optional upgrade  

## ⚡ Quick Start
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your repository
5. Follow the steps above

**Your meal-sharing app will be live on the internet in 5 minutes! 🚀**
