import { getServerSession } from "next-auth";
import {authOptions} from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model"; 
import {User} from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user = session?.user as User;
    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message:"Not Authenticated"
            },
            {
                status: 401
            }
        )
    }
    //  jab agr ham aggregation pipelines use karenge toh ye neeche wala statement pkka dikkat karega
    // const userId= user._id;

    const userId =new mongoose.Types.ObjectId(user._id);
    try {
        const user= await UserModel.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            {
                $unwind: "$messages"
            },
            {
                $sort:{'messages.createdAt': -1}
            },
            {
                $group: {_id: '$_id', messages:{$push: '$messages'}}                
            }
        ])
        if(!user || user.length === 0){
            return Response.json(
            {
                success: false,
                message:"User not found"
            },
            {
                status: 401
            }
        )
        }

        return Response.json(
            {
                success: true,
                messages:user[0].messages
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("An unexpected error occurred while fetching messages", error);
        return Response.json(
            {
                success: false,
                message:"Internal Server Error"
            },
            {
                status: 500
            }
        )
    }
}