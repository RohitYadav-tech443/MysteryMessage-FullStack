import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
      const { username, email, password } = await request.json();
      const existingUserVerifiedByUsername = await UserModel.findOne({
        username,
        isVerified: true,
      });

      if(existingUserVerifiedByUsername){
        return Response.json({
            success:false,
            message:"Username is already taken"            
        },{status:400})
      }

      const existingUserByEmail=await UserModel.findOne({email})

      let verifyCode =Math.floor(100000+Math.random()*900000).toString()

      if(existingUserByEmail){
        if(existingUserByEmail.isVerified){
            return Response.json({
                success:false,
                message:"Email is already registered and verified"
            },{status:400})
        }
        else{
            const hashPassword = await bcrypt.hash(password, 10);
            existingUserByEmail.password=hashPassword;
            existingUserByEmail.verifyCode=verifyCode;
            existingUserByEmail.verifyCodeExpiry=new Date(Date.now() +3600000); // 1 hour from now
            await existingUserByEmail.save();
        }
      }
      else
      {
       const hashPassword= await bcrypt.hash(password,10)
        const expiryDate= new Date()
        expiryDate.setHours(expiryDate.getHours() +1)
        // upar ke line se email ki expiry ek ghante baad ho jaegi

       const newUser= new UserModel({
             username,
             email,
             password:hashPassword,
             verifyCode,
             verifyCodeExpiry:expiryDate,
             isVerified:false,
             isAcceptingMessage:true,
             messages:[],
        })

        await newUser.save();

        // send verification email
        const emailResponse=await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:"Error sending verification email.",
            },{status:500})
        }
        
        return Response.json({
                success:true,
                message:"User registered successfully. Please verify your email.",
        },{status:201})

        
      }
    }
    catch (error) {
        console.log("Error in sign-up route:", error);
        return Response.json(
          {
            success: false,
            message: "Error registering the user",
          },
          {
            status: 500,
          }
        );
    }
    // You should return a response if everything is successful
    return Response.json(
      {
        success: true,
        message: "User registration logic not fully implemented yet.",
      },
      {
        status: 200,
      }
    );
}    