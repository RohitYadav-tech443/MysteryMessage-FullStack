import {z} from "zod"

export const verifySchema = z.object({
    code: z.string().length(6, 'verification code must be of the 6 digits')
});