import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Opportunities from "./pages/Opportunities";
import Applications from "./pages/Applications";
import Messaging from "./pages/Messaging";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const location = useLocation();

  // Hide navbar on landing, signup, signin
  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/signup" ||
    location.pathname === "/signin";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/messaging" element={<Messaging />} />
      </Routes>
    </>
  );
}

export default App;
