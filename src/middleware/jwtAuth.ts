import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

interface JwtPayload {
    id: string;
}

export default async function jwtAuth(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user; // attach user to request
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
