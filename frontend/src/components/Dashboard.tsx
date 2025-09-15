import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import CitizenManager from "./CitizenManager";
import CitizenLookup from "./CitizenLookup";
import { capitalizeText } from "../utils/textUtils";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"citizens" | "lookup">(
    user?.role === "citizen" ? "lookup" : "citizens"
  );

  useEffect(() => {
    if (user?.role === "citizen") {
      setActiveTab("lookup");
    } else if (user?.role === "employee") {
      setActiveTab("citizens");
    }
  }, [user?.role]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "citizens":
        return <CitizenManager />;
      case "lookup":
        return <CitizenLookup />;
      default:
        return <CitizenManager />;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "#f8fafc",
        padding: "0",
        margin: "0",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "0",
          padding: window.innerWidth <= 768 ? "15px 20px" : "20px 40px",
          marginBottom: "0",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: window.innerWidth <= 768 ? "column" : "row",
          justifyContent: "space-between",
          alignItems: window.innerWidth <= 768 ? "flex-start" : "center",
          width: "100%",
          borderBottom: "1px solid #e2e8f0",
          gap: window.innerWidth <= 768 ? "15px" : "0",
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 5px 0",
              color: "#1a202c",
              fontSize: window.innerWidth <= 768 ? "20px" : "28px",
              fontWeight: "600",
            }}
          >
            Σύστημα Διαχείρισης Ευρωπαίων Πολιτών
          </h1>
          <p style={{ margin: 0, color: "#64748b" }}>
            Καλώς ήρθατε, {user?.name ? capitalizeText(user.name) : ""} (
            {user?.role === "employee" ? "Υπάλληλος" : "Πολίτης"})!
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: window.innerWidth <= 768 ? "10px" : "15px",
            alignItems: "center",
            flexDirection: window.innerWidth <= 768 ? "column" : "row",
            width: window.innerWidth <= 768 ? "100%" : "auto",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              width: window.innerWidth <= 768 ? "100%" : "auto",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            Αποσύνδεση
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #e2e8f0",
          padding: window.innerWidth <= 768 ? "0 20px" : "0 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0",
            flexDirection: window.innerWidth <= 768 ? "column" : "row",
          }}
        >
          {user?.role === "employee" && (
            <button
              onClick={() => setActiveTab("citizens")}
              style={{
                padding: "16px 24px",
                background:
                  activeTab === "citizens" ? "#3b82f6" : "transparent",
                color: activeTab === "citizens" ? "white" : "#64748b",
                border: "none",
                borderBottom:
                  activeTab === "citizens"
                    ? "3px solid #3b82f6"
                    : "3px solid transparent",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              👥 Διαχείρηση Ευρωπαίων Πολιτών
            </button>
          )}

          <button
            onClick={() => setActiveTab("lookup")}
            style={{
              padding: "16px 24px",
              background: activeTab === "lookup" ? "#3b82f6" : "transparent",
              color: activeTab === "lookup" ? "white" : "#64748b",
              border: "none",
              borderBottom:
                activeTab === "lookup"
                  ? "3px solid #3b82f6"
                  : "3px solid transparent",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            🔍 Αναζήτηση Στοιχείων
          </button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default Dashboard;
