import { z } from "zod";

export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;

export const applicationSchema = z.object({
  roleId: z.string().min(2, "Role is required"),
  name: z.string().min(2, "Name is required"),
  email: z.email("Enter a valid email"),
  phone: z.string().min(7, "Phone is required"),
  experienceYears: z.string().min(1, "Experience is required"),
  portfolioUrl: z.url("Enter a valid URL").or(z.literal("https://example.com")),
  coverLetter: z.string().min(20, "Tell us more in your cover letter"),
  website: z.string().max(0).default(""),
  city: z.string().optional(),
  linkedin: z.string().optional(),
  currentRole: z.string().optional(),
  currentCtc: z.string().optional(),
  expectedCtc: z.string().optional(),
  noticePeriod: z.string().optional(),
  skills: z.string().optional(),
  heardFrom: z.string().optional(),
  referralName: z.string().optional(),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
