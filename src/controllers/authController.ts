"use strict";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Request, Response } from "express";
import { User } from "../models/User";
import { VerificationCode } from "../models/verificationCode";
import { createToken } from "../util/jwtGenerator";
import { sendEmail } from "../util/sendEmail";

export const signUp = async (req: Request, res: Response) => {
    try {
        // const {error} = validate(req.body);
        // if(error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send("User with given email already exist!");

        user = await new User({
            email: req.body.email,
            password: req.body.password
        }).save();

        const verificationCode = await new VerificationCode({
            userId: user._id,
            code: crypto.randomBytes(32).toString("hex")
        }).save();

        // TODO change hard coded string to an enviroment variable
        const message = `http://localhost:3000/api/user/verify/${user.id}/${verificationCode.code}`;
        await sendEmail(user.email, "Verify Email", message);
        res.send("An Email sent to your account please verify");
    } catch (error) {
        res.status(400).send("An error occured");
    }
};

export const verifyUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send("Invalid link1");

        const code = await VerificationCode.findOne({
            userId: user._id,
            code: req.params.code,
        });
        if (!code) return res.status(400).send("Invalid link2");

        await User.updateOne({ _id: user._id, status: "Verified" });
        await VerificationCode.findByIdAndRemove(code._id);
        res.send("email verified sucessfully");
    } catch (error) {
        res.status(400).send("An error occured");
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email: req.body.email.toLowerCase() });
        if (!user) return res.status(400).send("User not found");

        if (user.status === "Pending") return res.status(400).send("Please verify your email first");

        const isPasswordMatching = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordMatching) return res.status(400).send("Incorrect password");

        const jsonWebToken = createToken(user);
        res.setHeader("www-authenticate", jsonWebToken);
        res.send(user);
    } catch (error) {
        res.status(400).send("An error occured");
    }
};
