import { logger } from "@/lib/logger";
import {
  generateChatResponse,
  ChatMessageInput,
  GenerateChatResponseOptions,
} from "@/lib/ai/chatbot";

export class AiService {
  /**
   * Generates grounded portfolio AI response with prompt injection defense and redaction
   */
  async generateReply(options: GenerateChatResponseOptions): Promise<string> {
    logger.debug("Generating AI chat response", {
      subsystem: "ai",
      data: {
        messageLength: options.message?.length || 0,
        historyCount: options.history?.length || 0,
      },
    });

    try {
      const reply = await generateChatResponse(options);
      return reply;
    } catch (error) {
      logger.error("AI service failure during reply generation", {
        subsystem: "ai",
        error,
      });
      throw error;
    }
  }
}

export const aiService = new AiService();
export type { ChatMessageInput, GenerateChatResponseOptions };
