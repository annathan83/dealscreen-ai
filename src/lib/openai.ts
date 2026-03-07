import OpenAI from "openai";
import { env } from "@/lib/config";

let cachedClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  if (cachedClient) return cachedClient;

  cachedClient = new OpenAI({
    apiKey: env.OPENAI_API_KEY
  });

  return cachedClient;
}

