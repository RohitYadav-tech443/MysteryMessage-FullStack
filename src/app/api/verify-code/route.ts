import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(request: Request){
    await dbConnect();
    try {
        const {username,code}=await request.json();

        const decodedUsername=decodeURIComponent(username) // decode the username in case it has special characters
        const user=await UserModel.findOne({username: decodedUsername})

        if(!user){
            return Response.json(
                {
                    success:false,
                    message:"User not found"
                },
                {
                    status: 500
                }
            )
        }

        const isCodeValid= user.verifyCode === code
        const isCodeNotExpired=new Date(user.verifyCodeExpiry)
        > new Date()
        // above line is just comparing the expirydate of the code with the new Date which is assigned 
        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true,
            await user.save()

             return Response.json(
                {
                    success:true,
                    message:"Account verified Successfully"
                },
                {
                    status: 200
                }
            )
        } else if (!isCodeNotExpired){
            return Response.json(
                {
                    success:false,
                    message:"verification code has expired, please request a new one"
                },
                {
                    status: 400
                }
            )
        }
        else{
            return Response.json(
                {
                    success:false,
                    message:"Incorrect verification code"
                },
                {
                    status: 400
                }
            )
        }

    } catch (error) {
        console.log("ERROR in checking checking username", error)
        return Response.json(
            {
                success: false,
                message: "Error checking the Username"
            },
            {
                status: 500
            },

        )
    }
}
