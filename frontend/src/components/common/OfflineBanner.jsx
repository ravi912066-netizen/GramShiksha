import React from "react";
import { WifiOff } from "lucide-react";
import useOnlineStatus from "../../hooks/useOnlineStatus";

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="alert"
      className="bg-amber-600 text-white px-4 py-2 text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md animate-in slide-in-from-top-1"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>
        You are currently offline. GramShiksha is running from cached files. Some online video streams and actions may be unavailable until your connection is restored.
      </span>
    </div>
  );
}
