import { ReactNode } from 'react'

interface StatsCardProps {
    title: string
    value: number
    icon: ReactNode
    gradient: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}

const gradientClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    yellow: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
}

const bgClasses = {
    blue: 'bg-blue-500/10',
    green: 'bg-emerald-500/10',
    yellow: 'bg-amber-500/10',
    red: 'bg-red-500/10',
    purple: 'bg-purple-500/10',
}

export default function StatsCard({ title, value, icon, gradient }: StatsCardProps) {
    return (
        <div className="glass-card p-6 hover-card pulse-on-hover">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                    <p className={`text-3xl font-bold bg-gradient-to-r ${gradientClasses[gradient]} bg-clip-text text-transparent`}>
                        {value}
                    </p>
                </div>
                <div className={`w-14 h-14 rounded-2xl ${bgClasses[gradient]} flex items-center justify-center`}>
                    <div className={`text-2xl bg-gradient-to-r ${gradientClasses[gradient]} bg-clip-text text-transparent`}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    )
}
