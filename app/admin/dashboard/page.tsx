'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiHome, FiList, FiLogOut, FiLoader, FiClock, FiCheckCircle, FiXCircle, FiCalendar, FiUsers, FiMapPin, FiTruck, FiCheck, FiX } from 'react-icons/fi'
import StatusBadge from '@/components/StatusBadge'
import { Booking } from '@/lib/supabase'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

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

    const getItemIcon = (itemType: string) => {
        switch (itemType) {
            case 'meeting_room':
                return <FiUsers className="w-5 h-5" />
            case 'training_center':
                return <FiMapPin className="w-5 h-5" />
            case 'vehicle':
                return <FiTruck className="w-5 h-5" />
            default:
                return <FiCalendar className="w-5 h-5" />
        }
    }

    const getItemGradient = (itemType: string) => {
        switch (itemType) {
            case 'meeting_room':
                return 'from-blue-500 to-cyan-500'
            case 'training_center':
                return 'from-purple-500 to-pink-500'
            case 'vehicle':
                return 'from-orange-500 to-red-500'
            default:
                return 'from-gray-500 to-gray-600'
        }
    }

    const formatDateTime = (datetime: string) => {
        try {
            return format(new Date(datetime), 'dd MMM yyyy, HH:mm', { locale: id })
        } catch {
            return datetime
        }
    }

    const filteredBookings = filter === 'all'
        ? bookings
        : bookings.filter(b => b.status === filter)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-gray-400">Memuat dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 p-6 hidden lg:block">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <FiCalendar className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">Admin</span>
                </div>

                <nav className="space-y-2">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white">
                        <FiHome className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/admin/bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                        <FiList className="w-5 h-5" />
                        <span>Semua Booking</span>
                    </Link>
                </nav>

                <div className="absolute bottom-6 left-6 right-6">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full transition-colors">
                        <FiLogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 p-6 lg:p-8">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <FiCalendar className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">Admin</span>
                    </div>
                    <button onClick={handleLogout} className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                        <FiLogOut className="w-5 h-5" />
                    </button>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400">Kelola permintaan booking</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <FiLoader className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stats.total}</p>
                        <p className="text-sm text-gray-400">Total Request</p>
                    </div>
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                <FiClock className="w-6 h-6 text-amber-400" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stats.pending}</p>
                        <p className="text-sm text-gray-400">Pending</p>
                    </div>
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                <FiCheckCircle className="w-6 h-6 text-emerald-400" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stats.approved}</p>
                        <p className="text-sm text-gray-400">Approved</p>
                    </div>
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                                <FiXCircle className="w-6 h-6 text-red-400" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stats.rejected}</p>
                        <p className="text-sm text-gray-400">Rejected</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {(['pending', 'all', 'approved', 'rejected'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap ${filter === f
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {f === 'all' ? 'Semua' : f === 'pending' ? 'Pending' : f === 'approved' ? 'Approved' : 'Rejected'}
                            {f === 'pending' && stats.pending > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">
                                    {stats.pending}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                    {filteredBookings.length === 0 ? (
                        <div className="glass-card p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                <FiList className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-gray-400">Tidak ada booking dengan status ini</p>
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <div key={booking.id} className="glass-card p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                    {/* Item Info */}
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getItemGradient(booking.item_type)} flex items-center justify-center text-white shrink-0`}>
                                            {getItemIcon(booking.item_type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                <h3 className="font-bold text-slate-800">{booking.item_name}</h3>
                                                <StatusBadge status={booking.status} />
                                            </div>
                                            <p className="text-sm text-slate-600 mb-2">{booking.purpose}</p>
                                            {booking.destination && (
                                                <p className="text-sm text-slate-600 mb-2">
                                                    <FiMapPin className="inline w-4 h-4 mr-1" />
                                                    Tujuan: {booking.destination}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap gap-4 text-xs text-slate-700">
                                                <span>
                                                    <FiCalendar className="inline w-3 h-3 mr-1" />
                                                    {formatDateTime(booking.start_datetime)} - {formatDateTime(booking.end_datetime)}
                                                </span>
                                                <span className="font-medium">Pemohon: {booking.requester_name}</span>
                                                <span className="font-medium">Divisi: {booking.division}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {booking.status === 'pending' && (
                                        <div className="flex gap-2 shrink-0">
                                            <button
                                                onClick={() => handleAction(booking.id, 'approved')}
                                                disabled={actionLoading === booking.id}
                                                className="btn btn-success py-2 px-4"
                                            >
                                                {actionLoading === booking.id ? (
                                                    <div className="spinner w-4 h-4"></div>
                                                ) : (
                                                    <FiCheck className="w-4 h-4" />
                                                )}
                                                <span className="hidden sm:inline">Approve</span>
                                            </button>
                                            <button
                                                onClick={() => handleAction(booking.id, 'rejected')}
                                                disabled={actionLoading === booking.id}
                                                className="btn btn-danger py-2 px-4"
                                            >
                                                {actionLoading === booking.id ? (
                                                    <div className="spinner w-4 h-4"></div>
                                                ) : (
                                                    <FiX className="w-4 h-4" />
                                                )}
                                                <span className="hidden sm:inline">Reject</span>
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
