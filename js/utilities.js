import { COLORS, FILE_STATUS } from "./filesystem.js";
import { dialogContainer } from "./app.js";
import { openFile } from "./openFile.js";

const SETTINGS = {
    showTimestamp: true
};

export function printToConsole(text, type = 'info') {
    const p = document.createElement('p');
    const colorClass = COLORS[type] || COLORS.info;

    const time = new Date().toLocaleTimeString('en-US', {
        hour12: false
    });

    const timestamp = SETTINGS.showTimestamp
        ? `<span class="text-neutral-600">[${time}]</span> `
        : '';

    p.className = `${colorClass} font-mono`;
    p.innerHTML = `${timestamp}<span class="text-neutral-500">[SYS]</span> ${text}`;

    dialogContainer.appendChild(p);
    dialogContainer.scrollTop = dialogContainer.scrollHeight;
}

export function checkFileStatus(fileData) {

    if (!fileData) {
        printToConsole(`Filesystem error: file does not exist.`, 'error');
        return false;
    }

    switch (fileData.status) {
        case FILE_STATUS.LOCKED:
            printToConsole( `Access denied. ${fileData.name} is encrypted.`, 'error');
            return false;

        case FILE_STATUS.CORRUPTED:
            printToConsole(`Data integrity failure. ${fileData.name} is corrupted and cannot be opened.`, 'warning');
            return false;

        case FILE_STATUS.OK:            
            openFile(fileData);

            return true;

        default:
            printToConsole(`Unknown file state detected for ${fileData.name}.`, 'error');
            return false;
    }
}

export async function showLoadingBar(label, duration = 2000, width = 20) {
    const p = document.createElement('p');
    p.className = `${COLORS.loading} font-mono`;
    dialogContainer.appendChild(p);

    const stepDuration = duration / width;

    for (let i = 0; i <= width; i++) {
        const progress = Math.round((i / width) * 100);
        const bar = '█'.repeat(i) + '░'.repeat(width - i);

        p.innerHTML = `
            <span class="text-neutral-500">[SYS]</span>
            ${label} [${bar}] ${progress}%
        `;

        dialogContainer.scrollTop = dialogContainer.scrollHeight;
        await new Promise(res => setTimeout(res, stepDuration));
    }
}