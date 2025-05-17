'use client'

import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Button,
    Link as HeroLink
} from '@heroui/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import ButtonAPIRequest from './ButtonAPIRequest'
import Image from 'next/image'

export default function NavHeader() {
    const pathname = usePathname()
    const [menuOpen, setMenuOpen] = useState(false)

    const links = [
        { href: '/', label: 'Home' },
        { href: '/protected', label: 'Protected' },
        { href: '/unprotected', label: 'Unprotected' }
    ]

    const isAuthPage = pathname === '/login'

    return (
        <Navbar
            className={`pt-2 pl-2 pr-4 lg:px-8 text-gray-200 z-50 font-medium ${!(menuOpen) && 'bg-transparent'}`}
            onMenuOpenChange={setMenuOpen}
            maxWidth='full'
        >
            {/* Mobile toggle + brand */}
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    className="lg:hidden text-gray-300"
                />
                <NavbarBrand>
                    <Link href="/" className="flex items-center gap-x-2">
                        <span className="text-gray-400">Made with</span>
                        <Image
                            width={32}
                            height={32}
                            className="h-8 w-auto"
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=blue&shade=400"
                            alt="Tailwind logo"
                        />
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            {/* Desktop links */}
            <NavbarContent className="hidden lg:flex gap-x-12" justify="center">
                {links.map(link => (
                    <NavbarItem key={link.href}>
                        <Button color="primary" variant="bordered">
                            <Link href={link.href} className="text-sm/6 font-semibold text-gray-200 px-2">{link.label}</Link>
                        </Button>
                    </NavbarItem>
                ))}
                <NavbarItem>
                    <ButtonAPIRequest />
                </NavbarItem>
            </NavbarContent>

            {/* CTA buttons */}
            <NavbarContent justify="end">
                {!isAuthPage && (
                    <NavbarItem>
                        <HeroLink as={Link} href="/login" className="text-gray-300 hover:text-primary font-semibold">
                            Login →
                        </HeroLink>
                    </NavbarItem>
                )}
            </NavbarContent>

            {/* Mobile menu */}
            <NavbarMenu>
                {links.map((link) => (
                    <NavbarItem key={link.href}>
                        <Button color="primary" variant="bordered" className='w-full justify-start'>
                            <Link href={link.href} className="text-sm/6 text-left font-semibold text-gray-200 px-2">{link.label}</Link>
                        </Button>
                    </NavbarItem>
                ))}
                <NavbarMenuItem>
                    <ButtonAPIRequest className='relative w-full justify-start' />
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    )
}
