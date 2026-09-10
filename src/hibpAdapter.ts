import { BaseOSINTAdapter, AdapterConfig } from './baseAdapter';
import { IntelligenceFinding, TargetType } from '@aosint/core';

export class HIBPAdapter extends BaseOSINTAdapter {
  readonly name = 'haveibeenpwned';
  readonly supportedTypes: TargetType[] = ['EMAIL', 'DOMAIN'];
  private baseUrl = 'https://haveibeenpwned.com/api/v3';

  constructor(config: AdapterConfig) {
    super(config);
    if (!this.apiKey) {
      throw new Error('[HIBPAdapter] An hibp-api-key is required.');
    }
  }

  async run(target: string, targetType: TargetType): Promise<IntelligenceFinding[]> {
    if (!this.supportedTypes.includes(targetType)) {
      throw new Error(`[HIBPAdapter] Unsupported target type: ${targetType}`);
    }

    if (targetType === 'EMAIL') {
      return this.checkEmail(target);
    } else {
      return this.checkDomainBreaches(target);
    }
  }

  private async checkEmail(email: string): Promise<IntelligenceFinding[]> {
    const url = `${this.baseUrl}/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`;
    
    const response = await this.fetchWithTimeout(url, {
      headers: {
        'hibp-api-key': this.apiKey!,
        'user-agent': 'AOSINT-Assessment-Platform',
      },
    });

    if (response.status === 404) return []; // Clean target (no breaches)
    if (response.status === 429) {
      throw new Error('[HIBPAdapter] Rate limit exceeded. Backoff required.');
    }
    if (!response.ok) {
      throw new Error(`[HIBPAdapter] HTTP ${response.status}: ${await response.text()}`);
    }

    const breaches = await response.json();

    return breaches.map((breach: Record<string, unknown>) =>
      this.createFinding(
        email,
        'BREACH',
        {
          title: breach.Title,
          domain: breach.Domain,
          breachDate: breach.BreachDate,
          pwnCount: breach.PwnCount,
          dataClasses: breach.DataClasses,
          isVerified: breach.IsVerified,
        },
        100 // High confidence - verified breach data
      )
    );
  }

  private async checkDomainBreaches(domain: string): Promise<IntelligenceFinding[]> {
    // Note: HIBP Domain Search endpoint requires subscription tier credentials
    const url = `${this.baseUrl}/breacheddomain/${encodeURIComponent(domain)}`;

    const response = await this.fetchWithTimeout(url, {
      headers: {
        'hibp-api-key': this.apiKey!,
        'user-agent': 'AOSINT-Assessment-Platform',
      },
    });

    if (response.status === 404) return [];
    if (!response.ok) {
      throw new Error(`[HIBPAdapter] HTTP ${response.status}: ${await response.text()}`);
    }

    const domainBreaches = await response.json();

    return [
      this.createFinding(
        domain,
        'BREACH',
        {
          affectedAccounts: domainBreaches,
          summaryCount: Object.keys(domainBreaches).length,
        },
        95
      ),
    ];
  }
}
