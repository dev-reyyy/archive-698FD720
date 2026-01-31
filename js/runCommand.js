import { FILES, FILE_STATUS } from "./filesystem.js";
import { recoverFile } from "./recoverFile.js";
import { unlockFile } from "./unlockFile.js";
import { printToConsole } from "./utilities.js";
import { dialogContainer } from "./app.js";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function runCommand (target, command, value = null) {
    switch (command) {
        case 'decrypt':
            if (!target) {
                printToConsole(`Syntax error: filename parameter missing.`, 'error');
            } else if (!FILES[target]) {
                printToConsole(`Filesystem error: "${target}" does not exist.`, 'error');
            } else {
                unlockFile(FILES[target], value);
            }
            break;

        case 'help':
            (async () => {
                const lines = [
                    `<span class="text-cyan-400">SYSTEM COMMAND INDEX</span><br>`,
                    `<span class="text-emerald-500">help</span> — display system commands.<br>`,
                    `<span class="text-emerald-500">status</span> — display the current status of all files.<br>`,
                    `<span class="text-emerald-500">[Arrow ↑]</span> — previous command.<br>`,
                    `<span class="text-emerald-500">[Arrow ↓]</span> — next command.<br>`,
                    `<span class="text-emerald-500">clear | cls</span> — clear terminal buffer.<br>`,
                    `<span class="text-emerald-500">recover &lt;file&gt;</span> — initiate recovery sequence for corrupted file.<br>`,
                    `<span class="text-emerald-500">decrypt &lt;file&gt; &lt;key&gt;</span> — unlock encrypted file.<br>`,
                    `<span class="text-neutral-500">D - 2372141</span><br>`
                ];

                for (const line of lines) {
                    printToConsole(line, 'info');
                    await delay(300);
                }
            })();
            break;

        case 'recover':
            if (!target) {
                printToConsole(`Syntax error: filename parameter missing.`, 'error');
            } else if (!FILES[target]) {
                printToConsole(`Filesystem error: "${target}" does not exist.`, 'error');
            } else {
                recoverFile(FILES[target]);
            }
            break;

        case 'status':
            (async () => {
                for (const file of Object.values(FILES)) {
                    const type = file.status === FILE_STATUS.OK ? 'success' : 'error';

                    printToConsole(
                        `[${file.status.toUpperCase()}] ${file.name}`,
                        type
                    );

                    await delay(500);
                }

                await delay(500);
                printToConsole(
                    `<span class="text-neutral-500">D - 8436077</span><br>`,
                    'system'
                );
            })();
            break;

        case 'clear':
        case 'cls':
            dialogContainer.innerHTML = '';
            break;

        default:
            printToConsole(`Command error: '${command}' is not a recognized command.`, 'error');
    }
}