/**
 * Strict Runtime Zod Schemas for API Requests and Data Contracts
 * Enforces contract boundary integrity, input size limits, and provides clean error reporting.
 */

import { z } from "zod";

/**
 * Validation schema for POST /api/analyze
 */
export const AnalyzeRequestSchema = z.object({
  text: z
    .string({
      error: "Contract text is required.",
    })
    .min(20, "Contract text is too short. Minimum 20 characters required for legal analysis.")
    .max(65000, "Contract text exceeds maximum allowable limit of 65,000 characters."),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

/**
 * Validation schema for POST /api/chat
 */
export const ChatRequestSchema = z.object({
  contractText: z
    .string({
      error: "No contract context found. Contract context is required to ground answers.",
    })
    .min(20, "Contract context is required to ground answers."),
  query: z
    .string({
      error: "Question query is required.",
    })
    .min(1, "Please provide a valid question.")
    .max(5000, "Question query exceeds 5,000 characters limit."),
  history: z
    .array(
      z.object({
        role: z.string(),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
  stream: z.boolean().optional().default(false),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

/**
 * Validation schema for POST /api/compare
 */
export const CompareRequestSchema = z.object({
  docA: z
    .string({
      error: "Document A text is required.",
    })
    .min(20, "Document A must contain at least 20 characters.")
    .max(65000, "Document A exceeds 65,000 characters limit."),
  docB: z
    .string({
      error: "Document B text is required.",
    })
    .min(20, "Document B must contain at least 20 characters.")
    .max(65000, "Document B exceeds 65,000 characters limit."),
});

export type CompareRequest = z.infer<typeof CompareRequestSchema>;

/**
 * Validation schema for POST /api/negotiate
 */
export const NegotiateRequestSchema = z.object({
  clauseTitle: z
    .string({
      error: "Clause title is required.",
    })
    .min(2, "Clause title must have at least 2 characters.")
    .max(200, "Clause title cannot exceed 200 characters."),
  originalSnippet: z
    .string({
      error: "Original clause text is required.",
    })
    .min(10, "Original clause text must have at least 10 characters.")
    .max(10000, "Original clause text cannot exceed 10,000 characters."),
  stance: z
    .enum(["Balanced", "Protective"], {
      error: "Stance must be either 'Balanced' or 'Protective'.",
    })
    .optional()
    .default("Balanced"),
});

export type NegotiateRequest = z.infer<typeof NegotiateRequestSchema>;

/**
 * Formats Zod validation errors into a clean, human-readable string
 */
export function formatZodError(error: z.ZodError): string {
  const issues = error?.issues || (error as unknown as { errors?: Array<{ message: string }> })?.errors || [];
  if (issues.length > 0) {
    return issues.map((e) => e.message).join(" ");
  }
  return error.message || "Invalid request payload";
}

