"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floating-label";
import { useTransition, useRef } from "react";
import { encryptBody, processError } from "@/lib/utils";
import { toast } from "sonner";
import { AddScheduleFormSchema } from "./AddScheduleForm";
import { createScheduleParameter } from "@/app/actions/schedule-details/scheduleDetails";
import { Checkbox } from "@/components/ui/checkbox";
import { DateTimePicker } from "@/components/ui/date-time-picker";


const addParameterFormSchema = z.object({
  param_id: z.number().optional(),
  schedule_id: z.number().optional(),
  param_name: z.string().min(1, "Parameter name is required"),
  param_value: z.string().min(1, "Parameter value is required"),
  sequence_no: z.number().min(1, "Sequence number is required"),
  NEXT_SCHEDULE_TIME: z.date().optional().nullable(),
  created_by: z.string(),
  last_updated_by: z.string(),
});

export type AddParameterFormSchema = z.infer<typeof addParameterFormSchema>;

type AddParameterFormProps = {
  onClose: () => void;
  scheduleFormData: AddScheduleFormSchema;
};

const AddParameterForm = ({ onClose, scheduleFormData }: AddParameterFormProps) => {
  const [isPending, startTransition] = useTransition();
  const previousValueRef = useRef<string>("");

  const form = useForm<AddParameterFormSchema>({
    resolver: zodResolver(addParameterFormSchema),
    defaultValues: {
      param_name: "",
      param_value: "",
      sequence_no: 1,
      NEXT_SCHEDULE_TIME: null,
      created_by: "Admin",
      last_updated_by: "Admin",
    },
  });

  const { watch, setValue, getValues } = form;

  const paramValue = watch("param_value");
  const isFetchTime = paramValue === "FETCH_TIME";

  const handleIncrementalChange = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      const currentValue = getValues("param_value");
      previousValueRef.current = currentValue;

      setValue("param_value", "FETCH_TIME", { shouldDirty: true });

      const currentTime = getValues("NEXT_SCHEDULE_TIME");
      setValue(
        "NEXT_SCHEDULE_TIME",
        currentTime instanceof Date ? currentTime : new Date(),
        { shouldDirty: true }
      );
      //console.log("Current Time:", currentTime);
    } else {
      setValue("param_value", previousValueRef.current || "", {
        shouldDirty: true,
      });
      setValue("NEXT_SCHEDULE_TIME", null, { shouldDirty: true });
    }
  };

  // function formatToOracleDate(input: Date | null | undefined) {
  //   if (!input) return "";
  //   const date = new Date(input);
  //   const day = date.getDate().toString().padStart(2, "0");
  //   const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  //   const year = date.getFullYear();
  //   const hours = date.getHours().toString().padStart(2, "0");
  //   const minutes = date.getMinutes().toString().padStart(2, "0");
  //   const seconds = date.getSeconds().toString().padStart(2, "0");
  //   return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  // }

  function formatToOracleDate(input: Date | null | undefined) {
    if (!input) return "";
    const date = new Date(input);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const year = date.getFullYear();
  
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12; // 12 AM or 12 PM
    const hourStr = hours.toString().padStart(2, "0");
  
    return `${day}-${month}-${year} ${hourStr}:${minutes}:${seconds} ${ampm}`;
  }
  

  function onSubmit(formData: AddParameterFormSchema) {
    console.log("Form Data addparameter:", formData);
    const finalPayload = {
      ...scheduleFormData,
      param_name: formData.param_name,
      param_value: formData.param_value,
      sequence_no: formData.sequence_no,
      next_schedule_time: formatToOracleDate(formData.NEXT_SCHEDULE_TIME),
      next_schedule_time_temp: formatToOracleDate(formData.NEXT_SCHEDULE_TIME),
    };

    startTransition(async () => {
      try {
        console.log("Final Payload frontend add parameter:", finalPayload);
        const body = JSON.stringify(finalPayload);
              const { ciphertext, iv } = encryptBody(body);
              const encryptedBody = JSON.stringify({ ciphertext, iv });
              console.log("encryptedBody", encryptedBody);
        const response = await createScheduleParameter(encryptedBody);
        console.log("Create Parameter Response frontend:", response);
        // if(response.success) {
        
        toast.success("Schedule and Parameter Created Successfully!");
        onClose();
        // }
        // else {
        //   toast.error("Failed to create schedule and parameter.");
        // }
      } catch (error) {
        processError(error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="param_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput {...field} label="Parameter Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Incremental Checkbox */}
        <div className="flex items-center gap-2 pt-2">
          <Checkbox
            id="incremental-check"
            checked={isFetchTime}
            onCheckedChange={handleIncrementalChange}
          />
          <label
            htmlFor="incremental-check"
            className="text-sm font-medium cursor-pointer"
          >
            Incremental (Use Fetch Time)
          </label>
        </div>

        <FormField
          control={form.control}
          name="param_value"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  {...field}
                  label="Parameter Value"
                  disabled={isFetchTime}
                  aria-disabled={isFetchTime}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sequence_no"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  {...field}
                  type="number"
                  label="Sequence No"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isFetchTime && (
          <FormField
            control={form.control}
            name="NEXT_SCHEDULE_TIME"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2">
                <FormLabel className="text-sm font-medium">Next Schedule Time</FormLabel>
                <FormControl>
                  <DateTimePicker
                    selected={field.value instanceof Date ? field.value : null}
                    onChange={field.onChange}
                    // showTimeSelect
                    // dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddParameterForm;
