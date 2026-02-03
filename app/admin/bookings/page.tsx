'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiHome, FiList, FiLogOut, FiCalendar, FiTruck, FiCheck, FiX, FiTrash2, FiFilter, FiSearch } from 'react-icons/fi'
import StatusBadge from '@/components/StatusBadge'
import AdminSidebar from '@/components/AdminSidebar'
import { Booking } from '@/lib/supabase'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export default function AdminBookingsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        const admin = localStorage.getItem('admin')
        if (!admin) {
            router.push('/admin/login')
            return
        }
        fetchBookings()
    }, [router, statusFilter])

    const fetchBookings = async () => {
        setLoading(true)
        try {
            let url = '/api/bookings?'
            if (statusFilter) url += `status=${statusFilter}&`
            // Assuming we only have vehicles now, no need to filter by type unless legacy data

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

    const formatDateTime = (datetime: string) => {
        try {
            return format(new Date(datetime), 'dd MMM yyyy, HH:mm', { locale: idLocale })
        } catch {
            return datetime
        }
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
                        <Link href="/admin/dashboard">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                                <FiCalendar className="w-5 h-5 text-white" />
                            </div>
                        </Link>
                        <span className="text-xl font-bold text-gray-900">Bookings</span>
                    </div>
                    <button onClick={handleLogout} className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
                        <FiLogOut className="w-5 h-5" />
                    </button>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Semua Booking</h1>
                    <p className="text-gray-500 text-sm">Daftar lengkap permintaan peminjaman</p>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <FiFilter className="w-5 h-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        {/* Search could go here in future */}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="spinner w-8 h-8 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
                            <p className="text-gray-500">Memuat data...</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                                <FiList className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500">Tidak ada booking ditemukan</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Peminjam</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Waktu</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                                        <FiTruck className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{booking.item_name}</p>
                                                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{booking.purpose}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-gray-900 font-medium">{booking.requester_name}</p>
                                                <p className="text-xs text-gray-500">{booking.division}</p>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm text-gray-600">
                                                    <p>{formatDateTime(booking.start_datetime)}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">s/d {formatDateTime(booking.end_datetime)}</p>
                                                </div>
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
                                                                className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                                                title="Approve"
                                                            >
                                                                <FiCheck className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction(booking.id, 'rejected')}
                                                                disabled={actionLoading === booking.id}
                                                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                                title="Reject"
                                                            >
                                                                <FiX className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(booking.id)}
                                                        disabled={actionLoading === booking.id}
                                                        className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
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
