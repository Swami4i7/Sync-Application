"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SetupDetailsType } from "@/types/setupDetails";
import { createSetupDetails, getSetupDetails, updateSetupDetails } from "@/app/actions/setupDetails";
import { FloatingLabelInput } from "@/components/ui/floating-label";
import { encryptBody, processError } from "@/lib/utils";
import { toast } from "sonner";


const formSchema = z.object({
  setup_id: z.number().min(1, "Setup ID is required"),
  fusion_username: z.string().min(1, "Fusion username is required"),
  fusion_domain: z.string().min(5, "Invalid domain"),
  fusion_password: z.string().min(6, "Password must be at least 6 characters"),
  mail_notification: z.string(),
});

const SetupDetails = () => {
  const [initialSetupData, setInitialSetupData] = useState<SetupDetailsType>({
    setup_id: 1,
    fusion_username: "",
    fusion_domain: "",
    fusion_password: "",
    mail_notification: "",
  });
  const [isPending, startTransition] = useTransition();


  const form = useForm<SetupDetailsType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      setup_id: 1,
      fusion_username: "",
      fusion_domain: "",
      fusion_password: "",
      mail_notification: "",
    },
  });

  const fetchSetupDetails = async () => {
    const data = await getSetupDetails(1);
    //console.log("fetch setup details: ", data);
    if (data && Array.isArray(data) && data.length > 0) {
      const formattedData = {
        setup_id: data[0].SETUP_ID,
        fusion_username: data[0].FUSION_USERNAME,
        fusion_domain: data[0].FUSION_DOMAIN,
        fusion_password: data[0].FUSION_PASSWORD,
        mail_notification: data[0].MAIL_NOTIFICATION,
      };
      form.reset(formattedData);
      setInitialSetupData(formattedData);
    }
  };

  useEffect(() => {
    fetchSetupDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleSubmit = async (formData: SetupDetailsType) => {
  //   console.log("form data: ", formData);
  //   startTransition(async()=>{
  //     try{
  //       if (initialSetupData.fusion_username){
  //         console.log("updateSetupDetails",formData.setup_id)
  //         const response = await updateSetupDetails(formData);
  //         console.log("updateSetupDetails",response)
  //         if (response) {
  //           toast.success("Setup details updated successfully!");
  //         } else {
  //           toast.error("Failed to update setup details.");
  //         }
  //         console.log("updatedetails",response)
  //       } else {
  //         const response = await createSetupDetails(formData);
  //         console.log("createdetails",response)
  //       }
  //     }catch(error){
  //       processError(error);
  //       console.error(error);
  //     }finally{
  //       fetchSetupDetails(); // Refetch data after submission
  //     }
  //   }) 
  // };
  const handleSubmit = async (data: SetupDetailsType & {setup_id: number}) => {
   // console.log("form data: ", data);
    const setup_id = data.setup_id;
    //console.log("setup_id: ", setup_id);
    startTransition(async () => {
      try {
        if (initialSetupData.fusion_username) {
          const body = JSON.stringify(data);
          // console.log("onsubmit updatebody", body);
          const { ciphertext, iv } = encryptBody(body);
          const encryptedBody = JSON.stringify({ ciphertext, iv });
          const response = await updateSetupDetails(encryptedBody, setup_id);
          //console.log("updateSetupDetails after update", response.data);
          //console.log("updateSetupDetails suuuuuuuuuuuuuccccsessu", response.success);
          if (response?.success === true) {
            toast.success("Setup details updated successfully!");
          } else {
            toast.error("Failed to update setup details.");
          }
        } else {
          const body = JSON.stringify(data);
          console.log("onsubmit createbody", body);
          const { ciphertext, iv } = encryptBody(body);
          const encryptedBody = JSON.stringify({ ciphertext, iv });
          console.log("encryptedBody", encryptedBody);
          const response = await createSetupDetails(encryptedBody);
          console.log("createdetails", response);
          toast.success("Setup details created successfully!");
        }
      } catch (error) {
        const errorMessage = processError(error);
        console.error("handleSubmit error:", error);
        toast.error(errorMessage || "An error occurred");
      } finally {
        fetchSetupDetails(); // Refetch data after submission
      }
    });
  };
  return (
    <div className="bg-white dark:bg-transparent dark:text-white p-4 rounded-lg shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2" autoComplete="off">
          <FormField
            control={form.control}
            name="setup_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                      {...field}
                      id="setup_id"
                      label="Setup ID"
                      disabled
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fusion_username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                      {...field}
                      id="fusion_username"
                      label="Fusion Username"
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fusion_domain"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                      {...field}
                      id="fusion_domain"
                      label="Fusion Domain"
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fusion_password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                      {...field}
                      id="fusion_password"
                      label="Fusion Password"
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

            <FormField
              control={form.control}
              name="mail_notification"
              render={({ field }) => (
                <FormItem className="flex ">
                  <FormLabel className="mr-1 dark:text-white">Mail notification</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value === "Y"}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? "Y" : "N")
                      }
                      className="place-self-center"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <Button type="submit" className="md:w-1/4 w-full place-self-end" disabled={isPending}>
            {initialSetupData.fusion_username ? "Update" : "Create"}
          </Button>
        </form>
      </Form>

    </div>
  );
};

export default SetupDetails;