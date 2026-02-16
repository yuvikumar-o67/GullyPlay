import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GullyGang from "./pages/GullyGang";
import UserLogin from "./pages/UserLogin";

import ProtectedRoute from "./ProtectedRoute";
import UserProtectedRoute from "./pages/UserProtectedRoute";
import LiveSports from "./pages/LiveSports";
import Chat from "./pages/Chat";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/admin-login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Protected Routes */}
        <Route
          path="/home"
          element={
            <UserProtectedRoute>
              <Home />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <UserProtectedRoute>
              <Events />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/gullygang"
          element={
            <UserProtectedRoute>
              <GullyGang />
            </UserProtectedRoute>
          }
        />

        {/* Admin Protected Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/live"
          element={
            <UserProtectedRoute>
              <LiveSports />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <UserProtectedRoute>
              <Chat />
            </UserProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
