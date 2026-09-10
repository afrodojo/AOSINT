import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Queue } from 'bullmq';
import { AssessmentJob, TargetType } from '@aosint/core';

// Redis connection settings matching worker setup
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
};

// Instantiate BullMQ Queue
export const assessmentQueue = new Queue<AssessmentJob>('osint-assessments', { connection });

interface CreateAssessmentBody {
  target: string;
  targetType: TargetType;
  options?: {
    adapters?: string[];
    priority?: number;
  };
}

export async function assessmentRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/v1/assessments
   * Enqueues a new OSINT collection task
   */
  fastify.post<{ Body: CreateAssessmentBody }>(
    '/assessments',
    {
      schema: {
        body: {
          type: 'object',
          required: ['target', 'targetType'],
          properties: {
            target: { type: 'string', minLength: 1 },
            targetType: { 
              type: 'string', 
              enum: ['DOMAIN', 'IP', 'USER', 'EMAIL', 'URL', 'HASH'] 
            },
            options: {
              type: 'object',
              properties: {
                adapters: { type: 'array', items: { type: 'string' } },
                priority: { type: 'number', minimum: 1, maximum: 5 },
              },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: CreateAssessmentBody }>, reply: FastifyReply) => {
      const { target, targetType, options } = request.body;
      const jobId = `job_${crypto.randomUUID()}`;

      const jobData: AssessmentJob = {
        jobId,
        target,
        targetType,
        status: 'QUEUED',
        progress: 0,
        options,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Push job to Redis BullMQ Queue
      await assessmentQueue.add('run-assessment', jobData, {
        jobId,
        priority: options?.priority || 3,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      });

      return reply.status(202).send({
        success: true,
        message: 'Assessment job successfully queued.',
        jobId,
        status: 'QUEUED',
      });
    }
  );

  /**
   * GET /api/v1/assessments/:jobId
   * Retrieves current status and progress of a job
   */
  fastify.get<{ Params: { jobId: string } }>(
    '/assessments/:jobId',
    async (request, reply) => {
      const { jobId } = request.params;
      const job = await assessmentQueue.getJob(jobId);

      if (!job) {
        return reply.status(404).send({
          success: false,
          error: `Job with ID "${jobId}" was not found.`,
        });
      }

      const state = await job.getState();
      const progress = job.progress;
      const result = job.returnvalue;

      return reply.send({
        jobId: job.id,
        status: state.toUpperCase(),
        progress,
        createdAt: job.timestamp,
        data: job.data,
        result: result || null,
        failedReason: job.failedReason || null,
      });
    }
  );
}
