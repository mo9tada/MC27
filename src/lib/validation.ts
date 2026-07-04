import * as z from "zod";

export const reservationSchema = z.object({
  name: z.string().trim().min(2, { error: "Le nom doit contenir au moins 2 caractères." }),
  email: z.email({ error: "Veuillez saisir une adresse e-mail valide." }).trim(),
  phone: z.string().trim().min(7, { error: "Veuillez saisir un numéro de téléphone valide." }),
  partySize: z.coerce.number().int().min(1).max(20),
  date: z.string().min(1, { error: "Veuillez choisir une date." }),
  time: z.string().min(1, { error: "Veuillez choisir une heure." }),
  notes: z.string().trim().max(500).optional(),
});

export const otpSchema = z.object({
  reservationId: z.string().min(1),
  code: z.string().trim().length(6, { error: "Saisissez le code à 6 chiffres." }),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, { error: "Le nom doit contenir au moins 2 caractères." }),
  email: z.email({ error: "Veuillez saisir une adresse e-mail valide." }).trim(),
  subject: z.string().trim().min(2, { error: "Veuillez ajouter un sujet." }),
  message: z.string().trim().min(5, { error: "Le message est trop court." }).max(2000),
});

export const wheelSchema = z.object({
  name: z.string().trim().min(2, { error: "Le nom doit contenir au moins 2 caractères." }),
  email: z.email({ error: "Veuillez saisir une adresse e-mail valide." }).trim(),
});

export const eventSchema = z.object({
  title: z.string().trim().min(2, { error: "Le titre est obligatoire." }).max(120),
  description: z.string().trim().min(5, { error: "La description est trop courte." }).max(4000),
  date: z.string().min(1, { error: "Veuillez choisir une date et une heure." }),
  location: z.string().trim().max(160).optional(),
  price: z.string().trim().max(60).optional(),
  capacity: z.number().int().min(1).max(100000).nullable().optional(),
  imageUrl: z.string().trim().max(2000).optional(),
  published: z.boolean().optional(),
});

export const rsvpSchema = z.object({
  eventId: z.string().min(1),
  name: z.string().trim().min(2, { error: "Le nom doit contenir au moins 2 caractères." }),
  email: z.email({ error: "Veuillez saisir une adresse e-mail valide." }).trim(),
});

export const prizeSchema = z.object({
  label: z.string().trim().min(1, { error: "Le libellé est obligatoire." }).max(40),
  weight: z.coerce.number({ error: "Le poids doit être un nombre." }).int().min(0).max(1000),
  color: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{6})$/, { error: "La couleur doit être une valeur hexadécimale comme #163b66." }),
  order: z.coerce.number().int().min(0).max(999),
});
