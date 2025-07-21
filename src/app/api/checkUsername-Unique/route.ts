import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import {z} from "zod";
import { usernameValidation } from "@/Schemas/signUpSchema";


const UsernameQuerySchema= z.object({
    username: usernameValidation,
})

export async function GET(request: Request){
    // TODO: use this in other routes
    if(request.method !== 'GET'){
         return Response.json({
                success: false,
                message:"Method not allowed",
            },{status: 405})
    }
   
    await dbConnect();
    
    try {
        const {searchParams}= new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        // validate using the Zod
        const result= UsernameQuerySchema.safeParse(queryParam)
        console.log(result)
        if(!result.success){
            const usernameErrors=result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message:"Invalid UserName",
            },{status: 400})
        }

        const {username}= result.data
        
        const existingVerifiedUser=await UserModel.findOne({username,isVerified: true})
        if(existingVerifiedUser){
             return Response.json({
                success: false,
                message:"Usernmae is already Taken",
            },{status: 400})
        }

        return Response.json({
                success: true,
                message:"Username is Unique",
            },{status: 200})
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
