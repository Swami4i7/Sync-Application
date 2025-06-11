import { z } from "zod";

export const UserSchema = z.object({
  USER_ID: z.number(),
  USER_NAME: z.string(),
  PASSWORD: z.string(),
  ROLE: z.string(),
  CREATED_BY: z.string().optional(),
  CREATION_DATE: z.date().optional(),
  LAST_UPDATED_BY: z.string().optional(),
  LAST_UPDATE_DATE: z.date().optional(),
});

export const UsersPayloadSchema = z.object({
  USER_ID: z.string(),
});

export const UsersUpdateSchema = z.object({
  USER_NAME: z.string().min(3, "Username must be at least 3 characters").max(50, "Username must be less than 50 characters"),
  PASSWORD: z.string().min(6,"Password must be at least 6 characters").max(100, "Password must be less than 100 characters").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)"
  ),
  ROLE: z.string().min(1, "Role is required"),
  CREATED_BY: z.string().optional(),
  CREATION_DATE: z.date().optional(),
  LAST_UPDATED_BY: z.string().optional(),
  LAST_UPDATE_DATE: z.date().optional(),
});


export const UsersDeleteSchema = z.object({
  USER_ID: z.string(),
});

export const loginUserSchema = z.object({
  USER_NAME: z
    .string()
    .min(1, { message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be less than 20 characters" }),
  PASSWORD: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),
});

export type UserSchema = z.infer<typeof UserSchema>;
export type UsersPayload = z.infer<typeof UsersPayloadSchema>;
export type UsersUpdate = z.infer<typeof UsersUpdateSchema>;
export type UsersDelete = z.infer<typeof UsersDeleteSchema>;
export type loginUser = z.infer<typeof loginUserSchema>;
