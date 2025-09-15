import express from "express";
import { User } from "../models/User";
import { generateToken } from "../utils/jwt";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = "citizen" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Παρακαλώ συμπληρώστε όνομα, email και κωδικό",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        error: "Το email υπάρχει ήδη. Παρακαλώ χρησιμοποιήστε άλλο email.",
      });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
    });

    const savedUser = await newUser.save();

    const token = generateToken({
      userId: (savedUser._id as any).toString(),
      email: savedUser.email,
    });

    res.status(201).json({
      message: "Η εγγραφή ολοκληρώθηκε επιτυχώς!",
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error in register:", error);
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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Παρακαλώ συμπληρώστε email και κωδικό",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        error: "Λάθος email ή κωδικός",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Λάθος email ή κωδικός",
      });
    }

    const token = generateToken({
      userId: (user._id as any).toString(),
      email: user.email,
    });

    res.json({
      message: "Επιτυχής σύνδεση!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error in login:", error);
    res.status(500).json({
      error: "Σφάλμα server. Παρακαλώ δοκιμάστε ξανά.",
    });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user?.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Ο χρήστης δεν βρέθηκε" });
    }
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Σφάλμα server" });
  }
});

router.post("/verify", authenticateToken, (req, res) => {
  res.json({
    message: "Token is valid",
    user: {
      id: req.user?.userId,
      email: req.user?.email,
    },
  });
});

export default router;
