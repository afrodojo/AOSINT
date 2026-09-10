export class AOSINTError extends Error {
  constructor(message: string, public code: string, public statusCode: number = 500) {
    super(message);
    this.name = 'AOSINTError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AdapterExecutionError extends AOSINTError {
  constructor(adapterName: string, reason: string) {
    super(`[Adapter Error: ${adapterName}] ${reason}`, 'ADAPTER_EXECUTION_FAILED', 502);
  }
}

export class InvalidTargetError extends AOSINTError {
  constructor(target: string, expectedType: string) {
    super(`Target "${target}" is invalid for expected type "${expectedType}".`, 'INVALID_TARGET', 400);
  }
}

export class RateLimitError extends AOSINTError {
  constructor(source: string) {
    super(`Rate limit exceeded for provider: ${source}.`, 'RATE_LIMIT_EXCEEDED', 429);
  }
}
