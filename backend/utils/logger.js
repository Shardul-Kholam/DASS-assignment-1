const path = require('path');

const SENSITIVE_KEYS = new Set(['password', 'confirmPassword', 'pwd', 'token', 'authorization']);

function redact(value) {
    if (value == null) return value;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
        try {
            const cloned = Array.isArray(value) ? [...value] : { ...value };
            for (const k of Object.keys(cloned)) {
                if (SENSITIVE_KEYS.has(k)) cloned[k] = '[REDACTED]';
                else if (typeof cloned[k] === 'object') cloned[k] = redact(cloned[k]);
            }
            return cloned;
        } catch (e) {
            return '[UNREDACTABLE]';
        }
    }
    return value;
}

function getCallerLocation() {
    const stack = new Error().stack || '';
    const lines = stack.split('\n').slice(2);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed.includes('node:internal') || trimmed.includes('internal/modules')) continue;
        if (trimmed.includes('logger.js')) continue;
        // Example stack: at Object.<anonymous> (/home/user/.../file.js:10:5)
        const match = trimmed.match(/\(?(.+?):(\d+):(\d+)\)?$/);
        if (match) {
            const filePath = match[1];
            const rel = path.relative(process.cwd(), filePath);
            const funcMatch = trimmed.match(/at (.+?) \(/);
            const fn = funcMatch ? funcMatch[1] : '<anonymous>';
            return `${rel}:${match[2]} (${fn})`;
        }
    }
    return '<unknown>';
}

function wrapConsoleMethod(name) {
    const orig = console[name].bind(console);
    console[name] = (...args) => {
        try {
            const location = getCallerLocation();
            const safeArgs = args.map(arg => redact(arg));
            orig(`[${location}]`, ...safeArgs);
        } catch (e) {
            orig('[logger error]', e, ...args);
        }
    };
}

['log', 'info', 'warn', 'error', 'debug'].forEach(wrapConsoleMethod);

module.exports = { redact, getCallerLocation };
