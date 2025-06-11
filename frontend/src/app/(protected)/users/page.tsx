import { fetchUsersData } from "@/app/actions/user/users";
import { usersPropsCache } from "@/lib/utils";
import { SearchParams } from "nuqs/server";
import Users from "@/components/pages/users/Users";
import { Users as UsersType } from "@/types/users";

type PageProps = {
  searchParams: Promise<SearchParams> 
}

const page = async({ searchParams }: PageProps) => {
  const { searchTerm, limit, offset, primaryKey, searchColumns } =await usersPropsCache.parse(searchParams);

  const result = await fetchUsersData({ searchTerm, searchColumns, limit, offset, primaryKey });

  const data = result.data as UsersType[];

  const pageCount = Math.ceil(data.length / limit);
  const totalPages = pageCount;

  return <Users data={data} totalPages={totalPages} pageCount={pageCount} />;
};

export default page;
