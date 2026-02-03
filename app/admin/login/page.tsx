'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiLock, FiUser, FiArrowLeft, FiAlertCircle } from 'react-icons/fi'

export default function AdminLoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Login gagal')
            }

            // Store admin info in localStorage
            localStorage.setItem('admin', JSON.stringify(data.admin))

            router.push('/admin/dashboard')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 transition-colors text-sm font-medium">
                    <FiArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Beranda</span>
                </Link>

                {/* Login Card */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 flex items-center justify-center">
                            <FiLock className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
                        <p className="text-gray-500 text-sm">
                            Masuk untuk mengelola booking & kendaraan
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                            <FiAlertCircle className="w-5 h-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiUser className="text-gray-400 w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="input-field pl-10 w-full"
                                    placeholder="Masukkan username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="text-gray-400 w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field pl-10 w-full"
                                    placeholder="Masukkan password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-3 shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="spinner w-5 h-5 border-white border-t-transparent"></div>
                                    <span>Memproses...</span>
                                </div>
                            ) : (
                                <span>Masuk Dashboard</span>
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Demo Account</p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-200">
                            <span className="text-sm font-mono text-gray-600">admin</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-sm font-mono text-gray-600">admin123</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
