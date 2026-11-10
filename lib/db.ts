import { Pool, types, type QueryResult } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __reiPool: Pool | undefined;
}

// Keep numeric and date values close to the shapes the UI already expects.
types.setTypeParser(20, (value) => Number(value)); // int8 / bigint
types.setTypeParser(1700, (value) => Number(value)); // numeric
types.setTypeParser(1082, (value) => value); // date -> "YYYY-MM-DD"
types.setTypeParser(1114, (value) => value); // timestamp -> string
types.setTypeParser(1184, (value) => value); // timestamptz -> string

export const pool =
  global.__reiPool ??
  new Pool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "web_emdig",
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    options: "-c timezone=Asia/Jakarta",
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  });

if (process.env.NODE_ENV !== "production") global.__reiPool = pool;

/**
 * Existing queries use `?` placeholders. PostgreSQL needs `$1, $2, ...`, so
 * translate them here (skipping question marks inside quoted literals).
 */
function toPgPlaceholders(sql: string): string {
  let index = 0;
  let inString = false;
  let out = "";
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    if (char === "'") {
      inString = !inString;
      out += char;
      continue;
    }
    if (char === "?" && !inString) {
      index += 1;
      out += `$${index}`;
      continue;
    }
    out += char;
  }
  return out;
}

export async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await pool.query(toPgPlaceholders(sql), params);
  return result.rows as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

export async function execute(sql: string, params: unknown[] = []): Promise<QueryResult> {
  return pool.query(toPgPlaceholders(sql), params);
}
