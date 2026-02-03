'use client'

import { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight, FiTruck } from 'react-icons/fi'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns'
import { id } from 'date-fns/locale'

interface BookedDate {
    start: Date
    end: Date
    item_type: string
    item_name: string
    status: string
}

interface BookingCalendarProps {
    bookedDates: BookedDate[]
}

export default function BookingCalendar({ bookedDates }: BookingCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState<Date | null>(null)
    const [today, setToday] = useState<Date | null>(null)

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
        <div className="glass-card p-4 sm:p-6">
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
                            className={`min-h-[100px] p-2 rounded-lg flex flex-col items-start justify-start relative transition-all border border-transparent
                ${isCurrentDay ? 'ring-2 ring-indigo-500 z-10' : ''}
                ${booked ? getBookingColor(booked.item_type) + ' text-white shadow-sm' : ''}
                ${pending && !booked ? 'bg-amber-50 text-amber-900 border-amber-200' : ''}
                ${!booked && !pending ? 'bg-white hover:bg-gray-50 border-gray-100' : ''}
              `}
                            title={activeBooking ? `${activeBooking.item_name} (${activeBooking.status === 'approved' ? 'Approved' : 'Pending'})` : ''}
                        >
                            <span className={`text-sm mb-1 ${booked ? 'font-bold opacity-80' : 'font-medium text-gray-500'}`}>
                                {format(day, 'd')}
                            </span>
                            {activeBooking && (
                                <div className={`w-full text-xs font-medium leading-tight px-1.5 py-1 rounded truncate
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
    )
}
