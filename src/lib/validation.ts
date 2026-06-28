import * as z from "zod";

export const reservationSchema = z.object({
  name: z.string().trim().min(2, { error: "Name must be at least 2 characters." }),
  email: z.email({ error: "Please enter a valid email." }).trim(),
  phone: z.string().trim().min(7, { error: "Please enter a valid phone number." }),
  partySize: z.coerce.number().int().min(1).max(20),
  date: z.string().min(1, { error: "Please choose a date." }),
  time: z.string().min(1, { error: "Please choose a time." }),
  notes: z.string().trim().max(500).optional(),
});

export const otpSchema = z.object({
  reservationId: z.string().min(1),
  code: z.string().trim().length(6, { error: "Enter the 6-digit code." }),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, { error: "Name must be at least 2 characters." }),
  email: z.email({ error: "Please enter a valid email." }).trim(),
  subject: z.string().trim().min(2, { error: "Please add a subject." }),
  message: z.string().trim().min(5, { error: "Message is too short." }).max(2000),
});

export const wheelSchema = z.object({
  name: z.string().trim().min(2, { error: "Name must be at least 2 characters." }),
  email: z.email({ error: "Please enter a valid email." }).trim(),
});

export const eventSchema = z.object({
  title: z.string().trim().min(2, { error: "Title is required." }).max(120),
  description: z.string().trim().min(5, { error: "Description is too short." }).max(4000),
  date: z.string().min(1, { error: "Please choose a date and time." }),
  location: z.string().trim().max(160).optional(),
  price: z.string().trim().max(60).optional(),
  capacity: z.number().int().min(1).max(100000).nullable().optional(),
  imageUrl: z.string().trim().max(2000).optional(),
  published: z.boolean().optional(),
});

export const rsvpSchema = z.object({
  eventId: z.string().min(1),
  name: z.string().trim().min(2, { error: "Name must be at least 2 characters." }),
  email: z.email({ error: "Please enter a valid email." }).trim(),
});

export const prizeSchema = z.object({
  label: z.string().trim().min(1, { error: "Label is required." }).max(40),
  weight: z.coerce.number({ error: "Weight must be a number." }).int().min(0).max(1000),
  color: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{6})$/, { error: "Color must be a hex value like #163b66." }),
  order: z.coerce.number().int().min(0).max(999),
});
