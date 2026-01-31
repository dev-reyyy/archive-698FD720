import { printToConsole, showLoadingBar } from "./utilities.js";
import { FILE_STATUS, TERMINAL_MODES, terminalState } from "./filesystem.js";
import { refreshDetailsTable } from "./viewToggle.js";

export async function recoverFile(fileData) {
    if (fileData.status !== FILE_STATUS.CORRUPTED) {
        printToConsole(`${fileData.name} is not corrupted.`, 'info');
        return;
    }

    terminalState.mode = TERMINAL_MODES.RECOVER;
    terminalState.recoveryContext = {
        file: fileData
    };

    await showLoadingBar('Checking corrupted data...', 1000, 20);

    printToConsole(`Missing metadata field: FILE_SIZE (KB).`, 'info');
    printToConsole(`Manual reconstruction required.`, 'info');
    printToConsole(`Enter missing value or press <span class="text-rose-500">ESC to abort recovery</span>.`, 'info');
}

export async function handleRecoveryInput(input) {
    const { file } = terminalState.recoveryContext;

    const value = Number(input);

    if (Number.isNaN(value)) {
        printToConsole(`Invalid input. Expected numeric value (KB).`, 'error');
        return;
    }

    await showLoadingBar('Rebuilding metadata...', 1500, 20);

    if (value !== file.size) {
        printToConsole(`Integrity check failed. Metadata mismatch.`, 'error');
        printToConsole(`Enter value again or press <span class="text-rose-500">ESC to abort recovery</span>.`, 'info');
        return;
    }

    file.status = FILE_STATUS.OK;

    refreshDetailsTable();

    const el = document.getElementById(file.id);
    if (el) {
        el.querySelector('div').classList.remove('opacity-30');
        el.querySelector('i').className = `icon icon-lg ${file.icon}`;
    }

    printToConsole(`Integrity restored. ${file.name} recovered successfully.`, 'success');

    terminalState.mode = TERMINAL_MODES.COMMAND;
    terminalState.recoveryContext = null;
}