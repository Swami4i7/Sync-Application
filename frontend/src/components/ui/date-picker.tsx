"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  selected: Date | undefined; // Make selected prop accept Date | undefined
  onDateChange: (date: string) => void; // Callback to send the selected date in the desired format
}

export function DatePicker({ selected, onDateChange }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(selected);

  // Function to format the date in "12-MAR-2020" format
  const handleDateChange = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setDate(selectedDate);
    const formattedDate = format(selectedDate, "dd-MMM-yyyy").toUpperCase();
    onDateChange(formattedDate); // Send formatted date to the parent component (form)
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date} // Use undefined if no date is selected
          onSelect={handleDateChange} // Ensure that `onSelect` gets a Date
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
