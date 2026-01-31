import { printToConsole } from './utilities.js';

const converterView = document.getElementById('converter-view');
const hexInput = document.getElementById('hexadecimal');
const decInput = document.getElementById('decimal');
const convertBtn = document.getElementById('convert-btn');

const imgEl = document.getElementById('file-image');
const modal = document.getElementById('file-modal');
const textEl = document.getElementById('file-text');
const titleEl = document.getElementById('file-title');
const closeBtn = document.getElementById('close-modal');
const flower = document.getElementById('flower-container');

function resetModal() {
    converterView.classList.add('hidden');
    textEl.classList.add('hidden');
    imgEl.classList.add('hidden');
    flower.classList.add('hidden');

    textEl.textContent = '';
    imgEl.src = '';
}

function showModal({ title, type, content }) {
    resetModal();
    titleEl.textContent = title;

    if (type === 'text') {
        textEl.innerHTML = marked.parse(content);
        textEl.classList.remove('hidden');
    }

    if (type === 'image') {
        imgEl.src = content;
        imgEl.classList.remove('hidden');
    }

    if (type === 'converter') {
        converterView.classList.remove('hidden');
    }

    modal.classList.remove('hidden');
}

function hideModal() {
    modal.classList.add('hidden');
}

export async function openFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();

    const handlers = {
        txt: () => openText(file),
        md: () => openText(file),
        png: () => openImage(file),
        jpg: () => openImage(file),
        jpeg: () => openImage(file),
        tiff: () => openImage(file),
        pdf: () => openPdf(file),
        exe: () => openExe(file)
    };

    if (handlers[ext]) {
        await handlers[ext]();
    } else {
        printToConsole(`No associated viewer for ${file.name}.`, 'warning');
    }
}

function openImage(file) {
    showModal({
        title: file.name,
        type: 'image',
        content: `${file.src}`
    });
}

function openPdf(file) {
    window.open(`assets/files/${file.name}`, '_blank', 'noopener');
}

function openExe(file) {
    if (file.name.toLowerCase() === 'utility.exe') {
        showModal({
            title: file.name,
            type: 'converter'
        });
        return;
    }

    showModal({
        title: file.name,
        type: 'text',
        content: 'Executable preview is not supported.'
    });
}

async function openText(file) {
    try {
        const res = await fetch(`${file.src}`);
        const text = await res.text();

        showModal({
            title: file.name,
            type: 'text',
            content: text
        });
        
        if (file.name === 'postscript.txt') {
            flower.classList.remove('hidden');
        }

    } catch {
        printToConsole(`Failed to open ${file.name}.`, 'error');
    }
}

closeBtn.addEventListener('click', hideModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideModal();
});

convertBtn.addEventListener('click', () => {
    if (hexInput.value !== '') {
        decInput.value = parseInt(hexInput.value, 16);
        return;
    }

    if (decInput.value !== '') {
        hexInput.value = Number(decInput.value)
            .toString(16)
            .toUpperCase();
    }
});

hexInput.addEventListener('input', () => {
    if (hexInput.value) decInput.value = '';
});

decInput.addEventListener('input', () => {
    if (decInput.value) hexInput.value = '';
});