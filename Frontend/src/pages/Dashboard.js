import "./Dashboard.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const userRes = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { "x-auth-token": token },
        });
        setUser(userRes.data.user);

        const oppRes = await axios.get("http://localhost:5000/api/opportunities");
        setOpportunities(oppRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApply = async (opportunityId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to apply for an opportunity.");
        return;
      }
      
      await axios.post("http://localhost:5000/api/opportunities/apply", 
        { opportunityId },
        { headers: { "x-auth-token": token } }
      );
      
      alert("Application submitted successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.msg || "Error submitting application.");
    }
  };

  const filteredOpportunities = opportunities.filter(opportunity =>
    opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opportunity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opportunity.ngo_id?.organization_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (opportunity.required_skills && opportunity.required_skills.some(skill => 
      skill.toLowerCase().includes(searchQuery.toLowerCase())
    )) ||
    opportunity.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="dashboard">Loading...</div>;
  if (error) return <div className="dashboard">{error}</div>;

  return (
    <div className="dashboard">
      <div className="welcome-card">
        <div className="welcome-left">
          <h2>Hello, {user?.name || "User"} 👋</h2>
          <p>Ready to make an impact?</p>
        </div>
        <div className="welcome-right">
          <Link to="/profile">
            <button className="profile-btn">View Profile</button>
          </Link>
        </div>
      </div>

      <div className="opportunities-section">
        <div className="opportunities-header">
          <h3>All Available Opportunities</h3>
          <input
            type="text"
            placeholder="Search opportunities..."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="opportunity-cards">
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opp) => (
              <div key={opp._id} className="opportunity-card">
                <h4>{opp.title}</h4>
                <p className="org">Posted by: {opp.ngo_id?.organization_name}</p>
                <div className="tags">
                  {(opp.required_skills || []).map((skill, i) => (
                    <span key={i} className="tag">{skill}</span>
                  ))}
                </div>
                <p className="time">Duration: {opp.duration}</p>
                <p className="time">Location: {opp.location}</p>
                <button
                    onClick={() => handleApply(opp._id)}
                    className="apply-btn">
                    Apply
                </button>
              </div>
            ))
          ) : (
            <p>No opportunities found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;