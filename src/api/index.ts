import { ApiConfiguration, ModelInfo } from "../shared/api"
import { ApiStream, ApiStreamUsageChunk } from "./transform/stream"
import { LiteLlmHandler } from "./providers/litellm"

// Define our own message types instead of relying on Anthropic SDK
export interface MessageContent {
  type: string;
  text?: string;
  source?: string;
  [key: string]: any;
}

export interface MessageParam {
  role: string;
  content: string | MessageContent[];
  [key: string]: any;
}

export interface ApiHandler {
  createMessage(systemPrompt: string, messages: MessageParam[]): ApiStream
  getModel(): { id: string; info: ModelInfo }
  getApiStreamUsage?(): Promise<ApiStreamUsageChunk | undefined>
}

export interface SingleCompletionHandler {
  completePrompt(prompt: string): Promise<string>
}

export function buildApiHandler(configuration: ApiConfiguration): ApiHandler {
  const { apiProvider, ...options } = configuration
  
  // Always return LiteLLM regardless of setting
  return new LiteLlmHandler(options)
}
