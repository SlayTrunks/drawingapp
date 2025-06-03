import { jwtsecret } from "@repo/backend-common/client";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
// Extend Request interface
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

interface DecodedToken extends JwtPayload {
  userId: string;
}
export function middleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = req.headers["authorization"];
    
    if (!token) {
      res.status(401).json({ msg: "unauthorized" });
      return; 
    }

    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(cleanToken, jwtsecret) as DecodedToken;

    if (decoded.userId) {
      req.userId = decoded.userId;
      next(); 
    } else {
      res.status(401).json({ msg: "check the token again" });
      return; 
    }
  } catch (error) {
    res.status(401).json({ msg: "unauthorized" });
    return; 
  }
}

