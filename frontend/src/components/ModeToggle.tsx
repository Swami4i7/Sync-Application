// src/components/mode-toggle.tsx

"use client";

import * as React from "react";

interface ModeToggleProps {
  checked: boolean;
  onChange: () => void; // Add an onChange handler to toggle the theme
}

export function ModeToggle({ checked, onChange }: ModeToggleProps) {
  return (
    <div
      className={`relative inline-block w-10 h-6 transition-colors duration-200 ease-in rounded-full ${
        checked ? "bg-gray-700" : "bg-gray-300"
      }`}
      onClick={onChange} // Trigger the onChange handler when clicked
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange();
        }
      }}
    >
      <span
        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in ${
          checked ? "transform translate-x-4" : ""
        }`}
      ></span>
    </div>
  );
}
