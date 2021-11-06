import { CronJob } from "cron";
import axios from "axios";
import { Check } from "../models/check";

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
                    const url = `${check.protocol}://${check.url}`;
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