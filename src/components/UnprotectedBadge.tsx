import { UnlockedPadlockIcon } from "./icons";

export function UnprotectedBadge() {
  return (
    <div className="mb-8 flex justify-center">
        <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-300 ring-2 ring-red-500/30 hover:ring-red-500/50">
            <div className="font-semibold text-red-400 flex items-center gap-x-1">
                <span className="absolute inset-0" aria-hidden="true"></span>
                <span>Unprotected</span>
                <UnlockedPadlockIcon />
            </div>
        </div>
      </div>
  );
} 