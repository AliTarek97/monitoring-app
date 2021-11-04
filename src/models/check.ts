import mongoose, { Schema } from "mongoose";

type AuthenticationHeader = {
    username: string,
    password: string
}

type HTTPHeader = {
    key: string,
    value: string
}

type Assert = {
    statusCode: number
}
export type CheckDocument = mongoose.Document & {
    userId: Schema.Types.ObjectId,
    name: string;
    url: string;
    protocol: string,
    path?: string,
    port?: number,
    webhook?: string,
    timeout?: number,
    interval?: number,
    threshold?: number,
    authentication?: AuthenticationHeader,
    httpHeaders?: [HTTPHeader],
    assert?: Assert,
    tags?: [string],
    ignoreSSL: boolean
};

const checkSchema = new mongoose.Schema<CheckDocument>(
    {
        userId: {type: Schema.Types.ObjectId, ref: "User"},
        name: {type: String, required: true},
        url: {type: String, required: true},
        protocol: {
            type: String,
            enum: ["HTTP", "HTTPS", "TCP"],
            default: "Pending"
        },
        path: String,
        port: Number,
        webhook: String,
        timeout: {type: Number, default: 5},
        interval: {type: Number, default: 10*60},
        threshold: {type: Number, default: 1},
        authentication: {username: String, password: String},
        httpHeaders:[{key: String, value: String}],
        assert: {statusCode: Number},
        tags: [String],
        ignoreSSL: {type: Boolean, required: true}
    },
    { timestamps: true },
);

export const Check = mongoose.model<CheckDocument>("Check", checkSchema);

// export const validate = (user: any) => {
//     const schema = Joi.object({
//       email: Joi.string().email().required(),
//     });
//     return schema.validate(user);
//   };
// TODO check out what is the problem in exporting in that way
//   module.exports = {
//       User,
//       validate
//   };
