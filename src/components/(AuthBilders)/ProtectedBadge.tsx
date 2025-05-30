import { LockedPadlockIcon } from "./icons";

export function ProtectedBadge() {
  return (
    <div className="mb-8 flex justify-center">
        <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-300 ring-2 ring-blue-500/30 hover:ring-blue-500/50">
            <div className="font-semibold text-primary-400 flex items-center gap-x-1">
                <span className="absolute inset-0" aria-hidden="true"></span>
                <span>Protected</span>
                <LockedPadlockIcon />
            </div>
        </div>
    </div>
  );
} 