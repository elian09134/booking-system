'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiPlus, FiEdit2, FiTrash2, FiTruck, FiTool, FiLogOut, FiMenu, FiMoreVertical } from 'react-icons/fi'
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="spinner w-8 h-8 border-indigo-600 border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar />

            <main className="lg:ml-64 p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Aset Kendaraan</h1>
                        <p className="text-gray-500 text-sm">Kelola daftar kendaraan operasional</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn btn-primary shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
                    >
                        <FiPlus className="w-5 h-5" />
                        Tambah Kendaraan
                    </button>
                </div>

                {/* Vehicles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                        <div key={vehicle.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm ${vehicle.is_active ? 'bg-indigo-600' : 'bg-gray-400'}`}>
                                        <FiTruck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{vehicle.brand} {vehicle.name}</h3>
                                        <p className="text-sm text-gray-500 font-mono">{vehicle.plate_number}</p>
                                    </div>
                                </div>
                                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${vehicle.is_active ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                    {vehicle.is_active ? 'Active' : 'Inactive'}
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 mb-6 space-y-1 bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Tipe</span>
                                    <span className="font-medium">{vehicle.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Tahun</span>
                                    <span className="font-medium">{vehicle.year}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handleOpenModal(vehicle)}
                                    className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                    title="Edit"
                                >
                                    <FiEdit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleToggleStatus(vehicle)}
                                    className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                    title={vehicle.is_active ? 'Deactivate' : 'Activate'}
                                >
                                    <FiTool className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(vehicle.id)}
                                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    title="Delete"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                </button>
                                <Link
                                    href={`/admin/vehicles/${vehicle.id}/services`}
                                    className="ml-auto px-4 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 text-sm font-medium transition-colors flex items-center gap-2 border border-gray-200 hover:border-indigo-200"
                                >
                                    <FiTool className="w-3.5 h-3.5" />
                                    Service Log
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl scale-100 transform transition-all">
                            <h2 className="text-xl font-bold mb-6 text-gray-900">
                                {editingVehicle ? 'Edit Kendaraan' : 'Tambah Kendaraan Baru'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Merek</label>
                                    <input
                                        type="text"
                                        className="input-field w-full"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        placeholder="Toyota, Honda, dll"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama / Model</label>
                                    <input
                                        type="text"
                                        className="input-field w-full"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Avanza, Innova, dll"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Plat Nomor</label>
                                        <input
                                            type="text"
                                            className="input-field w-full"
                                            value={formData.plate_number}
                                            onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
                                            placeholder="B 1234 ABC"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                                        <input
                                            type="number"
                                            className="input-field w-full"
                                            value={formData.year}
                                            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                                    <select
                                        className="input-field w-full"
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

                                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
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
