export const COLORS = {
    prompt: 'text-emerald-600',
    system: 'text-neutral-500',
    error: 'text-rose-500',
    warning: 'text-amber-400',
    success: 'text-cyan-400',
    info: 'text-neutral-400',
    loading: 'text-sky-400'
};

export const TERMINAL_MODES = {
    COMMAND: 'command',
    RECOVER: 'recover',
};

export const terminalState = {
    mode: TERMINAL_MODES.COMMAND,
    recoveryContext: null,
};

export const FILE_STATUS = {
    OK: "ok",
    LOCKED: "locked",
    CORRUPTED: "corrupted",
};

export const FILES = {
    'foreword.md': {
        id: "foreword",
        name: "foreword.md",
        icon: "ri-file-text-line",
        src: "assets/files/foreword.md",
        status: FILE_STATUS.OK,
        code: null,
        size: 48,
        created_at: 1689071400000
    },

    'margin.jpg': {
        id: "margin",
        name: "margin.jpg",
        icon: "ri-file-image-line",
        src: "assets/images/margin.jpg",
        status: FILE_STATUS.OK,
        code: null,
        size: 98,
        created_at: 1698919200000
    },

    'excerpt.tiff': {
        id: "excerpt",
        name: "excerpt.tiff",
        icon: "ri-file-image-line",
        src: "assets/images/excerpt.jpg",
        status: FILE_STATUS.OK,
        code: null,
        size: 60,
        created_at: 1683226800000
    },

    'interval.pdf': {
        id: "interval",
        name: "interval.pdf",
        icon: "ri-file-pdf-2-line",
        src: "assets/files/interval.pdf",
        status: FILE_STATUS.CORRUPTED,
        code: null,
        size: 120,
        created_at: 1703943000000
    },

    'reference.png': {
        id: "reference",
        name: "reference.png",
        icon: "ri-file-image-line",
        src: "assets/images/reference.png",
        status: FILE_STATUS.LOCKED,
        code: "010101",
        size: 148,
        created_at: 1696251600000
    },

    'utility.exe': {
        id: "utility",
        name: "utility.exe",
        icon: "ri-swap-box-line",
        src: null,
        status: FILE_STATUS.LOCKED,
        code: "8314",
        size: 480,
        created_at: 1678390200000
    },

    'postscript.txt': {
        id: "postscript",
        name: "postscript.txt",
        icon: "ri-file-text-line",
        src: "assets/files/postscript.md",
        status: FILE_STATUS.LOCKED,
        code: "1771034400",
        size: 240,
        created_at: 1687115700000
    },
};

export const COLOR_CODES = {
  "90398D": {
    name: "violet-dark",
    fill: "#90398D"
  },
  "F896FD": {
    name: "violet-light",
    fill: "#F896FD"
  },
  "D064FA": {
    name: "violet-mid",
    fill: "#D064FA"
  },
  "F1D25E": {
    name: "gold",
    fill: "#F1D25E"
  },
  "49795A": {
    name: "green-dark",
    fill: "#49795A"
  },
  "B6E281": {
    name: "green-light",
    fill: "#B6E281"
  },
  "24322D": {
    name: "dark",
    fill: "#24322D"
  },
  "80B96D": {
    name: "green",
    fill: "#80B96D"
  }
};
