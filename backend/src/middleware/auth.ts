import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types.js";

export const auth =
  (roles: string[] = []) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header) return res.status(401).json({ error: "No token provided" });

    const token = header.split(" ")[1];

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        role: string;
      };

      req.user = payload;

      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ error: "Access denied" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
