import { NextRequest, NextResponse } from "next/server";
import { preAggregators } from "../../../../../backend/aggregators";
import { whatsappTemplates } from "../../../../../backend/templates/whatsapp-templates";
import { defaultDispatcher } from "../../../../../backend/notifications/dispatcher";
import { openwaClient } from "../../../../../backend/notifications/openwa";
import {
  isReminderAlreadySent,
  markReminderAsSent,
  getSentRemindersCount,
} from "../../../../../backend/jobs/class-reminder-job";

export const runtime = "nodejs";

/**
 * OpenWA Class Reminders Automation Route
 * - Dispatches daily WhatsApp reminders to parents for classes on the specific day.
 * - Enforces idempotency to prevent duplicate messages and over-logging/event fatigue.
 *
 * Query Params / Body:
 * - `date`: Target date (defaults to today in IST, e.g. "Thu 12 Nov" or "2026-11-12")
 * - `force`: Set true to bypass deduplication cache (useful for testing)
 * - `studentId`: Filter to a specific student (e.g. "aarav")
 * - `dryRun`: Set true to preview rendered messages without sending
 */
async function handleClassReminders(
  targetDateParam?: string | null,
  forceParam?: boolean | string | null,
  studentIdParam?: string | null,
  dryRunParam?: boolean | string | null,
  statusOnlyParam?: boolean | string | null
) {
  const isForce = forceParam === true || forceParam === "true";
  const isDryRun = dryRunParam === true || dryRunParam === "true";
  const isStatusOnly = statusOnlyParam === true || statusOnlyParam === "true";

  // If status query only, return OpenWA gateway and cache metrics quietly
  if (isStatusOnly) {
    const sessionStatus = await openwaClient.getSessionStatus();
    return NextResponse.json({
      status: "ok",
      channel: "OPENWA",
      gateway: {
        isConfigured: openwaClient.isConfigured(),
        session: sessionStatus,
      },
      deduplicationCache: {
        totalCachedReminders: getSentRemindersCount(),
        rateLimitActive: true,
      },
      schedule: {
        frequency: "DAILY",
        scheduledTime: "09:00 AM IST",
        cronExpression: "0 9 * * *",
        timezone: "Asia/Kolkata",
      },
    });
  }

  // 1. Resolve eligible class reminder records
  const preAggResult = await preAggregators.classReminders(targetDateParam || undefined);
  let records = preAggResult.data;

  if (studentIdParam) {
    records = records.filter(
      (r) => r.studentId.toLowerCase() === studentIdParam.toLowerCase()
    );
  }

  const dispatchedDetails: Array<{
    studentId: string;
    studentName: string;
    phone: string;
    className: string;
    status: "SENT" | "SKIPPED_DUPLICATE" | "FAILED" | "DRY_RUN";
    messageId?: string;
  }> = [];

  let sentCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const record of records) {
    const alreadySent = isReminderAlreadySent(
      record.studentId,
      record.sessionId,
      record.classDate
    );

    // Prevent over-logging & redundant message spam
    if (alreadySent && !isForce) {
      skippedCount++;
      dispatchedDetails.push({
        studentId: record.studentId,
        studentName: record.studentName,
        phone: record.parentPhone,
        className: record.className,
        status: "SKIPPED_DUPLICATE",
      });
      continue;
    }

    if (isDryRun) {
      dispatchedDetails.push({
        studentId: record.studentId,
        studentName: record.studentName,
        phone: record.parentPhone,
        className: record.className,
        status: "DRY_RUN",
      });
      continue;
    }

    try {
      const wa = whatsappTemplates.classReminder(record);

      const result = await defaultDispatcher.sendWhatsApp({
        to: record.parentPhone,
        templateName: wa.templateName,
        fallbackText: wa.fallbackText,
        components: wa.components,
        metadata: {
          studentId: record.studentId,
          sessionId: record.sessionId,
          classDate: record.classDate,
          source: "OPENWA_DAILY_REMINDER_ROUTE",
        },
      });

      if (result.status === "FAILED") {
        failedCount++;
        dispatchedDetails.push({
          studentId: record.studentId,
          studentName: record.studentName,
          phone: record.parentPhone,
          className: record.className,
          status: "FAILED",
        });
      } else {
        markReminderAsSent(record.studentId, record.sessionId, record.classDate);
        sentCount++;
        dispatchedDetails.push({
          studentId: record.studentId,
          studentName: record.studentName,
          phone: record.parentPhone,
          className: record.className,
          status: "SENT",
          messageId: result.id,
        });
      }
    } catch {
      failedCount++;
      dispatchedDetails.push({
        studentId: record.studentId,
        studentName: record.studentName,
        phone: record.parentPhone,
        className: record.className,
        status: "FAILED",
      });
    }
  }

  // Prevent over-logging: emit a single clean summary log line only when work is performed
  if (sentCount > 0 || failedCount > 0) {
    console.info(
      `[OpenWA ClassReminder Route] Completed for date "${targetDateParam || "today"}": ${sentCount} sent, ${skippedCount} duplicate(s) skipped, ${failedCount} failed.`
    );
  }

  return NextResponse.json({
    success: true,
    automation: "OpenWA Daily Class Reminders",
    channel: "OPENWA",
    isOpenWAConfigured: openwaClient.isConfigured(),
    resolvedDate: preAggResult.metadata?.resolvedDateDisplay || targetDateParam || "today",
    summary: {
      totalEligible: records.length,
      dispatched: sentCount,
      skippedDuplicates: skippedCount,
      failed: failedCount,
      isDryRun,
    },
    results: dispatchedDetails,
    deduplicationActive: true,
    quietMode: true,
    executedAt: new Date().toISOString(),
  });
}

export async function GET(request: NextRequest) {
  // Optional security check if CRON_SECRET configured
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const targetDate = searchParams.get("date");
  const force = searchParams.get("force");
  const studentId = searchParams.get("studentId");
  const dryRun = searchParams.get("dryRun");
  const statusOnly = searchParams.get("status");

  return handleClassReminders(targetDate, force, studentId, dryRun, statusOnly);
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // Body is optional
  }

  const targetDate = (body.date as string) || request.nextUrl.searchParams.get("date");
  const force = body.force !== undefined ? Boolean(body.force) : request.nextUrl.searchParams.get("force");
  const studentId = (body.studentId as string) || request.nextUrl.searchParams.get("studentId");
  const dryRun = body.dryRun !== undefined ? Boolean(body.dryRun) : request.nextUrl.searchParams.get("dryRun");
  const statusOnly = body.status !== undefined ? Boolean(body.status) : request.nextUrl.searchParams.get("status");

  return handleClassReminders(targetDate, force, studentId, dryRun, statusOnly);
}

