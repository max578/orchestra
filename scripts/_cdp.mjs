// Shared CDP harness for the gate scripts (overflow, a11y, motion, visual,
// keyboard, target-size). chrome-launcher resolves from the bare specifier
// when the script lives in an instance, else from <cwd>/node_modules.
// Exit-code protocol for consumers: 0 pass · 1 findings · 2 usage/tool
// missing/launch error (message says which).
import { resolve } from "node:path";

export async function loadChromeLauncher(toolName) {
  try { return await import("chrome-launcher"); } catch {}
  const { createRequire } = await import("node:module");
  const { pathToFileURL } = await import("node:url");
  const req = createRequire(pathToFileURL(resolve(process.cwd(), "package.json")));
  try { return await import(pathToFileURL(req.resolve("chrome-launcher"))); }
  catch {
    console.error(`${toolName}: chrome-launcher not installed (run from an instance dir)`);
    process.exit(2);
  }
}

export async function connect(toolName, extraFlags = []) {
  const chromeLauncher = await loadChromeLauncher(toolName);
  let chrome;
  try {
    chrome = await chromeLauncher.launch({
      chromePath: process.env.CHROME_PATH || undefined,
      chromeFlags: ["--headless", "--no-sandbox", ...extraFlags],
    });
  } catch (e) {
    console.error(`${toolName}: could not launch Chrome: ${e.message}`);
    process.exit(2);
  }
  const targets = await (await fetch(`http://localhost:${chrome.port}/json`)).json();
  const page = targets.find((t) => t.type === "page") ?? targets[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0; const pending = new Map();
  const send = (method, params = {}) =>
    new Promise((res) => { pending.set(++id, res); ws.send(JSON.stringify({ id, method, params })); });
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  });
  await new Promise((r) => ws.addEventListener("open", r));
  await send("Page.enable");
  const close = async () => { ws.close(); await chrome.kill(); };
  return { send, close };
}

export async function goto(send, url, settleMs = 1200) {
  await send("Page.navigate", { url });
  await new Promise((r) => setTimeout(r, settleMs));
}

// evaluate an expression that returns a JSON string; exits 2 on failure
export async function evalJson(send, close, toolName, expression, opts = {}) {
  const { result, exceptionDetails } = await send("Runtime.evaluate",
    { expression, returnByValue: true, ...opts });
  if (exceptionDetails || typeof result?.value !== "string") {
    console.error(`${toolName}: in-page evaluation failed` +
      (exceptionDetails?.exception?.description ? `: ${exceptionDetails.exception.description.split("\n")[0]}` : ""));
    await close(); process.exit(2);
  }
  return JSON.parse(result.value);
}
