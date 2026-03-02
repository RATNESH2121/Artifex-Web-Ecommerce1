import React, { useState } from "react";
import "./ContactPage.css";

const ContactPage = () => {
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setmessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Thank You ${name} for Contacting Us. We will Get Back to You Soon.\n\nYour Mail Id - ${email}.\nYour Message is - ${message}`
    );
    setname("");
    setEmail("");
    setmessage("");
  };

  return (
    <>
      <div className="contactSection">
        <h2>Contact Our Campus</h2>
        <div className="contactMap">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3410.72656480121!2d75.70251787590861!3d31.255991460144365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a5f5e9c489cf3%3A0x4049a5409d53c3d!2sLovely%20Professional%20University!5e0!3m2!1sen!2sin!4v1708851456723!5m2!1sen!2sin"
            width="100%"
            height="500"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="lpumap"
          ></iframe>
        </div>
        <div className="contactInfo">
          <div className="contactAddress">
            <div className="address">
              <h3>Campus Headquarters</h3>
              <p>
                Lovely Professional University,
                <br /> Jalandhar - Delhi, G.T. Road,
                <br /> Phagwara, Punjab 144411, India
              </p>
              <p>
                <strong>Email:</strong> contact@artifex.lpu.in
                <br />
                <strong>Support:</strong> +91 1824 404404
              </p>
            </div>
            <div className="address">
              <h3>Working Hours</h3>
              <p>
                Monday – Friday: 09:00 AM – 06:00 PM
                <br /> Saturday: 09:00 AM – 02:00 PM
                <br /> <strong>Sunday: Closed</strong>
              </p>
              <p>
                Our campus office is located at the heart of the LPU campus,
                welcoming students and partners from across the globe.
              </p>
            </div>
          </div>
          <div className="contactForm">
            <h3>Get In Touch</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                placeholder="Name *"
                onChange={(e) => setname(e.target.value)}
                required
              />
              <input
                type="email"
                value={email}
                placeholder="Email address *"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <textarea
                rows={10}
                cols={40}
                placeholder="Your Message"
                value={message}
                onChange={(e) => setmessage(e.target.value)}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
