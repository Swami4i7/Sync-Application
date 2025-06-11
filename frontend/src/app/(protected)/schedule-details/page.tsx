import { getScheduleDetails } from "@/app/actions/schedule-details/scheduleDetails";
import ScheduleList from "@/components/pages/schedule-details/ScheduleList";
import { scheduleDetailsPropsCache } from "@/lib/utils";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { searchTerm, limit, offset, primaryKey, searchColumns } =
    await scheduleDetailsPropsCache.parse(searchParams);
  
  // Fetch data
  const { data, pageCount, totalPages }  = await getScheduleDetails({
    searchTerm,
    searchColumns,
    limit,
    offset,
    primaryKey,
  });

// const result = await getScheduleDetails({ searchTerm, searchColumns, limit, offset, primaryKey });

//   const data = result.data as ScheduleListType[];

//   const pageCount = Math.ceil(data.length / limit);
//   const totalPages = pageCount;

  return (
    <ScheduleList
      data={data}
      totalPages={totalPages}
      pageCount={pageCount}
      searchParams={{ searchTerm, searchColumns, limit, offset, primaryKey }}
    />
  );
};

export default Page;
