import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User, UserDocument } from "../models/User";
export interface AuthenticatedRequest extends Request {
    user: UserDocument;
}

// TODO remove hard coded string
export const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, "ThisIsAJwtSecret") as { id: string };
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error("You are not logged in.");
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: "please login." });
    }
};