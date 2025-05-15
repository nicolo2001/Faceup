import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z.string()
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(254, 'Email cannot exceed 254 characters'),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password cannot exceed 72 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  userType: z.enum(['creator', 'actor', '']),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),
  privacyAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the privacy policy'
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const verifyOtpSchema = z.object({
  code: z.string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d+$/, 'Verification code must contain only numbers'),
});

export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(254, 'Email cannot exceed 254 characters'),
  password: z.string()
    .min(1, 'Password is required'),
  captchaToken: z.string().optional()
});