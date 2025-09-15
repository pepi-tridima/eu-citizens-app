import React, { useState } from "react";
import axios from "axios";
import { capitalizeText, capitalizePassport } from "../utils/textUtils";

const API_BASE_URL = "http://localhost:5000/api";

interface CitizenData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportIssueDate: string;
  uniqueId: string;
}

const CitizenLookup: React.FC = () => {
  const [passportNumber, setPassportNumber] = useState("");
  const [citizenData, setCitizenData] = useState<CitizenData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passportNumber.trim()) {
      setError("Παρακαλώ εισάγετε τον αριθμό διαβατηρίου");
      return;
    }

    if (passportNumber.length !== 9) {
      setError("Ο αριθμός διαβατηρίου πρέπει να είναι ακριβώς 9 χαρακτήρες");
      return;
    }

    setLoading(true);
    setError("");
    setCitizenData(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/citizens/lookup/${passportNumber.toLowerCase()}`
      );
      setCitizenData(response.data.citizen);
    } catch (error: any) {
      console.error("Error looking up citizen:", error);
      setError(
        error.response?.data?.error ||
          "Δεν βρέθηκε πολίτης με αυτόν τον αριθμό διαβατηρίου"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("el-GR");
  };

  return (
    <div
      style={{
        padding: window.innerWidth <= 768 ? "15px" : "20px",
        maxWidth: window.innerWidth <= 768 ? "95%" : "800px",
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            margin: 0,
            color: "#1a202c",
            fontSize: window.innerWidth <= 768 ? "24px" : "32px",
            fontWeight: "600",
          }}
        >
          Αναζήτηση Στοιχείων Πολίτη
        </h1>
        <p
          style={{
            margin: "10px 0 0 0",
            color: "#64748b",
            fontSize: window.innerWidth <= 768 ? "14px" : "16px",
          }}
        >
          Εισάγετε τον αριθμό διαβατηρίου σας για να δείτε τα στοιχεία σας
        </p>
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: window.innerWidth <= 768 ? "20px" : "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          marginBottom: "30px",
        }}
      >
        <form onSubmit={handleSearch}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "600",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              Αριθμός Διαβατηρίου
            </label>
            <input
              type="text"
              value={passportNumber}
              onChange={(e) => setPassportNumber(e.target.value)}
              placeholder="Εισάγετε τον αριθμό διαβατηρίου σας (9 χαρακτήρες)"
              maxLength={9}
              minLength={9}
              pattern="[A-Za-z0-9]{9}"
              title="Ο αριθμός διαβατηρίου πρέπει να είναι ακριβώς 9 χαρακτήρες"
              style={{
                width: "100%",
                padding: "14px 16px",
                border:
                  passportNumber.length > 0 && passportNumber.length !== 9
                    ? "2px solid #ef4444"
                    : "2px solid #e2e8f0",
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
            {passportNumber.length > 0 && passportNumber.length !== 9 && (
              <small
                style={{
                  color: "#ef4444",
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                Ο αριθμός διαβατηρίου πρέπει να είναι ακριβώς 9 χαρακτήρες
              </small>
            )}
          </div>

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
          >
            {loading ? "Αναζήτηση..." : "Αναζήτηση"}
          </button>
        </form>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            color: "#dc2626",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "20px",
            border: "1px solid #fecaca",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {error}
        </div>
      )}

      {citizenData && (
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "30px",
              color: "#1a202c",
              fontSize: "24px",
              fontWeight: "600",
            }}
          >
            Στοιχεία Πολίτη
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Όνομα
              </label>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                {capitalizeText(citizenData.firstName)}
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Επώνυμο
              </label>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                {capitalizeText(citizenData.lastName)}
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Ημερομηνία Γέννησης
              </label>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                {formatDate(citizenData.dateOfBirth)}
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Υπηκοότητα
              </label>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                {capitalizeText(citizenData.nationality)}
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Αριθμός Διαβατηρίου
              </label>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                {capitalizePassport(citizenData.passportNumber)}
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Ημερομηνία Έκδοσης
              </label>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                {formatDate(citizenData.passportIssueDate)}
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Μοναδικό ID
              </label>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontFamily: "monospace",
                  fontSize: "14px",
                }}
              >
                {capitalizeText(citizenData.uniqueId)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenLookup;
