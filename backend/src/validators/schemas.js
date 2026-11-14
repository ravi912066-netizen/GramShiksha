const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters long"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Invalid email address format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long"),
  role: z
    .enum(["STUDENT", "ADMIN"], {
      errorMap: () => ({ message: "Role must be either STUDENT or ADMIN" }),
    })
    .optional(),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Invalid email address format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

const courseCreateSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(3, "Title must be at least 3 characters long"),
  description: z
    .string({ required_error: "Description is required" })
    .trim()
    .min(5, "Description must be at least 5 characters long"),
  subject: z
    .string({ required_error: "Subject is required" })
    .trim()
    .min(2, "Subject must be at least 2 characters long"),
});

const courseUpdateSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").optional(),
    description: z.string().trim().min(5, "Description must be at least 5 characters").optional(),
    subject: z.string().trim().min(2, "Subject must be at least 2 characters").optional(),
  })
  .refine(
    (data) => data.title || data.description || data.subject,
    "At least one field (title, description, or subject) is required to update"
  );

const lessonCreateSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(2, "Lesson title must be at least 2 characters long"),
  description: z.string().trim().optional().nullable(),
  type: z.enum(["VIDEO", "PDF", "NOTE"], {
    errorMap: () => ({ message: "Lesson type must be VIDEO, PDF, or NOTE" }),
  }),
  contentUrl: z.string().trim().optional().nullable(),
});

const progressSchema = z.object({
  completed: z.boolean().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  courseCreateSchema,
  courseUpdateSchema,
  lessonCreateSchema,
  progressSchema,
};