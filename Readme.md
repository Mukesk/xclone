

## Project Overview

This is a full-stack Twitter/X clone application built with:
- **Frontend**: React + Vite + TailwindCSS + TanStack Query (React Query)
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Image Storage**: Cloudinary
- **Authentication**: JWT with cookies

## Development Commands

### Development Server
```bash
# Start backend development server (with nodemon)
npm run dev

# Start frontend development server (Vite)
npm run dev --prefix frontend
```

### Build and Production
```bash
# Build the entire application (backend dependencies + frontend build)
npm run build

# Start production server
npm start

# Preview frontend build
npm run preview --prefix frontend
```

### Linting
```bash
# Lint frontend code
npm run lint --prefix frontend
```

### Single File Operations
```bash
# Run specific backend file
node backend/server.js

# Build only frontend
npm run build --prefix frontend
```

## Architecture Overview

### Backend Architecture (MVC Pattern)

The backend follows a clean MVC (Model-View-Controller) architecture:

```
backend/
├── server.js              # Main server entry point with middleware setup
├── model/                 # Mongoose models/schemas
│   ├── usermodel.js       # User schema with followers, following, likedPosts
│   ├── postmodel.js       # Post schema with likes, comments, images
│   └── notification.js    # Notification system model
├── controller/            # Business logic handlers
│   ├── auth.control.js    # Authentication (signup, login, logout, getme)
│   ├── user.control.js    # User operations (profile, follow/unfollow)
│   ├── post.control.js    # Post CRUD operations
│   └── notification.control.js # Notification management
├── router/               # Express route definitions
│   ├── router.js         # Auth routes (/api/auth/)
│   ├── user.route.js     # User routes (/api/user)
│   ├── post.route.js     # Post routes (/api/post/)
│   └── notification.route.js # Notification routes (/api/notification/)
├── middleware/           # Custom middleware
│   └── protectorcookie.js # JWT authentication middleware
├── db/                  # Database configuration
│   └── dbconnet.js      # MongoDB connection setup
└── config/              # Configuration files
```

**Key Backend Patterns:**
- JWT authentication stored in HTTP-only cookies (cookie name: `jvt`)
- Middleware-based route protection using `protectorcookie`
- Cloudinary integration for image uploads
- CORS configured for frontend URL (localhost:5173 in dev)
- Express static serving for frontend build in production

### Frontend Architecture (React SPA)

The frontend is a React Single Page Application with modern patterns:

```
frontend/src/
├── App.jsx               # Main app component with routing and auth logic
├── main.jsx             # React app entry point
├── pages/               # Route components
│   ├── auth/            # Authentication pages (login, signup)
│   ├── home/            # Home timeline page
│   ├── profile/         # User profile pages
│   └── notification/    # Notifications page
├── components/          # Reusable UI components
│   ├── common/          # Shared components (Sidebar, RightPanel)
│   ├── skeletons/       # Loading skeleton components
│   └── svgs/            # SVG icon components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── constant/            # Configuration constants
│   └── baseUrl.js       # Backend API URL configuration
└── assets/              # Static assets
```

**Key Frontend Patterns:**
- React Router for client-side routing with protected routes
- TanStack Query (React Query) for server state management and caching
- Axios for HTTP requests with credentials (cookies)
- Conditional rendering based on authentication state
- Tailwind CSS for styling
- Vite for fast development and building

### Data Flow Architecture

**Authentication Flow:**
1. User login → Backend validates → JWT stored in HTTP-only cookie
2. Frontend checks auth status via `/api/auth/me` endpoint on app load
3. All protected routes redirect to `/login` if unauthenticated
4. Middleware `protectorcookie` validates JWT on protected API endpoints

**API Communication:**
- Frontend uses axios with `withCredentials: true` for cookie-based auth
- Base URL configured via environment variable (`VITE_BACKEND_URL`)
- TanStack Query handles caching, background refetching, and optimistic updates

**Database Relationships:**
- Users have followers/following arrays (referenced ObjectIds)
- Posts reference users and contain likes/comments arrays
- Notifications link users to specific actions/posts
- Images stored on Cloudinary with URLs in database

## Environment Configuration

**Required Backend Variables (.env):**
- `PORT` - Server port (default: 8080)
- `MONGO` - MongoDB connection string
- `JWT_SECERT` - JWT signing secret
- `NODE_ENV` - Environment (development/production)
- `CLOUDINARY_*` - Cloudinary credentials for image uploads
- `FRONTEND_URL` - Frontend URL for CORS

**Required Frontend Variables (frontend/.env):**
- `VITE_BACKEND_URL` - Backend API URL

## Production Deployment

### Vercel Configuration
The application is optimized for Vercel deployment with:
- **Serverless Functions**: Backend restructured as `/backend/api/index.js` for Vercel Functions
- **Static Frontend**: Frontend builds to `frontend/dist` and serves via Vercel's CDN
- **Environment Variables**: Production-ready environment configuration with `.env.example` templates
- **Error Handling**: Comprehensive error boundaries and loading states
- **Performance**: Optimized builds with proper caching strategies

### Deployment Files
- `vercel.json` - Main deployment configuration
- `frontend/vercel.json` - Frontend routing for SPA
- `backend/api/index.js` - Serverless function handler
- `DEPLOYMENT.md` - Complete deployment guide
- `.env.example` - Environment template

### External Services Required
- **MongoDB Atlas** - Database hosting
- **Cloudinary** - Image upload and storage
- **Vercel** - Application hosting platform

## Common Development Patterns

**Adding New Features:**
1. Create/modify Mongoose model in `backend/model/`
2. Add controller functions in `backend/controller/`
3. Define routes in `backend/router/`
4. Create React components/pages in `frontend/src/`
5. Use TanStack Query for API integration

**Authentication Integration:**
- Use `protectorcookie` middleware for protected backend routes
- Check `authData` from TanStack Query for frontend route protection
- Access current user via `req.user` in protected backend endpoints
