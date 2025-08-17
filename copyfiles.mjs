import { exec } from 'child_process';
import { copyFile } from 'fs/promises';

exec('go env GOROOT', async (err, goroot) => {
    if (err) {
        throw err;
    }

    goroot = goroot.trim();

    await copyFile(`${goroot}/lib/wasm/wasm_exec.js`, `src/wasm_exec/wasm_exec.js`);
    await copyFile(`${goroot}/lib/wasm/wasm_exec_node.js`, `src/wasm_exec/wasm_exec_node.js`);
    await copyFile(`${goroot}/LICENSE`, `src/wasm_exec/LICENSE`);
});
