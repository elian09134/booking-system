'use client'

import { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight, FiUsers, FiMapPin, FiTruck, FiSquare } from 'react-icons/fi'
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
            case 'meeting_room':
                return <FiUsers className="w-3 h-3" />
            case 'glass_room':
                return <FiSquare className="w-3 h-3" />
            case 'training_center':
                return <FiMapPin className="w-3 h-3" />
            case 'vehicle':
                return <FiTruck className="w-3 h-3" />
            default:
                return null
        }
    }

    const getBookingColor = (itemType: string) => {
        switch (itemType) {
            case 'meeting_room':
                return 'bg-blue-500'
            case 'glass_room':
                return 'bg-teal-500'
            case 'training_center':
                return 'bg-purple-500'
            case 'vehicle':
                return 'bg-orange-500'
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

                    // Get short vehicle name for display
                    const getVehicleShortName = (itemName: string) => {
                        const name = itemName.toLowerCase()
                        if (name.includes('xpander')) return 'XP'
                        if (name.includes('xenia')) return 'XN'
                        if (name.includes('livina')) return 'LV'
                        if (name.includes('avanza')) return 'AV'
                        if (name.includes('voxy')) return 'VX'
                        return itemName.substring(0, 2).toUpperCase()
                    }

                    return (
                        <div
                            key={day.toString()}
                            className={`aspect-square p-0.5 rounded-lg flex flex-col items-center justify-center relative
                ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}
                ${booked ? getBookingColor(booked.item_type) + ' text-white' : ''}
                ${pending && !booked ? 'bg-amber-100 dark:bg-amber-900/30' : ''}
                ${!booked && !pending ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
              `}
                            title={activeBooking ? `${activeBooking.item_name} (${activeBooking.status === 'approved' ? 'Approved' : 'Pending'})` : ''}
                        >
                            <span className={`text-sm ${booked ? 'font-bold' : ''}`}>
                                {format(day, 'd')}
                            </span>
                            {activeBooking && activeBooking.item_type === 'vehicle' && (
                                <span className="text-[8px] font-bold leading-tight">
                                    {getVehicleShortName(activeBooking.item_name)}
                                </span>
                            )}
                            {activeBooking && activeBooking.item_type !== 'vehicle' && (
                                <span className="absolute bottom-0.5">
                                    {getItemIcon(activeBooking.item_type)}
                                </span>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-blue-500"></div>
                        <span>Meeting</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-teal-500"></div>
                        <span>R. Kaca</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-purple-500"></div>
                        <span>Training</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-orange-500"></div>
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
