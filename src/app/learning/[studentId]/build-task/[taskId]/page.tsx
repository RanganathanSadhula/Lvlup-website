import { redirect } from "next/navigation";

export default async function BuildTaskRedirect({
  params,
}: {
  params: Promise<{ studentId: string; taskId: string }>;
}) {
  const { studentId, taskId } = await params;
  redirect(`/learning/${studentId}?view=build-task&taskId=${taskId}`);
}

