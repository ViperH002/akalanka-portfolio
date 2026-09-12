import { logger } from "@/lib/logger";
import { generateSpeechAudio, sanitizeTextForSpeech } from "@/lib/tts/elevenlabs";

export class TtsService {
  /**
   * Generates vocal audio buffer from ElevenLabs or in-memory cache
   */
  async synthesizeSpeech(rawText: string): Promise<Buffer | null> {
    const cleanText = sanitizeTextForSpeech(rawText);

    if (!cleanText) {
      logger.warn("TTS synthesis requested with empty or invalid text", {
        subsystem: "tts",
      });
      return null;
    }

    logger.debug("Synthesizing voice audio", {
      subsystem: "tts",
      data: { textLength: cleanText.length },
    });

    const buffer = await generateSpeechAudio(cleanText);

    if (!buffer) {
      logger.warn("Audio synthesis returned null (offline or unconfigured)", {
        subsystem: "tts",
      });
      return null;
    }

    return buffer;
  }
}

export const ttsService = new TtsService();
