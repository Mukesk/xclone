import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/login/login";
import Signup from "./pages/auth/signup/signup";
import Home from "./pages/home/home.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import NotificationPage from "./pages/notification/NotificationPage.jsx"
import ProfilePage from "./pages/profile/ProfilePage.jsx"
import RightPanel from "./components/common/RightPanel"
import{ useMutation,useQuery,useQueryClient,QueryClientProvider,QueryClient} from "@tanstack/react-query"
import axios from "axios";
import baseUrl from "./constant/baseUrl.js";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";
  const queryClient=new QueryClient({
    retry:1
  });
; 

  const App = () => {
    const { data: authData, isLoading } = useQuery({
      queryKey: ['authData'],
      queryFn: async () => {
        try {
          const res = await axios.get(`${baseUrl}/api/auth/me`, {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            withCredentials: true
          });
          return res.data;
        } catch (err) {
          return null;
        }
      }
    });
  
    if (isLoading) return (<div className="flex justify-center items-center h-screen"><LoadingSpinner size="lg" /></div>);
  
    return (
      <BrowserRouter>
        <div className="flex">
          {/* Sidebar is visible on certain pages */}
          {authData && <Sidebar />}
          <div className="flex-grow bg-black">
            <Routes>
              <Route path="/" element={authData ? <Home /> : <Navigate to="/login" />} />
              <Route path="/login" element={!authData?<Login />:<Navigate to="/" /> } />
              <Route path="/signup" element={!authData?<Signup />:<Navigate to="/" /> }/>
              <Route path="/notifications" element={authData ? <NotificationPage /> : <Navigate to="/login" />} />
              <Route path="/profile/:username" element={authData ? <ProfilePage /> : <Navigate to="/login" />} />
            </Routes>
          </div>
          {authData && <RightPanel />}
        </div>
      </BrowserRouter>
    );
  };
  
  const WrappedApp = () => (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
  
  export default WrappedApp;
  
