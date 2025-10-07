import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function LandingPage() {
  return (
    <div className="page" style={{ backgroundColor: "#0f111a" }}>
      <div className="logo-header">
              <img src={logo} alt="SkillBridge Logo" className="auth-logo" />
            </div>
      <div style={{ position: "absolute", top: 20, right: 40 }}>
        <Link to="/signup"><button>Sign Up</button></Link>
        <Link to="/signin"><button>Sign In</button></Link>
      </div>
      <h1>SkillBridge - Connecting Volunteers & NGOs</h1>
      <p>
        Empowering communities through purposeful action and meaningful
        collaboration
      </p>
      <div>
        <Link to="/signup"><button>Join as Volunteer</button></Link>
        <Link to="/signup"><button>Join as NGO</button></Link>
      </div>

    </div>
  );
}

export default LandingPage;
