import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RentPage from "./components/RentPage";
import RentResult from "./components/RentResult";
import ParttimeJob from "./components/ParttimeJob";
import JobResults from "./components/JobResults";
import PostAccommodation from "./components/PostAccommodation";
import PostedProperties from "./components/PostedProperties";
import LandingPage from "./components/LandingPage";
import MyProfile from "./components/MyProfile";
import EmergencyContacts from "./components/EmergencyContacts";
import HomePage from "./components/HomePage";
import ForumHome from "./pages/ForumHome";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import ExploreCity from "./components/Explorecity";
import ExploreCategory from "./components/ExploreCategory";

import AdminRoute from "./components/AdminRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProperties from "./pages/AdminProperties";
import AdminUsers from "./pages/AdminUsers";
import AdminForum from "./pages/AdminForum";

// ✅ Private route for logged-in users
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* ── Admin routes ── */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/properties" element={<AdminRoute><AdminProperties /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/forum" element={<AdminRoute><AdminForum /></AdminRoute>} />

      {/* Forum routes */}
      <Route path="/forum" element={<ForumHome />} />
      <Route path="/forum/create" element={<CreatePost />} />
      <Route path="/forum/posts/:id" element={<PostDetails />} />

      {/* ✅ Protected routes (only after login) */}
      <Route
        path="/MyProfile"
        element={
          <PrivateRoute>
            <MyProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/post-accommodation"
        element={
          <PrivateRoute>
            <PostAccommodation />
          </PrivateRoute>
        }
      />
      <Route
        path="/posted-properties"
        element={
          <PrivateRoute>
            <PostedProperties />
          </PrivateRoute>
        }
      />
      <Route
        path="/owner-dashboard"
        element={
          <PrivateRoute>
            <PostAccommodation />
          </PrivateRoute>
        }
      />
      <Route
        path="/rent"
        element={
          <PrivateRoute>
            <RentPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rent-results"
        element={
          <PrivateRoute>
            <RentResult />
          </PrivateRoute>
        }
      />
      <Route
        path="/ParttimeJob"
        element={
          <PrivateRoute>
            <ParttimeJob />
          </PrivateRoute>
        }
      />
      <Route
        path="/job-results"
        element={
          <PrivateRoute>
            <JobResults />
          </PrivateRoute>
        }
      />
      <Route
        path="/EmergencyContacts"
        element={
          <PrivateRoute>
            <EmergencyContacts />
          </PrivateRoute>
        }
      />
      <Route path="/explore" element={<ExploreCity />} />
<Route path="/explore/category" element={<ExploreCategory />} />

      

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}