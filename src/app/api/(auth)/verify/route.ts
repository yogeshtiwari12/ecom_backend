
import { User } from "../../model/userModel";
import { connectDb } from "../../route";

export async function POST(request: Request) {
  const { name, otp } = await request.json();
  // console.log("Received Name:", name);
  // console.log("Received OTP:", otp);
  
  try {
    await connectDb();
    
    const decodedusername = decodeURIComponent(name);
    // console.log("Decoded Username:", decodedusername);
    

    const user = await User.findOne({ name: decodedusername });
    // console.log("User found:", user ? "Yes" : "No");
    
    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }
    

    
    const isCodeValid = user.otp === otp;
    const isNotExpired = new Date(user.verifyCodeExpiry) > new Date(); 
    
    console.log("OTP matches:", isCodeValid);
    console.log("OTP not expired:", isNotExpired);
    
    if (isCodeValid && isNotExpired) {
      user.isVerified = true;
      await user.save();
      
      return Response.json({
        success: true,
        message: "User verified successfully",
      });
    } else if (!isNotExpired) {
      return Response.json({
        success: false,
        message: "Verification code expired",
      });
    } else {
      return Response.json({
        success: false,
        message: "Invalid verification code",
      });
    }
  } catch (error) {
    console.error("Error in verify code:", error);
    return Response.json({
      success: false,
      message: `Failed to verify code: ${(error as Error).message}`,
    });
  }
}
