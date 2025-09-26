import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/login/login";
import Signup from "./pages/auth/signup/signup";
import Home from "./pages/home/home.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import NotificationPage from "./pages/notification/NotificationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import RightPanel from "./components/common/RightPanel";
import { useQuery, QueryClientProvider, QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import baseUrl from "./constant/baseUrl.js";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";
import PageLoader from "./components/common/PageLoader.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import { getAuthToken } from "./utils/auth.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => {
  const { data: authData, isLoading } = useQuery({
    queryKey: ['authData'],
    queryFn: async () => {
      try {
        const token = getAuthToken();
        const res = await axios.get(`${baseUrl}/api/auth/me`, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          withCredentials: true
        });
        return res.data;
      } catch (err) {
        return null;
      }
    }
  });

  if (isLoading) {
    return <PageLoader message="Initializing XClone..." />;
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="flex w-full h-full relative z-10">
          {/* Sidebar with slide-in animation */}
          {authData && (
            <div className="animate-slide-in-left h-full">
              <Sidebar />
            </div>
          )}
          
          {/* Main content area */}
          <div className="flex-grow bg-black/80 backdrop-blur-sm animate-fade-in h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
            <Routes>
              <Route 
                path="/" 
                element={authData ? <Home /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/login" 
                element={!authData ? <Login /> : <Navigate to="/" />} 
              />
              <Route 
                path="/signup" 
                element={!authData ? <Signup /> : <Navigate to="/" />} 
              />
              <Route 
                path="/notifications" 
                element={authData ? <NotificationPage /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/profile/:username" 
                element={authData ? <ProfilePage /> : <Navigate to="/login" />} 
              />
            </Routes>
          </div>
          
          {/* Right panel with slide-in animation */}
          {authData && (
            <div className="animate-slide-in-right h-full">
              <RightPanel />
            </div>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
};

const WrappedApp = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgb(51 65 85)",
            color: "#fff",
          },
        }}
      />
    </QueryClientProvider>
  </ErrorBoundary>
);

export default WrappedApp;
