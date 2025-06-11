import { I_ReportArgsRes, I_ReportArgsItemRes } from "../interfaces/soap";
import { T_Credentials } from "../types/soap";
import { I_ParamsRes } from "../interfaces/schedule/lines";

export const M_ReportArgsSoap = (
  lastUpdatedDate: string,
  reportAbsolutePath: string,
  credential: T_Credentials,
  params: I_ParamsRes[]
): I_ReportArgsRes => {
  var reportParams: I_ReportArgsItemRes = { item: [] };
  params.forEach((data) => {
    var items: string[] = [];
    if (data.PARAM_VALUE === "FETCH_TIME") {
      items.push(lastUpdatedDate);
    } else {
      let Array = data.PARAM_VALUE.split(",");
      Array.forEach((rmItems) => {
        items.push(rmItems);
      });
    }
    reportParams.item.push({
      name: data.PARAM_NAME,
      values: {
        item: items,
      },
    });
  });
  return {
    password: credential.password,
    reportRequest: {
      parameterNameValues: reportParams,
      reportAbsolutePath: reportAbsolutePath,
    },
    userID: credential.username,
  };
};
