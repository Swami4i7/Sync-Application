import { useTransition } from "react";
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
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { encryptBody, processError } from "@/lib/utils";
import { ScheduleList } from "@/types/scheduleDetails";
import { updateScheduleDetails } from "@/app/actions/schedule-details/scheduleDetails";
 
// Define schema using Zod
const editScheduleFormSchema = z.object({
  SCHEDULE_ID: z.number().min(1, "Schedule ID is required"),
  SCHEDULE_NAME: z.string(),
  BI_REPORT_PATH: z.string(),
  DB_TABLE_NAME: z.string(),
  PACKAGE_TO_RUN_AFTER_PROCESS: z.null(),
  FREQUENCY_MIN: z.number(),
  BI_REPORT_NAME: z.string(),
  DB_COLUMN_NAMES: z.string(),
  OPERATION: z.enum(["INSERT", "MERGE"]),
  STATUS: z.enum(["Y", "N"]),
  RESET_DATA: z.enum(["Y", "N"]),
  RUN_PACKAGE_AT_LAST_SEQ: z.enum(["Y", "N"]),
});
 
export type EditScheduleFormSchema = z.infer<typeof editScheduleFormSchema>;
 
// export type editScheduleFormSchema = {
//   schedule_name: string;
//   bi_report_path: string;
//   db_table_name: string;
//   package_to_run_after_process: string;
//   frequency_min: number;
//   bi_report_name: string;
//   db_column_names: string;
//   operation: string;
//   status: string;
//   reset_data: string;
//   run_package_at_last_seq: string;
// };
 
type EditScheduleModalProps = {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  data: ScheduleList;
};
 
const EditScheduleModal = ({
  message,
  isOpen,
  onClose,
  data,
}: EditScheduleModalProps) => {
  const [isPending, startTransition] = useTransition();
 
  const form = useForm<EditScheduleFormSchema>({
    resolver: zodResolver(editScheduleFormSchema),
    defaultValues: {
      ...data,
      // Convert null values to appropriate defaults
      PACKAGE_TO_RUN_AFTER_PROCESS: null,
      OPERATION: data.OPERATION?.toUpperCase() as "INSERT" | "MERGE",
      STATUS: (data.STATUS === "Y" || data.STATUS === "N") ? data.STATUS : "N",
      RESET_DATA: (data.RESET_DATA === "Y" || data.RESET_DATA === "N") ? data.RESET_DATA : "N",
      RUN_PACKAGE_AT_LAST_SEQ: (data.RUN_PACKAGE_AT_LAST_SEQ === "Y" || data.RUN_PACKAGE_AT_LAST_SEQ === "N") ? data.RUN_PACKAGE_AT_LAST_SEQ : "N",
      FREQUENCY_MIN: Number(data.FREQUENCY_MIN) || 1,
    },
  });
 
  function onSubmit(data: EditScheduleFormSchema & { SCHEDULE_ID: number }) {
    console.log("schedule id from data", data.SCHEDULE_ID)
    const schedule_id = data.SCHEDULE_ID ;
    console.log("Schedule ID", schedule_id);
    const formattedFormData = {
      schedule_id: schedule_id,
      schedule_name: data.SCHEDULE_NAME,
      frequency_min: data.FREQUENCY_MIN,
      bi_report_path: data.BI_REPORT_PATH,
      bi_report_name: data.BI_REPORT_NAME,
      status: data.STATUS,
      reset_data: data.RESET_DATA,
      db_table_name: data.DB_TABLE_NAME,
      db_column_names: data.DB_COLUMN_NAMES,
      operation: data.OPERATION,
      package_to_run_after_process: data.PACKAGE_TO_RUN_AFTER_PROCESS,
      run_package_at_last_seq: data.RUN_PACKAGE_AT_LAST_SEQ,
      created_by: "Admin",
      last_updated_by: "Admin",
      last_update_login: new Date().toISOString(),
    };
    console.log("Formatted Form Data", formattedFormData);
    startTransition(async () => {
      try {
        console.log("before calling update", schedule_id);
        const body = JSON.stringify(formattedFormData);
              const { ciphertext, iv } = encryptBody(body);
              const encryptedBody = JSON.stringify({ ciphertext, iv });
        const response = await updateScheduleDetails(
          encryptedBody,
          schedule_id
        );
        
        console.log("after Response ", response);
        console.log("Response schdid", data.SCHEDULE_ID);
        if (data.SCHEDULE_ID) {
          onClose();
          toast.success("Schedule updated successfully");
        } else {
          toast.error("Failed to update schedule");
        }
      } catch (error: unknown) {
        processError(error);
      }
    });
  }
 
  function onError(errors: unknown) {
    console.error("Errors", errors);
  }
  return (
    <ResponsiveModal open={isOpen} onOpenChange={onClose}>
      <ResponsiveModalContent aria-describedby={""}>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>{message}</ResponsiveModalTitle>
        </ResponsiveModalHeader>
 
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="grid gap-2"
            autoComplete="off"
          >
            {/* Schedule Name */}
            <FormField
              control={form.control}
              name="SCHEDULE_NAME"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      {...field}
                      id="schedule_name"
                      label="Schedule Name"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            {/* Report Path */}
            <FormField
              control={form.control}
              name="BI_REPORT_PATH"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      {...field}
                      id="bi_report_path"
                      label="Report Path"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            {/* Report Name */}
            <FormField
              control={form.control}
              name="BI_REPORT_NAME"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      {...field}
                      id="bi_report_name"
                      label="Report Name"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            {/* Table Name */}
            <FormField
              control={form.control}
              name="DB_TABLE_NAME"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      {...field}
                      id="db_table_name"
                      label="Table Name"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            {/* Column Names */}
            <FormField
              control={form.control}
              name="DB_COLUMN_NAMES"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      {...field}
                      id="db_column_names"
                      label="Column Names"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            {/* Package to Run After Process */}
            <FormField
              control={form.control}
              name="PACKAGE_TO_RUN_AFTER_PROCESS"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      {...field}
                      id="package_to_run_after_process"
                      label="Package to Run After Process"
                      value= "null" // Ensure empty string instead of null
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            {/* Frequency Min */}
            <FormField
              control={form.control}
              name="FREQUENCY_MIN"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      {...field}
                      id="frequency_min"
                      label="Frequency Min"
                      type="number"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            {/* Operation Select */}
            <FormField
              control={form.control}
              name="OPERATION"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Operation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Operations</SelectLabel>
                          {/* Match enum cases */}
                          <SelectItem value="INSERT">Insert</SelectItem>
                          <SelectItem value="MERGE">Merge</SelectItem>
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
                name="STATUS"
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
                          // Handle potential null values
                          defaultChecked={field.value === "Y"}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
 
              <FormField
                control={form.control}
                name="RESET_DATA"
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
                          // Handle potential null values
                          defaultChecked={field.value === "Y"}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
 
              <FormField
                control={form.control}
                name="RUN_PACKAGE_AT_LAST_SEQ"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Run Package at Last Sequence</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value === "Y"}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? "Y" : "N")
                          }
                          // Handle potential null values
                          defaultChecked={field.value === "Y"}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>
 
            {/* Submit Button */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating" : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};
 
export default EditScheduleModal;
 
