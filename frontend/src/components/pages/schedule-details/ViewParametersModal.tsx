"use client";

import { useEffect, useTransition, useRef, useCallback } from "react"; // Added useRef, useCallback
import {
  getParameters,
  saveParameters,
} from "@/app/actions/schedule-details/parameters";
import {
  ResponsiveModal,
  ResponsiveModalTitle,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalDescription,
} from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, FieldArrayWithId } from "react-hook-form"; // Added FieldArrayWithId
import { FloatingLabelInput } from "@/components/ui/floating-label";
import clsx from "clsx";
import { isEqual, omit } from "lodash";
import { toast } from "sonner";
import { encryptBody, processError } from "@/lib/utils";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Checkbox } from "@/components/ui/checkbox";

// Define the shape of Parameter more explicitly for form state
type ParameterFormData = {
  PARAM_ID?: number;
  SCHEDULE_ID: number;
  PARAM_NAME: string;
  PARAM_VALUE: string;
  SEQUENCE_NO: number; // Ensure SEQUENCE_NO is handled
  NEXT_SCHEDULE_TIME?: Date | null;
  isNew?: boolean; // Flag for newly added parameters
};

// Define the type fetched from the API
type ApiParameter = {
  PARAM_ID: number;
  SCHEDULE_ID: number;
  PARAM_NAME: string;
  PARAM_VALUE: string;
  SEQUENCE_NO: number;
  NEXT_SCHEDULE_TIME?: string | Date | null; // API might return string date
};

// Extend ParameterFormData for useFieldArray which adds an `id`
type ParameterField = FieldArrayWithId<
  z.infer<typeof formSchema>,
  "parameters",
  "id"
> &
  ParameterFormData;

const parameterSchema = z.object({
  PARAM_ID: z.number().optional(),
  SCHEDULE_ID: z.number(),
  PARAM_NAME: z.string().min(1, "Name required"),
  PARAM_VALUE: z.string().min(1, "Value required"),
  SEQUENCE_NO: z.number().min(1, "Sequence number required"), // Added validation
  NEXT_SCHEDULE_TIME: z.date().optional().nullable(),
  isNew: z.boolean().optional(), // Include isNew in schema if managed by form
});

const formSchema = z.object({
  parameters: z.array(parameterSchema),
});

type ViewParameterModalProps = {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  id: number; // SCHEDULE_ID
};

const ViewParametersModal = ({
  message,
  isOpen,
  onClose,
  id,
}: ViewParameterModalProps) => {
  const [isPending, startTransition] = useTransition();
  // Store the initial state loaded from API to compare for modifications
  const initialParamsRef = useRef<ParameterFormData[]>([]);
  // Store IDs of existing parameters that have been marked for deletion
  const deletedIdsRef = useRef<number[]>([]);
  // Store previous values for the 'Incremental' checkbox logic
  const previousValuesRef = useRef<Record<string, string>>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { parameters: [] },
    // RHF v7+ mode: 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all' = 'onSubmit'
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors, isDirty }, // use formState.errors, isDirty
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "parameters",
  });

  // Load data when the modal opens or the schedule ID changes
  useEffect(() => {
    if (isOpen && id) {
      const loadData = async () => {
        try {
          const response = await getParameters(id);
          if (response?.success && response?.data) {
            const formattedData = response.data.map(
              (p: ApiParameter): ParameterFormData => ({
                ...p,
                NEXT_SCHEDULE_TIME: p.NEXT_SCHEDULE_TIME
                  ? new Date(p.NEXT_SCHEDULE_TIME)
                  : null,
                isNew: false, // Mark fetched parameters as not new
              })
            );
            initialParamsRef.current = JSON.parse(
              JSON.stringify(formattedData)
            ); // Deep copy for comparison
            reset({ parameters: formattedData });
            deletedIdsRef.current = []; // Reset deleted IDs on load
            previousValuesRef.current = {}; // Reset previous values
          } else {
            // Handle case where data fetch fails or returns no data
            initialParamsRef.current = [];
            reset({ parameters: [] });
            deletedIdsRef.current = [];
            previousValuesRef.current = {};
            if (!response?.success) {
              toast.error(response?.message || "Failed to load parameters.");
            }
          }
        } catch (error) {
          processError(error);
          initialParamsRef.current = [];
          reset({ parameters: [] }); // Reset form on error
          deletedIdsRef.current = [];
          previousValuesRef.current = {};
        }
      };
      loadData();
    } else {
      // Clear state if modal is closed or id is missing
      reset({ parameters: [] });
      initialParamsRef.current = [];
      deletedIdsRef.current = [];
      previousValuesRef.current = {};
    }
  }, [isOpen, id, reset]); // Dependencies for effect

  // Function to add a new parameter row
  const addParameter = useCallback(() => {
    append({
      SCHEDULE_ID: id,
      PARAM_NAME: "",
      PARAM_VALUE: "",
      // Calculate next sequence number based on current fields length
      SEQUENCE_NO:
        fields.length > 0
          ? Math.max(...fields.map((f) => f.SEQUENCE_NO), 0) + 1
          : 1,
      NEXT_SCHEDULE_TIME: null,
      isNew: true, // Mark as new
    });
  }, [append, id, fields]); // Dependencies for useCallback

  // Function to remove a parameter row
  const removeParameter = useCallback(
    (index: number) => {
      if (window.confirm("Are you sure you want to delete this parameter?")) {
        const paramToRemove = fields[index] as ParameterField; // Type assertion

        // If the parameter is not new (i.e., it existed initially) and has an ID,
        // add its ID to the list of IDs to be deleted on the backend.
        if (!paramToRemove.isNew && paramToRemove.PARAM_ID != null) {
          // Check for null/undefined
          deletedIdsRef.current = [
            ...deletedIdsRef.current,
            paramToRemove.PARAM_ID,
          ];
        }

        // Clean up the previous value if it was stored for this parameter
        const fieldId = paramToRemove.id; // Use the unique id from useFieldArray
        if (previousValuesRef.current[fieldId]) {
          // const { [fieldId]: _, ...rest } = previousValuesRef.current; // Remove entry
          const { [fieldId]: unused, ...rest } = previousValuesRef.current; // eslint-disable-line @typescript-eslint/no-unused-vars
          previousValuesRef.current = rest;
          previousValuesRef.current = rest;
        }

        // Remove the field from the form array
        remove(index);
      }
    },
    [fields, remove]
  ); // Dependencies for useCallback

  // Function to check if a parameter has been modified compared to its initial state
  const isModified = useCallback(
    (index: number): boolean => {
      const currentParam = getValues(
        `parameters.${index}`
      ) as ParameterFormData; // Get current form value
      // If it's marked as new, it's not technically 'modified' from an initial state
      if (currentParam.isNew || !currentParam.PARAM_ID) {
        return false;
      }
      const originalParam = initialParamsRef.current.find(
        (p) => p.PARAM_ID === currentParam.PARAM_ID
      );
      // If no original parameter found (shouldn't happen for non-new items), consider it not modified
      if (!originalParam) return false;

      // Compare relevant fields, omitting the 'isNew' flag which is for UI/logic state
      // Use lodash.isEqual for deep comparison, especially for dates
      const relevantCurrent = omit(currentParam, ["isNew"]);
      const relevantOriginal = omit(originalParam, ["isNew"]);

      // Handle Date comparison carefully as direct object comparison might fail
      const currentNextTime =
        relevantCurrent.NEXT_SCHEDULE_TIME instanceof Date
          ? relevantCurrent.NEXT_SCHEDULE_TIME.toISOString()
          : relevantCurrent.NEXT_SCHEDULE_TIME;
      const originalNextTime =
        relevantOriginal.NEXT_SCHEDULE_TIME instanceof Date
          ? relevantOriginal.NEXT_SCHEDULE_TIME.toISOString()
          : relevantOriginal.NEXT_SCHEDULE_TIME;

      return !isEqual(
        { ...relevantCurrent, NEXT_SCHEDULE_TIME: currentNextTime },
        { ...relevantOriginal, NEXT_SCHEDULE_TIME: originalNextTime }
      );
    },
    [getValues]
  ); // Dependency on getValues

  // Handle form submission
  const onSubmit = (formData: z.infer<typeof formSchema>) => {

    const parameters = formData.parameters;

    const payload = {
      create: parameters
        .filter((p) => p.isNew) // Filter for newly added parameters
        .map((p) => ({
          schedule_id: p.SCHEDULE_ID,
          param_name: p.PARAM_NAME,
          param_value: p.PARAM_VALUE,
          sequence_no: p.SEQUENCE_NO,
          next_schedule_time:
            p.NEXT_SCHEDULE_TIME instanceof Date
              ? p.NEXT_SCHEDULE_TIME.toISOString()
              : new Date(), // Ensure ISO string or null
          created_by: "Admin", // Consider making dynamic
          last_updated_by: "Admin", // Consider making dynamic
        })),
      update: parameters
        .filter((p, index) => !p.isNew && isModified(index)) // Filter for existing parameters that are modified
        .map((p) => ({
          param_id: p.PARAM_ID, // Should exist for non-new
          schedule_id: p.SCHEDULE_ID,
          param_name: p.PARAM_NAME,
          param_value: p.PARAM_VALUE,
          sequence_no: p.SEQUENCE_NO,
          next_schedule_time:
            p.NEXT_SCHEDULE_TIME instanceof Date
              ? p.NEXT_SCHEDULE_TIME.toISOString()
              : new Date(), // Ensure ISO string or null
          // created_by is typically not updated, only last_updated_by
          last_updated_by: "Admin", // Consider making dynamic
        })),
      delete: deletedIdsRef.current, // Use the stored IDs for deletion
    };

    console.log("Final Payload:", JSON.stringify(payload, null, 2)); // Log the payload being sent

    // Prevent submission if nothing changed
    if (
      payload.create.length === 0 &&
      payload.update.length === 0 &&
      payload.delete.length === 0
    ) {
      toast.info("No changes detected.");
      return; // Exit if no changes
    }

    startTransition(async () => {
      try {
        const body = JSON.stringify(payload);
        const { ciphertext, iv } = encryptBody(body);
        const encryptedBody = JSON.stringify({ ciphertext, iv });
        console.log("Encrypted Payload:", encryptedBody); // Log the encrypted payload
        await saveParameters(encryptedBody);
        toast.success("User Created Successfully");
        onClose(); 
            
           } catch (error) {
             const errorMessage = processError(error);
             toast.error(errorMessage || "An error occurred");
           }
    });
  };

  // Handle checkbox change for 'Incremental'
  const handleIncrementalChange = (
    index: number,
    checked: boolean | "indeterminate"
  ) => {
    const currentParamField = fields[index] as ParameterField; // Use the field from useFieldArray
    const fieldId = currentParamField.id; // Use the stable ID from useFieldArray

    if (checked === true) {
      // Store the current value before overwriting
      const currentValue = getValues(`parameters.${index}.PARAM_VALUE`);
      previousValuesRef.current = {
        ...previousValuesRef.current,
        [fieldId]: currentValue,
      };

      // Set value to 'FETCH_TIME' and disable input
      setValue(`parameters.${index}.PARAM_VALUE`, "FETCH_TIME", {
        shouldDirty: true,
      });
      // Set schedule time, default to now if null/undefined
      const currentNextScheduleTime = getValues(
        `parameters.${index}.NEXT_SCHEDULE_TIME`
      );
      setValue(
        `parameters.${index}.NEXT_SCHEDULE_TIME`,
        currentNextScheduleTime instanceof Date
          ? currentNextScheduleTime
          : new Date(),
        { shouldDirty: true }
      );
    } else {
      // Restore the previous value (or empty string if none)
      const previousValue = previousValuesRef.current[fieldId] || "";
      setValue(`parameters.${index}.PARAM_VALUE`, previousValue, {
        shouldDirty: true,
      });
      // Clear schedule time
      setValue(`parameters.${index}.NEXT_SCHEDULE_TIME`, null, {
        shouldDirty: true,
      });

      // Clean up the stored previous value
      //const { [fieldId]: unused, ...rest } = previousValuesRef.current; // eslint-disable-line no-unused-vars
      const { [fieldId]: unused, ...rest } = previousValuesRef.current; // eslint-disable-line @typescript-eslint/no-unused-vars

      previousValuesRef.current = rest;
    }
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={onClose}>
      <ResponsiveModalContent className="max-h-[80vh] overflow-y-auto">
        {" "}
        {/* Added overflow */}
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>{message}</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Manage parameters for the schedule. Add, edit, or remove as needed.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <Form {...form}>
          {/* Use a unique key for the form if reset needs to fully remount */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 px-1 py-2"
          >
            {fields.length > 0 ? (
              <Accordion type="multiple" className="w-full">
                {" "}
                {/* Changed to type="multiple" */}
                {fields.map((field, index) => {
                  // Watch specific fields for dynamic UI updates
                  const watchParamValue = watch(
                    `parameters.${index}.PARAM_VALUE`
                  );
                  const watchParamName = watch(
                    `parameters.${index}.PARAM_NAME`
                  );
                  const isFetchTime = watchParamValue === "FETCH_TIME";
                  const currentField = field as ParameterField; // Type assertion
                  const isItemModified = isModified(index);
                  const hasError = !!errors.parameters?.[index];

                  return (
                    <AccordionItem
                      key={currentField.id}
                      value={currentField.id}
                      className="border rounded-md mb-2"
                    >
                      <AccordionTrigger
                        className={clsx(
                          "px-3 py-2 flex justify-between items-center hover:no-underline",
                          // Apply border based on state, error takes precedence
                          {
                            "border-l-4 border-red-500": hasError,
                            "border-l-4 border-orange-500":
                              !hasError && isItemModified,
                            "border-l-4 border-green-500":
                              !hasError &&
                              !isItemModified &&
                              currentField.isNew,
                            "border-l-4 border-transparent":
                              !hasError &&
                              !isItemModified &&
                              !currentField.isNew,
                          }
                        )}
                      >
                        <span className="truncate mr-2">
                          {" "}
                          {/* Added truncate */}
                          {currentField.isNew
                            ? `New Parameter ${index + 1}`
                            : watchParamName || `Parameter ${index + 1}`}
                        </span>
                        {/* Maybe add icon indicator for state here */}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 p-4 border-t">
                        {/* PARAM_NAME */}
                        <FormField
                          control={control}
                          name={`parameters.${index}.PARAM_NAME`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <FloatingLabelInput
                                  {...field}
                                  label="Parameter Name"
                                  id={`param-name-${currentField.id}`}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Incremental Checkbox */}
                        <div className="flex items-center gap-2 pt-2">
                          <Checkbox
                            id={`incremental-check-${currentField.id}`}
                            checked={isFetchTime}
                            onCheckedChange={(checked) =>
                              handleIncrementalChange(index, checked)
                            }
                          />
                          <label
                            htmlFor={`incremental-check-${currentField.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            Incremental (Use Fetch Time)
                          </label>
                        </div>

                        {/* PARAM_VALUE */}
                        <FormField
                          control={control}
                          name={`parameters.${index}.PARAM_VALUE`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <FloatingLabelInput
                                  {...field}
                                  label="Parameter Value"
                                  id={`param-value-${currentField.id}`}
                                  disabled={isFetchTime} // Disable if incremental is checked
                                  aria-disabled={isFetchTime}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* SEQUENCE_NO (Hidden or visible input) */}
                        <FormField
                          control={control}
                          name={`parameters.${index}.SEQUENCE_NO`}
                          render={({ field }) => (
                            <FormItem className="hidden">
                              {" "}
                              {/* Keep hidden or make visible if needed */}
                              <FormControl>
                                <input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* NEXT_SCHEDULE_TIME (DateTime Picker) */}
                        {isFetchTime && (
                          <FormField
                            control={control}
                            name={`parameters.${index}.NEXT_SCHEDULE_TIME`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col space-y-2">
                                <FormLabel className="text-sm font-medium">
                                  Next Schedule Time
                                </FormLabel>
                                <FormControl>
                                  <DateTimePicker
                                    selected={
                                      field.value instanceof Date
                                        ? field.value
                                        : null
                                    } // Ensure it's a Date or null
                                    onChange={field.onChange} // RHF handles the value conversion
                                    // showTimeSelect // Ensure time selection is enabled
                                    // dateFormat="MMMM d, yyyy h:mm aa" // Example format
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {/* Remove Button */}
                        <div className="flex justify-end pt-2">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm" // Smaller button
                            onClick={() => removeParameter(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No parameters added yet.
              </p> // Placeholder when no fields
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <Button
                type="button"
                onClick={addParameter}
                variant="outline"
                disabled={isPending}
              >
                Add Parameter
              </Button>
              <Button
                type="submit"
                disabled={isPending || !isDirty} // Disable if pending or form hasn't changed
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export default ViewParametersModal;
