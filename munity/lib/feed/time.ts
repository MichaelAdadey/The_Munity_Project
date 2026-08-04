export const formatRelativeTime = (iso: string, now = Date.now()): string => {
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return "";

    const seconds = Math.max(0, Math.floor((now - then) / 1000));
    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 60) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (hours < 60) return `${days}d ago`;

    return new Date(iso).toLocaleDateString();
}