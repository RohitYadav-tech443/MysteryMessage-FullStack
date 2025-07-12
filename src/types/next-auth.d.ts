import 'next-auth';
import { DefaultSession } from 'next-auth';

// here we are using module augmentation to add properties to the User interface of next-auth to use those properties of those thing which we can't access directly
// this is useful when we want to add properties to the User interface of next-auth
declare module 'next-auth'{
    interface Session{
        user:{
            _id?:string;
            isVerified?:boolean;
            isAcceptingMessages?:boolean;
            username?:string;
        } & DefaultSession['user'];
    }
    // here we are adding properties to the User interface of next-auth
    interface User{
             _id?:string;
            isVerified?:boolean;
            isAcceptingMessages?:boolean;
            username?:string;
    }
}

declare module 'next-auth/jwt'{
    interface JWT{
        _id?:string;
        isVerified?:boolean;
        isAcceptingMessages?:boolean;
        username?:string;
    }
}