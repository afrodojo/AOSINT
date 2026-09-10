export * from './baseAdapter';
export * from './shodanAdapter';
export * from './hibpAdapter';

import { BaseOSINTAdapter } from './baseAdapter';
import { ShodanAdapter } from './shodanAdapter';
import { HIBPAdapter } from './hibpAdapter';
import { TargetType } from '@aosint/core';

/**
 * Adapter Registry Factory for dynamic worker execution
 */
export class AdapterRegistry {
  private adapters: Map<string, BaseOSINTAdapter> = new Map();

  /**
   * Register a single adapter instance
   */
  register(adapter: BaseOSINTAdapter): this {
    this.adapters.set(adapter.name, adapter);
    return this; // Allows method chaining
  }

  /**
   * Retrieve an adapter by name (e.g., 'shodan', 'haveibeenpwned')
   */
  get(name: string): BaseOSINTAdapter | undefined {
    return this.adapters.get(name);
  }

  /**
   * Get all registered adapters that support a specific target type
   */
  getAdaptersForType(type: TargetType): BaseOSINTAdapter[] {
    return Array.from(this.adapters.values()).filter((adapter) =>
      adapter.supportedTypes.includes(type)
    );
  }

  /**
   * Returns a list of all registered adapter names
   */
  getRegisteredNames(): string[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Factory helper to instantiate and register all default platform adapters
   */
  static createWithDefaults(envKeys: { shodanApiKey?: string; hibpApiKey?: string }): AdapterRegistry {
    const registry = new AdapterRegistry();

    if (envKeys.shodanApiKey) {
      registry.register(new ShodanAdapter({ apiKey: envKeys.shodanApiKey }));
    }

    if (envKeys.hibpApiKey) {
      registry.register(new HIBPAdapter({ apiKey: envKeys.hibpApiKey }));
    }

    return registry;
  }
}
