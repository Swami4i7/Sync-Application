//src/app/(protected)/schedule-logs/page.tsx
import { getScheduleLogs, getScheduleNames } from "@/app/actions/schedule-logs/sync-logs";
import { processError, scheduleLogsPropsCache } from "@/lib/utils";
import { SearchParams } from "nuqs/server";
import SyncLogsSelector from "@/components/pages/schedule-logs/SyncLogs-Selector";

type PageProps = {
  searchParams: Promise<SearchParams> // Next.js 15+: async searchParams prop
}

const Page = async ({ searchParams }: PageProps) => {
    const { searchTerm, limit, offset, primaryKey, searchColumns, customWhere } =await scheduleLogsPropsCache.parse(searchParams);

    const { data, pageCount, totalPages } = await getScheduleLogs({ searchTerm, searchColumns, limit, offset, primaryKey, customWhere });
    
    
    let scheduleNames = [];
    
      try {
        const response = await getScheduleNames();
        scheduleNames = response?.data?.map((item: { SCHEDULE_ID: number; SCHEDULE_NAME: string }) => ({
          schedule_id: item.SCHEDULE_ID,
          schedule_name: item.SCHEDULE_NAME,
        })) ?? [];
      } catch (error) {
        processError(error);
      }
    // const data = await getScheduleLogs();
    return (
<SyncLogsSelector 
  scheduleNames={scheduleNames}
  data={data} 
  totalPages={totalPages}
  pageCount={pageCount}
  
/>

    );
  };
  
  export default Page;
  
  //extract searchparams fetch getSynclogs