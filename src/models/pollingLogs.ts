import mongoose from "mongoose";
export type pollingLogsDocument = mongoose.Document & {
    url: string;
    status: boolean,
    elapsedTime: number

};

const pollingLogsSchema = new mongoose.Schema<pollingLogsDocument>(
    {
        url: { type: String, index: true, required: true },
        status: { type: Boolean, required: true },
        elapsedTime: { type: Number, required: true }
    },
    { timestamps: true },
);

export const PollingLogs = mongoose.model<pollingLogsDocument>("PollingLogs", pollingLogsSchema);
