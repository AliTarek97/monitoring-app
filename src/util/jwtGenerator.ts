import jwt from "jsonwebtoken";
import { UserDocument } from "../models/User";

// TODO add secret to .env
export const createToken = (user: UserDocument): string => {
    const expiresIn = 60 * 60; // an hour
    const secret = "ThisIsAJwtSecret";
    const dataStoredInToken = {
        id: user._id
    };
    return `${jwt.sign(dataStoredInToken, secret, { expiresIn })}`;
};