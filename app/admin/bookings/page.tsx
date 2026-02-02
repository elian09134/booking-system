'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiHome, FiList, FiLogOut, FiCalendar, FiUsers, FiMapPin, FiTruck, FiCheck, FiX, FiTrash2, FiFilter } from 'react-icons/fi'
import StatusBadge from '@/components/StatusBadge'
import AdminSidebar from '@/components/AdminSidebar'
import { Booking } from '@/lib/supabase'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function AdminBookingsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [typeFilter, setTypeFilter] = useState<string>('')
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        const admin = localStorage.getItem('admin')
        if (!admin) {
            router.push('/admin/login')
            return
        }
        fetchBookings()
    }, [router, statusFilter, typeFilter])

    const fetchBookings = async () => {
        setLoading(true)
        try {
            let url = '/api/bookings?'
            if (statusFilter) url += `status=${statusFilter}&`
            if (typeFilter) url += `item_type=${typeFilter}&`

            const response = await fetch(url)
            const data = await response.json()
            if (response.ok) {
                setBookings(data.bookings || [])
            }
        } catch (error) {
            console.error('Error fetching bookings:', error)
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
                fetchBookings()
            }
        } catch (error) {
            console.error('Error updating booking:', error)
        } finally {
            setActionLoading(null)
        }
    }

    const handleDelete = async (bookingId: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus booking ini?')) return

        setActionLoading(bookingId)
        try {
            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                fetchBookings()
            }
        } catch (error) {
            console.error('Error deleting booking:', error)
        } finally {
            setActionLoading(null)
        }
    }

    const getItemIcon = (itemType: string) => {
        switch (itemType) {
            case 'meeting_room':
                return <FiUsers className="w-4 h-4" />
            case 'training_center':
                return <FiMapPin className="w-4 h-4" />
            case 'vehicle':
                return <FiTruck className="w-4 h-4" />
            default:
                return <FiCalendar className="w-4 h-4" />
        }
    }

    const formatDateTime = (datetime: string) => {
        try {
            return format(new Date(datetime), 'dd MMM yyyy, HH:mm', { locale: id })
        } catch {
            return datetime
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="lg:ml-64 p-6 lg:p-8">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/dashboard">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <FiCalendar className="w-5 h-5 text-white" />
                            </div>
                        </Link>
                        <span className="text-xl font-bold text-white">Bookings</span>
                    </div>
                    <button onClick={handleLogout} className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                        <FiLogOut className="w-5 h-5" />
                    </button>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Semua Booking</h1>
                    <p className="text-gray-400">Daftar lengkap semua permintaan booking</p>
                </div>

                {/* Filters */}
                <div className="glass-card p-4 mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <FiFilter className="w-5 h-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input-field w-auto"
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="input-field w-auto"
                        >
                            <option value="">Semua Tipe</option>
                            <option value="meeting_room">Ruang Meeting</option>
                            <option value="training_center">Training Center</option>
                            <option value="vehicle">Kendaraan</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="glass-card overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="spinner mx-auto mb-4"></div>
                            <p className="text-gray-400">Memuat data...</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="p-12 text-center">
                            <FiList className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                            <p className="text-gray-400">Tidak ada booking ditemukan</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Item</th>
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Pemohon</th>
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Waktu</th>
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                                        <th className="text-left p-4 text-sm font-medium text-gray-400">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-gray-400">
                                                        {getItemIcon(booking.item_type)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800">{booking.item_name}</p>
                                                        <p className="text-xs text-slate-600 truncate max-w-[200px]">{booking.purpose}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-slate-800 font-medium">{booking.requester_name}</p>
                                                <p className="text-xs text-slate-600">{booking.division}</p>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-sm text-slate-700">{formatDateTime(booking.start_datetime)}</p>
                                                <p className="text-xs text-slate-600">s/d {formatDateTime(booking.end_datetime)}</p>
                                            </td>
                                            <td className="p-4">
                                                <StatusBadge status={booking.status} />
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    {booking.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleAction(booking.id, 'approved')}
                                                                disabled={actionLoading === booking.id}
                                                                className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                                                title="Approve"
                                                            >
                                                                <FiCheck className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction(booking.id, 'rejected')}
                                                                disabled={actionLoading === booking.id}
                                                                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                                                title="Reject"
                                                            >
                                                                <FiX className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(booking.id)}
                                                        disabled={actionLoading === booking.id}
                                                        className="p-2 rounded-lg bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
