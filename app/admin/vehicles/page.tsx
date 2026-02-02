'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiPlus, FiEdit2, FiTrash2, FiTruck, FiTool, FiLogOut, FiMenu } from 'react-icons/fi'
import AdminSidebar from '@/components/AdminSidebar'

interface Vehicle {
    id: string
    name: string
    type: string
    plate_number: string
    brand?: string
    year?: number
    is_active: boolean
}

export default function VehicleManagementPage() {
    const router = useRouter()
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        type: 'MPV',
        plate_number: '',
        brand: '',
        year: new Date().getFullYear(),
    })
    const [submitLoading, setSubmitLoading] = useState(false)

    useEffect(() => {
        const admin = localStorage.getItem('admin')
        if (!admin) {
            router.push('/admin/login')
            return
        }
        fetchVehicles()
    }, [router])

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
            setLoading(false)
        }
    }

    const handleOpenModal = (vehicle?: Vehicle) => {
        if (vehicle) {
            setEditingVehicle(vehicle)
            setFormData({
                name: vehicle.name,
                type: vehicle.type,
                plate_number: vehicle.plate_number || '',
                brand: vehicle.brand || '',
                year: vehicle.year || new Date().getFullYear(),
            })
        } else {
            setEditingVehicle(null)
            setFormData({
                name: '',
                type: 'MPV',
                plate_number: '',
                brand: '',
                year: new Date().getFullYear(),
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitLoading(true)

        try {
            const url = editingVehicle
                ? `/api/vehicles/${editingVehicle.id}`
                : '/api/vehicles'

            const method = editingVehicle ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                fetchVehicles()
                setIsModalOpen(false)
            }
        } catch (error) {
            console.error('Error saving vehicle:', error)
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus kendaraan ini?')) return

        try {
            const res = await fetch(`/api/vehicles/${id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                fetchVehicles()
            }
        } catch (error) {
            console.error('Error deleting vehicle:', error)
        }
    }

    const handleToggleStatus = async (vehicle: Vehicle) => {
        try {
            const res = await fetch(`/api/vehicles/${vehicle.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !vehicle.is_active }),
            })

            if (res.ok) {
                fetchVehicles()
            }
        } catch (error) {
            console.error('Error updating status:', error)
        }
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Aset Kendaraan</h1>
                        <p className="text-gray-400">Kelola daftar kendaraan operasional</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn btn-primary"
                    >
                        <FiPlus className="w-5 h-5" />
                        Tambah Kendaraan
                    </button>
                </div>

                {/* Vehicles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                        <div key={vehicle.id} className="glass-card p-6 border border-white/10 bg-white/5 relative group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${vehicle.is_active ? 'bg-blue-600' : 'bg-gray-600'}`}>
                                        <FiTruck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{vehicle.brand} {vehicle.name}</h3>
                                        <p className="text-sm text-gray-400">{vehicle.plate_number}</p>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-bold ${vehicle.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {vehicle.is_active ? 'Active' : 'Non-Active'}
                                </div>
                            </div>

                            <div className="text-sm text-gray-400 mb-6 space-y-1">
                                <p>Tipe: {vehicle.type}</p>
                                <p>Tahun: {vehicle.year}</p>
                            </div>

                            <div className="flex gap-2 mt-auto">
                                <button
                                    onClick={() => handleOpenModal(vehicle)}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-blue-400 transition-colors"
                                    title="Edit"
                                >
                                    <FiEdit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(vehicle.id)}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-red-400 transition-colors"
                                    title="Delete"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleToggleStatus(vehicle)}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-yellow-400 transition-colors"
                                    title={vehicle.is_active ? 'Deactivate' : 'Activate'}
                                >
                                    <FiTool className="w-4 h-4" />
                                </button>
                                <Link
                                    href={`/admin/vehicles/${vehicle.id}/services`}
                                    className="ml-auto px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    <FiTool className="w-4 h-4" />
                                    Service History
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-slate-800 rounded-2xl w-full max-w-md p-6 border border-white/10 shadow-xl">
                            <h2 className="text-xl font-bold mb-6">
                                {editingVehicle ? 'Edit Kendaraan' : 'Tambah Kendaraan Baru'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Merek</label>
                                    <input
                                        type="text"
                                        className="input-field bg-slate-900 border-slate-700 text-white"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        placeholder="Toyota, Honda, dll"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Nama / Model</label>
                                    <input
                                        type="text"
                                        className="input-field bg-slate-900 border-slate-700 text-white"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Avanza, Innova, dll"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Plat Nomor</label>
                                        <input
                                            type="text"
                                            className="input-field bg-slate-900 border-slate-700 text-white"
                                            value={formData.plate_number}
                                            onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
                                            placeholder="B 1234 ABC"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Tahun</label>
                                        <input
                                            type="number"
                                            className="input-field bg-slate-900 border-slate-700 text-white"
                                            value={formData.year}
                                            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Tipe</label>
                                    <select
                                        className="input-field bg-slate-900 border-slate-700 text-white"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="MPV">MPV</option>
                                        <option value="SUV">SUV</option>
                                        <option value="Sedan">Sedan</option>
                                        <option value="Van">Van</option>
                                        <option value="Pickup">Pickup</option>
                                    </select>
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
