// packages/osint-adapters/src/index.ts
export * from './baseAdapter';
export * from './shodanAdapter';
export * from './hibpAdapter';

import { BaseOSINTAdapter } from './baseAdapter';
import { ShodanAdapter } from './shodanAdapter';
import { HIBPAdapter } from './hibpAdapter';
import { TargetType } from '@aosint/core';

export class AdapterRegistry {
  private adapters: Map<string, BaseOSINTAdapter> = new Map();

  register(adapter: BaseOSINTAdapter): this {
    this.adapters.set(adapter.name, adapter);
    return this;
  }

  get(name: string): BaseOSINTAdapter | undefined {
    return this.adapters.get(name);
  }

  getAdaptersForType(type: TargetType): BaseOSINTAdapter[] {
    return Array.from(this.adapters.values()).filter((adapter) =>
      adapter.supportedTypes.includes(type)
    );
  }

  getRegisteredNames(): string[] {
    return Array.from(this.adapters.keys());
  }

  static createWithDefaults(envKeys: { shodanApiKey?: string; hibpApiKey?: string }): AdapterRegistry {
    const registry = new AdapterRegistry();

    // Only instantiate if non-placeholder key is provided
    if (envKeys.shodanApiKey && !envKeys.shodanApiKey.includes('your_')) {
      registry.register(new ShodanAdapter({ apiKey: envKeys.shodanApiKey }));
    }

    if (envKeys.hibpApiKey && !envKeys.hibpApiKey.includes('your_')) {
      registry.register(new HIBPAdapter({ apiKey: envKeys.hibpApiKey }));
    }

    return registry;
  }
}
