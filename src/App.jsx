import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
//import Browse from "./pages/Browse";
import RentPage from "./components/RentPage";
import RentResult from "./components/RentResult";
import ParttimeJob from "./components/ParttimeJob";
import JobResults from "./components/JobResults";
import PostAccommodation from "./components/PostAccommodation";
import PostedProperties from "./components/PostedProperties";
import LandingPage from "./components/LandingPage"; 
import MyProfile from "./components/MyProfile";
import EmergencyContacts from "./components/EmergencyContacts";

// ✅ Private route for logged-in users
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* After login — redirect to LandingPage */}
      <Route
        path="/landing"
        element={
          <PrivateRoute>
            <LandingPage />
          </PrivateRoute>
        }
      />

      {/* Protected routes */}
      {/* <Route
        path="/browse"
        element={
          <PrivateRoute>
            <Browse />
          </PrivateRoute>
        }
      /> */}
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
       path="/MyProfile" 
       element=
       {<PrivateRoute>
        <MyProfile />
        </PrivateRoute>} />
        <Route path="/EmergencyContacts" element={<PrivateRoute><EmergencyContacts /></PrivateRoute>} />


      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
