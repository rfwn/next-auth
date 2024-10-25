import { UserRole } from '@prisma/client';
import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().min(1, {
    message: "Email address is required."
  }).email(),
  password: z.string().min(1, {
    message: "Password is required."
  })
});

export const RegisterSchema = z.object({
  email: z.string().min(1, {
    message: "Email address is required"
  }).email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long."
  }),
  name: z.string().min(1, { message: "Name is required" })
    .max(20, { message: "Name must not exceed 20 characters" })
});


export const SettingsSchema = z.object({
  name: z.optional(z.string().min(1, { message: "Name is required" })
  .max(20, { message: "Name must not exceed 20 characters" })),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6))
}).refine((data) => {
  if(!data.password && data.newPassword) {
    return false;
  }
  return true;
}, {
  message: "Password is required",
  path: ["password"],
}).refine((data) => {
  if(data.password && !data.newPassword) {
    return false;
  }
  return true;
}, {
  message: "New password is required",
  path: ["newPassword"]
})