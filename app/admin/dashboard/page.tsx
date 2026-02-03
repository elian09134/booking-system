'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiHome, FiList, FiLogOut, FiLoader, FiClock, FiCheckCircle, FiXCircle, FiCalendar, FiMapPin, FiTruck, FiCheck, FiX } from 'react-icons/fi'
import StatusBadge from '@/components/StatusBadge'
import AdminSidebar from '@/components/AdminSidebar'
import { Booking } from '@/lib/supabase'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface Stats {
    total: number
    pending: number
    approved: number
    rejected: number
}

export default function AdminDashboardPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 })
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        const admin = localStorage.getItem('admin')
        if (!admin) {
            router.push('/admin/login')
            return
        }
        fetchData()
    }, [router])

    const fetchData = async () => {
        try {
            // Fetch stats
            const statsRes = await fetch('/api/admin/stats')
            const statsData = await statsRes.json()
            if (statsRes.ok) {
                setStats(statsData.stats)
            }

            // Fetch bookings
            const bookingsRes = await fetch('/api/bookings')
            const bookingsData = await bookingsRes.json()
            if (bookingsRes.ok) {
                setBookings(bookingsData.bookings || [])
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' })
        localStorage.removeItem('admin')
        router.push('/admin/login')
    }

    const handleAction = async (bookingId: string, status: 'approved' | 'rejected') => {
        setActionLoading(bookingId)
        try {
            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            })

            if (response.ok) {
                fetchData()
            }
        } catch (error) {
            console.error('Error updating booking:', error)
        } finally {
            setActionLoading(null)
        }
    }

    const formatDateTime = (datetime: string) => {
        try {
            return format(new Date(datetime), 'dd MMM yyyy, HH:mm', { locale: idLocale })
        } catch {
            return datetime
        }
    }

    const filteredBookings = filter === 'all'
        ? bookings
        : bookings.filter(b => b.status === filter)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="spinner w-8 h-8 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-500">Memuat dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="lg:ml-64 p-6 lg:p-8">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                            <FiCalendar className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Admin</span>
                    </div>
                    <button onClick={handleLogout} className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
                        <FiLogOut className="w-5 h-5" />
                    </button>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
                    <p className="text-gray-500 text-sm">Overview permintaan booking</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                                <FiLoader className="w-5 h-5 text-indigo-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</p>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                <FiClock className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-1">{stats.pending}</p>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-1">{stats.approved}</p>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Approved</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                                <FiXCircle className="w-5 h-5 text-red-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-1">{stats.rejected}</p>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Rejected</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {(['pending', 'all', 'approved', 'rejected'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap border ${filter === f
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {f === 'all' ? 'Semua' : f === 'pending' ? 'Pending' : f === 'approved' ? 'Approved' : 'Rejected'}
                            {f === 'pending' && stats.pending > 0 && (
                                <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-full ${filter === f ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                                    {stats.pending}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                    {filteredBookings.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                                <FiList className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500">Tidak ada booking dengan status ini</p>
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <div key={booking.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                    {/* Item Info */}
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                            <FiTruck className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                <h3 className="font-bold text-gray-900">{booking.item_name}</h3>
                                                <StatusBadge status={booking.status} />
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{booking.purpose}</p>
                                            {booking.destination && (
                                                <p className="text-sm text-gray-600 mb-2 flex items-center gap-1.5">
                                                    <FiMapPin className="w-4 h-4 text-gray-400" />
                                                    Tujuan: <span className="font-medium text-gray-800">{booking.destination}</span>
                                                </p>
                                            )}
                                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                                                <span className="flex items-center gap-1.5">
                                                    <FiCalendar className="w-3.5 h-3.5" />
                                                    {formatDateTime(booking.start_datetime)} - {formatDateTime(booking.end_datetime)}
                                                </span>
                                                <span className="font-medium">Oleh: {booking.requester_name}</span>
                                                <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600">{booking.division}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {booking.status === 'pending' && (
                                        <div className="flex gap-2 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 mt-2 lg:mt-0">
                                            <button
                                                onClick={() => handleAction(booking.id, 'approved')}
                                                disabled={actionLoading === booking.id}
                                                className="btn bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 py-2 px-4 shadow-sm"
                                            >
                                                {actionLoading === booking.id ? (
                                                    <div className="spinner w-4 h-4 border-emerald-600 border-t-transparent"></div>
                                                ) : (
                                                    <FiCheck className="w-4 h-4" />
                                                )}
                                                <span className="hidden sm:inline font-medium">Approve</span>
                                            </button>
                                            <button
                                                onClick={() => handleAction(booking.id, 'rejected')}
                                                disabled={actionLoading === booking.id}
                                                className="btn bg-white text-red-600 hover:bg-red-50 border border-red-200 py-2 px-4 shadow-sm"
                                            >
                                                {actionLoading === booking.id ? (
                                                    <div className="spinner w-4 h-4 border-red-600 border-t-transparent"></div>
                                                ) : (
                                                    <FiX className="w-4 h-4" />
                                                )}
                                                <span className="hidden sm:inline font-medium">Reject</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}
