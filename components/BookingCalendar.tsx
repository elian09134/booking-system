'use client'

import { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight, FiTruck, FiX, FiUser, FiClock, FiFileText } from 'react-icons/fi'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns'
import { id } from 'date-fns/locale'

interface BookedDate {
    start: Date
    end: Date
    item_type: string
    item_name: string
    status: string
    requester_name?: string
    purpose?: string
}

interface BookingCalendarProps {
    bookedDates: BookedDate[]
}

export default function BookingCalendar({ bookedDates }: BookingCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState<Date | null>(null)
    const [today, setToday] = useState<Date | null>(null)
    const [selectedBooking, setSelectedBooking] = useState<BookedDate | null>(null)

    // Initialize dates on client side only to prevent hydration mismatch
    useEffect(() => {
        const now = new Date()
        setCurrentMonth(now)
        setToday(now)
    }, [])

    // Don't render until client-side hydration is complete
    if (!currentMonth || !today) {
        return (
            <div className="glass-card p-4 sm:p-6">
                <div className="h-80 flex items-center justify-center">
                    <div className="spinner"></div>
                </div>
            </div>
        )
    }

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Get first day of week (0 = Sunday)
    const startDay = monthStart.getDay()

    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

    const isDateBooked = (date: Date): BookedDate | null => {
        for (const booking of bookedDates) {
            if (booking.status === 'approved') {
                // Check if date is same day as start or end, or between them
                const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
                const startOnly = new Date(booking.start.getFullYear(), booking.start.getMonth(), booking.start.getDate())
                const endOnly = new Date(booking.end.getFullYear(), booking.end.getMonth(), booking.end.getDate())

                if (dateOnly >= startOnly && dateOnly <= endOnly) {
                    return booking
                }
            }
        }
        return null
    }

    const isDatePending = (date: Date): BookedDate | null => {
        for (const booking of bookedDates) {
            if (booking.status === 'pending') {
                // Check if date is same day as start or end, or between them
                const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
                const startOnly = new Date(booking.start.getFullYear(), booking.start.getMonth(), booking.start.getDate())
                const endOnly = new Date(booking.end.getFullYear(), booking.end.getMonth(), booking.end.getDate())

                if (dateOnly >= startOnly && dateOnly <= endOnly) {
                    return booking
                }
            }
        }
        return null
    }

    const getItemIcon = (itemType: string) => {
        switch (itemType) {
            case 'vehicle':
                return <FiTruck className="w-3 h-3" />
            default:
                return <FiTruck className="w-3 h-3" />
        }
    }

    const getBookingColor = (itemType: string) => {
        switch (itemType) {
            case 'vehicle':
                return 'bg-indigo-600'
            default:
                return 'bg-gray-500'
        }
    }

    const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

    return (
        <>
            <div className="glass-card p-4 sm:p-6 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={prevMonth}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-lg font-bold">
                        {format(currentMonth, 'MMMM yyyy', { locale: id })}
                    </h3>
                    <button
                        onClick={nextMonth}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <FiChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Week Days Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: startDay }).map((_, index) => (
                        <div key={`empty-${index}`} className="aspect-square" />
                    ))}

                    {/* Days of the month */}
                    {days.map((day) => {
                        const booked = isDateBooked(day)
                        const pending = isDatePending(day)
                        const isCurrentDay = isSameDay(day, today)
                        const activeBooking = booked || pending

                        return (
                            <div
                                key={day.toString()}
                                onClick={() => activeBooking && setSelectedBooking(activeBooking)}
                                className={`min-h-[60px] md:min-h-[100px] p-1 md:p-2 rounded-lg flex flex-col items-start justify-start relative transition-all border border-transparent
                    ${activeBooking ? 'cursor-pointer' : ''}
                    ${isCurrentDay ? 'ring-2 ring-indigo-500 z-10' : ''}
                    ${booked ? getBookingColor(booked.item_type) + ' text-white shadow-sm' : ''}
                    ${pending && !booked ? 'bg-amber-50 text-amber-900 border-amber-200' : ''}
                    ${!booked && !pending ? 'bg-white hover:bg-gray-50 border-gray-100' : ''}
                  `}
                                title={activeBooking ? `${activeBooking.item_name} (${activeBooking.status === 'approved' ? 'Approved' : 'Pending'})` : ''}
                            >
                                <span className={`text-xs md:text-sm mb-1 ${booked ? 'font-bold opacity-80' : 'font-medium text-gray-500'}`}>
                                    {format(day, 'd')}
                                </span>
                                {activeBooking && (
                                    <div className={`w-full text-[10px] md:text-xs font-medium leading-tight px-1 py-0.5 md:px-1.5 md:py-1 rounded truncate
                                        ${booked ? 'bg-white/20' : 'bg-amber-100 text-amber-800'}
                                    `}>
                                        {activeBooking.item_name}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-3 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-indigo-600"></div>
                            <span>Kendaraan</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-amber-200 dark:bg-amber-800"></div>
                            <span>Pending</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedBooking(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl scale-100 transform transition-all" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{selectedBooking.item_name}</h3>
                                <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 uppercase tracking-wide
                                    ${selectedBooking.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}
                                `}>
                                    {selectedBooking.status}
                                </div>
                            </div>
                            <button onClick={() => setSelectedBooking(null)} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                                    <FiUser className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{selectedBooking.requester_name || 'Tanpa Nama'}</p>
                                    <p className="text-xs text-gray-500">Peminjam</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                                    <FiFileText className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{selectedBooking.purpose || '-'}</p>
                                    <p className="text-xs text-gray-500">Keperluan</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                                    <FiClock className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {format(selectedBooking.start, 'd MMM HH:mm', { locale: id })} - 
                                        {format(selectedBooking.end, ' HH:mm', { locale: id })}
                                    </p>
                                    <p className="text-xs text-gray-500">Waktu</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button 
                                onClick={() => setSelectedBooking(null)} 
                                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
