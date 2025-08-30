import React from "react";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      {/* Top Section */}
      <div className="welcome-card">
        <div className="welcome-left">
          <img
            src="https://via.placeholder.com/80"
            alt="profile"
            className="profile-pic"
          />
          <div>
            <h2>Hello, Abhijeet Kulkarni!</h2>
            <p>Ready to make an impact?</p>
          </div>
        </div>
        <div className="welcome-right">
          <button className="profile-btn">View Profile</button>
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
