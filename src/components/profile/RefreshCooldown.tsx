export function RefreshCooldown({
  cooldownLeftMs,
}: {
  cooldownLeftMs: number;
}) {
  return (
    <span className="text-content-secondary text-sm">
      {Math.ceil(cooldownLeftMs / 1000)}초 후 가능
    </span>
  );
}
