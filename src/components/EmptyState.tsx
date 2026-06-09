export default function EmptyState({
  icon,
  title,
  description,
  action,
  onAction,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-5 max-w-[260px]">{description}</p>
      {action && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-gopay-blue text-white font-semibold rounded-xl shadow-[0_4px_15px_rgba(0,102,255,0.3)] hover:shadow-[0_6px_20px_rgba(0,102,255,0.4)] transition-all active:scale-[0.98]"
        >
          {action}
        </button>
      )}
    </div>
  )
}
