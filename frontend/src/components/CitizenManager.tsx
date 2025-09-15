import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Calendar from "./Calendar";
import { capitalizeText, capitalizePassport } from "../utils/textUtils";

const API_BASE_URL = "http://localhost:5000/api";

interface Citizen {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportIssueDate: string;
  uniqueId: string;
  createdAt: string;
  updatedAt: string;
}

const CitizenManager: React.FC = () => {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCitizen, setEditingCitizen] = useState<Citizen | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
    passportIssueDate: "",
  });
  const [showBirthCalendar, setShowBirthCalendar] = useState(false);
  const [showIssueCalendar, setShowIssueCalendar] = useState(false);
  const { user } = useAuth();

  const EU_COUNTRIES = [
    "Austria",
    "Belgium",
    "Bulgaria",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Ireland",
    "Italy",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Netherlands",
    "Poland",
    "Portugal",
    "Romania",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
  ];

  useEffect(() => {
    if (user?.role === "employee") {
      fetchCitizens();
    }
  }, [user]);

  const fetchCitizens = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/citizens`);
      setCitizens(response.data);
    } catch (error: any) {
      console.error("Error fetching citizens:", error);
      setError("Σφάλμα κατά τη λήψη των πολιτών");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passport number length
    if (formData.passportNumber.length !== 9) {
      setError("Ο αριθμός διαβατηρίου πρέπει να είναι ακριβώς 9 χαρακτήρες");
      return;
    }

    try {
      // Convert names and passport to lowercase for backend
      const dataToSend = {
        ...formData,
        firstName: formData.firstName.toLowerCase(),
        lastName: formData.lastName.toLowerCase(),
        passportNumber: formData.passportNumber.toLowerCase(),
      };

      if (editingCitizen) {
        await axios.put(
          `${API_BASE_URL}/citizens/${editingCitizen._id}`,
          dataToSend
        );
      } else {
        await axios.post(`${API_BASE_URL}/citizens`, dataToSend);
      }

      setShowForm(false);
      setEditingCitizen(null);
      setError("");
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        nationality: "",
        passportNumber: "",
        passportIssueDate: "",
      });
      fetchCitizens();
    } catch (error: any) {
      console.error("Error saving citizen:", error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.status === 400) {
        setError("Σφάλμα επικύρωσης δεδομένων");
      } else {
        setError("Σφάλμα κατά την αποθήκευση");
      }
    }
  };

  const handleEdit = (citizen: Citizen) => {
    setEditingCitizen(citizen);
    setFormData({
      firstName: citizen.firstName,
      lastName: citizen.lastName,
      dateOfBirth: citizen.dateOfBirth.split("T")[0],
      nationality: citizen.nationality,
      passportNumber: citizen.passportNumber,
      passportIssueDate: citizen.passportIssueDate.split("T")[0],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον πολίτη;"
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/citizens/${id}`);
      fetchCitizens();
    } catch (error: any) {
      console.error("Error deleting citizen:", error);
      setError("Σφάλμα κατά τη διαγραφή");
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      nationality: "",
      passportNumber: "",
      passportIssueDate: "",
    });
    setEditingCitizen(null);
    setShowForm(false);
    setError("");
  };

  if (user?.role !== "employee") {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Δεν έχετε δικαίωμα πρόσβασης σε αυτή τη σελίδα</h2>
        <p>Μόνο οι υπάλληλοι μπορούν να διαχειρίζονται τους πολίτες.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Φόρτωση...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ margin: 0, color: "#1a202c" }}>
          Διαχείρηση Ευρωπαίων Πολιτών
        </h1>
        <button
          onClick={() => setShowForm(true)}
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          + Νέος Πολίτης
        </button>
      </div>

      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: window.innerWidth <= 768 ? "20px" : "40px",
              borderRadius: "12px",
              maxWidth: window.innerWidth <= 768 ? "95%" : "800px",
              width: window.innerWidth <= 768 ? "95%" : "90%",
              minHeight: window.innerWidth <= 768 ? "80vh" : "90vh",
              maxHeight: "95vh",
              overflow: "auto",
              boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
              border: "1px solid #e2e8f0",
            }}
            onClick={(e) => {
              if (showBirthCalendar || showIssueCalendar) {
                setShowBirthCalendar(false);
                setShowIssueCalendar(false);
              }
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "30px" }}>
              {editingCitizen ? "Επεξεργασία Πολίτη" : "Νέος Πολίτης"}
            </h2>

            {error && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  padding: "16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  border: "1px solid #fecaca",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Όνομα *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: "white",
                      color: "#1a202c",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Επώνυμο *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: "white",
                      color: "#1a202c",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ position: "relative" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Ημερομηνία Γέννησης *
                  </label>
                  <input
                    type="text"
                    value={
                      formData.dateOfBirth
                        ? new Date(formData.dateOfBirth).toLocaleDateString(
                            "el-GR"
                          )
                        : ""
                    }
                    readOnly
                    onClick={() => setShowBirthCalendar(true)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "14px",
                      cursor: "pointer",
                      backgroundColor: "white",
                      color: "#1a202c",
                    }}
                  />
                  {showBirthCalendar && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "0",
                        zIndex: 1001,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Calendar
                        selectedDate={formData.dateOfBirth}
                        onDateSelect={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            dateOfBirth: date,
                          }));
                          setShowBirthCalendar(false);
                        }}
                        onClose={() => setShowBirthCalendar(false)}
                        disableClickOutside={true}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Υπηκοότητα *
                  </label>
                  <select
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: "white",
                      color: "#1a202c",
                    }}
                  >
                    <option value="">Επιλέξτε χώρα</option>
                    {EU_COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "30px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Αριθμός Διαβατηρίου *
                  </label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleInputChange}
                    required
                    maxLength={9}
                    minLength={9}
                    pattern="[A-Za-z0-9]{9}"
                    title="Ο αριθμός διαβατηρίου πρέπει να είναι ακριβώς 9 χαρακτήρες"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border:
                        formData.passportNumber.length > 0 &&
                        formData.passportNumber.length !== 9
                          ? "2px solid #ef4444"
                          : "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: "white",
                      color: "#1a202c",
                    }}
                  />
                  {formData.passportNumber.length > 0 &&
                    formData.passportNumber.length !== 9 && (
                      <small
                        style={{
                          color: "#ef4444",
                          fontSize: "12px",
                          marginTop: "4px",
                          display: "block",
                        }}
                      >
                        Ο αριθμός διαβατηρίου πρέπει να είναι ακριβώς 9
                        χαρακτήρες
                      </small>
                    )}
                </div>

                <div style={{ position: "relative" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Ημερομηνία Έκδοσης *
                  </label>
                  <input
                    type="text"
                    value={
                      formData.passportIssueDate
                        ? new Date(
                            formData.passportIssueDate
                          ).toLocaleDateString("el-GR")
                        : ""
                    }
                    readOnly
                    onClick={() => setShowIssueCalendar(true)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "14px",
                      cursor: "pointer",
                      backgroundColor: "white",
                      color: "#1a202c",
                    }}
                  />
                  {showIssueCalendar && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "0",
                        zIndex: 1001,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Calendar
                        selectedDate={formData.passportIssueDate}
                        onDateSelect={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            passportIssueDate: date,
                          }));
                          setShowIssueCalendar(false);
                        }}
                        onClose={() => setShowIssueCalendar(false)}
                        disableClickOutside={true}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    backgroundColor: "#6b7280",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Ακύρωση
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {editingCitizen ? "Ενημέρωση" : "Δημιουργία"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc" }}>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Όνομα
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Επώνυμο
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Υπηκοότητα
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Διαβατήριο
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Μοναδικό ID
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Ενέργειες
              </th>
            </tr>
          </thead>
          <tbody>
            {citizens.map((citizen) => (
              <tr
                key={citizen._id}
                style={{ borderBottom: "1px solid #f1f5f9" }}
              >
                <td style={{ padding: "16px" }}>
                  {capitalizeText(citizen.firstName)}
                </td>
                <td style={{ padding: "16px" }}>
                  {capitalizeText(citizen.lastName)}
                </td>
                <td style={{ padding: "16px" }}>
                  {capitalizeText(citizen.nationality)}
                </td>
                <td style={{ padding: "16px" }}>
                  {capitalizePassport(citizen.passportNumber)}
                </td>
                <td
                  style={{
                    padding: "16px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                >
                  {capitalizeText(citizen.uniqueId)}
                </td>
                <td style={{ padding: "16px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleEdit(citizen)}
                      style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      Επεξεργασία
                    </button>
                    <button
                      onClick={() => handleDelete(citizen._id)}
                      style={{
                        backgroundColor: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      Διαγραφή
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {citizens.length === 0 && (
          <div
            style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}
          >
            <p>Δεν υπάρχουν πολίτες καταχωρημένοι</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenManager;
