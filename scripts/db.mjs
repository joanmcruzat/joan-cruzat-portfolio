// Applies database migrations and the content seed with the owner connection.
// Usage: npm run db:migrate | npm run db:seed (both read POSTGRES_URL_NON_POOLING from .env.local).
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";

const root = join(import.meta.dirname, "..");
const migrationsDir = join(root, "db", "migrations");
const seedFile = join(root, "db", "seed.sql");

const command = process.argv[2];
const url = process.env.POSTGRES_URL_NON_POOLING;

if (!["migrate", "seed"].includes(command)) {
  console.error("Usage: node scripts/db.mjs <migrate|seed>");
  process.exit(1);
}
if (!url) {
  console.error("POSTGRES_URL_NON_POOLING is not set. Run `npx vercel env pull .env.local` first.");
  process.exit(1);
}

const sql = postgres(url, { max: 1, onnotice: () => {} });

async function migrate() {
  await sql`
    create table if not exists schema_migration (
      name        varchar(200) primary key,
      applied_at  timestamptz  not null default now()
    )`;
  await sql`alter table schema_migration enable row level security`;

  const applied = new Set((await sql`select name from schema_migration`).map((row) => row.name));
  const pending = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql") && !applied.has(file))
    .sort();

  for (const file of pending) {
    await sql.begin(async (tx) => {
      await tx.unsafe(readFileSync(join(migrationsDir, file), "utf8"));
      await tx`insert into schema_migration (name) values (${file})`;
    });
    console.log(`Applied ${file}`);
  }
  if (!pending.length) console.log("Database is up to date.");
}

async function seed() {
  await sql.unsafe(readFileSync(seedFile, "utf8"));
  console.log("Seeded portfolio content.");
}

try {
  await (command === "migrate" ? migrate() : seed());
} catch (error) {
  console.error(`${command} failed:`, error.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
