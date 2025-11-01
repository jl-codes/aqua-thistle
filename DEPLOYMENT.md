# 🚀 Vercel Deployment Guide

## Quick Deployment Steps

### 1. **GitHub Setup**
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - PROJECT AQUA THISTLE"

# Add remote repository
git remote add origin https://github.com/jl-codes/aqua-thistle.git
git branch -M main
git push -u origin main
```

### 2. **Vercel Account Setup**
1. Visit [vercel.com](https://vercel.com) and sign up/login
2. Connect your GitHub account
3. Import the `aqua-thistle` repository

### 3. **Project Configuration**
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `aqua-thistle/`
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Output Directory**: `.next` (auto-detected)

### 4. **Environment Variables**
Set these in Vercel dashboard:

```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.railway.app
NODE_ENV=production
```

### 5. **Backend Deployment (Optional)**
Deploy the FastAPI backend to Railway, Render, or Heroku:

**Railway (Recommended):**
```bash
cd backend
railway login
railway init
railway up
```

**Render:**
1. Connect GitHub repo
2. Select `/backend` folder
3. Set Python 3.9+ runtime
4. Use `python main.py` as start command

## 🔧 Build Testing

Test locally before deploying:

```bash
cd aqua-thistle

# Test production build
npm run build

# Test production server
npm start
```

## ✅ Pre-Deployment Checklist

- [ ] All TypeScript errors resolved
- [ ] Build completes successfully locally
- [ ] Environment variables configured
- [ ] README.md updated with live URLs
- [ ] Backend deployed and accessible
- [ ] CORS configured for production domain
- [ ] All tests passing (`npm test`)

## 🌐 Production URLs

After deployment, update these in README.md:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.railway.app`

## 🐛 Common Issues & Solutions

### Build Failures
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Loading
- Ensure variables are set in Vercel dashboard
- Restart deployment after adding variables
- Check variable names match exactly

### Backend Connection Issues
- Update `NEXT_PUBLIC_BACKEND_URL` with production backend URL
- Ensure backend CORS allows frontend domain
- Check backend is accessible via browser

### Image Optimization Issues
- Add production domain to `next.config.ts` images.domains
- Ensure images are properly imported

## 📊 Performance Monitoring

After deployment:
- Check Vercel Analytics for performance metrics
- Monitor build times and function execution
- Set up error tracking if needed

## 🔄 Continuous Deployment

Vercel automatically deploys on:
- **Main branch pushes** → Production deployment
- **Pull requests** → Preview deployments
- **Branch pushes** → Branch preview deployments

---

**Need Help?** Check the [Vercel Documentation](https://vercel.com/docs) or contact the development team.
