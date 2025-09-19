import "./Dashboard.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
   const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            "x-auth-token": localStorage.getItem("token")
          }
        });
        
        console.log(res.data); // check what API returns
        if (res.data && res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="dashboard">
      {/* Top Section */}
      <div className="welcome-card">
        <div className="welcome-left">
          <img 
            src="data:image/png;base64,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" 
            alt="profile" 
            className="profile-pic"
            onError={(e) => e.target.src = "/default-profile.png"} 
          />
          <div>
            {/* <h2>Hello, Abhijeet Kulkarni!</h2> */}
            <h2>Hello, {user?.name || "Loading..."}</h2>
            <p>Ready to make an impact?</p>
          </div>
        </div>
        <div className="welcome-right">
          <button className="profile-btn" onClick={() => navigate("/profile")}>
            View Profile
          </button>
        </div>
      </div>

      {/* Suggested Opportunities */}
      <div className="opportunities-section">
        <div className="opportunities-header">
          <h3>Suggested Opportunities</h3>
          <button className="browse-btn">Browse All Opportunities</button>
        </div>

        <div className="opportunity-cards">
          {/* Card 1 */}
          <div className="opportunity-card">
            <h4>Support for Homeless Shelter</h4>
            <p className="org">Helping Hands Charity</p>
            <p className="time">Ongoing (2-4 hrs/week)</p>
            <div className="tags">
              <span>Cooking</span>
              <span>Organization</span>
              <span>Empathy</span>
            </div>
            <button className="details-btn">View Details</button>
          </div>

          {/* Card 2 */}
          <div className="opportunity-card">
            <h4>Environmental Cleanup Project</h4>
            <p className="org">Clean Planet Initiative</p>
            <p className="time">One-time (Saturday)</p>
            <div className="tags">
              <span>Manual Labor</span>
              <span>Teamwork</span>
              <span>Environmental Awareness</span>
            </div>
            <button className="details-btn">View Details</button>
          </div>

          {/* Card 3 */}
          <div className="opportunity-card">
            <h4>Online Mentoring for Students</h4>
            <p className="org">Future Leaders Academy</p>
            <p className="time">Flexible (1 hr/week)</p>
            <div className="tags">
              <span>Tutoring</span>
              <span>Communication</span>
              <span>Subject Matter Expert</span>
            </div>
            <button className="details-btn">View Details</button>
          </div>

          {/* Card 4 */}
          <div className="opportunity-card">
            <h4>Animal Care Volunteer</h4>
            <p className="org">Paws & Claws Rescue</p>
            <p className="time">Weekends (3 hrs/day)</p>
            <div className="tags">
              <span>Animal Handling</span>
              <span>Cleaning</span>
              <span>Patience</span>
            </div>
            <button className="details-btn">View Details</button>
          </div>

          {/* Card 5 */}
          <div className="opportunity-card">
            <h4>Elderly Companion Program</h4>
            <p className="org">Golden Age Support</p>
            <p className="time">Weekly Visits</p>
            <div className="tags">
              <span>Care</span>
              <span>Empathy</span>
              <span>Patience</span>
            </div>
            <button className="details-btn">View Details</button>
          </div>

          {/* Card 6 */}
          <div className="opportunity-card">
            <h4>Community Garden Maintenance</h4>
            <p className="org">Urban Green Spaces</p>
            <p className="time">Bi-weekly (2 hrs/week)</p>
            <div className="tags">
              <span>Gardening</span>
              <span>Environment</span>
              <span>Teamwork</span>
            </div>
            <button className="details-btn">View Details</button>
          </div>

          {/* Card 7 */}
          <div className="opportunity-card">
            <h4>Digital Marketing Assistant</h4>
            <p className="org">Non-profit Tech Solutions</p>
            <p className="time">Remote (5 hrs/week)</p>
            <div className="tags">
              <span>Marketing</span>
              <span>Social Media</span>
              <span>Content Creation</span>
            </div>
            <button className="details-btn">View Details</button>
          </div>

          {/* Card 8 */}
          <div className="opportunity-card">
            <h4>Youth Sports Coach</h4>
            <p className="org">Active Kids League</p>
            <p className="time">Seasonal (Evenings)</p>
            <div className="tags">
              <span>Coaching</span>
              <span>Leadership</span>
              <span>Team Spirit</span>
            </div>
            <button className="details-btn">View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
