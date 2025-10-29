import { connectDb } from "../../route";
import { sendVerificationEmail } from "../../component/verifyemail";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
export async function POST(request: Request) {
  try {
    await connectDb();
    const { name, email, password, role } = await request.json();

    const isVerifiedUserAlreadyExists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { name }],
        isVerified: true,
      }
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
        await prisma.user.update({
          where: { id: isVerifiedUserAlreadyExists.id },
          data: {
            password: haspass,
            otp: verifycode,
            verifyCodeExpiry: new Date(Date.now() + 3600000),
          },
        });
      }
    } else {
      const haspass = await bcrypt.hash(password, 10);
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + 1);

    await prisma.user.create({
        data: {
          name,
          email,
          otp: verifycode,
          password: haspass,  
          verifyCodeExpiry: expiryTime,
          role
        },
      });

    }
    
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
    
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Internal Server Error", success: false });
  }
}
