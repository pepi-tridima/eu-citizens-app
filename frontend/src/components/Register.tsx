import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen" as "citizen" | "employee",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      await register(
        formData.name.toLowerCase(),
        formData.email.toLowerCase(),
        formData.password,
        formData.role
      );

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
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
          padding: window.innerWidth <= 768 ? "30px 20px" : "60px",
          borderRadius: "0",
          boxShadow: "none",
          width: "100%",
          maxWidth: window.innerWidth <= 768 ? "100%" : "500px",
          minHeight: window.innerWidth <= 768 ? "auto" : "100vh",
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
              background: "#3b82f6",
              borderRadius: "50%",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: "white",
            }}
          >
            👤
          </div>
          <h1
            style={{
              margin: "0",
              color: "#1a202c",
              fontSize: window.innerWidth <= 768 ? "24px" : "32px",
              fontWeight: "600",
            }}
          >
            Εγγραφή
          </h1>
          <p
            style={{
              margin: "10px 0 0 0",
              color: "#64748b",
              fontSize: window.innerWidth <= 768 ? "14px" : "16px",
            }}
          >
            Δημιουργήστε τον λογαριασμό σας
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
              Όνομα
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Εισάγετε το όνομά σας"
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "16px",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
                backgroundColor: "white",
                outline: "none",
                color: "#1a202c",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.backgroundColor = "white";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.backgroundColor = "white";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

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
                backgroundColor: "white",
                outline: "none",
                color: "#1a202c",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.backgroundColor = "white";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.backgroundColor = "white";
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
              minLength={6}
              placeholder="Τουλάχιστον 6 χαρακτήρες"
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "16px",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
                backgroundColor: "white",
                outline: "none",
                color: "#1a202c",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.backgroundColor = "white";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.backgroundColor = "white";
                e.target.style.boxShadow = "none";
              }}
            />
            <small
              style={{
                color: "#94a3b8",
                fontSize: "13px",
                marginTop: "8px",
                display: "block",
              }}
            >
              Χρησιμοποιήστε τουλάχιστον 6 χαρακτήρες
            </small>
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
              Ρόλος
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "16px",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
                backgroundColor: "white",
                outline: "none",
                color: "#1a202c",
                cursor: "pointer",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.backgroundColor = "white";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.backgroundColor = "white";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="citizen">Πολίτης</option>
              <option value="employee">Υπάλληλος</option>
            </select>
            <small
              style={{
                color: "#94a3b8",
                fontSize: "13px",
                marginTop: "8px",
                display: "block",
              }}
            >
              Πολίτες: μπορούν να βλέπουν μόνο τα δικά τους στοιχεία
              <br />
              Υπάλληλοι: μπορούν να διαχειρίζονται όλους τους πολίτες
            </small>
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
              background: loading ? "#9ca3af" : "#3b82f6",
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
                : "0 4px 15px rgba(59, 130, 246, 0.3)",
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.4)";
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.3)";
              }
            }}
          >
            {loading ? "Εγγραφή..." : "Εγγραφή"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "#64748b",
          }}
        >
          Έχετε ήδη λογαριασμό?{" "}
          <button
            onClick={() => navigate("/login")}
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
            Σύνδεση
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
