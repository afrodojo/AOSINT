import { BaseOSINTAdapter, AdapterConfig } from './baseAdapter';
import { IntelligenceFinding, TargetType } from '@aosint/core';

export class ShodanAdapter extends BaseOSINTAdapter {
  readonly name = 'shodan';
  readonly supportedTypes: TargetType[] = ['IP', 'DOMAIN'];
  private baseUrl = 'https://api.shodan.io';

  constructor(config: AdapterConfig) {
    super(config);
    if (!this.apiKey) {
      throw new Error('[ShodanAdapter] An API Key is required.');
    }
  }

  async run(target: string, targetType: TargetType): Promise<IntelligenceFinding[]> {
    if (!this.supportedTypes.includes(targetType)) {
      throw new Error(`[ShodanAdapter] Unsupported target type: ${targetType}`);
    }

    if (targetType === 'IP') {
      return this.lookupIp(target);
    } else {
      return this.lookupDomain(target);
    }
  }

  private async lookupIp(ip: string): Promise<IntelligenceFinding[]> {
    const url = `${this.baseUrl}/shodan/host/${encodeURIComponent(ip)}?key=${this.apiKey}`;
    const response = await this.fetchWithTimeout(url);

    if (response.status === 404) return []; // IP not indexed in Shodan
    if (!response.ok) {
      throw new Error(`[ShodanAdapter] HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const findings: IntelligenceFinding[] = [];

    // 1. Host Infrastructure Finding
    findings.push(
      this.createFinding(
        ip,
        'INFRASTRUCTURE',
        {
          org: data.org,
          isp: data.isp,
          asn: data.asn,
          country: data.country_name,
          openPorts: data.ports || [],
          hostnames: data.hostnames || [],
          os: data.os,
        },
        95
      )
    );

    // 2. Vulnerability Findings (if available)
    if (data.vulns && Array.isArray(data.vulns)) {
      findings.push(
        this.createFinding(
          ip,
          'VULNERABILITY',
          { cves: data.vulns, count: data.vulns.length },
          90
        )
      );
    }

    return findings;
  }

  private async lookupDomain(domain: string): Promise<IntelligenceFinding[]> {
    const url = `${this.baseUrl}/dns/domain/${encodeURIComponent(domain)}?key=${this.apiKey}`;
    const response = await this.fetchWithTimeout(url);

    if (response.status === 404) return [];
    if (!response.ok) {
      throw new Error(`[ShodanAdapter] HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    
    return [
      this.createFinding(
        domain,
        'SUBDOMAIN',
        {
          domain: data.domain,
          subdomains: data.subdomains?.map((sub: string) => `${sub}.${domain}`) || [],
          dnsRecords: data.data || [],
        },
        85
      ),
    ];
  }
}
