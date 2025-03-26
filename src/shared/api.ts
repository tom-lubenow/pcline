export type ApiProvider = "litellm"

export interface ApiHandlerOptions {
  apiModelId?: string
  liteLlmBaseUrl?: string
  liteLlmModelId?: string
  liteLlmApiKey?: string
}

export type ApiConfiguration = ApiHandlerOptions & {
  apiProvider?: ApiProvider
}

// Models
export interface ModelInfo {
  maxTokens?: number
  contextWindow?: number
  supportsImages?: boolean
  supportsComputerUse?: boolean
  supportsPromptCache: boolean
  inputPrice?: number
  outputPrice?: number
  cacheWritesPrice?: number
  cacheReadsPrice?: number
  description?: string
}

// LiteLLM
export type LiteLLMModelId = string
export const liteLlmDefaultModelId = "gpt-3.5-turbo"
export const liteLlmModelInfoSaneDefaults: ModelInfo = {
  maxTokens: -1,
  contextWindow: 128_000,
  supportsImages: true,
  supportsPromptCache: false,
  inputPrice: 0,
  outputPrice: 0,
}
