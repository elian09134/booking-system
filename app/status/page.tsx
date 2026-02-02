'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FiSearch, FiArrowLeft, FiClock, FiCheckCircle, FiXCircle, FiLoader, FiCalendar, FiMapPin, FiTruck, FiUsers } from 'react-icons/fi'
import Navbar from '@/components/Navbar'
import StatusBadge from '@/components/StatusBadge'
import { Booking } from '@/lib/supabase'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

function StatusPageContent() {
    const searchParams = useSearchParams()
    const initialName = searchParams.get('name') || ''

    const [name, setName] = useState(initialName)
    const [searchName, setSearchName] = useState(initialName)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(!!initialName)

    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        approved: bookings.filter(b => b.status === 'approved').length,
        rejected: bookings.filter(b => b.status === 'rejected').length,
    }

    useEffect(() => {
        if (initialName) {
            fetchBookings(initialName)
        }
    }, [initialName])

    const fetchBookings = async (requesterName: string) => {
        setLoading(true)
        try {
            const response = await fetch(`/api/status?name=${encodeURIComponent(requesterName)}`)
            const data = await response.json()
            if (response.ok) {
                setBookings(data.bookings || [])
            }
        } catch (error) {
            console.error('Error fetching bookings:', error)
        } finally {
            setLoading(false)
            setSearched(true)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            setSearchName(name.trim())
            fetchBookings(name.trim())
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

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-8 transition-colors">
                        <FiArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Beranda</span>
                    </Link>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                            <span className="gradient-text">Cek Status Booking</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Masukkan nama Anda untuk melihat status booking
                        </p>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="glass-card p-6 mb-8">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field"
                                    placeholder="Masukkan nama pemohon..."
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? (
                                    <div className="spinner w-5 h-5"></div>
                                ) : (
                                    <FiSearch className="w-5 h-5" />
                                )}
                                <span className="hidden sm:inline">Cari</span>
                            </button>
                        </div>
                    </form>

                    {/* Results */}
                    {searched && (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 fade-in">
                                <div className="glass-card p-4 text-center">
                                    <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                        <FiLoader className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <p className="text-2xl font-bold text-blue-500">{stats.total}</p>
                                    <p className="text-xs text-gray-500">Total Request</p>
                                </div>
                                <div className="glass-card p-4 text-center">
                                    <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                        <FiClock className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <p className="text-2xl font-bold text-amber-500">{stats.pending}</p>
                                    <p className="text-xs text-gray-500">Pending</p>
                                </div>
                                <div className="glass-card p-4 text-center">
                                    <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <FiCheckCircle className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <p className="text-2xl font-bold text-emerald-500">{stats.approved}</p>
                                    <p className="text-xs text-gray-500">Approved</p>
                                </div>
                                <div className="glass-card p-4 text-center">
                                    <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-red-500/10 flex items-center justify-center">
                                        <FiXCircle className="w-5 h-5 text-red-500" />
                                    </div>
                                    <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
                                    <p className="text-xs text-gray-500">Rejected</p>
                                </div>
                            </div>

                            {/* Bookings List */}
                            {loading ? (
                                <div className="glass-card p-12 text-center">
                                    <div className="spinner mx-auto mb-4"></div>
                                    <p className="text-gray-500">Memuat data...</p>
                                </div>
                            ) : bookings.length > 0 ? (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold">
                                        Hasil untuk &quot;{searchName}&quot;
                                    </h2>
                                    {bookings.map((booking, index) => (
                                        <div
                                            key={booking.id}
                                            className="glass-card p-6 fade-in hover-card"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getItemGradient(booking.item_type)} flex items-center justify-center text-white shrink-0`}>
                                                    {getItemIcon(booking.item_type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                        <h3 className="font-bold">{booking.item_name}</h3>
                                                        <StatusBadge status={booking.status} />
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                        {booking.purpose}
                                                    </p>
                                                    {booking.destination && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                            <FiMapPin className="inline w-4 h-4 mr-1" />
                                                            Tujuan: {booking.destination}
                                                        </p>
                                                    )}
                                                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                                                        <span>
                                                            <FiCalendar className="inline w-3 h-3 mr-1" />
                                                            {formatDateTime(booking.start_datetime)} - {formatDateTime(booking.end_datetime)}
                                                        </span>
                                                        <span>Divisi: {booking.division}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-card p-12 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        <FiSearch className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">Tidak ada booking ditemukan</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        Tidak ada booking dengan nama &quot;{searchName}&quot;
                                    </p>
                                    <Link href="/booking" className="btn btn-primary">
                                        Buat Booking Baru
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </>
    )
}

export default function StatusPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        }>
            <StatusPageContent />
        </Suspense>
    )
}
