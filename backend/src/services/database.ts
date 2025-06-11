import _ from "lodash";
import {
  BIND_IN,
  BindParameters,
  Connection,
  createPool,
  ExecuteManyOptions,
  ExecuteOptions,
  NUMBER,
  OUT_FORMAT_OBJECT,
  Pool,
  Result,
  Results,
  STRING,
} from "oracledb";
import hrPool from "../config/database";
import oracledb from 'oracledb';

let connectionPool: Pool;

oracledb.fetchAsBuffer = [oracledb.BLOB];

// Initialize the database
export const initialize = async () => {
  connectionPool = await createPool(hrPool);
};

// Closing the database
export const close = async () => {
  if (connectionPool) await connectionPool.close();
};

export const getConnection = async () =>{
    return await connectionPool.getConnection();
};

// Execute the query
// Execute the query
export const simpleExecutePlSql = async (
  statement: string,
  binds: BindParameters = [],
  opts: ExecuteOptions = {},
  existingConn?: Connection // Optional connection parameter
): Promise<Result<any>> => {
  let localConn: Connection | null = null;
  opts.outFormat = OUT_FORMAT_OBJECT;

  try {
    // Use existing connection if provided, otherwise create new
    const conn = existingConn || (await connectionPool.getConnection());

    // Store reference only if we created the connection
    if (!existingConn) localConn = conn;

    // Execute the statement
    console.log("Statement: ", statement, "Binds: ", binds);
    const result: Result<any> = await conn.execute(statement, binds, opts);
    console.log("Result: ", result, "Statement: ", statement, "Binds: ", binds);

    // Auto-commit only for non-transactional operations
    if (!existingConn && opts.autoCommit !== false) {
      await conn.commit();
    }

    return result;
  } catch (err) {
    // Rollback only if using local connection
    if (localConn) {
      try {
        await localConn.rollback();
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr);
      }
    }
    throw err;
  } finally {
    // Only close connections we created
    if (localConn) {
      try {
        await localConn.close();
      } catch (closeErr) {
        console.error("Connection close failed:", closeErr);
      }
    }
  }
};
 

export const resultSetExecute = async (
  statement: string,
  binds: BindParameters = [],
  opts: ExecuteOptions = {}
): Promise<any> => {
  let conn: Connection | null = null;
  opts.resultSet = true;
  opts.outFormat = OUT_FORMAT_OBJECT;
  try {
    conn = await connectionPool.getConnection();
    const result: Result<any> = await conn.execute(statement, binds, opts);
    let outBinds: any = {};
    await Promise.all(
      _.chain(result.outBinds)
        .map(async (value, key) => {
          if (typeof value?.getRow != "function") outBinds[key] = value;
          else {
            const row = await value.getRows(5000);
            await value.close();
            outBinds[key] = row;
          }
        })
        .value()
    );
    return outBinds;
  } catch (err) {
    throw err;
  } finally {
    if (conn) await conn!.close();
  }
};

export const executeManyPlSql = async (
  statement: string,
  binds: BindParameters[] = [],
  opts: ExecuteManyOptions = {}
): Promise<Results<any>> => {
  let conn: Connection | null = null;
  try {
    conn = await connectionPool.getConnection();
    const result: Results<any> = await conn.executeMany(statement, binds, opts);
    return result;
  } catch (err) {
    throw err;
  } finally {
    if (conn) await conn!.close();
  }
};

export const simpleExecutePlSqls = async (
  statement: string,
  binds: BindParameters = [],
  opts: ExecuteOptions = {},
  conn: Connection 
): Promise<Result<any>> => {
  try {
    var result: Result<any> | null;
    result = await conn.execute(statement, binds, opts);
    return result;
  } catch (err) {
    throw err;
  }
};


//oracle standard get query
// export const buildDynamicQuery = (
//   baseQuery: string,
//   searchParams: {
//     searchColumns?: string[];
//     searchTerm?: string;
//     sortColumn?: string;
//     sortOrder?: "ASC" | "DESC";
//     limit?: number;
//     offset?: number;
//     primaryKey?: string;
//     customWhere?: Record<string, { operator: string; value: any }>;
//   }
// ) => {
//   let whereClause = "";
//   let binds: Record<string, any> = {};

//   // 🔹 Search Logic
//   if (searchParams.searchColumns && searchParams.searchTerm) {
//     const searchConditions = searchParams.searchColumns.map((col, index) => {
//       const paramKey = `search_${index}`;
//       binds[paramKey] = `%${searchParams.searchTerm}%`;
//       return `${col} LIKE :${paramKey}`;
//     });

//     whereClause = ` WHERE ${searchConditions.join(" OR ")}`;
//   }

//   // 🔹 Custom WHERE Conditions
//   if (searchParams.customWhere) {
//     const customConditions = Object.entries(searchParams.customWhere).map(
//       ([key, { operator, value }], index) => {
//         const paramKey = `custom_${index}`;
//         binds[paramKey] = value;
//         return `${key} ${operator} :${paramKey}`;
//       }
//     );

//     whereClause += whereClause
//       ? ` AND (${customConditions.join(" AND ")})`
//       : ` WHERE ${customConditions.join(" AND ")}`;
//   }

//   // 🔹 Base Query with Filters
//   const filteredQuery = `${baseQuery}${whereClause}`;

//   // 🔹 Optimized COUNT Query (Only Counts Rows)
//   const countQuery = `SELECT COUNT(*) AS total FROM ${
//     baseQuery.split("FROM")[1]
//   }${whereClause}`;

//   // 🔹 Sorting Logic
//   const defaultPrimaryKey = searchParams.primaryKey;
//   const sortByColumn =
//     searchParams.sortColumn ||
//     (searchParams.searchColumns?.length
//       ? searchParams.searchColumns[0]
//       : defaultPrimaryKey);

//   let orderByClause = ` ORDER BY ${sortByColumn} ${
//     searchParams.sortOrder || "ASC"
//   }`;

//   // 🔹 Pagination (Using OFFSET ... FETCH NEXT for Oracle)
//   let finalQuery = `${filteredQuery}${orderByClause}`;
//   if (searchParams.limit) {
//     finalQuery += ` OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`;
//     binds.limit = searchParams.limit;
//     binds.offset = searchParams.offset ?? 0;
//   }

//   return { sql: finalQuery, binds, countSql: countQuery };
// };

//new dq
export const buildDynamicQuery = (
  baseQuery: string,
  searchParams: {
    searchColumns?: string[];
    searchTerm?: string;
    sortColumn?: string;
    sortOrder?: "ASC" | "DESC";
    limit?: number;
    offset?: number;
    primaryKey?: string;
    customWhere?: Record<string, { operator: string; value: any }>;
  }
) => {
  let whereClause = "";
  let binds: Record<string, any> = {};

  // 🔹 Search Logic
  let searchClause = "";
  if (searchParams.searchColumns && searchParams.searchTerm) {
    const searchConditions = searchParams.searchColumns.map((col, index) => {
      const paramKey = `search_${index}`;
      // binds[paramKey] = `%${searchParams.searchTerm}%`;
      // return `${col} LIKE :${paramKey}`;
      //case insensitive search
      // Lowercase the bind value
    binds[paramKey] = `%${searchParams?.searchTerm?.toLowerCase()}%`;
    // Apply LOWER() to the column
    return `LOWER(${col}) LIKE :${paramKey}`;
    });

    // Wrap search conditions in parentheses
    searchClause = `(${searchConditions.join(" OR ")})`;
  }

  // 🔹 Custom WHERE Conditions
  let customClause = "";
  if (searchParams.customWhere) {
    const customConditions = Object.entries(searchParams.customWhere).map(
      ([key, { operator, value }], index) => {
        const paramKey = `custom_${index}`;
        binds[paramKey] = value;
        return `${key} ${operator} :${paramKey}`;
      }
    );

    customClause = customConditions.join(" AND ");
  }

  // 🔹 Combine WHERE logic with proper parentheses
  if (searchClause && customClause) {
    whereClause = ` WHERE ${searchClause} AND (${customClause})`;
  } else if (searchClause) {
    whereClause = ` WHERE ${searchClause}`;
  } else if (customClause) {
    whereClause = ` WHERE ${customClause}`;
  }

  // 🔹 Base Query with Filters
  const filteredQuery = `${baseQuery}${whereClause}`;

  // 🔹 Optimized COUNT Query
  const countQuery = `SELECT COUNT(*) AS total FROM ${
    baseQuery.split("FROM")[1]
  }${whereClause}`;

  // 🔹 Sorting Logic
  const defaultPrimaryKey = searchParams.primaryKey;
  const sortByColumn =
    searchParams.sortColumn ??
    (searchParams.searchColumns?.length
      ? searchParams.searchColumns[0]
      : defaultPrimaryKey);

  let orderByClause = ` ORDER BY ${sortByColumn} ${
    searchParams.sortOrder ?? "ASC"
  }`;

  // 🔹 Pagination
  let finalQuery = `${filteredQuery}${orderByClause}`;
  if (searchParams.limit) {
    finalQuery += ` OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`;
    binds.limit = searchParams.limit;
    binds.offset = searchParams.offset ?? 0;
  }

  return { sql: finalQuery, binds, countSql: countQuery };
};


// Oracle standard get query WITH ALTERED COUNT QUERY FILTERED
// export const buildDynamicQuery = (
//   baseQuery: string,
//   searchParams: {
//     searchColumns?: string[];
//     searchTerm?: string;
//     sortColumn?: string;
//     sortOrder?: "ASC" | "DESC";
//     limit?: number;
//     offset?: number;
//     primaryKey?: string;
//     customWhere?: Record<string, { operator: string; value: any }>;
//   }
// ) => {
//   let whereClause = "";
//   let binds: Record<string, any> = {};

//   // 🔹 Search Logic
//   if (searchParams.searchColumns && searchParams.searchTerm) {
//     const searchConditions = searchParams.searchColumns.map((col, index) => {
//       const paramKey = `search_${index}`;
//       binds[paramKey] = `%${searchParams.searchTerm}%`;
//       return `${col} LIKE :${paramKey}`;
//     });

//     whereClause = ` WHERE ${searchConditions.join(" OR ")}`;
//   }

//   // 🔹 Custom WHERE Conditions
//   if (searchParams.customWhere) {
//     const customConditions = Object.entries(searchParams.customWhere).map(
//       ([key, { operator, value }], index) => {
//         const paramKey = `custom_${index}`;
//         binds[paramKey] = value;
//         return `${key} ${operator} :${paramKey}`;
//       }
//     );

//     whereClause += whereClause
//       ? ` AND (${customConditions.join(" AND ")})`
//       : ` WHERE ${customConditions.join(" AND ")}`;
//   }

//   // 🔹 Base Query with Filters
//   const filteredQuery = `${baseQuery}${whereClause}`;

//   // 🔹 Optimized COUNT Query (Only Counts Rows) - NO CHANGES HERE
//   const countQuery = `SELECT COUNT(*) AS total FROM ${
//     baseQuery.split("FROM")[1]
//   }${whereClause}`;

//   // 🔹 Sorting Logic
//   const defaultPrimaryKey = searchParams.primaryKey;
//   const sortByColumn =
//     searchParams.sortColumn ||
//     (searchParams.searchColumns?.length
//       ? searchParams.searchColumns[0]
//       : defaultPrimaryKey);

//   let orderByClause = ` ORDER BY ${sortByColumn} ${
//     searchParams.sortOrder || "ASC"
//   }`;

//   // 🔹 Pagination (Using OFFSET ... FETCH NEXT for Oracle)
//   let finalQuery = `${filteredQuery}${orderByClause}`;
//   if (searchParams.limit) {
//     finalQuery += ` OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`;
//     binds.limit = searchParams.limit;
//     binds.offset = searchParams.offset ?? 0;
//   }

//   return { sql: finalQuery, binds, countSql: countQuery };
// };




// export const generateBindParams = (binds: Record<string, any>) => {
//   const bindParams: Record<string, any> = {};

//   Object.entries(binds).forEach(([key, value]) => {
//     bindParams[key] = {
//       val: value,
//       dir: BIND_IN,
//       type: typeof value === "number" ? NUMBER : STRING, 
//     };
//   });

//   return bindParams;
// };

export const parseCustomWhere = (customWhereQuery: string | undefined) => {
  if (!customWhereQuery) return undefined;

  const conditions: Record<string, { operator: string; value: any }> = {};

  // Split multiple conditions (e.g., "days>5,schedule_id=4000")
  customWhereQuery.split(",").forEach((condition, index) => {
    const match = condition.match(/(<=|>=|=|<|>)/);
    if (match) {
      const [key, value] = condition.split(match[0]);
      if (key && value) {
        conditions[key.trim()] = {
          operator: match[0],
          value: isNaN(Number(value.trim())) ? value.trim() : Number(value.trim()), // Convert numbers
        };
      }
    }
  });

  return conditions;
};