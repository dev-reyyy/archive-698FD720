import { FILES, FILE_STATUS } from './filesystem.js';

export const SORT_STATE = {
    by: 'name',
    order: 'asc'
};

export function getSortedFiles() {
    const files = Object.values(FILES);

    return [...files].sort((a, b) => {
        let valA, valB;

        switch (SORT_STATE.by) {
            case 'size':
                valA = a.status === FILE_STATUS.CORRUPTED ? Infinity : a.size;
                valB = b.status === FILE_STATUS.CORRUPTED ? Infinity : b.size;
                break;

            case 'created_at':
                valA = a.status === FILE_STATUS.CORRUPTED ? Infinity : a.created_at;
                valB = b.status === FILE_STATUS.CORRUPTED ? Infinity : b.created_at;
                break;

            case 'name':
            default:
                valA = a.name.toLowerCase();
                valB = b.name.toLowerCase();
        }

        if (valA < valB) return SORT_STATE.order === 'asc' ? -1 : 1;
        if (valA > valB) return SORT_STATE.order === 'asc' ? 1 : -1;
        return 0;
    });
}