// "use client";

// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useQueryState, parseAsString } from "nuqs";
// import { useEffect } from "react";

// type Schedule = {
//   schedule_id: number;
//   schedule_name: string;
// };

// type SyncLogsSelectorProps = {
//   scheduleNames: Schedule[];
// };

// const SyncLogsSelector = ({ scheduleNames }: SyncLogsSelectorProps) => {
//   // Don't set any default values
//   const [selectedSchedule, setSelectedSchedule] = useQueryState(
//     "schedule_id",
//     parseAsString.withDefault("").withOptions({ shallow: false })
//   );

//   const [noOfDays, setNoOfDays] = useQueryState(
//     "no_of_days",
//     parseAsString.withDefault("").withOptions({ shallow: false })
//   );

//     // Clear values on initial page load
//     useEffect(() => {
//         setSelectedSchedule(""); // Reset schedule selection
//         setNoOfDays(""); // Reset days selection
//       }, [setSelectedSchedule, setNoOfDays]); // Runs only on mount

//   return (
//     <div className="flex gap-4">
//       {/* Schedule Selector */}
//       <Select
//         onValueChange={(value) => setSelectedSchedule(value)}
//         value={selectedSchedule || ""}
//       >
//         <SelectTrigger className="w-60 dark:text-white">
//           <SelectValue placeholder="Select Schedule" />
//         </SelectTrigger>
//         <SelectContent>
//           {scheduleNames.length > 0 ? (
//             scheduleNames.map((schedule) => (
//               <SelectItem key={schedule.schedule_id} value={schedule.schedule_id.toString()}>
//                 {schedule.schedule_name}
//               </SelectItem>
//             ))
//           ) : (
//             <div className="p-2 text-gray-500 text-sm">No Schedules available</div>
//           )}
//         </SelectContent>
//       </Select>

//       {/* No of Days Selector */}
//       <Select
//         onValueChange={(value) => setNoOfDays(value)}
//         value={noOfDays || ""}
//       >
//         <SelectTrigger className="w-40 dark:text-white">
//           <SelectValue placeholder="Select Days" />
//         </SelectTrigger>
//         <SelectContent>
//           {[1, 2, 3, 4, 5, 6, 7].map((days) => (
//             <SelectItem key={days} value={days.toString()}>
//               {days} days
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//   );
// };

// export default SyncLogsSelector;

// //src/components/pages/schedule-logs/SyncLogs-Selector.tsx
// "use client";
// import { getScheduleLogsColumns } from "@/app/(protected)/schedule-logs/coulmns";
// import { DataTable } from "@/components/DataTable";
// import SearchBar from "@/components/searchbar";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { ScheduleLogs } from "@/types/scheduleLogs";
// import { useQueryState, parseAsString } from "nuqs";
// import { useEffect, useState } from "react";
// import { FolderUp } from "lucide-react";

// interface Schedule {
//   schedule_id: number;
//   schedule_name: string;
// }

// interface SyncLogsSelectorProps {
//   scheduleNames: Schedule[];
//   data: ScheduleLogs[];
//   totalPages: number;
//   pageCount: number;
// }

// const SyncLogsSelector = ({ scheduleNames, data, totalPages, pageCount }: SyncLogsSelectorProps) => {

//   const handleViewError = (id: number) => {
//     // Handle view error logic here
//     console.log("View Error ID: ", id);
//   };
//   const columns = getScheduleLogsColumns({
//     onView: handleViewError
//   });

//   const [customWhere, setCustomWhere] = useQueryState(
//     "customWhere",
//     parseAsString.withDefault("").withOptions({ shallow: false })
//   );

//   // Local states for selected values
//   const [selectedSchedule, setSelectedSchedule] = useState<string>("");
//   const [selectedDays, setSelectedDays] = useState<string>("");

//   // Handle Schedule Change (only updates local state)
//   const handleScheduleChange = (value: string) => {
//     setSelectedSchedule(value);
//     setSelectedDays(""); // Reset days when schedule changes
//   };

//   // Handle No of Days Change (only updates local state)
//   const handleDaysChange = (value: string) => {
//     setSelectedDays(value);
//   };

//   // Apply filters when the search button is clicked
//   const handleSearch = () => {
//     const newFilters = [
//       selectedSchedule ? `schedule_id=${selectedSchedule}` : "",
//       selectedDays ? `no_of_days=${selectedDays}` : "",
//     ]
//       .filter(Boolean)
//       .join(",");

//     setCustomWhere(newFilters);
//   };

//   // Clear values on mount
//   useEffect(() => {
//     setCustomWhere("");
//   }, [setCustomWhere]);

//   return (
//     <>
//       <div className="flex gap-4 items-center">
//         {/* Schedule Selector */}
//         <Select onValueChange={handleScheduleChange} value={selectedSchedule}>
//           <SelectTrigger className="w-60 dark:text-white">
//             <SelectValue placeholder="Select Schedule" />
//           </SelectTrigger>
//           <SelectContent>
//             {scheduleNames.length > 0 ? (
//               scheduleNames.map((schedule) => (
//                 <SelectItem key={schedule.schedule_id} value={schedule.schedule_id.toString()}>
//                   {schedule.schedule_name}
//                 </SelectItem>
//               ))
//             ) : (
//               <div className="p-2 text-gray-500 text-sm">No Schedules available</div>
//             )}
//           </SelectContent>
//         </Select>

//         {/* No of Days Selector - Disabled until schedule is selected */}
//         <Select
//           onValueChange={handleDaysChange}
//           value={selectedDays}
//           // disabled={!selectedSchedule} // Disable if no schedule is selected
//         >
//           <SelectTrigger className="w-40 dark:text-white" disabled={!selectedSchedule}>
//             <SelectValue placeholder="Select Days" />
//           </SelectTrigger>
//           <SelectContent>
//             {[1, 2, 3, 4, 5, 6, 7].map((days) => (
//               <SelectItem key={days} value={days.toString()}>
//                 {days} days
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         {/* Search Button */}
//         <Button
//           onClick={handleSearch}
//           disabled={!selectedSchedule && !selectedDays } // Enable only if a schedule is selected
//         >
//           Search
//         </Button>
//       <Button>

//            <FolderUp />
//            Export

//          </Button>
//          <Button className="place-content-end" variant={"destructive"} >
//            Clear Logs
//            </Button>
//       </div>

//       <div className="py-2 flex justify-between items-center">
//         <SearchBar columns={columns} />
//       </div>

//       <DataTable columns={columns} data={data || []} totalPages={totalPages} pageCount={pageCount} />

//     </>
//   );
// };

// export default SyncLogsSelector;

//src/components/pages/schedule-logs/SyncLogs-Selector.tsx
"use client";

import { getScheduleLogsColumns } from "@/app/(protected)/schedule-logs/columns";
import { DataTable } from "@/components/DataTable";
import SearchBar from "@/components/Searchbar";
import { Button } from "@/components/ui/button";
import { ScheduleLogs } from "@/types/scheduleLogs";
import { useQueryState, parseAsString } from "nuqs";
import { useMemo, useState } from "react";
import { FolderUp } from "lucide-react";
import {
  clearErrorLogs,
} from "@/app/actions/schedule-logs/sync-logs";
import { toast } from "sonner";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useRouter } from "next/navigation";
import NumberDropdown from "@/components/NumberDropdown";
import ScheduleDropdown from "@/components/ScheduleDropdown";

interface Schedule {
  schedule_id: number;
  schedule_name: string;
}

interface ColumnOption {
  accessorKey: string;
  header: string;
}

interface SyncLogsSelectorProps {
  scheduleNames: Schedule[];
  data: ScheduleLogs[];
  totalPages: number;
  pageCount: number;
}

const SyncLogsSelector = ({
  scheduleNames,
  data,
  totalPages,
  pageCount,
  // errorSearchParams,
}: SyncLogsSelectorProps) => {
  const [, setCustomWhere] = useQueryState(
    "customWhere",
    parseAsString.withDefault("").withOptions({ shallow: false })
  );

  // Modal state
  const [showClearLogsModal, setShowClearLogsModal] = useState(false);
  // const [errorData, setErrorData] = useState<any[]>([]);
  // const [errorPageCount, setErrorPageCount] = useState<number>(0);
  // const [errorTotalPages, setErrorTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  
  const handleViewError = (scheduleListId: number) => {
    // navigate to your new dynamic page
    router.push(
      `/schedule-logs/${scheduleListId}/error-logs`
    );
  };

  const handleClearLogs = async () => {
    setLoading(true); // Start loading
    const no_of_weeks = "4"; // Set the number of weeks to clear logs for
    try {
      const response = await clearErrorLogs(no_of_weeks);
      console.log("Clear Logs Response:", response);
      toast.success("Logs cleared successfully!"); // Show success toast
    } catch (error) {
      console.error("Error clearing logs", error);
      toast.error("Failed to clear logs. Please try again."); // Show error toast
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const columns = getScheduleLogsColumns({ onView: handleViewError });
   const searchableColumns = useMemo<ColumnOption[]>(() => {
        return columns
          .filter((col) => {
            const accessor = (col as ColumnOption).accessorKey;
            return (
              typeof accessor === "string" &&
              (col as ColumnOption).header !== "actions"
            );
          })
          .map((col) => ({
            accessorKey: (col as ColumnOption).accessorKey,
            header: (col as ColumnOption).header,
          }));
      }, [columns]);
  // const columns = getScheduleLogsColumns();

  // Local states for selected values
  const [selectedSchedule, setSelectedSchedule] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<string>("");

  // Handle Schedule Change (only updates local state)
  const handleScheduleChange = (value: string) => {
    setSelectedSchedule(value);
    setSelectedDays(""); // Reset days when schedule changes
  };

  // Handle No of Days Change (only updates local state)
  const handleDaysChange = (value: string) => {
    setSelectedDays(value);
  };

  // Apply filters when the search button is clicked
  const handleSearch = () => {
    const newFilters = [
      selectedSchedule ? `schedule_id=${selectedSchedule}` : "",
      selectedDays ? `no_of_days=${selectedDays}` : "",
    ]
      .filter(Boolean)
      .join(",");

    setCustomWhere(newFilters);
  };

  // // Clear values on mount
  // useEffect(() => {
  //   setCustomWhere("");
  // }, [setCustomWhere]);

  return (
    <>
      <div className="flex gap-4 items-center">
        {/* Schedule Selector */}
        {/* <Select onValueChange={handleScheduleChange} value={selectedSchedule}>
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
              <div className="p-2 text-gray-500 text-sm">
                No Schedules available
              </div>
            )}
          </SelectContent>
        </Select> */}

        {/* No of Days Selector - Disabled until schedule is selected */}
        {/* <Select onValueChange={handleDaysChange} value={selectedDays}>
          <SelectTrigger
            className="w-40 dark:text-white"
            disabled={!selectedSchedule}
          >
            <SelectValue placeholder="Select Days" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7].map((days) => (
              <SelectItem key={days} value={days.toString()}>
                {days} days
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}

        <ScheduleDropdown
          scheduleNames={scheduleNames}
          selectedSchedule={selectedSchedule}
          onChange={handleScheduleChange}
        />

        <NumberDropdown
          selectedDays={selectedDays}
          onChange={handleDaysChange}
          disabled={!selectedSchedule}
        />
{/* Search Button */}
        <Button onClick={handleSearch} 
        // disabled={!selectedSchedule || !selectedDays}>
        disabled={!selectedSchedule }>

          Search
        </Button>
 
        {/* Export and Clear Logs - Aligned to the Right */}
  <div className="ml-auto flex gap-2">
    <Button>
      <FolderUp />
      Export
    </Button>
 
    <Button
  className="place-content-end"
  variant="destructive"
  onClick={() => setShowClearLogsModal(true)}
  disabled={loading}
>
  {loading ? "Clearing..." : "Clear Logs"}
</Button>
<DeleteConfirmationModal
  message="Are you sure you want to clear the logs?"
  isOpen={showClearLogsModal}
  onClose={() => setShowClearLogsModal(false)}
  onDelete={() => {
    setShowClearLogsModal(false);
    handleClearLogs();
  }}
/>
 </div>

      </div>

      <div className="py-2 flex justify-between items-center">
        <SearchBar columns={searchableColumns} />
      </div>

      <DataTable
        columns={columns}
        data={data || []}
        totalPages={totalPages}
        pageCount={pageCount}
        pagination={true}
      />

    </>
  );
};

export default SyncLogsSelector;
