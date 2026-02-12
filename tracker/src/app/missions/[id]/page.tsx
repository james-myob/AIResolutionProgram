import { SEED_MISSIONS } from "@/lib/seed";
import MissionDetail from "@/components/MissionDetail";

export function generateStaticParams() {
  return SEED_MISSIONS.map((m) => ({ id: m.id }));
}

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MissionDetail id={id} />;
}
