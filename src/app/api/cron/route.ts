import { NextResponse } from "next/server";
import { getScheduler } from "../../../../backend/cron/scheduler";
import { defaultDispatcher } from "../../../../backend/notifications/dispatcher";

export const runtime = "nodejs";

/**
 * GET /api/cron
 * Returns health report, registered jobs, metrics, and outbox notification logs.
 */
export async function GET() {
  const scheduler = getScheduler();
  const health = scheduler.getHealth();
  const jobs = scheduler.getAllJobs().map((j) => ({
    id: j.id,
    name: j.name,
    description: j.description,
    trigger: j.trigger,
    status: scheduler.getJobStatus(j.id),
  }));

  const emailOutbox = defaultDispatcher.getEmailOutbox().slice(0, 10);
  const whatsAppOutbox = defaultDispatcher.getWhatsAppOutbox().slice(0, 10);

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    health,
    jobs,
    recentNotifications: {
      totalEmailsSent: emailOutbox.length,
      totalWhatsAppSent: whatsAppOutbox.length,
      emails: emailOutbox.map((e) => ({
        id: e.id,
        to: e.to,
        subject: e.subject,
        sentAt: e.sentAt,
      })),
      whatsApp: whatsAppOutbox.map((w) => ({
        id: w.id,
        to: w.to,
        template: w.templateName,
        sentAt: w.sentAt,
      })),
    },
  });
}

/**
 * POST /api/cron
 * Allows manual or webhook-triggered execution of a specific cron job.
 * Body: { "jobId": "job.abandoned_cart_recovery" } or { "runAll": true }
 */
export async function POST(request: Request) {
  // Optional security check
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { jobId?: string; runAll?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const scheduler = getScheduler();

  if (body.runAll) {
    const jobs = scheduler.getAllJobs();
    const results = [];
    for (const job of jobs) {
      try {
        const log = await scheduler.runJobNow(job.id);
        results.push({ jobId: job.id, status: "SUCCESS", log });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        results.push({ jobId: job.id, status: "FAILED", error: message });
      }
    }
    return NextResponse.json({ status: "success", executedJobsCount: results.length, results });
  }

  const { jobId } = body;
  if (!jobId) {
    return NextResponse.json({ error: "Missing required 'jobId' or 'runAll' in request body" }, { status: 422 });
  }

  const job = scheduler.getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: `Job with id '${jobId}' not found` }, { status: 404 });
  }

  try {
    const log = await scheduler.runJobNow(jobId);
    return NextResponse.json({
      status: "success",
      jobId,
      executionLog: log,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ status: "error", jobId, error: message }, { status: 500 });
  }
}
