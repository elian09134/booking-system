'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiTruck, FiArrowRight, FiCalendar, FiClock, FiSearch, FiPlus } from 'react-icons/fi'
import Navbar from '@/components/Navbar'
import BookingCalendar from '@/components/BookingCalendar'
import StatusBadge from '@/components/StatusBadge'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

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
  requester_name: string
  purpose: string
}

export default function HomePage() {
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch recent bookings
      const bookingsRes = await fetch('/api/bookings')
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json()
        const bookings = bookingsData.bookings || []
        setRecentBookings(bookings.slice(0, 5)) // Get 5 most recent

        // Transform for calendar
        const dates: BookedDate[] = bookings.map((b: Booking) => {
          // Robust date parsing
          const parseDate = (dateStr: string): Date => {
            const match = dateStr.match(/(\d{4,})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
            if (match) {
              let year = match[1]
              if (year.length > 4) year = year.slice(-4)
              const month = parseInt(match[2]) - 1
              const day = parseInt(match[3])
              const hour = parseInt(match[4])
              const minute = parseInt(match[5])
              return new Date(parseInt(year), month, day, hour, minute)
            }
            return new Date(dateStr)
          }

          return {
            start: parseDate(b.start_datetime),
            end: parseDate(b.end_datetime),
            item_type: b.item_type,
            item_name: b.item_name,
            status: b.status,
            requester_name: b.requester_name,
            purpose: b.purpose,
          }
        })
        setBookedDates(dates)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (datetime: string) => {
    try {
      // Robust date parsing logic (same as above for consistency if needed, or use date-fns directly if string is ISO)
       const date = new Date(datetime)
       if(isNaN(date.getTime())) return datetime;
       return format(date, 'd MMM, HH:mm', { locale: idLocale })
    } catch {
      return datetime
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Dashboard Kendaraan</h1>
              <p className="text-gray-500 mt-1">Kelola dan pantau penggunaan kendaraan operasional.</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/status"
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2 shadow-sm"
              >
                <FiSearch className="w-4 h-4" />
                Cek Status
              </Link>
              <Link 
                href="/booking/vehicle"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center gap-2 shadow-sm shadow-indigo-200"
              >
                <FiPlus className="w-4 h-4" />
                Booking Baru
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* LEFT: Calendar (Availability) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FiCalendar className="text-gray-400" />
                        Jadwal Peminjaman
                    </h2>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-600">Bulan Ini</span>
                 </div>
                 <BookingCalendar bookedDates={bookedDates} />
              </div>

              {/* Booking Promo / Quick Access */}
              <div className="grid md:grid-cols-2 gap-4">
                 <Link href="/booking/vehicle" className="group bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                            <FiTruck className="w-6 h-6 text-white" />
                        </div>
                        <FiArrowRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Booking Kendaraan</h3>
                    <p className="text-indigo-100 text-sm">Ajukan peminjaman untuk dinas luar atau operasional kantor.</p>
                 </Link>

                 <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-center items-start">
                    <h3 className="font-semibold text-gray-900 mb-2">Butuh Bantuan?</h3>
                    <p className="text-sm text-gray-500 mb-4">Hubungi admin GA jika mengalami kendala booking atau unit tidak tersedia.</p>
                    <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Hubungi Admin &rarr;</a>
                 </div>
              </div>
            </div>

            {/* RIGHT: Recent Activity */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                            <FiClock className="text-gray-400" />
                            Aktivitas Terbaru
                        </h2>
                        <Link href="/status" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Lihat Semua</Link>
                    </div>
                    
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="spinner w-6 h-6 border-indigo-500 border-t-transparent mx-auto"></div>
                        </div>
                    ) : recentBookings.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <p className="text-sm">Belum ada aktivitas.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {recentBookings.map((booking) => (
                                <div key={booking.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-500">
                                            <FiTruck className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-sm font-medium text-gray-900 truncate pr-2">{booking.item_name}</p>
                                                <StatusBadge status={booking.status} />
                                            </div>
                                            <p className="text-xs text-gray-500 truncate mb-1">{booking.purpose}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-wide">
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
                
                {/* Mini Stats (Optional, cleaner) */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Informasi</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Total Armada</span>
                            <span className="font-medium text-gray-900">5 Unit</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Jam Operasional</span>
                            <span className="font-medium text-gray-900">08:00 - 17:00</span>
                        </div>
                    </div>
                </div>

            </div>

          </div>
        </div>
      </main>
    </>
  )
}
