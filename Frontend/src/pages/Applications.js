import React from "react";
import "./Applications.css";

const Applications = () => {
  const applications = [
    {
      title: "Community Garden Cleanup Initiative",
      org: "Green Earth Alliance",
      date: "2024-03-15",
      status: "Accepted",
    },
    {
      title: "Online Tutoring for Disadvantaged Youth",
      org: "Future Minds Foundation",
      date: "2024-03-10",
      status: "Pending",
    },
    {
      title: "Animal Shelter Assistant",
      org: "Paws for Hope",
      date: "2024-02-28",
      status: "Rejected",
    },
    {
      title: "Elderly Home Companionship Program",
      org: "Golden Years Support",
      date: "2024-02-20",
      status: "Accepted",
    },
    {
      title: "Food Bank Distribution Volunteer",
      org: "Harvest of Hope",
      date: "2024-02-14",
      status: "Pending",
    },
    {
      title: "Environmental Awareness Campaign",
      org: "Eco-Warriors United",
      date: "2024-02-05",
      status: "Accepted",
    },
  ];

  return (
    <div className="applications-page">
      <div className="applications-header">
        <h2>My Applications</h2>
        {/* <button className="ngo-switch-btn">Switch to NGO View</button> */}
      </div>
      <div className="applications-grid">
        {applications.map((app, index) => (
          <div key={index} className="application-card">
            <h3>{app.title}</h3>
            <p className="org">{app.org}</p>
            <p className="date">Applied on: {app.date}</p>
            <div className={`status ${app.status.toLowerCase()}`}>
              {app.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applications;
