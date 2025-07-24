/**
 * Constants for report management feature
 */

export const REPORT_STATUS_COLORS = {
    PENDING: {
        badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        text: 'text-yellow-500'
    },
    IN_PROGRESS: {
        badge: 'bg-blue-100 text-blue-800 border-blue-200',
        text: 'text-blue-500'
    },
    COMPLETED: {
        badge: 'bg-green-100 text-green-800 border-green-200',
        text: 'text-green-500'
    },
    CANCELLED: {
        badge: 'bg-red-100 text-red-800 border-red-200',
        text: 'text-red-500'
    },
    DEFAULT: {
        badge: 'bg-gray-100 text-gray-800 border-gray-200',
        text: 'text-gray-500'
    }
};
