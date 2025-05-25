import { Link } from "@heroui/react";

export function AuthBildersLogo() {
    return (
        <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-white">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center font-bold">
                    AB
                </div>
                <span className="font-bold hidden sm:block text-xl">AuthBuilders</span>
            </Link>
        </div>
    );
} 