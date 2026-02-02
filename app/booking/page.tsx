'use client'

import Link from 'next/link'
import { FiUsers, FiMapPin, FiTruck, FiArrowLeft } from 'react-icons/fi'
import Navbar from '@/components/Navbar'

export default function BookingPage() {
    const bookingOptions = [
        {
            id: 'meeting-room',
            title: 'Ruang Meeting',
            description: 'Ruang Meeting Lantai 1',
            icon: <FiUsers className="w-8 h-8" />,
            gradient: 'from-blue-500 to-cyan-500',
            href: '/booking/meeting-room',
            available: true,
        },
        {
            id: 'training-center',
            title: 'Training Center',
            description: 'Bandara Mas',
            icon: <FiMapPin className="w-8 h-8" />,
            gradient: 'from-purple-500 to-pink-500',
            href: '/booking/training-center',
            available: true,
        },
        {
            id: 'vehicle',
            title: 'Kendaraan',
            description: 'Xpander, Xenia, Livina, Avanza, Voxy',
            icon: <FiTruck className="w-8 h-8" />,
            gradient: 'from-orange-500 to-red-500',
            href: '/booking/vehicle',
            available: true,
        },
    ]

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
                    <div className="text-center mb-12">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                            <span className="gradient-text">Pilih Item untuk Booking</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Pilih ruangan atau kendaraan yang ingin Anda booking
                        </p>
                    </div>

                    {/* Booking Options Grid */}
                    <div className="grid gap-6">
                        {bookingOptions.map((option, index) => (
                            <Link
                                key={option.id}
                                href={option.href}
                                className="glass-card p-6 hover-card group cursor-pointer fade-in flex items-center gap-6"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform`}>
                                    {option.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold">{option.title}</h3>
                                        {option.available && (
                                            <span className="badge badge-approved text-xs">Tersedia</span>
                                        )}
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400">{option.description}</p>
                                </div>
                                <div className="shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <FiArrowLeft className="w-5 h-5 rotate-180" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}
