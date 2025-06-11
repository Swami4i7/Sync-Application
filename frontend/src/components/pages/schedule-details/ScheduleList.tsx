//src/app/(protected)/schedule-details/ScheduleList.tsx
"use client";
import { getScheduleDetailsColumns } from "@/app/(protected)/schedule-details/columns";
import { DataTable } from "@/components/DataTable";
import { ScheduleList } from "@/types/scheduleDetails";
import ScheduleListHeader from "./ScheduleListHeader";
import { useBoolean } from "@/hooks/useBoolean";
import ViewParametersModal from "./ViewParametersModal";
import { useEffect, useMemo, useState } from "react";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { toast } from "sonner";
import { encryptBody, processError } from "@/lib/utils";
import { useScheduleStore } from "@/lib/scheduleStore";
import { deleteScheduleDetails } from "@/app/actions/schedule-details/scheduleDetails";
import EditScheduleModal from "./EditScheduleModal";

interface ColumnOption {
  accessorKey: string;
  header: string;
}

interface ScheduleListProps {
  data: ScheduleList[];
  totalPages: number;
  pageCount: number;
  searchParams: {
    searchTerm: string;
    searchColumns: string;
    limit: number;
    offset: number;
    primaryKey: string;
  };
}
const ScheduleListComponent = ({
  data,
  totalPages,
  pageCount,
  searchParams,
}: ScheduleListProps) => {
  const { setScheduleData, setQueryParams } = useScheduleStore();

  useEffect(() => {
    setScheduleData(data, totalPages, pageCount);
    setQueryParams(searchParams);
  }, [
    data,
    totalPages,
    pageCount,
    searchParams,
    setScheduleData,
    setQueryParams,
  ]);

  const { scheduleData } = useScheduleStore();

  // console.log("searchparmas",searchParams);

  const {
    value: parameterValue,
    onFalse: parameterOnFalse,
    onTrue: parameterOnTrue,
  } = useBoolean(false);

  //schedueModal state
  const {
    value: scheduleValueEdit,
    onFalse: scheduleOnFalseEdit,
    onTrue: scheduleOnTrueEdit,
  } = useBoolean(false);

  //schedueModal state
  const {
    value: scheduleValueDelete,
    onFalse: scheduleOnFalseDelete,
    onTrue: scheduleOnTrueDelete,
  } = useBoolean(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [scheduleName, setScheduleName] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleList | null>(
    null
  );

 

  const handleDeleteSchedule = (id: number, schedule_name: string) => {
    setSelectedId(id);
    setScheduleName(schedule_name);
    scheduleOnTrueDelete();
    console.log("Delete schedule:", schedule_name, "#" + id);
  };

  // Actual delete handler
  const handleConfirmDelete = async () => {
    if (selectedId !== null) {
      try {
        const schedule = selectedId.toString();
        console.log("schedule", schedule);
        const data = { schedule_id: schedule.toString() };
        const body = JSON.stringify(data);
        const { ciphertext, iv } = encryptBody(body);
        const encryptedBody = JSON.stringify({ ciphertext, iv });
        const response = await deleteScheduleDetails(encryptedBody, selectedId);
        console.log("response", response);
        //if (response.success=== true)
          toast.success("Schedule deleted successfully");
        //else toast.error("Failed to delete schedule");
      } catch (error) {
        const errorMessage = processError(error);
             toast.error(errorMessage || "Error deleting user");
      } finally {
        scheduleOnFalseDelete();
        setSelectedId(null);
      }
    }
  };

  

  const handleViewParameter = (id: number, schedule_name: string) => {
    setSelectedId(id);
    setScheduleName(schedule_name);
    // console.log("parent:", selectedId, "child:", id);
    parameterOnTrue();
  };

  const handleEditSchedule = (scheduleData: ScheduleList) => {
    setSelectedId(scheduleData.SCHEDULE_ID);
    setScheduleName(scheduleData.SCHEDULE_NAME);
    setSelectedSchedule(scheduleData);
    scheduleOnTrueEdit();
  };

  const columns = getScheduleDetailsColumns({
    onDelete: handleDeleteSchedule,
    onView: handleViewParameter,
    onEdit: handleEditSchedule,
  });



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

  return (
    <>
      <ScheduleListHeader columns={searchableColumns} />
      <DataTable
        data={scheduleData}
        columns={columns}
        totalPages={totalPages}
        pageCount={pageCount}
        pagination={true}
      />
      {/* view parameter modal */}
      {parameterValue && selectedId !== null && (
        <ViewParametersModal
          isOpen={parameterValue}
          onClose={parameterOnFalse}
          id={selectedId}
          message={`Manage Parameters for ${scheduleName}?`}
        />
      )}
      {/* delete schedule modal */}
      {scheduleValueDelete && selectedId !== null && (
        <DeleteConfirmationModal
          isOpen={scheduleValueDelete}
          onClose={scheduleOnFalseDelete}
          onDelete={handleConfirmDelete}
          message={`Delete schedule ${scheduleName}?`}
        />
      )}
      {/* edit schedule modal */}
      {scheduleValueEdit && selectedId !== null && (
        <EditScheduleModal
          isOpen={scheduleValueEdit}
          onClose={scheduleOnFalseEdit}
          // id={selectedId}
          message={`Edit Schedule Details for ${scheduleName}?`}
          data={selectedSchedule!}
        />
      )}
    </>
  );
};

export default ScheduleListComponent;
