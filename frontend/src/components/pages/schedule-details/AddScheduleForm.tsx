"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { processError } from "@/lib/utils";
import { startTransition } from "react";
import { createScheduleDetails } from "@/app/actions/schedule-details/scheduleDetails";
import { FloatingLabelInput } from "@/components/ui/floating-label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";


const addScheduleFormSchema = z.object({
  schedule_name: z.string().min(1, "Schedule name is required"),
  bi_report_path: z.string(),
  db_table_name: z.string(),
  package_to_run_after_process: z.null(),
  frequency_min: z.number(),
  bi_report_name: z.string(),
  db_column_names: z.string(),
  operation: z.enum(["INSERT", "MERGE"]),
  status: z.string().default("N"),
  reset_data: z.string().default("N"),
  run_package_at_last_seq: z.string().default("N"),
});

export type AddScheduleFormSchema = z.infer<typeof addScheduleFormSchema>;

// type  AddScheduleFormProps = {
//   // onClose:()=>void;
//   goToNextTab: () => void;
// }

type AddScheduleFormProps = {
  goToNextTab: (data: AddScheduleFormSchema) => void;
  initialData?: AddScheduleFormSchema | null;
};

const AddScheduleForm = ({ goToNextTab, initialData }: AddScheduleFormProps) => {
//   const [, startTransition] = useTransition();


// const AddScheduleForm = ({ goToNextTab}:AddScheduleFormProps) => {
//   const [, startTransition] = useTransition();
  const form = useForm<AddScheduleFormSchema>({
    resolver: zodResolver(addScheduleFormSchema),
    defaultValues: initialData || {
      schedule_name: "",
      bi_report_path: "",
      db_table_name: "", //d
      package_to_run_after_process: null,
      frequency_min: 0, //d
      bi_report_name: "", //d
      db_column_names: "", //d
      operation: "INSERT",
      status: "N", //d
      reset_data: "N", //d
      run_package_at_last_seq: "N", //d
    },
  });

  function onSubmit(formData: AddScheduleFormSchema) {
    console.log("form data: ", formData);
    const formattedData = {
      ...formData,
      package_to_run_after_process: null,
      operation: formData.operation?.toUpperCase() as "INSERT" | "MERGE",
    };
    startTransition(async () => {
      try {
        const response = await createScheduleDetails(formattedData);
        if (response.schedule_id) {
          toast.success("Schedule Created");
          goToNextTab(formattedData);
        }
          else toast.error("Some error occured");
      }
      catch(error){
        processError(error);
      }
    });
  }

  function onError(error: unknown) {
    console.error("form error:", error);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="grid gap-2"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="schedule_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  {...field}
                  value={field.value || ""}
                  id="schedule_name"
                  label="Schedule Name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bi_report_path"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  {...field}
                  id="bi_report_path"
                  label="Report Path"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bi_report_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  {...field}
                  id="bi_report_name"
                  label="Report Name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="db_table_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  {...field}
                  id="db_table_name"
                  label="Table Name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="db_column_names"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  {...field}
                  id="db_column_names"
                  label="Column Name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="package_to_run_after_process"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  {...field}
                  value="null"
                  id="package_to_run_after_process"
                  label="Package to Run After Process"
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="frequency_min"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  {...field}
                  id="frequency_min"
                  label="Frequency Min"
                  type="number"
                  onChange={(e) =>
                    field.onChange(e.target.value ? Number(e.target.value) : "")
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="operation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Operations</SelectLabel>
                      <SelectItem value="INSERT">INSERT</SelectItem>
                      <SelectItem value="MERGE">MERGE</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Toggle Switches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="place-content-stretch md:place-content-start">
                <div className="flex items-center justify-between">
                  <FormLabel className="mr-2">Status</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value === "Y"}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? "Y" : "N")
                      }
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reset_data"
            render={({ field }) => (
              <FormItem className="place-content-stretch md:place-content-start">
                <div className="flex items-center justify-between">
                  <FormLabel className="mr-2">Reset Data</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value === "Y"}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? "Y" : "N")
                      }
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="run_package_at_last_seq"
            render={({ field }) => (
              <FormItem className="">
                <div className="flex items-center justify-between">
                  <FormLabel>Run Package at Last Sequence</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value === "Y"}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? "Y" : "N")
                      }
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          {/* <Button type="submit" disabled={isPending}>
            {isPending ? "Creating...." : "Create"}
          </Button> */}
          {/* <Button type="button" onClick={goToNextTab}>
            Next
          </Button> */}
          <Button
  type="button"
  onClick={form.handleSubmit((formData) => goToNextTab(formData))}>
  Next
</Button>

            </div>
      </form>
    </Form>
  );
};

export default AddScheduleForm;
