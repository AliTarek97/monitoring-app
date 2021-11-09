import mongoose from "mongoose";
export type reportDocument = mongoose.Document & {
    status: string;
    availability: number,
    outages: number,
    downtime: number,
    uptime: number,
    responseTime: number,
    history: string

};

const reportsSchema = new mongoose.Schema<reportDocument>(
    {
        status: { type: String, required: true },
        availability: { type: Number, required: true },
        outages: { type: Number, required: true },
        downtime: { type: Number, required: true },
        uptime: { type: Number, required: true },
        responseTime: { type: Number, required: true },
        history: { type: String }
    },
    { timestamps: true },
);

export const reportsLogs = mongoose.model<reportDocument>("PollingLogs", reportsSchema);
