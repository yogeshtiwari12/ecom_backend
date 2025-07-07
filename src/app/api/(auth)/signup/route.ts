import { connectDb } from "../../route";

import { sendVerificationEmail } from "../../component/verifyemail";

import bcrypt from "bcryptjs";
import { User } from "../../model/userModel";

export async function POST(request: Request) {
  try {
    await connectDb();
    const { name, email, password,role } = await request.json();

    const isVerifiedUserAlreadyExists = await User.findOne({
      $or: [{ email }, { name }],
      isVerified: true,
    });

    const verifycode = Math.floor(100000 + Math.random() * 900000).toString();

    if (isVerifiedUserAlreadyExists) {
      if (isVerifiedUserAlreadyExists.isVerified) {
        return Response.json({
          message: "User already Exists With this email",
          success: false,
        });
      } else {
        const haspass = await bcrypt.hash(password, 10);
        isVerifiedUserAlreadyExists.password = haspass;
        isVerifiedUserAlreadyExists.otp = verifycode;
        isVerifiedUserAlreadyExists.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        );

        await isVerifiedUserAlreadyExists.save();
      }
    } else {
      const haspass = await bcrypt.hash(password, 10);
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + 1);

      const newUser = new User({
        name,
        email,
        otp: verifycode,
        password: haspass,
        verifyCodeExpiry: expiryTime,
        role
      });
      await newUser.save();


      const sendverificationemial = await sendVerificationEmail(
        name,
        verifycode,
        email
      );

      if (!sendverificationemial.success) {
        return Response.json({
          success: false,
          message: "Error sending verification email",
        });
      }
      return Response.json({
        message: "User created successfully Please Check your email for verification",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Internal Server Error", success: false });
  }
}