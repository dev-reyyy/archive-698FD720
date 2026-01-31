import { FILE_STATUS } from "./filesystem.js";
import { printToConsole, showLoadingBar } from "./utilities.js";
import { refreshDetailsTable } from "./viewToggle.js";

export async function unlockFile(fileData, inputCode) {
    if (fileData.status !== FILE_STATUS.LOCKED) {
        printToConsole(`${fileData.name} is not encrypted.`, 'warning');
        return;
    }

    if (!inputCode) {
        printToConsole(`Authorization failed: no security key provided.`, 'warning');
        return;
    }
    
    await showLoadingBar('Searching file:', 1000, 20);

    await showLoadingBar('Decrypting bits:', 2000, 20);

    if (fileData.code !== inputCode) {
        printToConsole(`Access denied: invalid security key`, 'error');
        return;
    }

    fileData.status = FILE_STATUS.OK;

    refreshDetailsTable();
    
    const linkElement = document.getElementById(fileData.id);
    
    if (linkElement) {
        const container = linkElement.querySelector('div');
        const icon = linkElement.querySelector('i');
        container.classList.remove('opacity-30');
        icon.className = `icon icon-lg ${fileData.icon}`; 
    }

    printToConsole(`Decryption complete: ${fileData.name} unlocked successfully.`, 'success');
}