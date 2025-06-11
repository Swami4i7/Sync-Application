"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { encryptBody, processError } from "@/lib/utils";
import { UsersUpdate, UsersUpdateSchema } from "@/schema/users";
import { createUser } from "@/app/actions/user/users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FloatingLabelInput } from "@/components/ui/floating-label";
import { useSession } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalHeader, ResponsiveModalTitle } from "@/components/ui/responsive-modal";

interface CreateUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: () => void; 
  message?: string;
}

const CreateUsersModal: React.FC<CreateUsersModalProps> = ({ isOpen, onClose, onCreate ,message}) => {
  const form = useForm<UsersUpdate>({
    resolver: zodResolver(UsersUpdateSchema),
    defaultValues: {
      USER_NAME: "",
      PASSWORD: "",
      ROLE: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = form;

  const { data: sessionData } = useSession();
  const created_by = sessionData?.user?.username;

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: UsersUpdate) => {
    try {
      if (!created_by) {
        toast.error("User session not found.");
        return;
      }
      data.CREATED_BY = created_by;
      data.LAST_UPDATED_BY = created_by;
      const formattedData = {
        user_name: data.USER_NAME,
        password: data.PASSWORD,
        role: data.ROLE, 
        created_by: data.USER_NAME,
        last_updated_by: data.USER_NAME,
      };
      const body = JSON.stringify(formattedData);
      const { ciphertext, iv } = encryptBody(body);
      const encryptedBody = JSON.stringify({ ciphertext, iv });
      console.log("encryptedBody", encryptedBody);
      await createUser(encryptedBody);
      toast.success("User Created Successfully");
      reset(); 
      onClose(); 
      if (onCreate) 
      onCreate();
    } catch (error) {
      const errorMessage = processError(error);
      toast.error(errorMessage || "An error occurred");
    }
  };

  const renderForm = () => (
  <ResponsiveModal open={isOpen} onOpenChange={onClose}>
  <ResponsiveModalContent aria-describedby={""}>
  <ResponsiveModalHeader>
    <ResponsiveModalTitle>{message}</ResponsiveModalTitle>
  </ResponsiveModalHeader>
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-6 p-4"
        autoComplete="off"
      >
        <FormField
          control={control}
          name="USER_NAME"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <FormControl className="w-full">
                  <div className="relative">
                    <FloatingLabelInput
                      {...field}
                      label="Username"
                      id="user_name"
                      className="dark:text-white dark:border-gray-600"
                    />
                  </div>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="PASSWORD"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <FormControl className="w-full">
                  <div className="relative">
                    <FloatingLabelInput
                      {...field}
                      label="Password"
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="dark:text-white dark:border-gray-600 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="ROLE"
          render={({ field }) => (
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <FormControl>
                  <div className="relative">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="md:w-[349px] w-[360px]">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                        <SelectItem value="CONFIGURATOR">CONFIGURATOR</SelectItem>
                        <SelectItem value="MONITOR">MONITOR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
              </div>
              <FormMessage />
            </div>
          )}
        />

      <div className="flex justify-end">  
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
      </form>
    </Form>
    </ResponsiveModalContent>
    </ResponsiveModal>
  );
  return renderForm();
}

export default CreateUsersModal;