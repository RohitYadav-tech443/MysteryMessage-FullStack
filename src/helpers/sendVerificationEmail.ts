import {resend} from '@/lib/resend';
import VerificationEmail from '../../Emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'dev@hiteshchoudhary.com',
            to: email,
            subject: 'Mystery Message Verification Code',
            react: VerificationEmail({ username, otp: otp }),
    });
        return {success: true,message:"Verification email sent successfully"}
    } catch (emailError) {
        console.log("Error sending verification email:", emailError);
        return {success: false, message: "Failed to send verification email."};
    }
}