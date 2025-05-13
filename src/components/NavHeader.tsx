'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import ButtonAPIRequest from "./ButtonAPIRequest";

export default function NavHeader() {
    const pathname = usePathname();
    return (
        <>
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <Link href="/" className="-m-1.5 p-1.5 flex items-center justify-center gap-x-2">
                            <span className="text-gray-400">Made with</span>
                            <img className="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=blue&shade=400" alt="" />
                        </Link>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        <Button color="primary" variant="bordered">
                            <Link href="/" className="text-sm/6 font-semibold text-gray-200">Home</Link>
                        </Button>
                        <Button color="primary" variant="bordered">
                            <Link href="/protected" className="text-sm/6 font-semibold text-gray-200">Protected</Link>
                        </Button>
                        <Button color="primary" variant="bordered">
                            <Link href="/unprotected" className="text-sm/6 font-semibold text-gray-200">Unprotected</Link>
                        </Button>
                        <ButtonAPIRequest />
                    </div>

                    {
                        (pathname === "/login") ||
                        <div className="flex lg:flex-1 lg:justify-end z-50">
                            <Link href="/login" className="text-sm/6 font-semibold text-gray-200 cursor-pointer">Log in <span aria-hidden="true">&rarr;</span></Link>
                        </div>
                    }
                </nav>
            </header>
        </>
    )
}