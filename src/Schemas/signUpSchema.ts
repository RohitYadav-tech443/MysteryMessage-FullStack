import {z} from 'zod'

// regex jo ek word hai uska mtlb kuch bahit bayanak cheeez nhi hai balki ye aapko ek tarah ka validation boundares setUp karne mein help karta hai like 1to9 atoz AtoZ aise in sabke beeck mein hi reh kar satisfy karna chahiye
export const usernameValidation = z
    .string()
    .min(2,"username must be atleast of the two characters")
    // above line indicates that the min length of the given string should be two and if its less than that then we should send up the message mentioned in the braces
    .max(20,"Usernmae must be of atmost 20 characters")
    .regex(/^[a-zA-Z0-9]+$/,"must not contain special character")

    export const signUpSchema= z.object({
        username:usernameValidation,
        email:z.string().email({message:'Invalid Email address'}),
        password:z.string().min(6,{message:'password must at least 6 characters'})
    })