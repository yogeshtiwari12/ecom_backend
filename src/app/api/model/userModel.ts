import mongoose,{Document, Schema} from "mongoose";

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    isVerified: boolean;
    verifyCodeExpiry: Date;
    otp: string;
}

const userSchema : Schema<User> = new Schema({
name:{
    type: String,
    required: true
},
email:{
    required: true,
    type: String,
},password:{
    type: String,
    required: true
},
role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
    // required: false
},
isVerified:{
    type: Boolean,
    default: false
},
verifyCodeExpiry: {
    type: Date,
    default: Date.now  // Remove parentheses to make it a function reference, not an immediate execution
},
createdAt: {
    type: Date,
    default: Date.now
},
otp: {
    type: String,
    default: "000000" // Remove required: true to prevent validation errors
}
})

export const User = mongoose.models.User || mongoose.model<User>("User", userSchema);