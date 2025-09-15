import { Request, Response, NextFunction } from "express";
import { verifyToken, extractTokenFromHeader, JwtPayload } from "../utils/jwt";
import { User } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { role?: string };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: "Access token required" });
      return;
    }

    const token = extractTokenFromHeader(authHeader);
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(403).json({ error: "User not found" });
      return;
    }

    req.user = {
      ...decoded,
      role: user.role,
    };
    next();
  } catch (error: any) {
    console.error("Auth middleware error:", error.message);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = extractTokenFromHeader(authHeader);
      const decoded = verifyToken(token);

      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = {
          ...decoded,
          role: user.role,
        };
      }
    }

    next();
  } catch (error) {
    next();
  }
};

export const requireEmployee = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  if (req.user.role !== "employee") {
    res.status(403).json({ error: "Employee access required" });
    return;
  }

  next();
};
