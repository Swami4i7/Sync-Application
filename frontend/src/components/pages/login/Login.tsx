"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Button } from "../../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import { Card } from "../../ui/card";
import { useRouter } from "next/navigation";
import { loginUserSchema } from "@/schema/users";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { getErrorMessage } from "@/app/error/page";
import { motion, AnimatePresence } from "framer-motion";
import { encryptBody } from "@/lib/utils";

export default function Login() {
  const form = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      USER_NAME: "",
      PASSWORD: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof loginUserSchema>) => {
    setIsLoading(true);
    const { USER_NAME, PASSWORD } = values;
    const credentialsdata = {
      user_name: USER_NAME,
      password: PASSWORD,  
    }
    const body = JSON.stringify(credentialsdata);
    const { ciphertext, iv } = encryptBody(body);
    const encryptedBody = JSON.stringify({ ciphertext, iv });
    const result = await signIn("credentials", {
      redirect: false,
      encryptedBody: encryptedBody,
    });

    if (result?.error) {
      const errorMessage = getErrorMessage(result.error);
      toast.error(errorMessage, { duration: 3000 });
    } else {
      router.push("/setup-details");
      toast.success("Login successful", { duration: 3000 });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FEFCF3] dark:bg-[#0C0C0C] text-black dark:text-white transition-colors duration-300">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg  h-full max-h-lg"
        >
          <Card className="bg-white dark:bg-gray-900 p-14 py-18 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Login
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Access your account with your login credentials
              </p>
            </motion.div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="USER_NAME"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">
                        Username
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          className="relative group"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Input
                            placeholder="Username"
                            {...field}
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-600 dark:focus:ring-gray-300 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          />
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
                          >
                            <Mail size={18} />
                          </motion.div>
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="PASSWORD"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">
                        Password
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          className="relative group"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Input
                            placeholder="Password"
                            type="password"
                            {...field}
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-white dark:focus:ring-gray-300 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          />
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
                          >
                            <Lock size={18} />
                          </motion.div>
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />

<motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    type="submit"
                    className="w-full py-3 text-lg font-semibold rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed will-change-colors"
                    disabled={isLoading}
                  >
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          layout
                          className="flex items-center"
                        >
                          <svg
                            className="animate-spin mr-2 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                            />
                          </svg>
                          Logging in...
                        </motion.span>
                      ) : (
                        <motion.span
                          key="login"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}
                          layout
                        >
                          Login
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>

                {/* <div className="text-center">
                  <Link
                    href="/register"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    Don&apos;t have an account?{" "}
                    <span className="font-semibold underline">Sign up</span>
                  </Link>
                </div> */}
              </form>
            </Form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}