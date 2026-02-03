'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiPlus, FiCalendar, FiTool, FiDollarSign, FiActivity } from 'react-icons/fi'
import AdminSidebar from '@/components/AdminSidebar'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface Vehicle {
    id: string
    name: string
    brand: string
    plate_number: string
}

interface ServiceLog {
    id: string
    service_date: string
    service_type: string
    description: string
    cost: number
    odometer_reading: number
    created_at: string
}

export default function ServiceHistoryPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)
    const [vehicle, setVehicle] = useState<Vehicle | null>(null)
    const [services, setServices] = useState<ServiceLog[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        service_date: new Date().toISOString().split('T')[0],
        service_type: 'Regular Service',
        description: '',
        cost: '',
        odometer_reading: '',
    })

    useEffect(() => {
        const admin = localStorage.getItem('admin')
        if (!admin) {
            router.push('/admin/login')
            return
        }
        fetchData()
    }, [id, router])

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/vehicles/${id}/services`)
            if (res.ok) {
                const data = await res.json()
                setVehicle(data.vehicle)
                setServices(data.services || [])
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitLoading(true)

        try {
            const res = await fetch(`/api/vehicles/${id}/services`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                fetchData()
                setIsModalOpen(false)
                setFormData({
                    service_date: new Date().toISOString().split('T')[0],
                    service_type: 'Regular Service',
                    description: '',
                    cost: '',
                    odometer_reading: '',
                })
            }
        } catch (error) {
            console.error('Error saving log:', error)
        } finally {
            setSubmitLoading(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            <AdminSidebar />

            <main className="lg:ml-64 p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin/vehicles" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
                        <FiArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Daftar Kendaraan</span>
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Riwayat Service</h1>
                            {vehicle && (
                                <p className="text-xl text-blue-400">
                                    {vehicle.brand} {vehicle.name} <span className="text-gray-500">•</span> {vehicle.plate_number}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn btn-primary"
                        >
                            <FiPlus className="w-5 h-5" />
                            Catat Service Baru
                        </button>
                    </div>
                </div>

                {/* Service Logs List */}
                <div className="space-y-4">
                    {services.length === 0 ? (
                        <div className="glass-card p-12 text-center bg-white/5">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                <FiTool className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-gray-400">Belum ada riwayat service untuk kendaraan ini</p>
                        </div>
                    ) : (
                        services.map((log) => (
                            <div key={log.id} className="glass-card p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex flex-col items-center justify-center text-blue-400 border border-blue-500/30">
                                            <span className="text-xs font-bold uppercase">{format(new Date(log.service_date), 'MMM', { locale: idLocale })}</span>
                                            <span className="text-2xl font-bold">{format(new Date(log.service_date), 'd')}</span>
                                            <span className="text-xs">{format(new Date(log.service_date), 'yyyy')}</span>
                                        </div>
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                                            <h3 className="text-lg font-bold text-white mb-1 sm:mb-0">{log.service_type}</h3>
                                            <span className="text-emerald-400 font-bold font-mono text-lg">
                                                {formatCurrency(log.cost)}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 mb-4">{log.description}</p>

                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <FiActivity className="w-4 h-4" />
                                                <span>KM {log.odometer_reading.toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Service Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-slate-800 rounded-2xl w-full max-w-md p-6 border border-white/10 shadow-xl">
                            <h2 className="text-xl font-bold mb-6">Catat Service Baru</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Tanggal Service</label>
                                    <input
                                        type="date"
                                        className="input-field bg-slate-900 border-slate-700 text-white"
                                        value={formData.service_date}
                                        onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Jenis Service</label>
                                    <select
                                        className="input-field bg-slate-900 border-slate-700 text-white"
                                        value={formData.service_type}
                                        onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                                    >
                                        <option value="Regular Service">Service Berkala</option>
                                        <option value="Oil Change">Ganti Oli</option>
                                        <option value="Tire Change">Ganti Ban</option>
                                        <option value="Repair">Perbaikan</option>
                                        <option value="Tune Up">Tune Up</option>
                                        <option value="Other">Lainnya</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Keterangan</label>
                                    <textarea
                                        className="input-field bg-slate-900 border-slate-700 text-white min-h-[100px]"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Detail pengerjaan service..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Biaya (Rp)</label>
                                        <input
                                            type="number"
                                            className="input-field bg-slate-900 border-slate-700 text-white"
                                            value={formData.cost}
                                            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Odometer (KM)</label>
                                        <input
                                            type="number"
                                            className="input-field bg-slate-900 border-slate-700 text-white"
                                            value={formData.odometer_reading}
                                            onChange={(e) => setFormData({ ...formData, odometer_reading: e.target.value })}
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 rounded-xl text-gray-400 hover:bg-white/5 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitLoading}
                                        className="btn btn-primary px-6"
                                    >
                                        {submitLoading ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
