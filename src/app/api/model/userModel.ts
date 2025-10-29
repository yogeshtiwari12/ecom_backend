import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    isVerified: boolean;
    verifyCodeExpiry: Date;
    otp: string;
    phoneno: string;
    employeeId?: string;
}

const userSchema: Schema<User> = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        required: true,
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "delivery_agent"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyCodeExpiry: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    otp: {
        type: String,
        default: "000000"
    },
    phoneno: {
        type: String,
        required: false,
        default: null
    },
    employeeId: {
        type: String,
        required: false,
        default: null
    },
}, {
    timestamps: true,
    versionKey: false
});

export const User = mongoose.models.User || mongoose.model<User>("User", userSchema);