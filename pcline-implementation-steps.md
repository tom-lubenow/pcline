# PCline Implementation Steps

This document provides step-by-step instructions for implementing the PCline fork, focusing on removing telemetry, eliminating external connections, and limiting the API provider to LiteLLM only.

## 1. Telemetry Removal

### Replace Telemetry Services with Stubs

The telemetry services need to be replaced with no-op implementations that maintain the same API but don't collect or transmit any data.

#### TelemetryService

```typescript
// src/services/telemetry/TelemetryService.ts
// Replace with:

class TelemetryService {
  // Empty constructor
  constructor() {}

  // Methods that do nothing but maintain compatibility
  public updateTelemetryState(isEnabled: boolean): void {}
  public captureTaskCreated(taskId: string, apiProvider?: string) {}
  public captureTaskRestarted(taskId: string, apiProvider?: string) {}
  public captureTaskCompleted(taskId: string) {}
  public captureConversationTurnEvent(taskId: string, provider: string = "unknown", model: string = "unknown", source: "user" | "assistant") {}
  public captureTokenUsage(taskId: string, tokensIn: number, tokensOut: number, model: string) {}
  public captureModeSwitch(taskId: string, mode: "plan" | "act") {}
  public captureToolUsage(taskId: string, tool: string, autoApproved: boolean, success: boolean) {}
  public captureCheckpointUsage(taskId: string, action: string, durationMs?: number) {}
  public captureProviderSwitch(from: string, to: string, location: "settings" | "bottom", taskId?: string) {}
  public captureImageAttached(taskId: string, imageCount: number) {}
  public captureButtonClick(button: string, taskId?: string) {}
  public captureMarketplaceOpened(taskId?: string) {}
  public captureSettingsOpened(taskId?: string) {}
  public captureHistoryOpened(taskId?: string) {}
  public captureTaskPopped(taskId: string) {}
  public captureModelSelected(model: string, provider: string, taskId?: string) {}
  public captureHistoricalTaskLoaded(taskId: string) {}
  public captureRetryClicked(taskId: string) {}
  public isTelemetryEnabled(): boolean { return false; }
  public shutdown(): Promise<void> { return Promise.resolve(); }
}

// Export a singleton instance
export const telemetryService = new TelemetryService();
```

#### ConversationTelemetryService

```typescript
// src/services/telemetry/ConversationTelemetryService.ts
// Replace with:

export class ConversationTelemetryService {
  constructor(provider: any) {
    // Empty constructor - no initialization needed
  }

  public isOptedInToConversationTelemetry(): boolean {
    // Always return false to ensure no data collection
    return false;
  }

  public async captureMessage(taskId: string, message: any, metadata: any): Promise<void> {
    // Do nothing - telemetry disabled
    return Promise.resolve();
  }

  public async cleanupTask(taskId: string, conversationData: any): Promise<void> {
    // Do nothing - telemetry disabled
    return Promise.resolve();
  }

  public async shutdown(): Promise<void> {
    // Do nothing - telemetry disabled
    return Promise.resolve();
  }
}
```

### Remove Telemetry UI Components

Remove the UI elements that allow enabling/disabling telemetry as they're no longer needed.

- Search and remove telemetry-related UI components in the webview code

## 2. External Connection Removal

### Modify Content Security Policy

Update the Content Security Policy in `src/core/webview/ClineProvider.ts` to remove permissions for external connections:

```typescript
// Find the current CSP policy that looks like:
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src https://*.posthog.com https://*.firebaseauth.com https://*.firebaseio.com https://*.googleapis.com https://*.firebase.com; font-src ${webview.cspSource}; style-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} https: data:; script-src 'nonce-${nonce}' 'unsafe-eval';">

// Replace with:
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src ${webview.cspSource}; style-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} data:; script-src 'nonce-${nonce}' 'unsafe-eval';">
```

### Remove Authentication Features

Modify the extension.ts file to remove URI handlers for authentication and account features:

```typescript
// In src/extension.ts, find the handleUri function and simplify it:

const handleUri = async (uri: vscode.Uri) => {
  console.log("URI Handler called with:", {
    path: uri.path,
    query: uri.query,
    scheme: uri.scheme,
  });

  const path = uri.path;
  const query = new URLSearchParams(uri.query.replace(/\+/g, "%2B"));
  const visibleProvider = ClineProvider.getVisibleInstance();
  if (!visibleProvider) {
    return;
  }
  switch (path) {
    // Remove all external auth handlers as they aren't needed
    default:
      break;
  }
}
```

### Remove Marketplace Integration

Replace any marketplace API calls with empty stubs:

```typescript
// In ClineProvider.ts, find marketplace methods like fetchMcpMarketplaceFromApi
// and replace with stub implementations that don't make external requests
```

## 3. API Provider Simplification

### Update API Provider List

Modify `src/shared/api.ts` to only include LiteLLM as a provider:

```typescript
// Replace the extensive list of providers with:
export type ApiProvider = "litellm"

// Keep only LiteLLM-related interfaces and types
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

// Keep only LiteLLM model info
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
```

### Simplify API Handler Factory

Update `src/api/index.ts` to only return the LiteLLM handler:

```typescript
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
  // Ignore all other provider settings, always return LiteLLM
  return new LiteLlmHandler(configuration)
}
```

## 4. UI Updates and Branding

### Update Extension Name and Branding

Modify extension naming in package.json and other files:

```json
// In package.json
{
  "name": "pcline",
  "displayName": "PCline",
  "description": "Private Cline - Enhanced privacy extension for AI-assisted coding",
  // ... other properties
}
```

### Update Documentation URLs

Replace external documentation links with internal ones:

```typescript
// In extension.ts, find:
context.subscriptions.push(
  vscode.commands.registerCommand("cline.openDocumentation", () => {
    vscode.env.openExternal(vscode.Uri.parse("https://docs.cline.bot"))
  })
)

// Replace with:
context.subscriptions.push(
  vscode.commands.registerCommand("cline.openDocumentation", () => {
    vscode.env.openExternal(vscode.Uri.parse("YOUR_INTERNAL_DOCUMENTATION_URL"))
  })
)
```

## 5. Final Verification Steps

After implementing all changes, perform the following verification:

1. **Monitor Network Connections**:
   - Use a network monitoring tool to verify no external connections are made to telemetry services
   - Ensure only authorized LiteLLM connections are established

2. **Verify API Flow**:
   - Test the extension with LiteLLM provider
   - Confirm all functionality works as expected

3. **Security Audit**:
   - Perform a final code review focusing on remaining external connections
   - Check for any overlooked telemetry or logging that might transmit data

4. **Update Documentation**:
   - Finalize all documentation with installation and usage instructions
   - Include security verification steps for user confidence
