const SENSITIVE_KEYS = new Set(['password', 'confirmPassword', 'pwd', 'token', 'authorization']);

function redact(value: any): any {
    if (value == null) return value;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
        try {
            const cloned = Array.isArray(value) ? [...value] : {...value};
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

function getCallerLocation(): string {
    const stack = new Error().stack || '';
    const lines = stack.split('\n').slice(2);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed.includes('logger.ts')) continue;
        // Browser stacks vary; return the first useful line
        return trimmed.replace(window.location?.origin || '', '.');
    }
    return '<unknown>';
}

export function initClientLogger() {
    const methods: Array<keyof Console> = ['log', 'info', 'warn', 'error', 'debug'];
    methods.forEach((m) => {
        const orig = console[m] as Function;
        (console as any)[m] = (...args: any[]) => {
            try {
                const loc = getCallerLocation();
                const safe = args.map(redact);
                orig.call(console, `[${loc}]`, ...safe);
            } catch (e) {
                orig.call(console, '[client-logger-error]', e, ...args);
            }
        };
    });
}

export default initClientLogger;
