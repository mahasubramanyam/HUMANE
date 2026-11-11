const fs = require("fs");
const path = require("path");

const wasmNativePath = path.resolve(__dirname, "../node_modules/@rollup/wasm-node/dist/native.js");
const wasmDir = path.resolve(__dirname, "../node_modules/@rollup/wasm-node/dist/wasm-node");
const targetNativePath = path.resolve(__dirname, "../node_modules/rollup/dist/native.js");
const targetWasmDir = path.resolve(__dirname, "../node_modules/rollup/dist/wasm-node");

if (fs.existsSync(wasmNativePath) && fs.existsSync(targetNativePath)) {
  try {
    fs.copyFileSync(wasmNativePath, targetNativePath);
    if (!fs.existsSync(targetWasmDir) && fs.existsSync(wasmDir)) {
      fs.cpSync(wasmDir, targetWasmDir, { recursive: true });
    }
  } catch (err) {
    // Ignore error if already handled
  }
}
