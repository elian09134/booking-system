'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiUsers, FiMapPin, FiTruck, FiArrowRight, FiClock, FiCheckCircle, FiXCircle, FiLoader, FiCalendar } from 'react-icons/fi'
import Navbar from '@/components/Navbar'
import BookingCalendar from '@/components/BookingCalendar'
import StatusBadge from '@/components/StatusBadge'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'

interface Stats {
  total: number
  pending: number
  approved: number
  rejected: number
}

interface Booking {
  id: string
  item_type: string
  item_name: string
  requester_name: string
  division: string
  purpose: string
  start_datetime: string
  end_datetime: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

interface BookedDate {
  start: Date
  end: Date
  item_type: string
  item_name: string
  status: string
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch('/api/admin/stats')
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData.stats)
      }

      // Fetch recent bookings
      const bookingsRes = await fetch('/api/bookings')
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json()
        const bookings = bookingsData.bookings || []
        setRecentBookings(bookings.slice(0, 5)) // Get 5 most recent

        // Transform for calendar
        const dates: BookedDate[] = bookings.map((b: Booking) => ({
          start: parseISO(b.start_datetime),
          end: parseISO(b.end_datetime),
          item_type: b.item_type,
          item_name: b.item_name,
          status: b.status,
        }))
        setBookedDates(dates)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
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
      return format(parseISO(datetime), 'dd MMM, HH:mm', { locale: id })
    } catch {
      return datetime
    }
  }

  const bookingOptions = [
    {
      id: 'meeting-room',
      title: 'Ruang Meeting',
      description: 'Ruang Meeting Lantai 1',
      icon: <FiUsers className="w-8 h-8" />,
      gradient: 'from-blue-500 to-cyan-500',
      href: '/booking/meeting-room',
    },
    {
      id: 'training-center',
      title: 'Training Center',
      description: 'Bandara Mas',
      icon: <FiMapPin className="w-8 h-8" />,
      gradient: 'from-purple-500 to-pink-500',
      href: '/booking/training-center',
    },
    {
      id: 'vehicle',
      title: 'Kendaraan',
      description: 'Xpander, Xenia, Livina, Avanza, Voxy',
      icon: <FiTruck className="w-8 h-8" />,
      gradient: 'from-orange-500 to-red-500',
      href: '/booking/vehicle',
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">Booking System</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Reservasi ruang meeting, training center, dan kendaraan operasional
              perusahaan dengan mudah dan cepat
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="glass-card p-4 text-center hover-card">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <FiLoader className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-500">{loading ? '-' : stats.total}</p>
              <p className="text-xs text-gray-500">Total Request</p>
            </div>
            <div className="glass-card p-4 text-center hover-card">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <FiClock className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-amber-500">{loading ? '-' : stats.pending}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
            <div className="glass-card p-4 text-center hover-card">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-emerald-500">{loading ? '-' : stats.approved}</p>
              <p className="text-xs text-gray-500">Approved</p>
            </div>
            <div className="glass-card p-4 text-center hover-card">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-red-500/10 flex items-center justify-center">
                <FiXCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-500">{loading ? '-' : stats.rejected}</p>
              <p className="text-xs text-gray-500">Rejected</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {/* Calendar */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold mb-4">📅 Kalender Booking</h2>
              <BookingCalendar bookedDates={bookedDates} />
            </div>

            {/* Booking Options & Recent */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Options */}
              <div>
                <h2 className="text-xl font-bold mb-4">🎯 Pilih Item untuk Booking</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {bookingOptions.map((option, index) => (
                    <Link
                      key={option.id}
                      href={option.href}
                      className="glass-card p-4 hover-card group cursor-pointer fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.gradient} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                        {option.icon}
                      </div>
                      <h3 className="font-bold mb-1">{option.title}</h3>
                      <p className="text-gray-500 text-xs mb-2">{option.description}</p>
                      <div className="flex items-center text-blue-500 text-sm font-medium">
                        <span>Booking</span>
                        <FiArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Bookings */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">📋 Riwayat Booking Terbaru</h2>
                  <Link href="/status" className="text-blue-500 text-sm hover:underline">
                    Lihat Semua →
                  </Link>
                </div>
                <div className="glass-card overflow-hidden">
                  {loading ? (
                    <div className="p-8 text-center">
                      <div className="spinner mx-auto mb-2"></div>
                      <p className="text-sm text-gray-500">Memuat...</p>
                    </div>
                  ) : recentBookings.length === 0 ? (
                    <div className="p-8 text-center">
                      <FiCalendar className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">Belum ada booking</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {recentBookings.map((booking) => (
                        <div key={booking.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getItemGradient(booking.item_type)} flex items-center justify-center text-white shrink-0`}>
                              {getItemIcon(booking.item_type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-sm">{booking.item_name}</span>
                                <StatusBadge status={booking.status} />
                              </div>
                              <p className="text-xs text-gray-500 truncate">{booking.purpose}</p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                <span>{booking.requester_name}</span>
                                <span>•</span>
                                <span>{formatDateTime(booking.start_datetime)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Check Status Section */}
          <div className="glass-card p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">🔍 Cek Status Booking Anda</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm sm:text-base">
              Masukkan nama Anda untuk melihat status booking yang sudah diajukan
            </p>
            <Link href="/status" className="btn btn-primary">
              <FiArrowRight className="w-4 h-4" />
              Cek Status Sekarang
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
