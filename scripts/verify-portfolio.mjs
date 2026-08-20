import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const required = [
  "package.json",
  "angular.json",
  "tsconfig.json",
  "tsconfig.app.json",
  "src/index.html",
  "src/main.ts",
  "src/app.component.ts",
  "src/app.component.html",
  "src/app.component.css",
  "src/styles.css",
  "api/contact.js",
  "vercel.json"
];

const missing = required.filter((file) => !existsSync(join(root, file)));
if (missing.length) {
  console.error("VERIFY FAILED: missing files:");
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const ts = readFileSync(join(root, "src/app.component.ts"), "utf8");
const html = readFileSync(join(root, "src/app.component.html"), "utf8");
const api = readFileSync(join(root, "api/contact.js"), "utf8");
const css = readFileSync(join(root, "src/app.component.css"), "utf8");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

const checks = [
  ["Angular workspace configured", existsSync(join(root, "angular.json"))],
  ["Angular start script", pkg.scripts?.start === "ng serve"],
  ["Angular build script", pkg.scripts?.build === "ng build"],
  ["Theme toggle persists", ts.includes("localStorage.setItem('portfolio-theme'")],
  ["Theme restores on startup", ts.includes("localStorage.getItem('portfolio-theme'")],
  ["Light theme CSS exists", css.includes(":host-context(html.light)")],
  ["Hire Me endpoint", ts.includes("fetch('/api/contact'")],
  ["Vercel function exists", existsSync(join(root, "api/contact.js"))],
  ["Reply-To configured", api.includes("reply_to: email")],
  ["Resend server-side key", api.includes("process.env.RESEND_API_KEY")],
  ["No frontend Resend key", !ts.includes("RESEND_API_KEY")],
  ["Honeypot exists", html.includes("companyFax") && api.includes("companyFax")]
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed++;
}

if (failed) {
  console.error(`\nVERIFY FAILED: ${failed} check(s).`);
  process.exit(1);
}

console.log("\nVERIFY PASSED: static portfolio checks are clean.");
