import { FILE_STATUS } from './filesystem.js';
import { checkFileStatus } from './utilities.js';
import { SORT_STATE, getSortedFiles } from './getSortedFiles.js'

const desktopContainer = document.querySelector('.flex.flex-wrap');

export function initViewToggle() {
    const viewRadios = document.querySelectorAll('input[name="view"]');

    viewRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'icons') {
                showIconView();
            } else {
                showDetailsView();
            }
        });
    });

    function showIconView() {
        const table = document.getElementById('details-table');
        const sortedFiles = getSortedFiles();

        sortedFiles.forEach(file => {
            const el = document.getElementById(file.id);
            if (el) desktopContainer.appendChild(el);
        });

        document.querySelectorAll('.desktop-icon').forEach(f => f.style.display = 'flex');
        if (table) table.remove();
    }

    document.querySelectorAll('input[name="sort_by"]').forEach(input => {
        input.addEventListener('change', e => {
            SORT_STATE.by = e.target.value;
            refreshView();
        });
    });

    document.querySelectorAll('input[name="sort_order"]').forEach(input => {
        input.addEventListener('change', e => {
            SORT_STATE.order = e.target.value;
            refreshView();
        });
    });
    
    function refreshView() {
        const currentView = document.querySelector('input[name="view"]:checked').value;
        currentView === 'icons' ? showIconView() : showDetailsView();
    }
}

export function showDetailsView() {
    document.querySelectorAll('.desktop-icon').forEach(f => f.style.display = 'none');

    // Remove old table if exists
    let oldTable = document.getElementById('details-table');
    if (oldTable) oldTable.remove();

    // Create table
    const table = document.createElement('table');
    table.id = 'details-table';
    table.className = 'w-full text-sm text-left text-neutral-300';

    // Table header
    table.innerHTML = `
        <thead class="bg-gray-700 select-none">
            <tr>
                <th class="px-2 py-1">Name</th>
                <th class="px-2 py-1">Size</th>
                <th class="px-2 py-1">Created At</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');
    let selectedRow = null;

    getSortedFiles().forEach(file => {
        const tr = document.createElement('tr');
        
        const isInaccessible = file.status === FILE_STATUS.CORRUPTED || file.status === FILE_STATUS.LOCKED;
        const opacityClass = isInaccessible ? 'opacity-30' : 'opacity-100';
        
        tr.className = `${opacityClass} hover:bg-neutral-400/10 duration-100 cursor-pointer`;

        const fileSize = file.status === FILE_STATUS.CORRUPTED ? '—' : `${file.size} KB`;
        const fileDate =
            file.status === FILE_STATUS.CORRUPTED
                ? '—'
                : (() => {
                    const d = new Date(file.created_at);

                    const date = d.toLocaleDateString('en-PH', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    timeZone: 'Asia/Manila'
                    });

                    const time = d.toLocaleTimeString('en-PH', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'Asia/Manila'
                    });

                    return `${date} | ${time}`;
                })();


        tr.innerHTML = `
            <td class="px-2 py-1">${file.name}</td>
            <td class="px-2 py-1">${fileSize}</td>
            <td class="px-2 py-1">${fileDate}</td>
        `;

        tr.addEventListener('click', (e) => {
            e.stopPropagation();
            if (selectedRow) selectedRow.classList.remove('bg-neutral-400/20');
            tr.classList.add('bg-neutral-400/20');
            selectedRow = tr;
        });

        tr.addEventListener('dblclick', () => {
            checkFileStatus(file);
        });

        tbody.appendChild(tr);
    });

    desktopContainer.appendChild(table);
}

export function refreshDetailsTable() {
    let table = document.getElementById('details-table');
    if (table) {
        
        table.remove();
        showDetailsView();
    }
}