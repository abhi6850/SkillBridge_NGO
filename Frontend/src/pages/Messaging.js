  import React from "react";
  import "./Messaging.css";

  const Messaging = () => {
    return (
      <div className="messaging-container">
        {/* Chat list on the left */}
        <div className="chat-list">
          <div className="chat-item active">
            <img
              src="https://via.placeholder.com/40"
              alt="Sarah Chen"
              className="chat-avatar"
            />
            <div className="chat-info">
              <h4>Sarah Chen (NGO)</h4>
              <p>Great, looking forward to it!</p>
            </div>
            <span className="chat-time">10:45 AM</span>
          </div>

          <div className="chat-item">
            <img
              src="https://via.placeholder.com/40"
              alt="David Lee"
              className="chat-avatar"
            />
            <div className="chat-info">
              <h4>David Lee (Volunteer)</h4>
              <p>Can you share the project dt</p>
            </div>
            <span className="chat-time">Yesterday</span>
          </div>

          <div className="chat-item">
            <img
              src="https://via.placeholder.com/40"
              alt="Emily White"
              className="chat-avatar"
            />
            <div className="chat-info">
              <h4>Emily White (NGO)</h4>
              <p>Sure, I will send the report.</p>
            </div>
            <span className="chat-time">Last Week</span>
          </div>

          <div className="chat-item">
            <img
              src="https://via.placeholder.com/40"
              alt="Michael Brown"
              className="chat-avatar"
            />
            <div className="chat-info">
              <h4>Michael Brown (Volunteer)</h4>
              <p>Thanks for your help!</p>
            </div>
            <span className="chat-time">Oct 20</span>
          </div>
        </div>

        {/* Chat window on the right */}
        <div className="chat-window">
          <div className="chat-header">
            <img
              src="https://via.placeholder.com/40"
              alt="Sarah Chen"
              className="chat-avatar"
            />
            <div>
              <h4>Sarah Chen (NGO)</h4>
              <p className="online-status">🟢 Online</p>
            </div>
          </div>

          <div className="chat-messages">
            <div className="message sent">
              <p>Hello Sarah, how are you?</p>
              <span className="time">10:30 AM</span>
            </div>
            <div className="message received">
              <p>
                I am doing great, John! How can I help you today regarding the
                community outreach project?
              </p>
              <span className="time">10:32 AM</span>
            </div>
            <div className="message sent">
              <p>I was wondering about the schedule for next week.</p>
              <span className="time">10:35 AM</span>
            </div>
            <div className="message received">
              <p>
                The schedule is finalized and will be sent out by end of day.
                Great, looking forward to it!
              </p>
              <span className="time">10:40 AM</span>
            </div>
          </div>

          {/* Input box */}
          <div className="chat-input">
            <input type="text" placeholder="Type your message..." />
            <button className="send-btn">➤</button>
          </div>
        </div>
      </div>
    );
  };

  export default Messaging;
