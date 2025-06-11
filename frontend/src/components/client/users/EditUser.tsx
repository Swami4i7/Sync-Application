"use client";
import React, { useEffect, useState } from "react"; 
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Users } from "@/types/users";
import { UsersUpdate, UsersUpdateSchema } from "@/schema/users";
import { updateUser } from "@/app/actions/user/users";
import { encryptBody, processError } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { FloatingLabelInput } from "@/components/ui/floating-label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalHeader, ResponsiveModalTitle } from "@/components/ui/responsive-modal";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: Users;
  onEdit: (updatedUser: Users) => void;
  message: string;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  userData,
  onEdit,
  message
}) => {

  const form = useForm<UsersUpdate>({
    resolver: zodResolver(UsersUpdateSchema),
    defaultValues: {
      USER_NAME: userData.USER_NAME ?? "",
      ROLE: userData.ROLE ?? "",
      PASSWORD: "", 
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  useEffect(() => {
    if (isOpen) {
      reset({
        USER_NAME: userData.USER_NAME ?? "",
        ROLE: userData.ROLE ?? "",
        PASSWORD: userData.PASSWORD ?? "",
      });
    }
  }, [isOpen, userData, reset]);

  const { data: sessionData } = useSession();
  const updated_by = sessionData?.user?.username;

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: UsersUpdate & { USER_ID: number }) => {
    try {
      if (!updated_by) {
        toast.error("User session not found.");
        return;
      }
      data.LAST_UPDATED_BY = updated_by;
      data.USER_ID= userData.USER_ID;
      const formattedData = {
        user_id: data.USER_ID,
        user_name: data.USER_NAME,
        password: data.PASSWORD,
        role: data.ROLE,
        created_by: data.CREATED_BY,
        last_updated_by: data.USER_NAME,
      };
      const body = JSON.stringify(formattedData);
      const { ciphertext, iv } = encryptBody(body);
      const encryptedBody = JSON.stringify({ ciphertext, iv });
      const response = await updateUser(encryptedBody, userData.USER_ID);
      const updatedUser: Users = response;
      toast.success("User Updated Successfully");
      onEdit(updatedUser);
      reset();
      onClose();
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
      <form onSubmit={handleSubmit((data) => onSubmit({ ...data, USER_ID: userData.USER_ID }))} className="grid gap-6 p-4" autoComplete="off">
        <FormField
          control={form.control}
          name="USER_NAME"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <FormControl className="w-full">
                  <div className="relative">
                    <FloatingLabelInput
                      {...field}
                      label="Enter Username"
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
          control={form.control}
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
          control={form.control}
          name="ROLE"
          render={({ field }) => (
            <FormItem>
              <div className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <div className="relative">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="md:w-[349px] w-[360px]">
                          <SelectValue placeholder="Select a ROLE" />
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
            </FormItem>
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
};

export default EditUserModal;