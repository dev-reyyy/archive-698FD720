import { FILES, TERMINAL_MODES, terminalState } from './filesystem.js';
import { runCommand } from './runCommand.js';
import { handleRecoveryInput } from './recoverFile.js';
import { checkFileStatus, printToConsole, showLoadingBar } from './utilities.js';
import { initViewToggle } from './viewToggle.js';

export const dialogContainer = document.querySelector('.dialog-container');

window.dialogContainer = dialogContainer;

document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('text_field');
    
    let commandHistory = [];
    let historyIndex = -1;

    initViewToggle(); 
    intro();

    async function intro() {
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        await showLoadingBar('Initializing archive...');

        const introScripts = [
            `Archive detected.<br>`,
            `Integrity check complete.<br>`,
            `1 user connected.<br><br>`,
            `Some files remain inaccessible.<br>`,
            `Some appear incomplete.<br>`,
            `None are accidental.<br><br>`,
            `Type <span class="text-emerald-500">'status'</span> to inspect the archive.<br>`,
            `Type <span class="text-emerald-500">'help'</span> if you need reminders.`,
        ];

        for (const line of introScripts) {
            printToConsole(line, 'info');
            await delay(500);
        }
    }

    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const rawInput = event.target.value;

            if (terminalState.mode === TERMINAL_MODES.RECOVER) {
                handleRecoveryInput(rawInput);
                event.target.value = '';
                return;
            }

            const cmdText = rawInput.trim();

            if (cmdText !== "") {
                commandHistory.push(cmdText);
                historyIndex = commandHistory.length;

                const newLine = document.createElement('p');
                newLine.innerHTML = `<span class="text-neutral-500">C:\\User\\Admin&gt;</span> ${cmdText}`;
                dialogContainer.appendChild(newLine);

                const parts = cmdText.split(' ');
                const command = parts[0].toLowerCase();
                const target = parts[1];
                const inputCode = parts[2];

                runCommand(target, command, inputCode)

                event.target.value = '';
                dialogContainer.scrollTop = dialogContainer.scrollHeight;
            }
        }

        if (event.key === 'Escape') {
            if (terminalState.mode === TERMINAL_MODES.RECOVER) {
                terminalState.mode = TERMINAL_MODES.COMMAND;
                terminalState.recoveryContext = null;

                printToConsole(`Recovery process aborted.`, 'warning');
                event.target.value = '';
                dialogContainer.scrollTop = dialogContainer.scrollHeight;
            }
        }

        // LATEST COMMAND
        if (event.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                event.target.value = commandHistory[historyIndex];
            }
            event.preventDefault();
        }
        
        // PREV COMMAND
        if (event.key === 'ArrowDown') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                event.target.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                event.target.value = '';
            }
            event.preventDefault();
        }
    });

    const icons = document.querySelectorAll('.desktop-icon');
    let selectedIcon = null;

    // FILE DOUBLE CLICK AND ADD SINGLE CLICK BG COLOR
    icons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();

            if (selectedIcon) {
                selectedIcon.classList.remove('bg-neutral-400/20');
            }

            selectedIcon = icon;
            icon.classList.add('bg-neutral-400/20');
        });

        icon.addEventListener('dblclick', (e) => {
            e.stopPropagation();

            const fileKey = icon.dataset.file;
            const fileData = FILES[fileKey];
            
            checkFileStatus(fileData)
        });

        icon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                icon.dispatchEvent(new Event('dblclick'));
            }
        });
    });

    // HANDLE CLICK OUTSIDE FOR FILE SELECTION & DROPDOWN
    document.addEventListener('click', (e) => {
        if (selectedIcon && !selectedIcon.contains(e.target)) {
            selectedIcon.classList.remove('bg-neutral-400/20');
            selectedIcon = null;
        }

        // Close all sort dropdowns if clicked outside
        const detailsElements = document.querySelectorAll('details.group');
        detailsElements.forEach(details => {
            if (!details.contains(e.target)) {
                details.open = false;
            }
        });
    });
});