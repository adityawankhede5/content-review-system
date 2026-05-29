import { verifyJWT } from "../auth/jwt";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (_req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = _req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = verifyJWT(token);
        if (!decoded) {
                return res.status(401).json({ message: "Unauthorized" });
        }
        _req.user = decoded;
        next();

    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
}