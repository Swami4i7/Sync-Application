import { Request, Response } from "express";
import { I_customReq_BodyOfObject, I_customReq_Params, I_customReq_Params_BodyOfObject } from "../interfaces";
import { SearchParams, T_loginUser, T_ScheduleUsers_t, T_ScheduleUsersDelete, T_ScheduleUsersUpdate, T_UpdateUsersPayload } from "../types";
import { createUsersAPI, deleteUsersAPI, getUsersAPI, loginAPI, updateUsersAPI } from "../api/scheduler/header";
import { M_create_users_t, M_Delete_Users, M_login_users_t, M_updateUsers_t } from "../models";
import { Resp_err_403 } from "../middleware/util";
import request from "request";
import { decryptBody, encryptBody } from "../middleware/auth";

export const createUsers = async (
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
    const userData = JSON.parse(decryptedBody);
    const result: any = await createUsersAPI(M_create_users_t(userData));
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    res.status(200).json(result.outBinds);
  } catch (err: any) {
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    Resp_err_403(res, err.message);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const searchParams: SearchParams = {
      searchColumns: req.query.searchColumns
        ? (req.query.searchColumns as string).split(",")
        : undefined,
      searchTerm: req.query.searchTerm as string | undefined,
      sortColumn: req.query.sortColumn as string | undefined,
      sortOrder: req.query.sortOrder as "ASC" | "DESC" | undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset
        ? parseInt(req.query.offset as string)
        : undefined,
      primaryKey: req.query.primaryKey as string | undefined,
    };
    const response = await getUsersAPI(searchParams);
    const { ciphertext, iv } = encryptBody(JSON.stringify(response));
    const encryptedBody = JSON.stringify({ ciphertext, iv });
    console.log("encryptedBody", encryptedBody);
    res.status(response.success ? 200 : 400).json(encryptedBody);
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateUsers = async (
  req: Request,
  res: Response,
) => {
  console.log("req.body", req.body);
  const { ciphertext, iv } = req.body;
  if (!ciphertext || !iv) {
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    res.status(400).json({ error: "Missing ciphertext or IV" });
    return;
  }
  try {
    const decryptedBody = decryptBody(ciphertext, iv);
    const userData = JSON.parse(decryptedBody);
    console.log("userData", userData);
    console.log("userData.user_id", userData.USER_ID);
    const userID= (userData.user_id).toString();
    console.log("userID", userID);
    const result: any = await updateUsersAPI(
      M_updateUsers_t(userID, userData)
    );
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    res.status(200).json(result.outBinds);
  } catch (err: any) {
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    Resp_err_403(res, err.message);
  }
};

export const deleteUsers = async (
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
    const userData = JSON.parse(decryptedBody);
    console.log("userData", userData);
    const result: any = await deleteUsersAPI(M_Delete_Users(userData));
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    res.status(200).json(result.outBinds);
  } catch (err: any) {
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    Resp_err_403(res, err.message);
  }
};

export const loginUsers = async (
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
    const loginData = JSON.parse(decryptedBody);
    const result: any = await loginAPI(M_login_users_t(loginData));
    console.log('REsult: ', result)
    if (result.rows.length) {
      res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
      res.setHeader("X-Timestamp", res.locals.timestamp);
      res.status(200).json(result.rows);
    } else {
      res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
      res.setHeader("X-Timestamp", res.locals.timestamp);
      res.status(401).send({ message: "Invalid Credentials!!!" });
    }
  } catch (err: any) {
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    res.status(400).json({ error: "Invalid encrypted payload" });
    return;
  }
};

export const UserController = {
  createUsers,
  getUsers,
  updateUsers,
  deleteUsers,
  loginUsers,
}