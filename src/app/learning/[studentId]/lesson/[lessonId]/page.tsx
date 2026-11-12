import { redirect } from "next/navigation";

export default async function LessonRedirect({
  params,
}: {
  params: Promise<{ studentId: string; lessonId: string }>;
}) {
  const { studentId, lessonId } = await params;
  redirect(`/learning/${studentId}?view=lesson&lessonId=${lessonId}`);
}

