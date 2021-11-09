import bcrypt from "bcryptjs";
import Joi from "joi";
import mongoose from "mongoose";
export type UserDocument = mongoose.Document & {
    email: string;
    password: string;
    status: string,
    confirmationCode: string,
};

const userSchema = new mongoose.Schema<UserDocument>(
    {
        email: { type: String, unique: true },
        password: String,
        status: {
            type: String,
            enum: ["Pending", "Verified"],
            default: "Pending"
        },
    },
    { timestamps: true },
);

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, async (err, salt) => {
        if (err) { return next(err); }
        const hashedPassword: string = await bcrypt.hash(user.password, salt);
        if (err) { return next(err); }
        user.password = hashedPassword;
        next();
    });
});
export const User = mongoose.model<UserDocument>("User", userSchema);

export const validate = (user: any) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
    });
    return schema.validate(user);
};
// TODO check out what is the problem in exporting in that way
//   module.exports = {
//       User,
//       validate
//   };
