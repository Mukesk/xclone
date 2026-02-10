# XClone - Vercel Deployment Guide

This guide will help you deploy your full-stack X Clone application to Vercel.

## 📋 Pre-deployment Checklist

### ✅ What We've Fixed
- ✅ Restructured backend for serverless functions
- ✅ Fixed environment variable names and typos
- ✅ Added proper error boundaries and loading states
- ✅ Enhanced UI components for better UX
- ✅ Fixed React warnings and code issues
- ✅ Optimized Vercel configuration files
- ✅ Added comprehensive error handling

## 🚀 Deployment Steps

### Step 1: Prepare Your Environment Variables

1. **Copy environment templates:**
   ```bash
   cp .env.example .env
   cp frontend/.env.example frontend/.env
   ```

2. **Update your `.env` file with production values:**
   ```env
   PORT=8080
   MONGO=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secure_jwt_secret_here_at_least_32_characters
   NODE_ENV=production
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FRONTEND_URL=https://your-app-name.vercel.app
   VITE_BACKEND_URL=https://your-app-name.vercel.app
   ```

### Step 2: Set Up External Services

#### MongoDB Atlas (Required)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Set up database user and whitelist IP addresses (use `0.0.0.0/0` for all IPs)
4. Get your connection string and add it to `MONGO` environment variable

#### Cloudinary (Required for image uploads)
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add them to your environment variables

### Step 3: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project root:**
   ```bash
   vercel
   ```

4. **Set environment variables in Vercel dashboard:**
   - Go to your project settings on vercel.com
   - Navigate to "Environment Variables"
   - Add all variables from your `.env` file

#### Option B: Using Vercel Dashboard

1. **Connect GitHub repository:**
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your repository

2. **Configure build settings:**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `frontend/dist`

3. **Add environment variables:**
   - In project settings, add all environment variables from your `.env` file

### Step 4: Update Environment Variables for Production

Once deployed, update the URLs in your environment variables:

```env
FRONTEND_URL=https://your-actual-vercel-url.vercel.app
VITE_BACKEND_URL=https://your-actual-vercel-url.vercel.app
```

## 🛠️ Local Development

### Start Development Servers
```bash
# Start both backend and frontend concurrently
npm run dev

# Or start them separately
npm run dev:backend  # Starts backend on port 8080
npm run dev:frontend # Starts frontend on port 5173
```

### Build for Production
```bash
# Build the entire application
npm run build
```

## 📁 Project Structure

```
xclone/
├── backend/
│   ├── api/
│   │   └── index.js          # Serverless function entry point
│   ├── controller/           # API controllers
│   ├── model/               # Database models
│   ├── router/              # API routes
│   ├── middleware/          # Custom middleware
│   └── db/                  # Database configuration
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   └── utils/           # Utility functions
│   ├── dist/                # Build output
│   └── vercel.json          # Frontend routing config
├── vercel.json              # Main Vercel configuration
└── package.json             # Root dependencies
```

## 🔧 API Endpoints

All API endpoints are available at `/api/`:

- **Authentication:** `/api/auth/`
  - `POST /api/auth/signup` - User registration
  - `POST /api/auth/login` - User login  
  - `POST /api/auth/logout` - User logout
  - `GET /api/auth/me` - Get current user

- **Users:** `/api/user`
  - `GET /api/user/profile/:username` - Get user profile
  - `POST /api/user/follow/:id` - Follow/unfollow user

- **Posts:** `/api/post/`
  - `GET /api/post/all` - Get all posts
  - `POST /api/post/create` - Create new post
  - `POST /api/post/:id/like` - Like/unlike post

- **Notifications:** `/api/notification/`
  - `GET /api/notification/` - Get user notifications

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Not Working**
   - Make sure all variables are set in Vercel dashboard
   - Check variable names match exactly (case-sensitive)
   - Redeploy after adding variables

2. **Database Connection Failed**
   - Verify MongoDB connection string
   - Check if IP whitelist includes `0.0.0.0/0`
   - Ensure database user has proper permissions

3. **Image Upload Issues**
   - Verify Cloudinary credentials
   - Check API limits on your Cloudinary account

4. **CORS Issues**
   - Update `FRONTEND_URL` in backend environment
   - Make sure URLs match your deployed app

### Development vs Production

- **Development:** Uses `http://localhost:5173` and `http://localhost:8080`
- **Production:** Uses your Vercel app URL for both frontend and backend

## 🔐 Security Notes

- Never commit your `.env` file to version control
- Use strong, unique JWT secrets (at least 32 characters)
- Keep your Cloudinary and MongoDB credentials secure
- Regularly rotate your secrets

## 📱 Features

Your deployed X Clone includes:

- ✅ User authentication (signup/login/logout)
- ✅ Create and view posts
- ✅ Like and comment on posts  
- ✅ Follow/unfollow users
- ✅ User profiles with bio and images
- ✅ Real-time notifications
- ✅ Image upload via Cloudinary
- ✅ Responsive design
- ✅ Dark theme
- ✅ Error boundaries and loading states

## 🆘 Support

If you encounter issues:

1. Check Vercel function logs in the dashboard
2. Verify all environment variables are set
3. Test API endpoints directly
4. Check network tab for failed requests

## 🎉 Success!

Once deployed, your X Clone will be available at your Vercel URL with a fully functional backend API and responsive frontend!

---

**Happy coding! 🚀**