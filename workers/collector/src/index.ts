import { Worker } from 'bullmq';
import { ShodanAdapter } from '@aosint/adapters/shodan';

const redisConfig = { host: process.env.REDIS_HOST || 'localhost', port: 6379 };

const assessmentWorker = new Worker(
  'osint-assessments',
  async (job) => {
    const { jobId, target, type } = job.data;
    console.log(`[+] Processing Assessment ${jobId} for target: ${target}`);

    // Example adapter execution
    const shodan = new ShodanAdapter(process.env.SHODAN_API_KEY!);
    const findings = await shodan.run(target);

    // TODO: Save findings to Database (PostgreSQL / Elastic)
    return { jobId, count: findings.length, findings };
  },
  { connection: redisConfig }
);
