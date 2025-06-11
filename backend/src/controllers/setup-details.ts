import { Request, Response } from "express";
import { createDetailsAPI, getDetailsAPI, updateDetailsAPI } from "../api/scheduler/header";
import { I_customReq_BodyOfObject, I_customReq_Params, I_customReq_Params_BodyOfObject } from "../interfaces";
import { Resp_err_403 } from "../middleware/util";
import { M_create_details_t, M_setup_details, M_updateDetail_t } from "../models";
import { T_setupDetailPayload, T_setupDetails_t, T_updateDetailPayload, T_updateDetails_t } from "../types";
import { decryptBody, encryptBody } from "../middleware/auth";

// export const getDetails = async (
//   req: I_customReq_Params_BodyOfObject<T_setupDetailPayload>,
//   res: Response,
// ) => {
//   try {
//     const result = await getDetailsAPI(M_setup_details(req.params));
//     res.status(200).json(result.rows);
//   } catch (err: any) {
//     Resp_err_403(res, err.message);
//   }
// };

export const getDetails = async (
  req: I_customReq_Params_BodyOfObject<T_setupDetailPayload>,
  res: Response,
) => {
  try {
    const result = await getDetailsAPI(M_setup_details(req.params));
    //console.log("result:", result);

    // Check if data exists instead of relying on result.success
    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No setup details found" });
    }

    const { ciphertext, iv } = encryptBody(JSON.stringify(result));
    //console.log("encryptBody output:", { ciphertext, iv });
    if (!ciphertext || !iv) {
      return res.status(500).json({ success: false, message: "Encryption failed: missing ciphertext or IV" });
    }

    const encryptedBody = { ciphertext, iv };
    //console.log("encryptedBody setupdetails", encryptedBody);
    res.status(200).json(encryptedBody);
  } catch (err: any) {
    //console.error("getDetails error:", err);
    res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
  }
};


// export const uupdateDetails = async (
//   req: I_customReq_Params<T_updateDetailPayload, T_updateDetails_t>,
//   res: Response,
// ) => {
//   try {
//     const result: any = await updateDetailsAPI(
//       M_updateDetail_t(req.params, req.body)
//     );
//     res.status(200).json({
//       success: true,
//       data: [result.outBinds],
//     });
//   } catch (err: any) {
//     Resp_err_403(res, err.message);
//   }
// };

export const updateDetails = async (
  req: I_customReq_Params<T_updateDetailPayload, T_updateDetails_t>,
  res: Response,
) => {
  const { ciphertext, iv } = req.body;
  if (!ciphertext || !iv) {
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    res.status(400).json({ error: "Missing ciphertext or IV" });
    return;
  }
  try {
    const decryptedBody = decryptBody(ciphertext, iv);
    const setupData = JSON.parse(decryptedBody);
    const setupID= (setupData.setup_id).toString();
    const result: any = await updateDetailsAPI(
      M_updateDetail_t(setupID, setupData)
    );
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    //res.status(200).json(result.outBinds);
    res.status(200).json({
      success: true,
      data: [result.outBinds] // wrap in array if needed, based on frontend expectation
    });
    
   } catch (err: any) {
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    Resp_err_403(res, err.message);
  }
};


// export const createDetails = async (
//   req: I_customReq_BodyOfObject<T_setupDetails_t>,
//   res: Response,
// ) => {
  
//   try {
//     const result: any = await createDetailsAPI(M_create_details_t(req.body));
//     res.status(200).json(result.outBinds);
//   } catch (err: any) {
//     Resp_err_403(res, err.message);
//   }
// };

export const createDetails = async (
  req: Request,
  res: Response,
) => {
  const { ciphertext, iv } = req.body;
  if (!ciphertext || !iv) {
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    res.status(400).json({ error: "Missing ciphertext or IV" });
    return;
  }
  try {
    const decryptedBody = decryptBody(ciphertext, iv);
    const setupData = JSON.parse(decryptedBody);
    const result: any = await createDetailsAPI(M_create_details_t(setupData));
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    res.status(200).json(result.outBinds);
    console.log("result.outBinds", result.outBinds);
  } catch (err: any) {
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    Resp_err_403(res, err.message);
  }
};


export const SetupDetailsController = {
  getDetails,
  updateDetails,
  createDetails,
}
