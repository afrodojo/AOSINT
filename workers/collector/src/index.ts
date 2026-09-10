import { Worker, Job } from 'bullmq';
import { AssessmentJob, IntelligenceFinding, TargetType } from '@aosint/core';
import { AdapterRegistry } from '@aosint/adapters';

// 1. Initialize AdapterRegistry with environment keys
const registry = AdapterRegistry.createWithDefaults({
  shodanApiKey: process.env.SHODAN_API_KEY,
  hibpApiKey: process.env.HIBP_API_KEY,
});

console.log(`[Worker] Loaded adapters: ${registry.getRegisteredNames().join(', ') || 'None'}`);

// Redis Connection Settings
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
};

/**
 * BullMQ Job Processor
 */
async function processAssessmentJob(job: Job<AssessmentJob>): Promise<{ jobId: string; count: number; findings: IntelligenceFinding[] }> {
  const { jobId, target, targetType, options } = job.data;
  console.log(`[+] [Job ${jobId}] Starting OSINT assessment for target: "${target}" (${targetType})`);

  await job.updateProgress(10);

  // 2. Select adapters dynamically
  let activeAdapters = registry.getAdaptersForType(targetType as TargetType);

  // If specific adapters were requested in options, filter down to them
  if (options?.adapters && options.adapters.length > 0) {
    activeAdapters = activeAdapters.filter((adapter) => options.adapters!.includes(adapter.name));
  }

  if (activeAdapters.length === 0) {
    console.warn(`[-] [Job ${jobId}] No matching active adapters found for target type: ${targetType}`);
    await job.updateProgress(100);
    return { jobId, count: 0, findings: [] };
  }

  console.log(`[*] [Job ${jobId}] Executing adapters: ${activeAdapters.map((a) => a.name).join(', ')}`);

  // 3. Run adapters concurrently
  const adapterPromises = activeAdapters.map(async (adapter) => {
    try {
      const findings = await adapter.run(target, targetType as TargetType);
      
      // Attach jobId to each finding
      return findings.map((f) => ({ ...f, jobId }));
    } catch (error) {
      console.error(`[!] [Job ${jobId}] Adapter execution failed (${adapter.name}):`, error);
      return []; // Return empty findings array on error so other adapters complete
    }
  });

  const results = await Promise.all(adapterPromises);
  await job.updateProgress(80);

  // 4. Flatten and aggregate findings
  const aggregatedFindings: IntelligenceFinding[] = results.flat();

  console.log(`[✔] [Job ${jobId}] Completed. Collected ${aggregatedFindings.length} findings.`);
  await job.updateProgress(100);

  return {
    jobId,
    count: aggregatedFindings.length,
    findings: aggregatedFindings,
  };
}

// 5. Instantiate BullMQ Worker
export const worker = new Worker<AssessmentJob>('osint-assessments', processAssessmentJob, {
  connection,
  concurrency: parseInt(process.env.WORKER_CONCURRENCY || '5', 10),
});

// Event Listeners for telemetry & debugging
worker.on('completed', (job) => {
  console.log(`[Job ${job.id}] Successfully processed.`);
});

worker.on('failed', (job, err) => {
  console.error(`[Job ${job?.id}] Failed with error: ${err.message}`);
});

worker.on('error', (err) => {
  console.error('[Worker Error]', err);
});
