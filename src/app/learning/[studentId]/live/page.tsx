import { redirect } from "next/navigation";

export default async function LiveClassRedirect({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  redirect(`/learning/${studentId}?tab=live`);
}

