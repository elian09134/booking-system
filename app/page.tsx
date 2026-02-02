'use client'

import Link from 'next/link'
import { FiUsers, FiMapPin, FiTruck, FiArrowRight, FiClock, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi'
import Navbar from '@/components/Navbar'

export default function HomePage() {
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
          <div className="text-center mb-16 fade-in">
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
              <p className="text-2xl font-bold text-blue-500">-</p>
              <p className="text-xs text-gray-500">Total Request</p>
            </div>
            <div className="glass-card p-4 text-center hover-card">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <FiClock className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-amber-500">-</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
            <div className="glass-card p-4 text-center hover-card">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-emerald-500">-</p>
              <p className="text-xs text-gray-500">Approved</p>
            </div>
            <div className="glass-card p-4 text-center hover-card">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-red-500/10 flex items-center justify-center">
                <FiXCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-500">-</p>
              <p className="text-xs text-gray-500">Rejected</p>
            </div>
          </div>

          {/* Booking Options */}
          <h2 className="text-2xl font-bold mb-6 text-center">Pilih Item untuk Booking</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {bookingOptions.map((option, index) => (
              <Link
                key={option.id}
                href={option.href}
                className="glass-card p-8 hover-card group cursor-pointer fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {option.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">{option.description}</p>
                <div className="flex items-center text-blue-500 font-medium">
                  <span>Booking Sekarang</span>
                  <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* Check Status Section */}
          <div className="glass-card p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Cek Status Booking</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
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
