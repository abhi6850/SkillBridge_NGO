// src/pages/Opportunities.js
import React from "react";
import "./Opportunities.css";

const opportunities = [
  {
      title: "Community Garden Project: Urban",
      org: "Green Thumb Collective",
      tags: ["Gardening", "Community Outreach", "Logistics"],
      duration: "3 Months (Weekends)",
    },
    {
      title: "Digital Literacy Workshop",
      org: "Tech For All Foundation",
      tags: ["Teaching", "Public Speaking", "Basic IT Skills"],
      duration: "4 Weeks (Evenings)",
    },
    {
      title: "Animal Shelter Assistant: Care and Support",
      org: "Paws & Claws Rescue",
      tags: ["Animal Care", "Cleaning", "Customer Service"],
      duration: "Ongoing (Flexible)",
    },
    {
      title: "Environmental Cleanup Crew",
      org: "Riverbend Conservancy",
      tags: ["Leadership", "Environmental Science", "Heavy Lifting"],
      duration: "2 Day Event",
    },
  {
    title: "Elderly Companion for Social Visits",
    org: "Golden Years Support",
    tags: ["Empathy", "Communication", "Patience"],
    duration: "6 Months (Weekly)",
    image: "https://via.placeholder.com/300x180", // Replace with real image
  },
  {
    title: "Food Bank Distribution",
    org: "Helping Hands Pantry",
    tags: ["Organization", "Physical Stamina", "Teamwork"],
    duration: "Weekend Mornings",
    image: "https://via.placeholder.com/300x180",
  },
  {
    title: "Mentorship Program for Youth",
    org: "Future Leaders Initiative",
    tags: ["Mentoring", "Counseling", "Role Modeling"],
    duration: "9 Months (Bi-weekly)",
    image: "https://via.placeholder.com/300x180",
  },
  {
    title: "Website Content Editor",
    org: "Global Aid Alliance",
    tags: ["Copywriting", "SEO", "WordPress"],
    duration: "Flexible (Remote)",
    image: "https://via.placeholder.com/300x180",
  },
];

function Opportunities() {
  return (
    <div className="opportunities">
      <div className="opportunities-header">
        <input
          type="text"
          placeholder="Search opportunities by title or organization..."
          className="search-bar"
        />
      </div>

      <div className="opportunities-grid">
        {opportunities.map((opportunity, index) => (
          <div key={index} className="opportunity-card">
            <img src={opportunity.image} alt={opportunity.title} />
            <div className="opportunity-content">
              <h3>{opportunity.title}</h3>
              <p className="org">{opportunity.org}</p>
              <div className="tags">
                {opportunity.tags.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
              <p className="duration">
                <strong>Duration:</strong> {opportunity.duration}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Opportunities;
