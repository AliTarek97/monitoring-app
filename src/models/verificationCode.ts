import mongoose, { Schema } from "mongoose";
export type verificationCodeDocument = mongoose.Document & {
    userId: Schema.Types.ObjectId;
    code: string
};

const verificationCodeSchema = new mongoose.Schema<verificationCodeDocument>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    code: {
        type: String,
        required: true
    },
},
    { timestamps: true },
);

export const VerificationCode = mongoose.model<verificationCodeDocument>("VerificationCode", verificationCodeSchema);
