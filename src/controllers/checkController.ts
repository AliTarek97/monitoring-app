"use strict";

import { Response } from "express";
import { AuthenticatedRequest } from "./api";
import { Check, CheckDocument, validate } from "../models/check";
import { CronJob } from "cron";
import axios from "axios";
export const createCheck = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO validate on coming request body
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const createdCheck: CheckDocument = await new Check({
      userId: req.user._id,
      ...req.body,
    }).save();

    const job = new CronJob(
      "*/5 * * * * *",
      async function() {
          try {
              console.log(`You will see this message every ${createdCheck.interval} seconds`);
              const url = `${createdCheck.protocol}://${createdCheck.url}`;
              console.log(url);
              const response = await axios.get(url);
              console.log(response.status);
          } catch (error) {
              console.log(error.message);
          }
      },
      null,
      true,
    );
    (global as any).jobMapper[createdCheck.id] = job;
    
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
    const job:CronJob = (global as any).jobMapper[deletedCheck.id];
    console.log((global as any).jobMapper[deletedCheck.id]);
    job.stop();
    delete (global as any).jobMapper[deletedCheck.id];

    res.status(200).send({message: "check deleted successfully", deletedCheck: deletedCheck});
  } catch (error) {
    res.status(400).send("An error occured");
  }
};

export const resumeCronJob = async (req: AuthenticatedRequest, res: Response) => {
  
  const check = await Check.findOne({userId: req.user.id, _id: req.params.checkId});
  
  const job:CronJob = (global as any).jobMapper[check.id];
  job.start();

  res.status(200).send(`Job of checkId ${check.id} has resumed`);
};
export const pauseCronJob = async (req: AuthenticatedRequest, res: Response) => {
    
  const check = await Check.findOne({userId: req.user.id, _id: req.params.checkId});
  
  const job:CronJob = (global as any).jobMapper[check.id];
  console.log((global as any).jobMapper[check.id]);
  job.stop();

  res.status(200).send(`Job of checkId ${check.id} has stopped`);
};

