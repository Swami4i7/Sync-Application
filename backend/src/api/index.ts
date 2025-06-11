import { format } from "date-and-time";
import _ from "lodash";
import oracledb, { autoCommit } from "oracledb";
import { BindParameters, ExecuteManyOptions, BIND_IN, BLOB } from "oracledb";
import { fs_node_scheduler } from "../bundle/db-package";
import { I_singleCursorResp, I_TabStruct } from "../interfaces";
import { M_ExeMrgQryBlobOptions, M_ExeMrgQryOptions } from "../models";
import { executeManyPlSql, resultSetExecute, simpleExecutePlSql } from "../services/database";
import { T_GetTableColumnsReq } from "../types";

export const readTableColumns = async (binds: T_GetTableColumnsReq): Promise<I_singleCursorResp> => {
  return resultSetExecute(fs_node_scheduler.get_table_columns, binds);
};

export const getDynamicMergeQuery = (
  tableName: string,
  filterColumns: string[],
  tableStructure: [I_TabStruct],
  tableValues: any
): string => {
  let columnsString: string = "";
  let dynamicValue: string;
  let updateValue: string | null;
  let mergeQuery: string = "";
  let insertString: string = "";
  let insertFlag: boolean = false;
  let updateString: string = "";
  let updateFlag: boolean = false;
  let onCondition: string = "";
  let conditionFlag: boolean = false;
  let matchedQuery: string = "";
  let notMatchedQuery: string = "";
  _.each(tableStructure, (column, index) => {
    if (index) {
      columnsString += ",";
      if (insertFlag) {
        insertString += ",";
        insertFlag = false;
      }
      if (updateFlag) {
        updateString += ",";
        updateFlag = false;
      }
    }
    dynamicValue = `${
      column.COLUMN_NAME === "SYNC_DATE"
        ? "SYSDATE"
        : tableValues[column.COLUMN_NAME]?.toString()
        ? column.DATA_TYPE.includes("TIMESTAMP")
          ? `TO_TIMESTAMP('${format(
              new Date(tableValues[column.COLUMN_NAME]),
              "DD-MMM-YY HH:mm:ss.SS"
            )}','DD-Mon-RR HH24:MI:SS.FF')`
          : column.DATA_TYPE.includes("DATE")
          ? `TO_DATE('${format(new Date(tableValues[column.COLUMN_NAME]), "DD-MM-YYYY")}','DD-MM-YYYY')`
          : column.DATA_TYPE.includes("VARCHAR2")
          ? `'${tableValues[column.COLUMN_NAME].toString().replace(/'/g, "''")}'`
          : `'${tableValues[column.COLUMN_NAME]}'`
        : null
    }`;

    if (!_.includes(filterColumns, column.COLUMN_NAME)) {
      updateValue = tableValues[column.COLUMN_NAME]
        ? tableValues[column.COLUMN_NAME].toString() === ""
          ? null
          : dynamicValue
        : column.COLUMN_NAME;
      updateString += `${column.COLUMN_NAME} = ${updateValue}`;
      updateFlag = true;
    } else {
      if (conditionFlag) {
        onCondition += " and ";
        conditionFlag = false;
      }
      onCondition += `${column.COLUMN_NAME} = ${dynamicValue}`;
      conditionFlag = true;
    }

    columnsString += column.COLUMN_NAME;
    insertString += dynamicValue;
    insertFlag = true;
  });
  if (updateString !== "") matchedQuery = `WHEN MATCHED THEN UPDATE SET ${updateString.replace(/,\s*$/, "")}`;
  if (insertString !== "")
    notMatchedQuery = `WHEN NOT MATCHED THEN INSERT (${columnsString.replace(
      /,\s*$/,
      ""
    )}) VALUES (${insertString.replace(/,\s*$/, "")})`;
  mergeQuery += `MERGE INTO ${tableName.replace(/,\s*$/, "")} 
  USING DUAL ON (${onCondition.replace(/,\s*$/, "")}) 
  ${matchedQuery} 
  ${notMatchedQuery}`;
  return mergeQuery;
};

export const getDynamicInsertQuery = (tableName: string, tableStructure: [I_TabStruct], tableValues: any): string => {
  let columnsString: string = "";
  let dynamicValue: string;
  let insertQuery: string = "";
  let insertString: string = "";
  let insertFlag: boolean = false;
  _.each(tableStructure, (column, index) => {
    if (index) {
      columnsString += ",";
      if (insertFlag) {
        insertString += ",";
        insertFlag = false;
      }
    }
    dynamicValue = `${
      column.COLUMN_NAME === "SYNC_DATE"
        ? "SYSDATE"
        : tableValues[column.COLUMN_NAME]?.toString()
        ? column.DATA_TYPE.includes("TIMESTAMP")
          ? `TO_TIMESTAMP('${format(
              new Date(tableValues[column.COLUMN_NAME]),
              "DD-MMM-YY HH:mm:ss.SS"
            )}','DD-Mon-RR HH24:MI:SS.FF')`
          : column.DATA_TYPE.includes("DATE")
          ? `TO_DATE('${format(new Date(tableValues[column.COLUMN_NAME]), "DD-MM-YYYY")}','DD-MM-YYYY')`
          : column.DATA_TYPE.includes("VARCHAR2")
          ? `'${tableValues[column.COLUMN_NAME].toString().replace(/'/g, "''")}'`
          : `'${tableValues[column.COLUMN_NAME]}'`
        : null
    }`;
    columnsString += column.COLUMN_NAME;
    insertString += dynamicValue;
    insertFlag = true;
  });
  insertQuery += `INSERT INTO ${tableName}(${columnsString.replace(/,\s*$/, "")}) 
  VALUES (${insertString.replace(/,\s*$/, "")})`;
  return insertQuery;
};

export const pushReports = (
  table: string,
  filterBy: string | null,
  tabStruct: any,
  operation: "INSERT" | "MERGE",
  reportData: any,
  SCHEDULE_ID: number,
  SCHEDULE_LIST_ID: any
) => {
  const dynamicQuery = _.map(reportData, (data) => {
    return {
      table_name: table,
      query:
        operation === "INSERT"
          ? getDynamicInsertQuery(table, tabStruct, data)
          : getDynamicMergeQuery(
              table,
              _.map(_.split(filterBy, ","), (value) => value.trim().toUpperCase()),
              tabStruct,
              data
            ),
      schedule_id: SCHEDULE_ID,
      schdl_list_id: SCHEDULE_LIST_ID,
    };
  });
  _.chain(dynamicQuery)
    .chunk(1000)
    .map((bulkQuery) => executeMergeQuery(bulkQuery, M_ExeMrgQryOptions()))
    .value();
};

export const executeMergeQuery = async (binds: BindParameters[], opts: ExecuteManyOptions) => {
  await executeManyPlSql(fs_node_scheduler.execute_merge_query, binds, opts);
};

export const getDynamicBlobMergeQuery = (
  tableName: string,
  filterColumns: string[],
  tableStructure: [I_TabStruct],
  tableValues: any
): string => {
  let columnsString: string = "";
  let dynamicValue: string;
  let updateValue: string | null;
  let mergeQuery: string = "";
  let insertString: string = "";
  let insertFlag: boolean = false;
  let updateString: string = "";
  let updateFlag: boolean = false;
  let onCondition: string = "";
  let conditionFlag: boolean = false;
  let matchedQuery: string = "";
  let notMatchedQuery: string = "";
  let bind: any = {};
  _.each(tableStructure, (column, index) => {
    let binditem: any = {};
    if (index) {
      columnsString += ",";
      if (insertFlag) {
        insertString += ",";
        insertFlag = false;
      }
      if (updateFlag) {
        updateString += ",";
        updateFlag = false;
      }
    }
    dynamicValue = `${
      column.COLUMN_NAME === "SYNC_DATE"
        ? "SYSDATE"
        : tableValues[column.COLUMN_NAME]?.toString()
        ? column.DATA_TYPE.includes("TIMESTAMP")
          ? `TO_TIMESTAMP('${format(
              new Date(tableValues[column.COLUMN_NAME]),
              "DD-MMM-YY HH:mm:ss.SS"
            )}','DD-Mon-RR HH24:MI:SS.FF')`
          : column.DATA_TYPE.includes("DATE")
          ? `TO_DATE('${format(new Date(tableValues[column.COLUMN_NAME]), "DD-MM-YYYY")}','DD-MM-YYYY')`
          : column.DATA_TYPE.includes("VARCHAR2")
          ? `'${tableValues[column.COLUMN_NAME].toString().replace(/'/g, "''")}'`
          : column.DATA_TYPE.includes("BLOB")
          ? `:${column.COLUMN_NAME}`
          : `'${tableValues[column.COLUMN_NAME]}'`
        : null
    }`;

    if (column.DATA_TYPE.includes("BLOB")) {
      binditem.val = Buffer.from(tableValues[column.COLUMN_NAME][0].replace(/\r\n/g, ""), "base64");
      binditem.dir = BIND_IN;
      binditem.type = BLOB;
      bind[column.COLUMN_NAME] = binditem;
    }

    if (!_.includes(filterColumns, column.COLUMN_NAME)) {
      updateValue = tableValues[column.COLUMN_NAME]
        ? tableValues[column.COLUMN_NAME].toString() === ""
          ? null
          : dynamicValue
        : column.COLUMN_NAME;
      updateString += `${column.COLUMN_NAME} = ${updateValue}`;
      updateFlag = true;
    } else {
      if (conditionFlag) {
        onCondition += " and ";
        conditionFlag = false;
      }
      onCondition += `${column.COLUMN_NAME} = ${dynamicValue}`;
      conditionFlag = true;
    }

    columnsString += column.COLUMN_NAME;
    insertString += dynamicValue;
    insertFlag = true;
  });
  if (updateString !== "") matchedQuery = `WHEN MATCHED THEN UPDATE SET ${updateString.replace(/,\s*$/, "")}`;
  if (insertString !== "")
    notMatchedQuery = `WHEN NOT MATCHED THEN INSERT (${columnsString.replace(
      /,\s*$/,
      ""
    )}) VALUES (${insertString.replace(/,\s*$/, "")})`;
  mergeQuery += `MERGE INTO ${tableName.replace(/,\s*$/, "")} 
  USING DUAL ON (${onCondition.replace(/,\s*$/, "")}) 
  ${matchedQuery} 
  ${notMatchedQuery}`;
  return mergeQuery;
  //await executeBlobMergeQuery(mergeQuery, bind);
};

export const getDynamicBlobInsertQuery = (
  tableName: string,
  tableStructure: [I_TabStruct],
  tableValues: any
): string => {
  let columnsString: string = "";
  let dynamicValue: string;
  let insertQuery: string = "";
  let insertString: string = "";
  let insertFlag: boolean = false;
  let bind: any = {};
  _.each(tableStructure, (column, index) => {
    let binditem: any = {};
    if (index) {
      columnsString += ",";
      if (insertFlag) {
        insertString += ",";
        insertFlag = false;
      }
    }
    dynamicValue = `${
      column.COLUMN_NAME === "SYNC_DATE"
        ? "SYSDATE"
        : tableValues[column.COLUMN_NAME]?.toString()
        ? column.DATA_TYPE.includes("TIMESTAMP")
          ? `TO_TIMESTAMP('${format(
              new Date(tableValues[column.COLUMN_NAME]),
              "DD-MMM-YY HH:mm:ss.SS"
            )}','DD-Mon-RR HH24:MI:SS.FF')`
          : column.DATA_TYPE.includes("DATE")
          ? `TO_DATE('${format(new Date(tableValues[column.COLUMN_NAME]), "DD-MM-YYYY")}','DD-MM-YYYY')`
          : column.DATA_TYPE.includes("VARCHAR2")
          ? `'${tableValues[column.COLUMN_NAME].toString().replace(/'/g, "''")}'`
          : column.DATA_TYPE.includes("BLOB")
          ? `:${column.COLUMN_NAME}`
          : `'${tableValues[column.COLUMN_NAME]}'`
        : null
    }`;
    if (column.DATA_TYPE.includes("BLOB")) {
      binditem.val = Buffer.from(tableValues[column.COLUMN_NAME][0].replace(/\r\n/g, ""), "base64");
      binditem.dir = BIND_IN;
      binditem.type = BLOB;
      bind[column.COLUMN_NAME] = binditem;
    }
    columnsString += column.COLUMN_NAME;
    insertString += dynamicValue;
    insertFlag = true;
  });
  insertQuery += `INSERT INTO ${tableName}(${columnsString.replace(/,\s*$/, "")}) 
  VALUES (${insertString.replace(/,\s*$/, "")})`;
  return insertQuery;
  // await executeBlobMergeQuery(insertQuery, bind);
};

// export const pushblobReports = async (
//   table: string,
//   filterBy: string | null,
//   tabStruct: [I_TabStruct],
//   operation: "INSERT" | "MERGE",
//   reportData: any,
//   schedule_id: number // Added schedule_id as a parameter
// ) => {
//   for (const data of reportData) {
//     // Add schedule_id to the data object
//     const enrichedData = { ...data, schedule_id };
//     const query =
//       operation === "INSERT"
//         ? getDynamicBlobInsertQuery(table, tabStruct, enrichedData)
//         : getDynamicBlobMergeQuery(
//             table,
//             _.map(_.split(filterBy, ","), (value) => value.trim().toUpperCase()),
//             tabStruct,
//             enrichedData
//           );

//     // Execute the query with schedule_id as a bind variable
//     await executeBlobMergeQuery(query, { schedule_id });
//   }
// };

// export const executeBlobMergeQuery = async (queries: any, bind: any): Promise<any> => {
//   let opts = { autoCommit: true };
//   await simpleExecutePlSql(queries, bind, opts);
// };

export const pushblobReports = async (
  table: string,
  filterBy: string | null,
  tabStruct: [I_TabStruct],
  operation: "INSERT" | "MERGE",
  reportData: any,
  SCHEDULE_ID: number,
  SCHEDULE_LIST_ID: any
) => {
  // for (const data of reportData) {
  //   const query =
  //     operation === "INSERT"
  //       ? getDynamicBlobInsertQuery(table, tabStruct, data)
  //       : getDynamicBlobMergeQuery(
  //           table,
  //           _.map(_.split(filterBy, ","), (value) => value.trim().toUpperCase()),
  //           tabStruct,
  //           data
  //         );
  // }
  const dynamicQuery = _.map(reportData, (data) => {
    return {
      table_name: table,
      query:
        operation === "INSERT"
          ? getDynamicBlobInsertQuery(table, tabStruct, data)
          : getDynamicBlobMergeQuery(
              table,
              _.map(_.split(filterBy, ","), (value) => value.trim().toUpperCase()),
              tabStruct,
              data
            ),
      schedule_id: SCHEDULE_ID,
      schdl_list_id: SCHEDULE_LIST_ID,
    };
  });
  _.chain(dynamicQuery)
    .chunk(1000)
    .map((bulkQuery) => executeBlobMergeQuery(bulkQuery, M_ExeMrgQryBlobOptions()))
    .value();
  // console.log(dynamicQuery);
  // await executeBlobMergeQuery(dynamicQuery, M_ExeMrgQryBlobOptions());
};

// export const executeBlobMergeQuery = async (binds: BindParameters[], opts: ExecuteManyOptions) => {
//   await executeManyPlSql(fs_node_scheduler.execute_merge_query, binds, opts);
// };
export const executeBlobMergeQuery = async (binds: BindParameters[], opts: ExecuteManyOptions) => {
  await executeManyPlSql(fs_node_scheduler.execute_merge_query, binds, opts);
};