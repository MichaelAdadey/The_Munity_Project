export function AuthDivider() {
  return (
    <div className="flex items-center py-2">
      <div className="h-px flex-1 border-t border-munity-input-border/50" />
      <span className="px-4 text-xs font-medium uppercase tracking-[0.6px] text-munity-gray">
        or
      </span>
      <div className="h-px flex-1 border-t border-munity-input-border/50" />
    </div>
  );
}
