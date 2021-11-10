"use strict";

import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { Check } from "../models/check";
import { PollingLogs } from "../models/pollingLogs";
import { bindUrl } from "../util/bindUrl";
export const createReport = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const { checkId } = req.params;
        const check = await Check.findById(checkId);
        if (!check) return res.status(400).send("check is not found");
        const url = bindUrl(check);

        const status = (
            await PollingLogs.find({ url }).sort({ _id: -1 }).limit(1)
        )[0].status;
        const documentsCount: number = await PollingLogs.countDocuments({ url });
        const upUrls: number = await PollingLogs.countDocuments({
            url,
            status: true,
        });
        const availability: number = (upUrls / documentsCount) * 100;
        const outages: number = await PollingLogs.countDocuments({
            url,
            status: false,
        });
        const avgResponseTime =
            (
                await PollingLogs.aggregate()
                    .match({ url: url })
                    .group({ _id: null, totalTimeElapsed: { $sum: "$elapsedTime" } })
            )[0].totalTimeElapsed / documentsCount;

        const uptime = (availability / 100) * avgResponseTime;
        const downtime = (outages / 100) * avgResponseTime;
        res.json({
            status,
            availability,
            outages,
            upUrls,
            documentsCount,
            uptime,
            downtime,
            avgResponseTime,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};
