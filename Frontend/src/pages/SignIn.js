import React from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import logo from "../assets/logo.png";

const SignIn = () => {
  return (
    <div className="auth-container">
      {/* Logo top-left */}
      <div className="logo-header">
        <img src={logo} alt="SkillBridge Logo" className="auth-logo" />
        <h3 className="auth-brand">SkillBridge NGO</h3>
      </div>

      <div className="auth-box">
        <h2>Sign In</h2>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button>Submit</button>

        <p>
          <Link to="/forgot-password" className="link forgot">
            Forgot Password?
          </Link>
        </p>
        <p>
          Don’t have an account?{" "}
          <Link to="/signup" className="link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
