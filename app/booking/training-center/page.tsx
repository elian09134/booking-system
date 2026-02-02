'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiMapPin, FiCalendar, FiClock, FiCheck, FiAlertCircle } from 'react-icons/fi'
import Navbar from '@/components/Navbar'

export default function TrainingCenterBookingPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        requester_name: '',
        division: '',
        purpose: '',
        start_date: '',
        start_time: '',
        end_date: '',
        end_time: '',
        duration_type: 'hours',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const startDatetime = `${formData.start_date}T${formData.start_time}:00`
            const endDatetime = `${formData.end_date}T${formData.end_time}:00`

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    item_type: 'training_center',
                    item_name: 'Bandara Mas',
                    requester_name: formData.requester_name,
                    division: formData.division,
                    purpose: formData.purpose,
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
                    <div className="glass-card p-12 text-center max-w-md fade-in">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
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
                <div className="max-w-2xl mx-auto">
                    {/* Back Button */}
                    <Link href="/booking" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-8 transition-colors">
                        <FiArrowLeft className="w-4 h-4" />
                        <span>Kembali</span>
                    </Link>

                    {/* Header */}
                    <div className="glass-card p-6 mb-8 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0">
                            <FiMapPin className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Training Center</h1>
                            <p className="text-gray-500 dark:text-gray-400">Bandara Mas</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="glass-card p-8">
                        <h2 className="text-xl font-bold mb-6">Form Booking</h2>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500">
                                <FiAlertCircle className="w-5 h-5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Requester Name */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Nama Pemohon *</label>
                                <input
                                    type="text"
                                    name="requester_name"
                                    value={formData.requester_name}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Masukkan nama lengkap"
                                    required
                                />
                            </div>

                            {/* Division */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Divisi *</label>
                                <input
                                    type="text"
                                    name="division"
                                    value={formData.division}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Masukkan nama divisi"
                                    required
                                />
                            </div>

                            {/* Purpose */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Keperluan *</label>
                                <textarea
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    className="input-field min-h-[100px]"
                                    placeholder="Jelaskan keperluan penggunaan training center"
                                    required
                                />
                            </div>

                            {/* Duration Type */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Tipe Durasi *</label>
                                <select
                                    name="duration_type"
                                    value={formData.duration_type}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                >
                                    <option value="hours">Hitungan Jam</option>
                                    <option value="days">Hitungan Hari</option>
                                </select>
                            </div>

                            {/* Start Date & Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        <FiCalendar className="inline w-4 h-4 mr-1" />
                                        Tanggal Mulai *
                                    </label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        <FiClock className="inline w-4 h-4 mr-1" />
                                        Jam Mulai *
                                    </label>
                                    <input
                                        type="time"
                                        name="start_time"
                                        value={formData.start_time}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                            </div>

                            {/* End Date & Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        <FiCalendar className="inline w-4 h-4 mr-1" />
                                        Tanggal Selesai *
                                    </label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        <FiClock className="inline w-4 h-4 mr-1" />
                                        Jam Selesai *
                                    </label>
                                    <input
                                        type="time"
                                        name="end_time"
                                        value={formData.end_time}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full"
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner w-5 h-5"></div>
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiCheck className="w-5 h-5" />
                                        <span>Ajukan Booking</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}
