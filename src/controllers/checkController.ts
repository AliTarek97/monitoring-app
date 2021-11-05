"use strict";

import { Response, Request, NextFunction } from "express";
import { AuthenticatedRequest } from "./api";
import { Check, CheckDocument } from "../models/check";
export const createCheck = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO validate on coming request body
    const createdCheck: CheckDocument = await new Check({
      userId: req.user._id,
      ...req.body,
    }).save();
    res.status(201).send(createdCheck);
  } catch (error) {
    res.status(400).send("An error occured");
  }
};

export const deleteCheck = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO validate on coming request body
    const deletedCheck = await Check.findOneAndDelete({
      userId: req.user._id,
      _id: req.params.checkId,
    });

    if(!deletedCheck) return res.status(400).send("Check doesn't exist");

    res.status(200).send({message: "check deleted successfully", deletedCheck: deletedCheck});
  } catch (error) {
    res.status(400).send("An error occured");
  }
};
