"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
}

export function DateTimePicker({ selected, onChange }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | null>(selected);
  const [time, setTime] = React.useState<string>(
    selected ? format(selected, "HH:mm") : "00:00"
  );

  // Sync internal state with external selected prop changes
  React.useEffect(() => {
    if (selected) {
      setDate(selected);
      setTime(format(selected, "HH:mm"));
    }
  }, [selected]);

  const updateDateTime = (newDate: Date | null, newTime: string) => {
    if (!newDate) {
      onChange(null);
      return;
    }

    const [hours, minutes] = newTime.split(":").map(Number);
    const updatedDate = new Date(newDate);
    updatedDate.setHours(hours);
    updatedDate.setMinutes(minutes);

    onChange(updatedDate);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) return;

    setDate(newDate);
    updateDateTime(newDate, time);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;

    // Ensure the time is in the correct format (HH:mm)
    const validTime = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/.test(newTime);
    if (validTime) {
      setTime(newTime);
      if (date) {
        updateDateTime(date, newTime);
      }
    } else {
      // Invalid time format, don't update
      console.error("Invalid time format");
    }
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
          {date ? format(date, "PPP HH:mm") : <span>Pick date & time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 space-y-4" align="start">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={handleDateChange}
          initialFocus
        />
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <Input
            type="time"
            value={time}
            onChange={handleTimeChange}
            className="w-full"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
