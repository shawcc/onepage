// Manage your Magic Codes here
// role: 'user' | 'admin'

export const MAGIC_CODES = {
    // Format: 'code': { id: 'unique_id', role: 'role' }
    'onepage2024': { id: '1', role: 'user' },
    'demo': { id: '2', role: 'user' },
    'admin888': { id: 'admin', role: 'admin' },
    // Add your new codes below:
    // 'newcode123': { id: '4', role: 'user' },
} as const
