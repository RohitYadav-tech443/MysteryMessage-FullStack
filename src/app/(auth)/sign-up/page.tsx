"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
// import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner";
// toast("Event has been created.")
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/Schemas/signUpSchema";
import { tree } from "next/dist/build/templates/app-page";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { success } from "zod/v4";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);
  // 300 milisecond is the delay time for the debounce
  // const { toast } = useToast();
  const router = useRouter();

  //  zod implementation
  // below line is used to define the userform should take the data from the signupSchema
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/checkUsername-Unique?username=${username}`
          );
          // let message= response.data.message
          // setUsernameMessage(message);
          // above syntax is for in case aap ka kaam na ho raha ho toh
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking the Username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  //  ye jo ham neecke backticks mein send karte hain n usmein na toh wahan par hamari request send hoti hai
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsCheckingUsername(true);
    try {
  const response = await axios.post<ApiResponse>(`/api/sign-up`, data);

  toast.success(response.data.message, {
    // Optional action button
    action: {
      label: "Sign In",
      onClick: () => router.push('/sign-in'),
    },
  });

    router.replace(`/verify/${username}`);
    setIsSubmitting(false);
  } catch (error) {
    toast.error("Sign up failed. Please try again.");
    setIsSubmitting(false);
  }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* const form = useForm() */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                   {isCheckingUsername && <Loader2 className="animate-spin" />}
                   <p className={`text-sm ${usernameMessage === "Username is Unique" ? 'text-green-500' : 'text-red-500'}`}>
                      test {usernameMessage}
                   </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />                    
                  </FormControl>                 
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
        </div>
    </div>
  );
};

export default page;
