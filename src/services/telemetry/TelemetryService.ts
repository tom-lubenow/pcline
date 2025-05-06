import * as vscode from "vscode"
import { version as extensionVersion } from "../../../package.json"

import type { TaskFeedbackType } from "@shared/WebviewMessage"
import type { BrowserSettings } from "@shared/BrowserSettings"

/**
 * PCline TelemetryService - stub implementation that disables all telemetry
 * This replaces the original PostHog-based telemetry implementation
 */
class TelemetryService {
	private static instance: TelemetryService
	private readonly version: string = extensionVersion

	private constructor() {
		// No initialization needed
	}

	public updateTelemetryState(didUserOptIn: boolean): void {
		// Always disabled in PCline
	}

	public static getInstance(): TelemetryService {
		if (!TelemetryService.instance) {
			TelemetryService.instance = new TelemetryService()
		}
		return TelemetryService.instance
	}

	// Stub implementations that maintain the same signature as the original
	public capture(event: { event: string; properties?: any }): void {}
	public captureTaskCreated(taskId: string, apiProvider?: string): void {}
	public captureTaskRestarted(taskId: string, apiProvider?: string): void {}
	public captureTaskCompleted(taskId: string): void {}
	public captureConversationTurnEvent(
		taskId: string,
		provider: string = "unknown",
		model: string = "unknown",
		source: "user" | "assistant",
	): void {}
	public captureTokenUsage(taskId: string, tokensIn: number, tokensOut: number, model: string): void {}
	public captureModeSwitch(taskId: string, mode: "plan" | "act"): void {}
	public captureTaskFeedback(taskId: string, feedbackType: TaskFeedbackType): void {}
	public captureToolUsage(taskId: string, tool: string, autoApproved: boolean, success: boolean): void {}
	public captureCheckpointUsage(
		taskId: string,
		action: "shadow_git_initialized" | "commit_created" | "restored" | "diff_generated",
		durationMs?: number,
	): void {}
	public captureProviderSwitch(from: string, to: string, location: "settings" | "bottom", taskId?: string): void {}
	public captureImageAttached(taskId: string, imageCount: number): void {}
	public captureButtonClick(button: string, taskId?: string): void {}
	public captureMarketplaceOpened(taskId?: string): void {}
	public captureSettingsOpened(taskId?: string): void {}
	public captureHistoryOpened(taskId?: string): void {}
	public captureTaskPopped(taskId: string): void {}
	public captureDiffEditFailure(taskId: string, errorType?: string): void {}
	public captureModelSelected(model: string, provider: string, taskId?: string): void {}
	public captureHistoricalTaskLoaded(taskId: string): void {}
	public captureRetryClicked(taskId: string): void {}
	public captureBrowserToolStart(taskId: string, browserSettings: BrowserSettings): void {}
	public captureBrowserToolEnd(
		taskId: string,
		stats: {
			actionCount: number
			duration: number
			actions?: string[]
		},
	): void {}
	public captureBrowserError(
		taskId: string,
		errorType: string,
		errorMessage: string,
		context?: {
			action?: string
			url?: string
			isRemote?: boolean
			[key: string]: any
		},
	): void {}
	public captureOptionSelected(taskId: string, qty: number, mode: "plan" | "act"): void {}
	public captureOptionsIgnored(taskId: string, qty: number, mode: "plan" | "act"): void {}
	public captureModelFavoritesUsage(model: string, isFavorited: boolean): void {}

	public isTelemetryEnabled(): boolean {
		return false
	}

	public async shutdown(): Promise<void> {
		// No cleanup needed
	}
}

export const telemetryService = TelemetryService.getInstance()
