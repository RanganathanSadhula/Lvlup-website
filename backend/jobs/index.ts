import type { CronEngine } from "../cron/engine";
import type { JobDefinition } from "../cron/types";
import { abandonedCartJob } from "./abandoned-cart-job";
import { installmentDueJob } from "./installment-due-job";
import { enrollmentSuccessJob } from "./enrollment-success-job";
import { paymentFailureJob } from "./payment-failure-job";
import { refundStatusJob } from "./refund-status-job";
import { weeklyEvaluationJob } from "./weekly-evaluation-job";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const allJobs: JobDefinition<any>[] = [
  abandonedCartJob,
  installmentDueJob,
  enrollmentSuccessJob,
  paymentFailureJob,
  refundStatusJob,
  weeklyEvaluationJob,
];

export function registerAllJobs(engine: CronEngine): void {
  for (const job of allJobs) {
    engine.registerJob(job);
  }
}

export {
  abandonedCartJob,
  installmentDueJob,
  enrollmentSuccessJob,
  paymentFailureJob,
  refundStatusJob,
  weeklyEvaluationJob,
};
