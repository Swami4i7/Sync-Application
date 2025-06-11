// src/components/NumberDropdown.tsx
"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface NumberDropdownProps {
  selectedDays: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const NumberDropdown = ({ selectedDays, onChange, disabled }: NumberDropdownProps) => {
  return (
    <Select onValueChange={onChange} value={selectedDays}>
      <SelectTrigger className="w-40 dark:text-white" disabled={disabled}>
        <SelectValue placeholder="Select Days" />
      </SelectTrigger>
      <SelectContent>
        {[1, 2, 3, 4, 5, 6, 7].map((days) => (
          <SelectItem key={days} value={days.toString()}>
            {days} days
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default NumberDropdown;
 