import express from "express";
import { Citizen } from "../models/Citizen";
import {
  authenticateToken,
  requireEmployee,
  optionalAuth,
} from "../middleware/auth";

const router = express.Router();

router.get("/", authenticateToken, requireEmployee, async (req, res) => {
  try {
    const citizens = await Citizen.find().sort({ createdAt: -1 });
    res.json(citizens);
  } catch (error: any) {
    console.error("Error fetching citizens:", error);
    res.status(500).json({ error: "Σφάλμα κατά τη λήψη των πολιτών" });
  }
});

router.get("/:id", authenticateToken, requireEmployee, async (req, res) => {
  try {
    const citizen = await Citizen.findById(req.params.id);
    if (!citizen) {
      return res.status(404).json({ error: "Ο πολίτης δεν βρέθηκε" });
    }
    res.json(citizen);
  } catch (error: any) {
    console.error("Error fetching citizen:", error);
    res.status(500).json({ error: "Σφάλμα κατά τη λήψη του πολίτη" });
  }
});

router.post("/", authenticateToken, requireEmployee, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      nationality,
      passportNumber,
      passportIssueDate,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !nationality ||
      !passportNumber ||
      !passportIssueDate
    ) {
      return res.status(400).json({
        error: "Παρακαλώ συμπληρώστε όλα τα πεδία",
      });
    }

    const existingCitizen = await Citizen.findOne({
      passportNumber: passportNumber.toLowerCase(),
    });
    if (existingCitizen) {
      return res.status(400).json({
        error: "Ο αριθμός διαβατηρίου υπάρχει ήδη",
      });
    }

    const newCitizen = new Citizen({
      firstName,
      lastName,
      dateOfBirth,
      nationality,
      passportNumber,
      passportIssueDate,
    });

    const savedCitizen = await newCitizen.save();
    res.status(201).json({
      message: "Ο πολίτης δημιουργήθηκε επιτυχώς!",
      citizen: savedCitizen,
    });
  } catch (error: any) {
    console.error("Error creating citizen:", error);
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return res.status(400).json({
        error: validationErrors.join(", "),
      });
    }
    res.status(500).json({
      error: "Σφάλμα server. Παρακαλώ δοκιμάστε ξανά.",
    });
  }
});

router.put("/:id", authenticateToken, requireEmployee, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      nationality,
      passportNumber,
      passportIssueDate,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !nationality ||
      !passportNumber ||
      !passportIssueDate
    ) {
      return res.status(400).json({
        error: "Παρακαλώ συμπληρώστε όλα τα πεδία",
      });
    }

    const existingCitizen = await Citizen.findOne({
      passportNumber: passportNumber.toLowerCase(),
      _id: { $ne: req.params.id },
    });
    if (existingCitizen) {
      return res.status(400).json({
        error: "Ο αριθμός διαβατηρίου υπάρχει ήδη σε άλλον πολίτη",
      });
    }

    const updatedCitizen = await Citizen.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        dateOfBirth,
        nationality,
        passportNumber,
        passportIssueDate,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCitizen) {
      return res.status(404).json({ error: "Ο πολίτης δεν βρέθηκε" });
    }

    res.json({
      message: "Ο πολίτης ενημερώθηκε επιτυχώς!",
      citizen: updatedCitizen,
    });
  } catch (error: any) {
    console.error("Error updating citizen:", error);
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return res.status(400).json({
        error: validationErrors.join(", "),
      });
    }
    res.status(500).json({
      error: "Σφάλμα server. Παρακαλώ δοκιμάστε ξανά.",
    });
  }
});

router.delete("/:id", authenticateToken, requireEmployee, async (req, res) => {
  try {
    const deletedCitizen = await Citizen.findByIdAndDelete(req.params.id);
    if (!deletedCitizen) {
      return res.status(404).json({ error: "Ο πολίτης δεν βρέθηκε" });
    }

    res.json({
      message: "Ο πολίτης διαγράφηκε επιτυχώς!",
    });
  } catch (error: any) {
    console.error("Error deleting citizen:", error);
    res.status(500).json({
      error: "Σφάλμα server. Παρακαλώ δοκιμάστε ξανά.",
    });
  }
});

router.get("/lookup/:passportNumber", optionalAuth, async (req, res) => {
  try {
    const { passportNumber } = req.params;

    const citizen = await Citizen.findOne({
      passportNumber: passportNumber.toLowerCase(),
    });
    if (!citizen) {
      return res
        .status(404)
        .json({ error: "Δεν βρέθηκε πολίτης με αυτόν τον αριθμό διαβατηρίου" });
    }

    res.json({
      citizen: {
        firstName: citizen.firstName,
        lastName: citizen.lastName,
        dateOfBirth: citizen.dateOfBirth,
        nationality: citizen.nationality,
        passportNumber: citizen.passportNumber,
        passportIssueDate: citizen.passportIssueDate,
        uniqueId: citizen.uniqueId,
      },
    });
  } catch (error: any) {
    console.error("Error looking up citizen:", error);
    res.status(500).json({ error: "Σφάλμα κατά την αναζήτηση του πολίτη" });
  }
});

export default router;
