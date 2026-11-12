import { redirect } from "next/navigation";

export default async function QuizRedirect({
  params,
}: {
  params: Promise<{ studentId: string; quizId: string }>;
}) {
  const { studentId, quizId } = await params;
  redirect(`/learning/${studentId}?view=quiz&quizId=${quizId}`);
}

