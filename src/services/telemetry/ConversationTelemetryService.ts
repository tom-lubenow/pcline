// PCline: Stub for conversation telemetry service - does nothing

import { ClineProvider } from "../../core/webview/ClineProvider";

export type TelemetryChatMessage = {
	role: "user" | "assistant" | "system"
	ts: number
	content: any
}

export class ConversationTelemetryService {
  constructor(provider: ClineProvider) {
    // Empty constructor - no initialization needed
  }

  public isOptedInToConversationTelemetry(): boolean {
    // Always return false to ensure no data collection
    return false;
  }

  public async captureMessage(taskId: string, message: TelemetryChatMessage, metadata: any): Promise<void> {
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
