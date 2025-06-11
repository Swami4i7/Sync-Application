import { create } from "zustand";
import { ScheduleList } from "@/types/scheduleDetails";

interface ScheduleState {
  scheduleData: ScheduleList[];
  totalPages: number;
  pageCount: number;
  searchParams: {
    searchTerm: string;
    searchColumns: string;
    limit: number;
    offset: number;
    primaryKey: string;
  } | null;

  setScheduleData: (
    data: ScheduleList[],
    totalPages: number,
    pageCount: number
  ) => void;

  setQueryParams: (params: {
    searchTerm: string;
    searchColumns: string;
    limit: number;
    offset: number;
    primaryKey: string;
  }) => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  scheduleData: [],
  totalPages: 0,
  pageCount: 0,
  searchParams: null,

  setScheduleData: (data, totalPages, pageCount) =>
    set({ scheduleData: data, totalPages, pageCount }),

  setQueryParams: (params) => set({ searchParams: params }),
}));


