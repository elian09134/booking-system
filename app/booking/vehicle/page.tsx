'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiTruck, FiCalendar, FiClock, FiCheck, FiAlertCircle, FiNavigation, FiUser, FiBriefcase, FiMapPin } from 'react-icons/fi'
import Navbar from '@/components/Navbar'

interface Vehicle {
    id: string
    name: string
    type: string
    brand?: string
    year?: number
    plate_number?: string
}

export default function VehicleBookingPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [loadingVehicles, setLoadingVehicles] = useState(true)

    // Form State
    const [formData, setFormData] = useState({
        requester_name: '',
        division: '',
        purpose: '',
        destination: '',
        vehicle: '', // ID
        start_date: '',
        start_time: '',
        end_date: '',
        end_time: '',
        duration_type: 'hours',
    })

    useEffect(() => {
        fetchVehicles()
    }, [])

    const fetchVehicles = async () => {
        try {
            const res = await fetch('/api/vehicles')
            if (res.ok) {
                const data = await res.json()
                setVehicles(data.vehicles || [])
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error)
        } finally {
            setLoadingVehicles(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const selectVehicle = (id: string) => {
        setFormData({ ...formData, vehicle: id })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (!formData.vehicle) {
            setError('Silakan pilih kendaraan terlebih dahulu')
            setLoading(false)
            return
        }

        try {
            const startDatetime = `${formData.start_date}T${formData.start_time}:00`
            const endDatetime = `${formData.end_date}T${formData.end_time}:00`

            // Find selected vehicle to get name and ID
            const selectedVehicle = vehicles.find(v => v.id === formData.vehicle)
            if (!selectedVehicle) throw new Error('Kendaraan tidak valid')

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    item_type: 'vehicle',
                    item_name: selectedVehicle.name,
                    vehicle_id: selectedVehicle.id,
                    requester_name: formData.requester_name,
                    division: formData.division,
                    purpose: formData.purpose,
                    destination: formData.destination,
                    start_datetime: startDatetime,
                    end_datetime: endDatetime,
                    duration_type: formData.duration_type,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Gagal membuat booking')
            }

            setSuccess(true)
            setTimeout(() => {
                router.push('/status?name=' + encodeURIComponent(formData.requester_name))
            }, 2000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                    <div className="glass-card p-12 text-center max-w-md fade-in w-full">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center animate-bounce">
                            <FiCheck className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Booking Berhasil!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Permintaan booking Anda telah dikirim dan menunggu persetujuan admin.
                        </p>
                        <div className="spinner mx-auto"></div>
                        <p className="text-sm text-gray-400 mt-4">Mengalihkan ke halaman status...</p>
                    </div>
                </main>
            </>
        )
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 fade-in">
                        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-4 transition-colors">
                            <FiArrowLeft className="w-4 h-4" />
                            <span>Kembali ke Beranda</span>
                        </Link>
                        <h1 className="text-3xl font-bold mb-2">Form Peminjaman Kendaraan</h1>
                        <p className="text-gray-500">Isi formulir di bawah untuk mengajukan peminjaman kendaraan operasional.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 fade-in">
                        
                        {/* LEFT COLUMN: Vehicle Selection */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="glass-card p-6">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <FiTruck className="text-indigo-600" />
                                    1. Pilih Kendaraan
                                </h2>
                                
                                {loadingVehicles ? (
                                    <div className="p-8 text-center">
                                        <div className="spinner mx-auto mb-2"></div>
                                        <p className="text-sm text-gray-400">Memuat daftar kendaraan...</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {vehicles.map((vehicle) => {
                                            const isSelected = formData.vehicle === vehicle.id
                                            return (
                                                <div
                                                    key={vehicle.id}
                                                    onClick={() => selectVehicle(vehicle.id)}
                                                    className={`
                                                        relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg group
                                                        ${isSelected 
                                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md' 
                                                            : 'border-transparent bg-white dark:bg-slate-800 hover:border-gray-200 dark:hover:border-slate-700 shadow-sm'}
                                                    `}
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                            <FiTruck className="w-5 h-5" />
                                                        </div>
                                                        {isSelected && <FiCheck className="w-6 h-6 text-indigo-500" />}
                                                    </div>
                                                    <h3 className={`font-bold ${isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-900 dark:text-white'}`}>
                                                        {vehicle.brand} {vehicle.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono">
                                                            {vehicle.plate_number || 'No Plate'}
                                                        </span>
                                                        <span className="text-xs text-gray-500">{vehicle.type}</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                                {error && !formData.vehicle && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                        <FiAlertCircle /> Pilih salah satu kendaraan
                                    </p>
                                )}
                            </div>

                            {/* Date & Time Selection */}
                            <div className="glass-card p-6">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <FiCalendar className="text-indigo-600" />
                                    2. Waktu Peminjaman
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Mulai</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="date"
                                                name="start_date"
                                                value={formData.start_date}
                                                onChange={handleChange}
                                                className="input-field flex-1"
                                                required
                                            />
                                            <input
                                                type="time"
                                                name="start_time"
                                                value={formData.start_time}
                                                onChange={handleChange}
                                                className="input-field w-24"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Selesai</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="date"
                                                name="end_date"
                                                value={formData.end_date}
                                                onChange={handleChange}
                                                className="input-field flex-1"
                                                required
                                            />
                                            <input
                                                type="time"
                                                name="end_time"
                                                value={formData.end_time}
                                                onChange={handleChange}
                                                className="input-field w-24"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <label className="text-sm text-gray-500 mb-1 block">Tipe Durasi</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="duration_type" 
                                                value="hours" 
                                                checked={formData.duration_type === 'hours'}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-indigo-600"
                                            />
                                            <span className="text-sm">Jam (Harian)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="duration_type" 
                                                value="days" 
                                                checked={formData.duration_type === 'days'}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-indigo-600"
                                            />
                                            <span className="text-sm">Hari (Luar Kota)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: User Details & Summary */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="glass-card p-6 sticky top-24">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <FiUser className="text-indigo-600" />
                                    3. Data Peminjam
                                </h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiUser className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="requester_name"
                                                value={formData.requester_name}
                                                onChange={handleChange}
                                                className="input-field pl-10"
                                                placeholder="Nama Anda"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Divisi</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiBriefcase className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="division"
                                                value={formData.division}
                                                onChange={handleChange}
                                                className="input-field pl-10"
                                                placeholder="Divisi Anda"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Tujuan</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiMapPin className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="destination"
                                                value={formData.destination}
                                                onChange={handleChange}
                                                className="input-field pl-10"
                                                placeholder="Lokasi tujuan"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Keperluan</label>
                                        <textarea
                                            name="purpose"
                                            value={formData.purpose}
                                            onChange={handleChange}
                                            className="input-field min-h-[100px]"
                                            placeholder="Jelaskan detail keperluan..."
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                        <FiAlertCircle className="shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary w-full py-4 text-lg shadow-lg hover:shadow-indigo-500/30"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="spinner w-5 h-5 border-white border-t-transparent"></div>
                                                <span>Memproses...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span>Ajukan Peminjaman</span>
                                                <FiArrowLeft className="rotate-180" />
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </main>
        </>
    )
}
