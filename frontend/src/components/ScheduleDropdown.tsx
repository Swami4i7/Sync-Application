// src/components/ScheduleDropdown.tsx
"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Schedule {
  schedule_id: number;
  schedule_name: string;
}

interface ScheduleDropdownProps {
  scheduleNames: Schedule[];
  selectedSchedule: string;
  onChange: (value: string) => void;
}

const ScheduleDropdown = ({
  scheduleNames,
  selectedSchedule,
  onChange,
}: ScheduleDropdownProps) => {
  return (
    <Select onValueChange={onChange} value={selectedSchedule}>
      <SelectTrigger className="w-60 dark:text-white">
        <SelectValue placeholder="Select Schedule" />
      </SelectTrigger>
      <SelectContent>
        {scheduleNames.length > 0 ? (
          scheduleNames.map((schedule) => (
            <SelectItem
              key={schedule.schedule_id}
              value={schedule.schedule_id.toString()}
            >
              {schedule.schedule_name}
            </SelectItem>
          ))
        ) : (
          <div className="p-2 text-gray-500 text-sm">No Schedules available</div>
        )}
      </SelectContent>
    </Select>
  );
};

export default ScheduleDropdown;

 