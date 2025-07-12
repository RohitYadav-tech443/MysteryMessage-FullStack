import {NextAuthOptions} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'   
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User.model'


export const authOptions: NextAuthOptions={
    // here like we are using the credential provider ,we can also use the other providers like google,github,facebook etc just by putting it along with the credentials provider
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                // yhan par hame credentials ka access milta hai
                email:{label:"Email",type:"text",placeholder:"Enter your Email"},
                password:{label:"Password",type:"password",placeholder:"Enter your password"}
            },
            async authorize(credentials:any ) : Promise<any>{
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.identifiers},
                            {username:credentials.identifiers}
                        ]
                    })
                    if(!user){
                        throw new Error("No user found with this email")
                    }

                    if(!user.isVerified){
                        throw new Error("Please verify your email before logging in")
                    }
                    const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password)
                    if(!isPasswordCorrect){
                        throw new Error("Incorrect password")
                    }
                    return user
                } catch (err :any) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks:{
        // here we are definig the both jwt and session
        async jwt({token,user}){
            // now make the token powerFul 
            if(user){
                token._id=user._id?.toString() // convert to string because _id is an object id
                token.isVerified=user.isVerified // add isVerified to the token
                token.isAcceptingMessages=user.isAcceptingMessages // add isAcceptingMessages to the token
                token.username=user.username // add username to the token
            }
            // you can add more properties to the token if you want
            return token
        },
        async session({session,token}){
            if(token){
                session.user._id=token._id
                session.user.isVerified=token.isVerified
                session.user.isAcceptingMessages=token.isAcceptingMessages
                session.user.username=token.username
            }
            return session
        },
    },
    pages:{
        signIn:'/sign-in',
    },
    // if you customise the session then you need to return the session as the callBack,if you customize the jwt then you nedd to return the jwt as the cllback
    session:{
        strategy:'jwt',
    },
    secret:process.env.NEXTAUTH_SECRET,
     

}