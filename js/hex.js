import { COLOR_CODES, FILES } from './filesystem.js';
import { unlockFile } from './unlockFile.js';
import { printToConsole } from './utilities.js';

const validatedColors = new Set();

document.addEventListener('DOMContentLoaded', () => {
    function normalizeHex(value) {
        return value.replace("#", "").toUpperCase();
    }

    function setHexError(message) {
        const errorEl = document.getElementById("hex-error");
        if (errorEl) {
            errorEl.textContent = message;
        }
    }

    function clearHexError() {
        const errorEl = document.getElementById("hex-error");
        if (errorEl) {
            errorEl.textContent = "";
        }
    }

    document.getElementById("check-btn").addEventListener("click", () => {
        const input = document.getElementById("hexcodes");
        const hex = normalizeHex(input.value);

        if (!COLOR_CODES[hex]) {
            setHexError("Code not recognized.");
            return;
        }

        if (validatedColors.has(hex)) {
            setHexError("Code already validated.");
            return;
        }

        clearHexError();
        validateColor(hex);
        input.value = "";
    });

    // Handle hexadecimal input field - validate on enter or input change
    document.getElementById("hexadecimal").addEventListener("keypress", (e) => {
        if (e.key === 'Enter') {
            const hex = normalizeHex(e.target.value);

            if (!COLOR_CODES[hex]) {
                setHexError("Hexcode not recognized.");
                return;
            }

            if (validatedColors.has(hex)) {
                setHexError("Hexcode already validated.");
                return;
            }

            clearHexError();
            validateColor(hex);
            e.target.value = "";
        }
    });

    function validateColor(hex) {
        validatedColors.add(hex);

        revealSvgColor(hex);
        addValidatedBadge(hex);

        if (validatedColors.size === Object.keys(COLOR_CODES).length) {
            unlockReference();
        }
    }

    function revealSvgColor(hex) {
        const rects = document.querySelectorAll(`[data-color="${hex}"]`);

        rects.forEach(rect => {
            rect.setAttribute("fill", COLOR_CODES[hex].fill);
        });
    }

    function addValidatedBadge(hex) {
        const container = document.querySelector(".validated-container");
        
        // Remove "None" placeholder only on first validation
        if (validatedColors.size === 1) {
            container.querySelector("p")?.remove();
        }

        const badge = document.createElement("p");
        badge.className = "rounded px-3 py-1 text-sm font-semibold";
        badge.style.background = COLOR_CODES[hex].fill;
        badge.style.color = "#000";
        badge.textContent = `#${hex}`;

        container.appendChild(badge);
    }

    function unlockReference() {
        const referenceFile = FILES['reference.png'];
        printToConsole("Pattern complete. Reference restored.", 'success');
        unlockFile(referenceFile, referenceFile.code);
    }
})