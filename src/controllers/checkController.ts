"use strict";

import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { Check, CheckDocument, validate } from "../models/check";
import { assignJobToCheck, instantiateCronJob, removeJobAssignmentToCheck, stopJob, resumeJob } from "../util/cronJob";
export const createCheck = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO validate on coming request body
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const createdCheck: CheckDocument = await new Check({
      userId: req.user._id,
      ...req.body,
    }).save();

    const job = instantiateCronJob(createdCheck);
    assignJobToCheck(createdCheck, job);

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

    stopJob(deletedCheck);
    removeJobAssignmentToCheck(deletedCheck);

    res.status(200).send({message: "check deleted successfully", deletedCheck: deletedCheck});
  } catch (error) {
    res.status(400).send("An error occured");
  }
};

export const resumeCronJob = async (req: AuthenticatedRequest, res: Response) => {
  
  const check = await Check.findOne({userId: req.user.id, _id: req.params.checkId});
  if(!check) return res.status(400).send(`check with id ${req.params.checkId} is not found`);
  
  resumeJob(check);

  res.status(200).send(`Job of checkId ${check.id} has resumed`);
};
export const pauseCronJob = async (req: AuthenticatedRequest, res: Response) => {
    
  const check = await Check.findOne({userId: req.user.id, _id: req.params.checkId});
  if(!check) return res.status(400).send(`check with id ${req.params.checkId} is not found`);
  
  stopJob(check);

  res.status(200).send(`Job of checkId ${check.id} has stopped`);
};

