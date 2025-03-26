// PCline: Stub for telemetry service - does nothing

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
