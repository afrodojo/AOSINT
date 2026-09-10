import { IntelligenceFinding, TargetType } from '@aosint/core';

export interface AdapterConfig {
  apiKey?: string;
  timeoutMs?: number;
}

export abstract class BaseOSINTAdapter {
  abstract readonly name: string;
  abstract readonly supportedTypes: TargetType[];
  protected apiKey?: string;
  protected timeoutMs: number;

  constructor(config: AdapterConfig = {}) {
    this.apiKey = config.apiKey;
    this.timeoutMs = config.timeoutMs || 15000;
  }

  /**
   * Main execution method to be overridden by individual tools.
   */
  abstract run(target: string, targetType: TargetType): Promise<IntelligenceFinding[]>;

  /**
   * Helper to format findings consistently across adapters.
   */
  protected createFinding(
    target: string,
    entityType: IntelligenceFinding['entityType'],
    rawPayload: Record<string, unknown>,
    confidenceScore: number
  ): IntelligenceFinding {
    return {
      id: crypto.randomUUID(),
      source: this.name,
      entityType,
      target,
      data: rawPayload,
      confidence: Math.min(100, Math.max(0, confidenceScore)),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Safe fetch with configurable timeout.
   */
  protected async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(id);
    }
  }
}
