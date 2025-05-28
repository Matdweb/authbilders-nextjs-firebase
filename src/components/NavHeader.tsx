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
import ButtonAPIRequest from './Buttons/ButtonAPIRequest'
import { AuthBildersLogo } from './AuthBildersLogo'

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
                    <AuthBildersLogo />
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
                            <Link href={link.href} className="w-full text-sm/6 text-left font-semibold text-gray-200 px-2">{link.label}</Link>
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
