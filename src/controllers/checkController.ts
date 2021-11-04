"use strict";

import { Response, Request, NextFunction } from "express";
import { AuthenticatedRequest } from "./api";
import { Check, CheckDocument } from "../models/check";

/**
 * List of API examples.
 * @route GET /api
 */
export const createCheck = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // TODO validate on coming request body
        const createdCheck:CheckDocument = await new Check({
            userId: req.user._id,
            ...req.body
        }).save();
        res.status(201).send(createdCheck);
    } catch (error) {
        res.status(400).send("An error occured");
    }
};