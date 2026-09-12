import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, { message: "Message cannot be empty." })
    .max(1000, { message: "Message exceeds maximum allowed length of 1000 characters." })
    .transform((str) => str.trim()),
  conversationId: z
    .string()
    .max(100)
    .optional()
    .default(() => `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(1000),
      })
    )
    .max(20, { message: "Conversation history exceeds limit of 20 items." })
    .optional()
    .default([]),
});

export const ttsRequestSchema = z.object({
  text: z
    .string()
    .min(1, { message: "Speech text cannot be empty." })
    .max(1200, { message: "Speech text exceeds maximum allowed length of 1200 characters." })
    .transform((str) => str.trim()),
});

export type ValidatedChatRequest = z.infer<typeof chatRequestSchema>;
export type ValidatedTTSRequest = z.infer<typeof ttsRequestSchema>;
