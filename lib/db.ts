import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var __reiPool: mysql.Pool | undefined;
}

export const pool =
  global.__reiPool ??
  mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "web_emdig",
    waitForConnections: true,
    connectionLimit: 10,
    charset: "utf8mb4",
    timezone: "+07:00",
    dateStrings: true,
  });

if (process.env.NODE_ENV !== "production") global.__reiPool = pool;

export async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

export async function execute(sql: string, params: unknown[] = []) {
  const [result] = await pool.query(sql, params);
  return result as mysql.ResultSetHeader;
}
