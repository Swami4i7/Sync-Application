// "use client";

// import { Button } from "@/components/ui/button";
// // import { useSearchContext } from "@/context/ApplicationContext";
// import { FileDown } from "lucide-react";
// import { usePathname } from "next/navigation";


// const downloadReport = (pathname: string, appId: number|null) => { 
//   getReport(pathname,appId);
// }

// export function DownloadReportButton() {
// const { appId } = useSearchContext(); 
//   const pathname = usePathname();
//   return (
//     <Button onClick={()=>downloadReport(pathname,appId)}variant="ghost" className="dark:text-white flex items-center translate-x-9 md:-translate-x-1">
//       <FileDown className="mr-2" />
//       Download Excel Report
//     </Button>
//   );
// }
