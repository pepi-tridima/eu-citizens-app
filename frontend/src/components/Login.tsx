import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useResponsive } from "../hooks/useResponsive";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isMobile } = useResponsive();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData.email.toLowerCase(), formData.password);

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Σφάλμα δικτύου. Παρακαλώ δοκιμάστε ξανά.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        margin: "0",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: isMobile ? "30px 20px" : "60px",
          borderRadius: "0",
          boxShadow: "none",
          width: "100%",
          maxWidth: isMobile ? "100%" : "500px",
          minHeight: isMobile ? "auto" : "100vh",
          position: "relative",
          border: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "#10b981",
              borderRadius: "50%",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: "white",
            }}
          >
            🔐
          </div>
          <h1
            style={{
              margin: "0",
              color: "#1a202c",
              fontSize: isMobile ? "24px" : "32px",
              fontWeight: "600",
            }}
          >
            Σύνδεση
          </h1>
          <p
            style={{
              margin: "10px 0 0 0",
              color: "#64748b",
              fontSize: isMobile ? "14px" : "16px",
            }}
          >
            Καλώς ήρθατε πίσω!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "600",
                color: "#374151",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Εισάγετε το email σας"
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "16px",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
                backgroundColor: "#f8fafc",
                outline: "none",
                color: "#1a202c",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#10b981";
                e.target.style.backgroundColor = "white";
                e.target.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.backgroundColor = "#f8fafc";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "600",
                color: "#374151",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Κωδικός
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Εισάγετε τον κωδικό σας"
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "16px",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
                backgroundColor: "#f8fafc",
                outline: "none",
                color: "#1a202c",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#10b981";
                e.target.style.backgroundColor = "white";
                e.target.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.backgroundColor = "#f8fafc";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                color: "#dc2626",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "25px",
                border: "1px solid #fecaca",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: loading ? "#9ca3af" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              boxShadow: loading
                ? "none"
                : "0 4px 15px rgba(16, 185, 129, 0.3)",
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.4)";
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.3)";
              }
            }}
          >
            {loading ? "Σύνδεση..." : "Σύνδεση"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "#64748b",
          }}
        >
          Δεν έχετε λογαριασμό;{" "}
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              color: "#3b82f6",
              textDecoration: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "color 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.color = "#2563eb";
              e.target.style.textDecoration = "underline";
            }}
            onMouseOut={(e) => {
              e.target.style.color = "#3b82f6";
              e.target.style.textDecoration = "none";
            }}
          >
            Εγγραφή
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
