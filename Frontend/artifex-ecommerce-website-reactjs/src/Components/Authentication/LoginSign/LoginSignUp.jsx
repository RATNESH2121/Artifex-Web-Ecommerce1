import React, { useState } from "react";
import "./LoginSignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../App/AuthContext";  

const LoginSignUp = () => {
  const [activeTab, setActiveTab] = useState("tabButton1");

  
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  const { login, register } = useAuth();

  
  const navigate = useNavigate();

  
  const handleLogin = async (e) => {
    e.preventDefault();          
    setError("");                
    setLoading(true);

    try {
      
      await login(loginUsername, loginPassword);
      navigate("/");             
    } catch (err) {
      setError(err.message);     
    } finally {
      setLoading(false);
    }
  };

  
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      
      await register(regUsername, regEmail, regPassword);
      setActiveTab("tabButton1"); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="loginSignUpSection">
        <div className="loginSignUpContainer">
          <div className="loginSignUpTabs">
            <p
              onClick={() => { setActiveTab("tabButton1"); setError(""); }}
              className={activeTab === "tabButton1" ? "active" : ""}
            >
              Login
            </p>
            <p
              onClick={() => { setActiveTab("tabButton2"); setError(""); }}
              className={activeTab === "tabButton2" ? "active" : ""}
            >
              Register
            </p>
          </div>

          <div className="loginSignUpTabsContent">

            {}
            {activeTab === "tabButton1" && (
              <div className="loginSignUpTabsContentLogin">
                <form onSubmit={handleLogin}>
                  {}
                  {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

                  <input
                    type="text"
                    placeholder="Username *"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password *"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <div className="loginSignUpForgetPass">
                    <label>
                      <input type="checkbox" className="brandRadio" />
                      <p>Remember me</p>
                    </label>
                    <p>
                      <Link to="/resetPassword">Lost password?</Link>
                    </p>
                  </div>
                  {}
                  <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Log In"}
                  </button>
                </form>
                <div className="loginSignUpTabsContentLoginText">
                  <p>
                    No account yet?{" "}
                    <span onClick={() => setActiveTab("tabButton2")}>
                      Create Account
                    </span>
                  </p>
                </div>
              </div>
            )}

            {}
            {activeTab === "tabButton2" && (
              <div className="loginSignUpTabsContentRegister">
                <form onSubmit={handleRegister}>
                  {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

                  <input
                    type="text"
                    placeholder="Username *"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email address *"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password *"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                  <p>
                    Your personal data will be used to support your experience
                    throughout this website.{" "}
                    <Link to="/terms" style={{ color: "#c32929" }}>
                      Privacy policy
                    </Link>
                    .
                  </p>
                  <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSignUp;
