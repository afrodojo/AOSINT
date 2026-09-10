export * from './baseAdapter';
export * from './shodanAdapter';
export * from './hibpAdapter';

import { BaseOSINTAdapter } from './baseAdapter';
import { ShodanAdapter } from './shodanAdapter';
import { HIBPAdapter } from './hibpAdapter';

/**
 * Adapter Registry Factory for dynamic worker execution
 */
export class AdapterRegistry {
  private adapters: Map<string, BaseOSINTAdapter> = new Map();

  register(adapter: BaseOSINTAdapter): void {
    this.adapters.set(adapter.name, adapter);
  }

  get(name: string): BaseOSINTAdapter | undefined {
    return this.adapters.get(name);
  }

  getAdaptersForType(type: string): BaseOSINTAdapter[] {
    return Array.from(this.adapters.values()).filter((adapter) =>
      adapter.supportedTypes.includes(type as any)
    );
  }
}
