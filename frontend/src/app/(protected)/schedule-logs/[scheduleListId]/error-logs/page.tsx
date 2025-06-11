// src/app/(protected)/schedule-logs/[scheduleListId]/error-logs/page.tsx
import { getErrorLogs } from "@/app/actions/schedule-logs/sync-logs";
import ErrorLogsClient from "@/components/pages/schedule-logs/ErrorLogs";
import { errorLogsPropsCache } from "@/lib/utils";
import { SearchParams } from "nuqs";


type PageProps = {
  params: Promise<{ scheduleListId: string }>;
  searchParams: Promise<SearchParams>;
};

export default async function ErrorLogsPage({
  params,
  searchParams,
}: Readonly<PageProps>) {
  const { limit, offset, primaryKey, searchTerm, searchColumns } =
    await errorLogsPropsCache.parse(searchParams);
    console.log("searchParams", searchParams);
    const {scheduleListId} = await params;
  console.log("params", scheduleListId);
  const customWhere = `schedule_list_id=${scheduleListId}`;
  console.log("customWhere page", customWhere);

  const { data, pageCount, totalPages } = await getErrorLogs({
    limit,
    offset,
    primaryKey,
    searchTerm,
    searchColumns,
    customWhere,
  });

  return (
    <div className="p-4">
      <p className="text-md mb-2 dark:text-white">
        Errors Logs for Schedule List Id #{customWhere.split("=")[1]}
      </p>
      <ErrorLogsClient
        data={data}
        pageCount={pageCount}
        totalPages={totalPages}
      />
    </div>
  );
}
