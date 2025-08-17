import fs from 'fs/promises';
import './wasm_exec/wasm_exec.js';

declare global {
    var Go: new () => {
        importObject: WebAssembly.Imports;
        run: (instance: WebAssembly.Instance) => Promise<void>;
    };

    // Provided by our Go main() via js.Global().Set(...)
    // eslint-disable-next-line no-var
    var add: (a: number, b: number) => number;
    // eslint-disable-next-line no-var
    var hello: (name?: string) => string;
}

async function loadGoWasm(wasmPath: string) {
    const go = new (global as any).Go();

    const bytes = await fs.readFile(wasmPath);
    const { instance } = await WebAssembly.instantiate(
        Buffer.from(bytes),
        go.importObject,
    );

    go.run(instance);

    await new Promise<void>((resolve) => {
        const check = () => {
            if (typeof (globalThis as any).add === 'function') resolve();
            else setTimeout(check, 10);
        };
        check();
    });
}

(async () => {
    await loadGoWasm('dist/main.wasm');

    const sum = globalThis.add(2, 3);
    const greeting = globalThis.hello('TypeScript');

    console.log('2 + 3 =', sum);
    console.log(greeting);

    process.exit(0);
})();
