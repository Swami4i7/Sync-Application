"use client";

import { startTransition } from "react";
import { Button } from "@/components/ui/button";
import { Play, CircleStop, Download, FolderUp } from "lucide-react";
import { useBoolean } from "@/hooks/useBoolean";
import MultiFormModal from "./MultiFormModal";
import { toast } from "sonner";
import {
  startSchedule,
  stopSchedule,
} from "@/app/actions/schedule-details/scheduleDetails";
import { processError } from "@/lib/utils";
import Searchbar from "@/components/Searchbar";


interface ColumnOption {
  accessorKey: string;
  header: string;
}

interface SearchBarProps {
  columns: ColumnOption[];
}



const ScheduleListHeader: React.FC<SearchBarProps> = ({ columns }) => {
  const modal = useBoolean(false);

  const handleStart = () => {
    startTransition(async () => {
      try {
        const response = await startSchedule();

        if (response.status === "running") {
          toast.success("Scheduler Started Successfully");
        } else {
          toast.warning(response.message);
        }
      } catch (error: unknown) {
        processError(error);
      }
    });
  };

  const handleStop = () => {
    startTransition(async () => {
      try {
        const response = await stopSchedule();
        if (response.status) 
          toast.success("Scheduler Stopped");
        else 
        toast.warning(response.message);
      } catch (error: unknown) {
        processError(error);
      }
    });
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <Button className="mr-2" onClick={handleStart}>
            <Play />
            Start
          </Button>
          <Button className="mr-2" onClick={handleStop}>
            <CircleStop />
            Stop
          </Button>
        </div>
        <div>
          <Button className="mr-2">
            <Download /> Import
          </Button>
          <Button>
            <FolderUp />
            Export
          </Button>
        </div>
      </div>
      <div className="py-2 flex justify-between items-center">
        <Searchbar columns={columns} />
        <Button className="ml-2" onClick={modal.onToggle}>
          Add Schedule
        </Button>
      </div>
      {modal.value && (
        <MultiFormModal isOpen={modal.value} onClose={modal.onFalse} />
      )}
    </div>
  );
};

export default ScheduleListHeader;
