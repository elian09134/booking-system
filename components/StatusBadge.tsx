interface StatusBadgeProps {
    status: 'pending' | 'approved' | 'rejected'
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const statusConfig = {
        pending: {
            label: 'Pending',
            className: 'badge-pending',
        },
        approved: {
            label: 'Approved',
            className: 'badge-approved',
        },
        rejected: {
            label: 'Rejected',
            className: 'badge-rejected',
        },
    }

    const config = statusConfig[status]

    return (
        <span className={`badge ${config.className}`}>
            {config.label}
        </span>
    )
}
