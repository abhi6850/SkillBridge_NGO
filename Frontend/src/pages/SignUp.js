import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function SignUp() {
  return (
    <div className="page">
        <div className="logo-header">
                <img src={logo} alt="SkillBridge Logo" className="auth-logo" />
                <h3 className="auth-brand">SkillBridge NGO</h3>
              </div>
      <h2>Create Account</h2>
      <form>
        <input type="text" placeholder="Username" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <input type="text" placeholder="Full Name" required />

        <select required>
          <option value="">I am a...</option>
          <option value="ngo">NGO/Organization</option>
          <option value="volunteer">Volunteer</option>
        </select>

        <input type="text" placeholder="Location (optional)" />
        <input type="text" placeholder="Organization Name" />
        <textarea placeholder="Organization Description"></textarea>
        <input type="url" placeholder="Website (optional)" />

        <button type="submit">Create Account</button>
        <p>
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
