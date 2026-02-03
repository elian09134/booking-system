'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiCalendar, FiSearch, FiSettings } from 'react-icons/fi'

export default function Navbar() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                            <FiCalendar className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">BookingApp</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link
                            href="/"
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isActive('/')
                                    ? 'bg-indigo-500/10 text-indigo-600 font-semibold'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600'
                                }`}
                        >
                            <FiHome className="w-4 h-4" />
                            <span>Beranda</span>
                        </Link>
                        <Link
                            href="/booking"
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${pathname.startsWith('/booking')
                                    ? 'bg-indigo-500/10 text-indigo-600 font-semibold'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600'
                                }`}
                        >
                            <FiCalendar className="w-4 h-4" />
                            <span>Booking</span>
                        </Link>
                        <Link
                            href="/status"
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isActive('/status')
                                    ? 'bg-indigo-500/10 text-indigo-600 font-semibold'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600'
                                }`}
                        >
                            <FiSearch className="w-4 h-4" />
                            <span>Cek Status</span>
                        </Link>
                    </div>

                    {/* Admin Link */}
                    <Link
                        href="/admin/login"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    >
                        <FiSettings className="w-4 h-4" />
                        <span className="font-medium hidden sm:inline">Admin</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center justify-around py-2 border-t border-gray-200 dark:border-gray-700">
                <Link
                    href="/"
                    className={`flex flex-col items-center gap-1 px-4 py-1 ${isActive('/') ? 'text-blue-500' : 'text-gray-500'
                        }`}
                >
                    <FiHome className="w-5 h-5" />
                    <span className="text-xs">Beranda</span>
                </Link>
                <Link
                    href="/booking"
                    className={`flex flex-col items-center gap-1 px-4 py-1 ${pathname.startsWith('/booking') ? 'text-blue-500' : 'text-gray-500'
                        }`}
                >
                    <FiCalendar className="w-5 h-5" />
                    <span className="text-xs">Booking</span>
                </Link>
                <Link
                    href="/status"
                    className={`flex flex-col items-center gap-1 px-4 py-1 ${isActive('/status') ? 'text-blue-500' : 'text-gray-500'
                        }`}
                >
                    <FiSearch className="w-5 h-5" />
                    <span className="text-xs">Status</span>
                </Link>
            </div>
        </nav>
    )
}
