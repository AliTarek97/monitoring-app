import { CronJob } from "cron";
import axios from "axios";
import { Check, CheckDocument } from "../models/check";
import { bindUrl } from "./bindUrl";

export const instantiateCronJob = (check: CheckDocument) => {
    const job = new CronJob(
        "*/5 * * * * *",
        async function() {
            try {
                console.log(`You will see this message every ${check.interval} seconds`);
                const url = bindUrl(check);
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
     return job;
};


export const startCronJob = async () => {
    
    const checks = await Check.find({});
    const jobMapper:Record<string,CronJob>  = {};
        
    for (const check of checks) {
        console.log(check.url);
        const job = new CronJob(
            "*/5 * * * * *",
            async function() {
                try {
                    console.log(`You will see this message every ${check.interval} seconds`);
                    const url = bindUrl(check);
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
        jobMapper[`${check._id}`] = job;
    }

    Object.assign(global, {jobMapper: jobMapper});
};

export const resumeJob = (check:CheckDocument) => {
    const job:CronJob = (global as any).jobMapper[check.id];
    job.start();
};

export const stopJob = (check:CheckDocument) => {
    const job:CronJob = (global as any).jobMapper[check.id];
    console.log((global as any).jobMapper[check.id]);
    job.stop();
};

export const assignJobToCheck = (check:CheckDocument, job: CronJob) => {
    (global as any).jobMapper[check.id] = job;
};

export const removeJobAssignmentToCheck = (check:CheckDocument) => {
    delete (global as any).jobMapper[check.id];
};