'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { FiHome, FiList, FiTruck, FiLogOut, FiCalendar } from 'react-icons/fi'

export default function AdminSidebar() {
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' })
            localStorage.removeItem('admin')
            router.push('/admin/login')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const isActive = (path: string) => pathname === path

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-6 hidden lg:block z-50">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <FiCalendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Admin</span>
            </div>

            <nav className="space-y-2">
                <Link
                    href="/admin/dashboard"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/dashboard')
                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                >
                    <FiHome className="w-5 h-5" />
                    <span>Dashboard</span>
                </Link>
                <Link
                    href="/admin/bookings"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/bookings')
                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                >
                    <FiList className="w-5 h-5" />
                    <span>Semua Booking</span>
                </Link>
                <Link
                    href="/admin/vehicles"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/vehicles')
                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                >
                    <FiTruck className="w-5 h-5" />
                    <span>Aset Kendaraan</span>
                </Link>
            </nav>

            <div className="absolute bottom-6 left-6 right-6">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full transition-colors"
                >
                    <FiLogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    )
}
