import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const required = [
  "package.json",
  "angular.json",
  "tsconfig.json",
  "tsconfig.app.json",
  "src/index.html",
  "src/main.ts",
  "src/app/app.ts",
  "src/app/app.html",
  "src/app/app.config.ts",
  "src/app/app.routes.server.ts",
  "src/main.server.ts",
  "src/app/content/portfolio-content.store.ts",
  "src/app/features/hire/contact-api.ts",
  "src/styles/_tokens.scss",
  "src/assets/images/joan-portrait.webp",
  "src/assets/resume.pdf",
  "api/content.js",
  "api/contact.js",
  "api/chat.js",
  "api/_lib/content-repository.js",
  "db/migrations/001_portfolio_content.sql",
  "db/migrations/002_redesign_content.sql",
  "db/seed.sql"
];

const missing = required.filter((file) => !existsSync(join(root, file)));
if (missing.length) {
  console.error("VERIFY FAILED: missing files:");
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const read = (file) => readFileSync(join(root, file), "utf8");

function sourceFiles(dir) {
  return readdirSync(join(root, dir)).flatMap((name) => {
    const path = join(dir, name);
    return statSync(join(root, path)).isDirectory() ? sourceFiles(path) : [path];
  });
}

const frontend = sourceFiles("src").filter((file) => /\.(ts|html)$/.test(file)).map(read).join("\n");
const contactApi = read("src/app/features/hire/contact-api.ts");
const hireTemplate = read("src/app/features/hire/hire-modal.html");
const contact = read("api/contact.js");
const inquiry = read("api/_lib/inquiry.js");
const repository = read("api/_lib/content-repository.js");
const migrations = ["001_portfolio_content.sql", "002_redesign_content.sql"].map((file) => read(`db/migrations/${file}`));
const store = read("src/app/content/portfolio-content.store.ts");
const browserEntry = read("src/main.ts");
const tokens = read("src/styles/_tokens.scss");
const motion = read("src/styles/_motion.scss");
const angular = JSON.parse(read("angular.json"));
const buildOptions = angular.projects["joan-cruzat-portfolio"].architect.build.options;
const pkg = JSON.parse(read("package.json"));

const checks = [
  ["Angular build script", pkg.scripts?.build === "ng build"],
  ["Angular test script", pkg.scripts?.test?.startsWith("ng test")],
  ["Accent is a single token", tokens.includes("--accent:")],
  ["Reduced motion disables animation", motion.includes("prefers-reduced-motion: reduce")],
  ["Homepage is prerendered", buildOptions.outputMode === "static" && buildOptions.server === "src/main.server.ts"],
  ["Hire Me endpoint", contactApi.includes("'/api/contact'")],
  ["Reply-To configured", contact.includes("reply_to: inquiry.email")],
  ["Resend server-side key", contact.includes("process.env.RESEND_API_KEY")],
  ["HTML email escapes input", inquiry.includes("escapeHtml(inquiry.message)")],
  ["Honeypot exists", hireTemplate.includes("companyFax") && contact.includes("companyFax")],
  ["Content read with publishable key only", repository.includes("SUPABASE_PUBLISHABLE_KEY") && !/SECRET|SERVICE_ROLE|POSTGRES_URL/.test(repository)],
  ["Content tables use row-level security", migrations.every((sql) => sql.includes("enable row level security") && sql.includes("revoke insert, update, delete"))],
  ["Page loads content from the API", store.includes("'/api/content'")],
  ["Vercel Analytics enabled in the browser only", browserEntry.includes("injectAnalytics(") && !read("src/main.server.ts").includes("@vercel/analytics")],
  ["No server secrets in frontend", !/RESEND_API_KEY|ANTHROPIC_API_KEY|SUPABASE_SECRET_KEY|SERVICE_ROLE|POSTGRES_URL/.test(frontend)],
  ["No console.log in frontend", !frontend.includes("console.log(")]
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
