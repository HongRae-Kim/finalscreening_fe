import { redirect } from "next/navigation";

export default async function GamePage({
  params,
}: {
  params: { game: string };
}) {
  const { game } = await params;
  return redirect(`/${game}/find`);
}
